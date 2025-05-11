import { Alert, Badge, Box, Button, Container, Grid, Snackbar, SvgIcon, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host, dataNotFoundImage, ruppeeIcon } from 'src/utils/util';
import { format } from 'date-fns';
import { redirect, useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Autorenew, More, RefreshOutlined, RepeatOneTwoTone } from '@mui/icons-material';

function Plans() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState('warning');
  const router = useRouter();
  const [recentPlan, setRecentPlan] = useState({
    status: false,
    price: 0,
    months: 0,
    createdAt: null,
    expiryDate: null,
  });
  const [userPlans, setUserPlans] = useState([]);
  const auth = useAuth();
  const current = new Date().getTime();

  useEffect(() => {
    axios.defaults.headers = {
      Authorization: auth.token,
    };
    axios
      .post(`${host}/wholesale/plan/my-plans`, {})
      .then((res) => {
        const data = res.data.content;
        setUserPlans(data);
        if (data.length > 0) {
          setRecentPlan(data[0]);
        }
      })
      .catch((err) => {
        setMessage(!!err.response ? err.response.data.message : err.message);
        setFlag('error');
        setOpen(true);
      });
  }, []);

  const formattedDate = (millis) => {
    if (!!millis) {
      return format(millis, 'dd/MM/yyyy');
    } else {
      return '-';
    }
  };

  /** for snackbar close */
  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Grid
        container
        sx={{
          justifyContent: 'center',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            borderRadius: 2,
            p: 5,
          }}
        >
          {/* Recent Plan Section */}
         <Grid
            xs={12}
            md={4}
            lg={4}
            xl={4}
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              m: 5,
              p: 2,
            }}
          >
            <Box sx={{ px: 5, mb: 2 }}>
              <Badge
                badgeContent={current <= recentPlan.expiryDate ? 'Active' : 'Expired'}
                color={current <= recentPlan.expiryDate ? 'success' : 'error'}
              />
            </Box>

            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'light', fontSize: 22, mb: 2 }}>
                Current Plan
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: 24, mb: 1 }}>
                {recentPlan.servicePlan?.price > 0 ? ruppeeIcon + recentPlan.servicePlan?.price : 'Free'}
                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: 14 }}>
                  {" "+recentPlan.servicePlan?.months} month's plan
                </Typography>
              </Typography>

              {/* Buttons for Expired or Active Plans */}
              {current > recentPlan.expiryDate && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button
                    sx={{ mb: 2, width: 'fit-content' }}
                    variant="contained"
                    color="primary"
                    onClick={(e) => redirectForPayment(recentPlan.servicePlan?.slug, 'cashfree')}
                    startIcon={
                      <SvgIcon>
                        <Autorenew size="small" />
                      </SvgIcon>
                    }
                  >
                    Renew Plan
                  </Button>
                  <Button
                    sx={{ mb: 2, width: 'fit-content' }}
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => router.push('/pricing')}
                    startIcon={
                      <SvgIcon>
                        <More size="small" />
                      </SvgIcon>
                    }
                  >
                    Explore More Plans
                  </Button>
                </Box>
              ) 
              //:
              //  (
              //   <Button
              //     sx={{ mb: 2, width: 'fit-content' }}
              //     variant="contained"
              //     color="primary"
              //     onClick={(e) => router.push('/')}
              //     startIcon={
              //       <SvgIcon>
              //         <ArrowForwardIcon size="small" />
              //       </SvgIcon>
              //     }
              //   >
              //     Go to Dashboard
              //   </Button>
              // )
              }

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'light', fontSize: 14 }}>
                    Created Date
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6c757d', fontSize: 12 }}>
                    {formattedDate(recentPlan.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'light', fontSize: 14 }}>
                    Expiry Date
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6c757d', fontSize: 12 }}>
                    {formattedDate(recentPlan.expiryDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* User Plans Table */}
          <Grid
            xs={12}
            md={12}
            sx={{
              p: 2,
            }}
          >
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Plan Name</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Months</TableCell>
                    <TableCell align="center">Purchased At</TableCell>
                    <TableCell align="center">Expired At</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userPlans.length > 0 ? (
                    userPlans.map((plan, i) => {
                      const createdAt = format(!!plan.createdAt ? plan.createdAt : 0, 'dd/MM/yyyy');
                      const expiryDate = format(!!plan.expiryDate ? plan.expiryDate : 0, 'dd/MM/yyyy');
                      return (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            {plan.servicePlan?.name}
                          </TableCell>
                          <TableCell align="center">
                            {plan.price === 0 ? (
                              <Badge badgeContent={'Free'} color="success" />
                            ) : (
                              plan.servicePlan?.price
                            )}
                          </TableCell>
                          <TableCell align="center">{plan.servicePlan?.months}</TableCell>
                          <TableCell align="center">{createdAt}</TableCell>
                          <TableCell align="center">{expiryDate}</TableCell>
                          <TableCell align="center">
                            {plan.expiryDate > current ? (
                              <Badge badgeContent={'Active'} color="success" />
                            ) : (
                              <Badge badgeContent={'Expired'} color="error" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 5,
                          }}
                        >
                          <img src={dataNotFoundImage} height={120} alt="data not found." />
                          <Typography variant="span">Data not found.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Container>
      </Grid>
    

      {/* Snackbar for Notifications */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
        <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      </Box>
    </>
  );
}

Plans.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Plans;