import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const Page = () => {

  const handleSubmit =(event) => {
      event.preventDefault();
      const form = e.target;
      const formData = new FormData(form)
      let password = formData.get("password");
      let confirm = formData.get("confirm");

      if (password !== confirm) {
        setMessage("Confirm password doesn't watch.")
        return false
      }
      let user = {
        slug: user.slug,
        password: formData.get("password")
      }

      axios.defaults.headers = {
        Authorization: auth.token
      }
      axios.post(host + "/admin/auth/password", user)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          form.reset();
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
            <SettingsPassword handleSubmit  = {handleSubmit}/>
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
