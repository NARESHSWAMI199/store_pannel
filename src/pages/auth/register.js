import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import HomeNavbar from 'src/sections/top-nav';
import bg from 'public/assets/bg2.png'
import styled from '@emotion/styled';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';


const Container = styled.div`
  width : 50%;
  background : white;
  border-radius : 20px;
  padding : 60px;
  @media (max-width: 768px) {
    width : 98%;
    padding : 30px;
  }
  @media (min-width: 768px) and (max-width: 992px) {
    width : 68%;
    padding : 50px;
  }
  @media (min-width: 992px) and (max-width: 1200px) {
    width : 40%;
    padding : 80px;
  }
  @media (min-width: 1200px){
    width : 40%;
    padding : 80px;
  }

`;

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      password2: '',
      contact : '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      password2: Yup
        .string()
        .max(255)
        .required('Password is required'),
      contact : Yup
        .string()
        .max(10)
        .required('Contact is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        if(values.password == values.password2){
          await auth.signUp(values.name, values.email, values.contact,values.password);
        }else{
          throw new Error("Password and confrim password doesn't match");
        }
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });



    useEffect(()=>{
      if(!!auth.token){
        router.push("/")
      }
    },[auth.token])
  



  const appBarRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(0);

  useEffect(() => {
    const getAppBarHeight = () => {
      if (appBarRef.current) {
        setAppBarHeight(appBarRef.current.clientHeight);
      }
    };

    getAppBarHeight(); 

    const resizeObserver = new ResizeObserver(getAppBarHeight);
    if (appBarRef.current) {
      resizeObserver.observe(appBarRef.current);
    }

    return () => {
      if (appBarRef.current) {
        resizeObserver.unobserve(appBarRef.current);
      }
    };
  }, []);

  return (
    <>
    <Box
        sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw', 
            height: '100vh',
            backgroundImage:`url(${bg.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            overflowX: 'hidden', /* Hide horizontal scrollbar */
            scrollbarWidth: 'none' 
        }}
     >
    <HomeNavbar navRef = {appBarRef} />
    <Box sx={{
            mt : (appBarHeight+10)+'px',
            display : 'flex',
            flexDirection : 'row',
            justifyContent : 'center',
            alignItems : 'center',
            minHeight : 'calc(100% - '+(appBarHeight+10)+'px)'
          }}
          >
    <Container>
      <Head>
        <title>
          Register | Swami Sales
        </title>
      </Head>
      <Box>
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Don't have any account ?
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  InputLabelProps={{shrink: true}}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  InputLabelProps={{shrink: true}}
                />

                <TextField
                  error={!!(formik.touched.contact && formik.errors.contact)}
                  fullWidth
                  helperText={formik.touched.contact && formik.errors.contact}
                  label="Phone Number"
                  name="contact"
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.contact}
                  max={10}
                  InputLabelProps={{shrink: true}}
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
                  value={formik.values.password}
                  InputLabelProps={{shrink: true}}
                />

                <TextField
                  error={!!(formik.touched.password2 && formik.errors.password2)}
                  fullWidth
                  helperText={formik.touched.password2 && formik.errors.password2}
                  label="Confirm Password"
                  name="password2"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password2}
                  InputLabelProps={{shrink: true}}
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
                Register
              </Button>
            </form>
          </div>
        </Box>

      </Container>
      </Box>
      </Box>
    </>
  );
};

export default Page;
