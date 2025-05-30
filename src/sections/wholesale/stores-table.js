import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Rating, Snackbar, SvgIcon, useMediaQuery } from '@mui/material';
import { Button } from 'antd';
import { CheckCircleOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from 'react';
import { useEffect } from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host, storeImage, toTitleCase } from 'src/utils/util';


export const StoresCard = (props) => {
  const [store , setStore] = useState(props.store)
  const createdAt =   format(!!store.createdAt ? store.createdAt : 0, 'dd/MM/yyyy')
  const [message , setMessage] = useState("")
  const [slug , setSlug] = useState(store.slug)
  const [status , setStatus] = useState(store.status)
  const [confrim , setConfirm] = useState(false)

  const [flag, setFlag] = useState("warning")
  const [open,setOpen] = useState()
  
  const auth = useAuth()
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  useEffect(()=>{
    setStore(props.store)
    setStatus(store.status)
    setSlug(store.slug)
  },[props])

  const updateStatus = (slug,status) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.post(host+`/admin/store/status`,{
      slug : slug,
      status : status
    })
    .then(res => {
      if (status === "A") {
        setFlag("success")
        setMessage("Successfully activated.")
        setStatus("A")
      }else {
        setFlag("warning")
        setMessage("Successfully deactivated.")
        setStatus("D")
      }
      setOpen(true)
      setStatus(status)
    }).catch(err => {
      console.log(err)
      setFlag("error")
      setMessage(!!err.response ? err.response.data.message : err.message)
      setOpen(true)
    } )
  }

  const confirmBox = () =>{
    setConfirm(true)
  }

  const takeAction = () =>{
      props.deleteStore(slug)
      setConfirm(false)
  }

  const handleClose = () =>{
      setConfirm(false)
  }




  return (<>
  {!!store.user  &&
    <Card sx={{ display: 'flex', paddingRight : 5 }}  
    //style={{background : "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url('"+storeImage+store.avtar+"')" }} 
    > 
        {/* Wholesale image */}
        <CardMedia
            component="img"
            sx={{ width: 300 }}
            image= {storeImage+store.slug+"/"+store.avtar}
            alt="Live from space store cover"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column'}} >
        <CardContent sx={{ flex: '1 0 auto', mx : '20px' }}>
          <Typography component="div" variant="h5">
            <Link title='Store Detail' style={{textDecoration : 'none' , color : 'black'}} href={"/store/"+ store.user.slug}>
              {toTitleCase(store.storeName)}
            </Link>
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
              <AccessTimeIcon sx={{ mr: 1 , p:0.1 }} />
              Created at : {createdAt}
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
              <span style={{ color: "green" }}>{store.slug}</span>
            </div>  
          </Typography>



          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.secondary',fontSize : 15, my:1}}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
          
              <PersonIcon sx={{ mr: 1 }} />
              <Link style={{textDecoration : 'none' , color : '#6C737F'}} href={"/wholesalers/"+store.user.slug}>
              <span title='Check user Detail' >{toTitleCase(store.user.username)}</span>
              </Link>
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
              <LocalPhoneIcon sx={{padding : 0.3 , mr:1}}/>
              <span> {store.phone}</span>
            </div>  
          </Typography>


          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.secondary', fontSize: 15, my: 1 }}
          >
             <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              textDecoration : 'none'
            }}>
              <EmailOutlinedIcon sx={{ padding: 0.3, mr: 1 }}/>
                 <Link href={"mailto:" + store.email} style={{ textDecoration: 'none' }}> {store.email}</Link>

            </div>  
          </Typography>




          <Rating value={store.rating} sx={{my:1}}/>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', my : 4 , ml : 'auto'}}>

        
        { status !== 'A' ?
        <Button  
          type='primary' 
          variant="outlined" 
          icon={<CheckCircleOutlined />} 
          style={{background:'#5cb85c'}} 
          onClick={(e)=> {
            setMessage("We are going to activate this store.")
            updateStatus(store.slug,"A")
          }} 
        >
            Active
        </Button>
        :
        <Button  
          type='primary' 
          variant="outlined" 
          icon={<CheckCircleOutlined />} 
          onClick={(e)=> {
            setMessage("We are going to deactivate this store.")
            updateStatus(store.slug,"D")
          }} 
          style={{background:'#ffc107', color : "black"}}
        >
            Deactive
        </Button>
      } 
       <Link
            href={{
              pathname: '/store/update/[slug]',
              query: { slug: store.slug },
            }}
          >
          <Button 
            type='primary'  
            style= {{marginTop : '5px',width:'110px'}}  
            icon={<EditFilled />} 
            primary
          >
              Edit
          </Button>
        </Link>
        <Button 
          type="primary" 
          variant="outlined" 
          style= {{marginTop : '5px'}} 
          icon={<DeleteFilled />} 
          danger 
          onClick={(e) =>{
            setSlug(store.slug)
            setMessage(`Are you sure you want delete store ${store.name}`)
            confirmBox()
          }}
        >
            Delete
        </Button>
      </Box>
    </Card>
}
      
    <Dialog
      fullScreen={fullScreen}
      open={confrim}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Are you sure ?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          autoFocus 
          onClick={handleClose}
        >
          Disagree
        </Button>
        <Button 
          onClick={()=>takeAction()} 
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>




    <Snackbar 
      anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
      open={open}
      onClose={handleClose}
      key={'top' + 'right'}
    >
     <Alert 
       onClose={handleClose} 
       severity={flag} 
       sx={{ width: '100%' }}
     >
        {message}
    </Alert>
    </Snackbar>

</>

  );
}