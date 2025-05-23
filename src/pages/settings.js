import { Alert, Box, Container, Snackbar, Stack, Typography } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PaginationSettings } from 'src/sections/settings/pagination-settings';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { host } from 'src/utils/util';

const Page = () => {

  const [message,setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [flag, setFlag] = useState('warning')

  const [reset ,setReset] = useState(false)
  const auth = useAuth()

  /** for snackbar close */
  const handleClose = () => {
    setOpen(false)
  };

  const handleSubmit = async(slug,password) => {
      let result = false
      let user = {
        password: password
      }

      axios.defaults.headers = {
        Authorization: auth.token
      }
      await axios.post(host + "/wholesale/auth/password", user)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          result = true
        }).catch(err => {
          setMessage(!!err.response ? err.response.data.message : err.message)
          setFlag("error")
          let status = (!!err.response ? err.response.status : 0);
          if (status == 401) {
            auth.signOut();
            router.push("/auth/login")
          }
        })
      setOpen(true)
      return result
    }


    const showError = (err) => {
      console.log(err)
      setMessage(!!err.response ? err.response.data.message : err.message)
      setFlag("error")
      setOpen(true)
    }

    const showSuccess = (message) => {
      setMessage(message)
      setFlag("success")
      setOpen(true)
    }



  return (
  
  <>
    <Head>
      <title>
        Settings | Devias Kit
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
          <Typography variant="h4">
            Settings
          </Typography>
          {/* <SettingsNotifications /> */}
            <SettingsPassword handleSubmit={handleSubmit} reset={reset} />
            <PaginationSettings showError={showError} showSuccess={showSuccess}/>

        </Stack>
      </Container>
    </Box>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
