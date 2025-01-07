import { Button, Grid, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import bg from 'public/assets/bg2.png'
import React, { useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import HomeNavbar from 'src/sections/top-nav'

function ValidateOtp() {

const auth = useAuth();
const router = useRouter();
const { slug } = router.query;
const [error, setError] = useState('')

const validateOtp = async (e) => {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let otp = formData.get('otp');
    try{
      await auth.validateOtp(otp,slug);
      router.push('/createstore')
    }catch(e){
      setError(e.message)
    }

  }

  return (
    <Grid container 
        sx={{
            justifyContent : 'center',
            alignItems : 'center',
            display : 'flex'
        }}>


        <Grid container md={3} xs={12} sx={{
            background : 'white',
            borderRadius : 2,
            px : 3,
            py : 3,
            boxShadow : 1,
            justifyContent : 'center',
            alignItems : 'center',
        }}> 

              <Grid item xs={12} md={12}>
                <Stack
                sx={{ my: 2}}
                >
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
            <Typography variant='body2' color='error'> {error !== '' && error} </Typography>
        </Grid>
        
    </Grid>

  )
}

ValidateOtp.getLayout = (page) => (
  <HomeNavbar bg={bg}>
    {page}
  </HomeNavbar>
)

export default ValidateOtp
