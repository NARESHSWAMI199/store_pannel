import {
  Alert,
  Box,
  Button,
  Link,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Spin } from 'antd';
import axios from 'axios';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { host } from 'src/utils/util';
import * as Yup from 'yup';
import bg from 'public/assets/bg2.png'
import styled from '@emotion/styled';
import HomeNavbar from 'src/sections/top-nav';
import NextLink from 'next/link';

const Container = styled.div`
  width : 35%;
  background : white;
  border-radius : 20px;
  @media (max-width: 768px) {
    width : 98%;
  }
`;


const Page = (props) => {


  /** snackbar varibatles */

  const [open,setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")


  const router = useRouter();
  const [method, setMethod] = useState('email');
  const auth = useAuth();
  const [values,setValues] = useState({})
  const [showSpinner,setShowSpinner] = useState(false)
  const [showOtpInput,setShowOtpInput] = useState(false)

  const handleChange = (event) => {
    if ([event.target.name] == 'email') setShowOtpInput(false)
    setValues((previous)=>({
      ...previous,
      [event.target.name] : event.target.value
    }))
  }


  const sendOtp = () =>{
      if(!!values.email ){
      setShowSpinner(true)
      axios.post(host+"/wholesale/auth/sendOtp",{email : values.email})
      .then(res => {
        setShowOtpInput(true)
        setMessage(res.data.message)
        setFlag("success")
        setOpen(true)
        setShowSpinner(false)
      })
      .catch(err => {
        setMessage(!!err.response ? err.response.data.message : err.message )
        setFlag("error")
        setOpen(true)
        setShowSpinner(false)
      })
    }
    else{
      setMessage("First enter you email.")
      setFlag("error")
      setOpen(true)
    }
  }

  const handleSubmit = async (e) =>{
    debugger
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form)
      let email = formData.get("email");
      let password = formData.get("otp");
    try {
      await auth.signIn(email,password,"OTP");
      router.push('/');
    } catch (err) {
      setMessage(err.message)
      setFlag("error")
      setOpen(true)
    }
  }


    /** for snackbar close */
    const handleClose = () => {
      setOpen(false)
    };


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signIn(values.email, values.password);
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  return (
    <>
        <Box
        sx={{
            backgroundImage:`url(${bg.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height : '100vh',
            display : 'flex',
            flexDirection : 'row',
            justifyContent : 'center',
            alignItems : 'center'
        }}
     >
    <HomeNavbar />
    <Container>
      <Head>
        <title>
          Login | Swami Sales
        </title>
      </Head>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          borderRadius : 2
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Already have an account ?
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don't have any account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Email"
                value="email"
              />
              <Tab
                label="Otp"
                value="otp"
              />
            </Tabs>
            {method === 'email' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                  
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"

                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>
         
            
              </form>
            )}
            {method === 'otp' && (
                 <form
                 onSubmit={handleSubmit}
               >
                 <Stack spacing={3}>
                   <TextField
                     error={!!(formik.touched.email && formik.errors.email)}
                     fullWidth
                     helperText={formik.touched.email && formik.errors.email}
                     label="Email Address"
                     name="email"
                     value={values.email}
                     required
                     onBlur={formik.handleBlur}
                     onChange={handleChange}
                     type="email"
                   
                   />
                  <Spin size='large' style={{display : showSpinner ? 'block' : 'none' ,marginTop : 20}} />
                   {!showOtpInput ? 
                    <Button
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        type="button"
                        variant="contained"
                        onClick={sendOtp}> 
                        Send Otp
                    </Button>
                  : ""}
                  {showOtpInput ? 
                   <TextField
                     fullWidth
                     label="Otp"
                     name="otp"
                     value={values.otp}
                     required
                     onBlur={formik.handleBlur}
                     onChange={handleChange}
                     type="number"
 
                   /> : ""}
                 </Stack>
                {showOtpInput ? 
                 <Button
                   fullWidth
                   size="large"
                   sx={{ mt: 3 }}
                   type="submit"
                   variant="contained"
                 >
                   Continue
                 </Button> : ""
                }
             
               </form>
            )}
          </div>
        </Box>


      <Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
      <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
          {message}
      </Alert>
    </Snackbar>

      </Box>
      </Container>
      </Box>
    </>
  );
};

// Page.getLayout = (page) => (
//     <AuthLayout>
//       {page}
//     </AuthLayout>
// );


export default Page;


