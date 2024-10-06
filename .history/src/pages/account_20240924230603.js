import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Snackbar, Alert } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host } from 'src/utils/util';
import { useState } from 'react';

const Page = () => { 

    /** snackbar varibatles */

    const [open,setOpen] = useState()
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("warning")
    const auth = useAuth()
    const [content, setContent] = useState(auth.user)
    const user = auth.user

    const updateProfile = async (updatedUser) =>{
        axios.defaults.headers = {
          Authorization : auth.token
        }
        const data = {
          ...user,
          ...updatedUser
        }
        await axios.post(host+"/admin/auth/update",data)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          setContent(data)
          try {
            sessionStorage.setItem("user", JSON.stringify(data))
          }catch{
            sessionStorage.setItem("isAuthenticated", "false")
          }

        }).catch(err=>{
          setFlag('error')
          console.log(err)
        })
        setOpen(true)
    }

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
      <Head>
        <title>
          Account | Swami Sales
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Account
              </Typography>
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfile user={content} />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                  <AccountProfileDetails user={content} updateProfile={updateProfile} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
    }
Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
