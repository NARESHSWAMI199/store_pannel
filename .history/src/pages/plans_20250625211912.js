import { Autorenew, More } from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Alert, Badge, Box, Button, Container, Grid, Snackbar, SvgIcon, Tab, Tabs,Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { host, ruppeeIcon } from 'src/utils/util';
import {ActivatedPlans} from 'src/sections/plans/activated-plans';
import {FuturePlans} from 'src/sections/plans/future-plans';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { on } from 'events';


function TabPanel(props) {
const { children, value, index, ...other } = props;

return (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`full-width-tabpanel-${index}`}
    aria-labelledby={`full-width-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    )}
  </div>
);
}
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
const [futurePlans,setFuturePlans] = useState([]);
const auth = useAuth();
const current = new Date().getTime();
const [value, setValue] = useState(0);
const [reload, setReload] = useState(false);

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
}, [reload]);






useEffect(() => {
  axios.defaults.headers = {
    Authorization: auth.token,
  };
  axios
    .post(`${host}/future/plans/`, {})
    .then((res) => {
      const data = res.data.content;
      setFuturePlans(data);
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



//** for payment redirection */
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


function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const handleChange = (event,newValue) => {
  setValue(newValue)
}

const onActivate = (plan) =>{
  if (!plan) return
  
  axios.defaults.headers = {
    Authorization: auth.token
  }
  axios.post(`${host/future/plans/activate/${plan?.slug}`)
    .then(res => {
      setMessage(res.data.message)
      setFlag("success")
      setOpen(true)
      setFuturePlans(futurePlans.filter((item) => item.id !== plan.id))
      setReload(!reload)
    })
    .catch(err => {
      setMessage(!!err.response ? err.response.data.message : err.message)
      setFlag("error")
      setOpen(true)
    });
}

const activateCurrentPlan = (planSlug) => {
  axios.defaults.headers = {
    Authorization: auth.token
  }
  axios.post(`${host}/wholesale/plan/activate/${planSlug}`).then(res => {
    setMessage(res.data.message);
    setFlag("success");
    setOpen(true);
  }).catch(err => {
    setMessage(!!err.response ? err.response.data.message : err.message);
    setFlag("error");
    setOpen(true);
  });
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
        maxWidth="xxl"
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
            {current > recentPlan.expiryDate ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {recentPlan.servicePlan?.price > 0 && 
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
      }
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
            :
              (
              <Button
                sx={{ mt: 1.5, width: 'fit-content' }}
                variant="contained"
                color="primary"
                onClick={(e) => router.push('/pricing')}
                startIcon={
                  <SvgIcon>
                    <ArrowForwardIcon size="small" />
                  </SvgIcon>
                }
              >
                Add Future Plans
              </Button>
            )
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

        <Grid
          xs={12}
          md={12}
          sx={{
            p: 2,
          }}
        >
          
        {/* Tabs */}
        <Box
          sx={{
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',
            mt : 5
          }}
        >
            <Tabs  
                value={value}
                onChange={handleChange}
                aria-label="icon tabs example"
              >
              <Tab icon={<EventIcon />} aria-label="Activated plans" {...a11yProps(0)}  label="Used plans" />
              <Tab icon={<AccountBalanceWalletIcon />} aria-label="Future plans"  {...a11yProps(1)} label= "Future plans"  />
            </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
            <ActivatedPlans plans={userPlans}
                count={userPlans.length}
                onActivate={activateCurrentPlan}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
              <FuturePlans plans={futurePlans}
                count={futurePlans.length}
                onActivate={onActivate}
            />
          </TabPanel>
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