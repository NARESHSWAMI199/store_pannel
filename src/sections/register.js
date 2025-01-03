import { Box, Button, Grid, Link, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import * as Yup from 'yup';


const Register = () => {
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
  

  return (
    <>
      <Head>
        <title>
          Register | Swami Sales
        </title>
      </Head>
      <Box>
        <div>
          <Stack
            spacing={1}
            sx={{ my: 2 }}
          >
            <Typography variant="h5">
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
            id={'register'}
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
                min={10}
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
    </>
  );
};

export default Register;
