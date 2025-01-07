import { Alert, Box, Button, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import bg from 'public/assets/bg2.png'
import React, { useCallback, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import HomeNavbar from 'src/sections/top-nav'
import axios from 'axios'
import {host} from 'src/utils/util'

function ValidateOtp() {

const [open,setOpen] = useState(false)
const [message,setMessage] = useState("")
const [flag,setFlag] = useState("success")
const auth = useAuth();
const router = useRouter();
const { slug } = router.query;


const handleClose = useCallback(()=>{
  setOpen(false)
},[])

const validateOtp = async (e) => {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let otp = formData.get('otp');
    try{
      await auth.validateOtp(otp,slug);
      if(auth.store == null){
        router.push('/createstore')
      }else{
        router.push('/')
      }
    }catch(err){
      setMessage(!!err.response ? err?.response?.data.message : err.message)
      setFlag("error")
      setOpen(true)
    }
  }

const sendOtp = ()=>{
  axios.post(host+"/wholesale/auth/sendOtp",{
    slug  : slug
  })
  .then(res => {
      setMessage(res.data.message)
      setOpen(true)
  })
  .catch(err => {
    const errorMessage = (!!err.response) ? err.response.data.message : err.message;
    setMessage(errorMessage)
    setFlag("error")
    setOpen(true)
  })
}

  return (
    <Grid container 
        sx={{
            justifyContent : 'center',
            alignItems : 'center',
            display : 'flex'
        }}>


        <Grid container md={4} xs={12} sx={{
            background : 'white',
            borderRadius : 2,
            px : 3,
            py : 3,
            boxShadow : 1,
            justifyContent : 'center',
            alignItems : 'center',
        }}> 

              <Grid item xs={12} md={12}>
                <Stack sx={{my : 1}}>
                <Typography variant="h6" color="text.secondary">
                    Validate OTP
                </Typography>
                </Stack>
             </Grid>
             <form onSubmit={(e) => validateOtp(e)} style={{ width : '100%' , display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
              <Grid item md={9} xs={12}  sx={{}}>
                  <TextField                    
                          fullWidth
                          label="Otp"
                          name="otp"
                          type="number"
                          required={true}
                          InputLabelProps={{shrink: true}}
                          sx={{my:1}}
                      />
              </Grid>
              <Grid item md={3} xs={12} sx={{
                      background : 'white',
                      display : 'flex',
                      justifyContent : 'center',
                      my:1
              }} >
                  <Button variant='contained' type='submit' color='primary' sx={{height : 55,width: '100%'}}> 
                              Validate OTP    
                  </Button>
              </Grid>
            </form>
            <Box sx={{
                display : 'flex', 
                flex : '1 1',
                width : '100%',
                alignItems : 'center'
              }}>
              <Button variant='text' onClick={sendOtp}  color='primary'> 
                    Resend otp ?
                </Button>
            </Box>
        
        </Grid>
        

          <Snackbar anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}
                    open={open}
                    onClose={handleClose}
                    key={'bottom' + 'left'}
                >
                <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

    </Grid>

  )
}

ValidateOtp.getLayout = (page) => (
  <HomeNavbar bg={bg}>
    {page}
  </HomeNavbar>
)

export default ValidateOtp
