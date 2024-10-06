import Head from 'next/head';
import { Alert, Box, Container, Snackbar, Stack, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState } from 'react';
import { host } from 'src/utils/util';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {

  const [message,setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [flag, setFlag] = useState('warning')

  const [reset ,setReset] = useState(false)
  const auth = useAuth()
  const user = auth.user;

  /** for snackbar close */
  const handleClose = () => {
    setOpen(false)
  };

  const handleSubmit =(slug,password) => {
      let user = {
        slug: slug,
        password: password
      }

      axios.defaults.headers = {
        Authorization: auth.token
      }
      axios.post(host + "/admin/auth/password", user)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          setReset(true)
        }).catch(err => {
          setMessage(!!err.response ? err.response.data.message : err.message)
          setFlag("error")
        })
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
