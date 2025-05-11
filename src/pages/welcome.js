import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { ArrowRightAltOutlined } from '@mui/icons-material';
import Link from 'next/link';
import axios from 'axios';
import bg from 'public/assets/bg2.png';
import HomeNavbar from 'src/sections/top-nav';
import Typewriter from 'src/components/Typewriter';
import { host } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/navigation';

function Page() {
  const [plans, setPlans] = useState([]);
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState("warning");

  // Fetch plans from the backend
  useEffect(() => {
    axios
      .get(`${host}/wholesale/plan/all`)
      .then((res) => {
        setPlans(res.data); // Assuming the API returns an array of plans
      })
      .catch((err) => {
        console.error('Failed to fetch plans:', err);
      });
  }, []);


    const redirectForPayment = (slug, pg) => {
      axios.defaults.headers = {
        Authorization: auth.token
      }
  
      const redirect = async () => {
        if (pg === "phonepe") {
          await axios.get(host + "/pg/pay/" + slug)
            .then(res => {
              window.open(res.data.url);
            })
            .catch(err => {
              setMessage(!!err.response ? err.response.data.message : err.message)
              setFlag("error")
              setOpen(true)
            });
        } else {
          window.location.href = host + "/cashfree/pay/" + slug + "/" + encodeURIComponent(auth.token.replace("Bearer ", ""))
        }
      }
      if (!!auth.token) {
        redirect();
      } else {
        router.push("/auth/register")
      }
    }

    const handleClose = () => {
        setOpen(false)
    };
  


  return (
    <Box>
      <HomeNavbar bg={bg.src} />
      <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Hero Section */}
        <Grid
          item
          sx={{
            backgroundImage: `url(${bg.src})`,
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '30%',
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))',
              backdropFilter: 'blur(10px)',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: '4vw', textAlign: 'center', fontWeight: 'light', color: '#ffffff', mt: 2 }}
            >
              WELCOME TO <br />
              <span style={{ fontSize: '120px' }}>SWAMI SALES</span>
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: 'serif', fontSize: '24px', mb: 4 }}>
              <Typewriter text="Grow your business with smart sales." />
            </Typography>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  height: 60,
                  width: 300,
                  fontWeight: 'bold',
                  fontSize: 18,
                  background: 'white',
                  color: 'black',
                  borderRadius: 20,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Register Now / Try Now
                  <ArrowRightAltOutlined sx={{ fontWeight: 'bold', mx: 1 }} />
                </Box>
              </Button>
            </Link>
          </Box>
        </Grid>

        {/* Plans Section */}
        {plans?.lenght &&
        <Grid item sx={{ padding: 5 }}>
         <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Our Plans
          </Typography>
          <Grid container spacing={2}>
            {plans.map((plan, index) => (
              <Grid item key={index} xs={12} sm={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {plan.months} Months Plan
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                      ₹ {plan.price}
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => redirectForPayment(plan.slug, "cashfree")}>
                      {!!auth?.token ? "Get Now" : "Sign Up"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        }

        {/* Call-to-Action Section */}
        <Grid item sx={{ padding: 5, backgroundColor: '#333', color: '#fff' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Get Started Today!
          </Typography>
          <Button
            variant="contained"
            sx={{
              height: 60,
              width: 300,
              fontWeight: 'bold',
              fontSize: 18,
              marginTop: 5,
              background: 'white',
              color: 'black',
              borderRadius: 20,
            }}
            onClick={() => router.push("/auth/register")}
          >
            Sign Up Now
          </Button>
        </Grid>

        {/* Footer Section */}
        <Grid item sx={{ padding: 5, backgroundColor: '#333', color: '#fff' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            2025 Swami Sales. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
          <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              open={open}
              onClose={handleClose}
              key={'bottom' + 'left'}
            >
              <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
    </Box>
  );
}

export default Page;