import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Snackbar,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';
import { format } from 'date-fns';
import { host, userImage } from 'src/utils/util';
import { useCallback, useEffect, useState } from 'react';
import { getInitials } from 'src/utils/get-initials';
import { Image } from 'antd';

export const AccountProfile = (props) => {
  const user = props.user
  const createdAt = (!!user && !!user.createdAt) ?  format(user.createdAt, 'dd/MM/yyyy') : "";
  const auth = useAuth();
  const [message , setMessage] = useState("")
  const [flag , setFlag] = useState("info")
  const [open , setOpen] = useState(false)


  const uploadProfile = async (event) =>{
    let flagStatus = "info"
    let image  = event.target.files[0];
    axios.defaults.headers = {
        Authorization : auth.token,
        "Content-Type" : "multipart/form-data"
    }
    let data = new FormData();
    if (!!image) data.append("profileImage", image);
    else return false
    await axios.post(host+`/wholesale/auth/update_profile` , data)
    .then(res =>{
      flagStatus = "success"
      setMessage(res.data.message)
      user.avatar = res.data.imageName
      handleUpdateLoggedUser()
    }).catch(err=>{
        flagStatus = "error"
        setMessage(!!err.response  ? err.response.data.message  : err.message)
        console.log(err)
    })
    setFlag(flagStatus)
    setOpen(true)
  }


  const handleUpdateLoggedUser = useCallback(
    () => {
      auth.updateUserDetail()
    },
    [auth]
  );


  /** for snackbar close */
  const handleClose = () => {
    setOpen(false)
  };



  return (<>
  
      
        <Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
            open={open}
            onClose={handleClose}
            key={'top' + 'right'}
          >
        <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
            {message}
        </Alert>
        </Snackbar>

          <Card>
            <CardContent>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >

              { !!user.avatar ? <Image  style={{borderRadius : '50%', height : '80px', width : '80px'}} src={userImage+user.slug+"/"+user.avatar}/> :

              <Avatar sx={{
                height: 80,
                mb: 2,
                width: 80
              }} src={userImage+user.avatar} >
                {getInitials(user.username)}
              </Avatar>
              }
  
                <Typography
                  gutterBottom
                  variant="h5"
                >
                  {!!user ? user.username :''}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                 Email : {!!user ? user.email:""} 
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Last updated at : {createdAt}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <CardActions>

              <Button
                type
                fullWidth
                variant="text"
                onClick={ () => document.getElementById("profileImage").click()}
              >
                Upload picture
                {/* <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => uploadProfile(event)}
                /> */}
                
              <input type='file' style={{display : "none"}} id="profileImage" accept='image/*'  onChange={(event) => uploadProfile(event)} />
              </Button>
              
            </CardActions>
          </Card>
          </>
        )
  }