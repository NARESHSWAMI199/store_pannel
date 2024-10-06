import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, Snackbar, useMediaQuery } from '@mui/material';
import { Button } from 'antd';
import { bgcolor, color } from '@mui/system';
import { bg } from 'date-fns/locale';
import { CheckCircleOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { CheckOutlined, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { useEffect } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host, toTitleCase } from 'src/utils/util';

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
    console.log(store)
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
    <Card sx={{ display: 'flex', paddingRight : 5 }}>
        {/* Wholesale image */}
        <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={store.avtar}
            alt="Live from space album cover"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto', mx : '20px' }}>
          <Typography component="div" variant="h5">
            {toTitleCase(store.storeName)}
          </Typography>
          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.secondary',fontSize : 15, my:1 }}
          >
           Registered Date : {createdAt}
          </Typography>

          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.secondary',fontSize : 15, my:1 }}
          >
            Token : <span style={{color:"green"}}>{store.slug}</span>
          </Typography>



          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.primary',fontSize : 15, my:1 }}
          >
            Owner : {!!store.user ? toTitleCase(store.user.username) : "Unkown"}
          </Typography>


          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.primary',fontSize : 15, my:1 }}
          >
            Contact Number : {store.phone}
          </Typography>


          <Typography
            variant="subtitle"
            component="div"
            sx={{ color: 'text.primary', fontSize: 15, my: 1 }}
          >
            Email Id : <Link href={"mailto:" + store.email} style={{ textDecoration : 'none'}}>{store.email}</Link>
          </Typography>




          <Rating value={store.rating} sx={{my:1}}/>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', my : 4 , ml : 'auto'}}>

        
        { status !== 'A' ?
        <Button  type='primary' variant="outlined" icon={<CheckCircleOutlined />} style={{background:'#5cb85c'}} onClick={(e)=> {
                          setMessage("We are going to activate this store.")
                          updateStatus(store.slug,"A")

                        }} >
            Active
        </Button>
        :
        <Button  type='primary' variant="outlined" icon={<CheckCircleOutlined />} onClick={(e)=> {
                          setMessage("We are going to deactivate this store.")
                          updateStatus(store.slug,"D")
                        }} style={{background:'#ffc107', color : "black"}}>
            Deactive
        </Button>
      } 
       <Link
            href={{
              pathname: '/store/update/[slug]',
              query: { slug: store.slug },
            }}
          >
          <Button type='primary'  style= {{marginTop : '5px',width:'110px'}}  icon={<EditFilled />} primary>
              Edit
          </Button>
        </Link>
        <Button type="primary" variant="outlined" style= {{marginTop : '5px'}} icon={<DeleteFilled />} danger 
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
        <Button autoFocus onClick={handleClose}>
          Disagree
        </Button>
        <Button onClick={()=>takeAction()} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>




    <Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
     <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
        {message}
    </Alert>
    </Snackbar>

</>

  );
}