import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {  Alert, Box, Button, Card, CardActions, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, MenuItem, Rating, Snackbar, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from 'axios';
import { host, itemImage, toTitleCase } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { Divider, Image } from 'antd';
import { useRouter } from 'next/router';
import { CurrencyRupee, Discount, DiscountOutlined, EditOutlined, KeyOutlined } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { OptionMenu } from 'src/layouts/option-menu';



const now = new Date();

const Page = () => {

  const [open,setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")

  const auth = useAuth()
  const router = useRouter()
  const {slug}  = router.query
  const [item,setItem] = useState({})
  const itemCreatedAt =   format(!!item.createdAt ? item.createdAt : 0, 'dd/MM/yyyy')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [comments,setComments] = useState([])
  const [currentTarget,setCurrentTarget] = useState(null)
  const openMenu = Boolean(currentTarget);
  const [data,setData] = useState({
    pageNumber : page,
    size : rowsPerPage
  })

  const [totalElements , setTotalElements] = useState(0)


  const handleOptionMenu = (e) =>{
    setCurrentTarget(e.currentTarget)
  }

  const handleCloseMenu = () => {
    setCurrentTarget(null);
  };


  useEffect(() => {
    const getData = async () => {
        axios.defaults.headers = {
            Authorization: auth.token
        }
        await axios.get(host + "/wholesale/item/detail/"+slug,)
            .then(res => {
                const result = res.data.res;
                setItem(result)
                setData({...data, itemId : result.id,})
            })
            .catch(err => {
                setMessage(!!err.response ? err.response.data.message : err.message)
                setFlag('error')
                setOpen(true)
                let status = (!!err.response ? err.response.status : 0);
                if (status == 401) {
                  auth.signOut();
                  router.push("/auth/login")
                }
            })
    }
    getData();

}, [])

/** for item comments */
useEffect( ()=>{
    const getData = async () => {
       axios.defaults.headers = {
         Authorization : auth.token
       }
       await axios.post(host+"/wholesale/item/comments/all",data)
       .then(res => {
          const data = res.data;
           setComments(data);
           console.log(data)
       })
       .catch(err => {
         setFlag("error")
         setMessage(!!err.response ? err.response.data.message : err.message)
         setOpen(true)
       } )
     }
    getData();

   },[data])


     /** for snackbar close */
  const handleClose = () => {
    setOpen(false)
  };



  
  return (
    <>

    <Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
     <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
        {message}
    </Alert>
    </Snackbar>
      <Head>
        <title>
          Wholesaler | Swami Sales
        </title>
      </Head>

    {/* Box using for div */}
      <Box
        component="main"
        sx={{
            flexGrow: 1,
            py: 8
          }}
      >
        <Container maxWidth="xl">
          <Card>
            <CardContent sx={{mt:3}}>
              {/* <BasicSearch onSearch={onSearch} /> */}
              <Grid container spacing={3}>
                  <Grid xs={12} md={3}> 
                      <Image
                          height="100%"
                          width ='100%'
                          max-width='300px'
                          max-height='300px'
                          src={itemImage+item.slug+"/"+item.avtar}
                      />
                  </Grid>
                  {/* item Detail */}
                  <Grid item xs={12} md={7}>
                          <Typography component="div" variant="h5">
                              {toTitleCase(item.name)}
                          </Typography>
                          <Typography
                              variant="subtitle"
                              component="div"
                              sx={{ color: 'text.secondary',fontSize : 15, my:1 }}
                          >
                              <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              }}>
                              {/* <AccessTimeIcon sx={{ mr: 1 , p:0.1 }} /> */}
                              Created at : {itemCreatedAt}
                              </div>  
                  
                          </Typography>

                          <Typography
                              variant="subtitle"
                              component="div"
                              sx={{ color: 'text.secondary',fontSize : 15, my:1 }}
                          >
                              <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              }}>
                              <KeyIcon sx={{ mr: 1, padding: 0.2 }} />
                              <span style={{ color: "green" }}>{item.slug}</span>
                              </div>  
                          </Typography>


                          <Typography
                              variant="subtitle"
                              component="div"
                              sx={{ color: 'text.secondary', fontSize: 15, my: 1 }}
                          >
                  
                              <Grid container spacing={2}>
                                  <Grid item xs={6} md={6}>
                                      <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      flexWrap: 'wrap',
                                      textDecoration : 'none'
                                      }}>
                                    
                                      <div>Current Pice : <span style={{ fontWeight:'bold' , fontSize : '20px', marginRight : '10px' }}> { (Math.round((item.price - item.discount) * 100) / 100).toFixed(2)}</span></div>
                                      <CurrencyRupee sx={{ padding: 0.3, mr: 1}}/>
                                      </div>  
                                  </Grid>
                              </Grid>
                              </Typography>

                              <Typography
                                  variant="subtitle"
                                  component="div"
                                  sx={{ color: 'text.secondary', fontSize: 15, my: 1 }}
                              >
                              <Grid container spacing={2}>
                                  <Grid item xs={6} md={6}>
                                      <div style={{
                                        display: 'flex'
                                      }}>
                                      <div style={{display:'flex'}}>
                                          <strike style={{fontSize : 20}}>{(Math.round((item.price) * 100) / 100).toFixed(2)}</strike>
                                          <CurrencyRupee sx={{ padding: 0.3, mr: 1 }}/>
                                      </div>
                                      <div style={{display:'flex'}}>
                                          <span style={{ color:'red',fontSize : 20}}>{(Math.round((item.discount) * 100) / 100).toFixed(2)}</span>
                                          <Discount sx={{ padding: 0.3, mr: 1 }}/>
                                      </div>
                                      </div>  
                                  </Grid>
                              </Grid>
                          </Typography>

                          <Rating value={parseFloat(item.rating)} sx={{my:1}}/>

                          <Typography
                                  variant="subtitle"
                                  component="div"
                                  sx={{ color: 'text.secondary', fontSize: 15, mt: 1 }}
                              >
                          
                                  <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      flexWrap: 'wrap',
                                      }}>
                                      <span style={{ color: "green" ,  fontSize : 15}}>Currently {item.inStock == "Y" ? <span style={{color:'green'}}>Avilable</span> : <span>Unavilable</span>}</span>
                                  </div>  
                          </Typography>
                  </Grid>
              <Grid xs={2} md={2}>
                  <Typography style={{float:'right'}}>
                    <Link href={"/items/update/"+slug}
                      style={{ textDecoration : 'none', color:'#6C737F'}}
                    >
                      <EditOutlined />
                    </Link>         
                  </Typography>
              </Grid>
              </Grid>
            </CardContent>
          </Card>
            <Box sx={{mt : 10, boxShadow : 1}}>
              <Typography variant='h6' sx={{color : 'text.primary'}}>
                  Customer Reviews :
              </Typography>
              {comments.map((comment,i) => {
                  return (<Box key={i} style={{width : '100%' , padding : 20}} sx={{boxShadow : 1}}>
                    <Grid container spacing={3}>
                      <Grid item xs={11} md={11} >
                        <Typography variant='subtitle' sx={{color : "text.primary", fontSize : 15}}>
                          {comment.message}
                        </Typography>
                        <Typography variant='subtitle' component="div" sx={{color : "text.secondary",fontSize : 10}}>
                          <span>{!!comment.createdAt ? format(parseInt(comment.createdAt),'dd/MM/yyyy') : '01/01/2000'}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={1} md={1} sx={{color:'text.secondary'}} >


                      <Button
                        id="demo-customized-button"
                        aria-controls={openMenu ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        // variant="contained"
                        disableElevation
                        onClick={handleOptionMenu}
                        endIcon={<MoreVertIcon />}
                      >
                      </Button> 
                          <OptionMenu currentTarget={currentTarget} handleClose={handleCloseMenu} />
                      </Grid>
                    </Grid>
                  </Box>)
              })}
            </Box>

        </Container>

        </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
