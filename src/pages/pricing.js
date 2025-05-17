import { Alert, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import bg from 'public/assets/bg.png'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import HomeNavbar from 'src/sections/top-nav'
import { host } from 'src/utils/util'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

function Pricing() {
  const [plans, setPlans] = useState([])
  const auth = useAuth()

  const [open, setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")
  const router = useRouter();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    axios(host + "/wholesale/plan/all")
      .then(res => {
        setPlans(res.data)
      })
      .catch(err => {
        console.log(err)
        setMessage(!!err.response ? err.response.data.message : err.message)
        
        setFlag("error")
        setOpen(true)
      })
  }, [])

  const redirectForPayment = (slug, pg) => {
    axios.defaults.headers = {
      Authorization: auth.token
    }

    const redirect = async () => {
      if (pg === "wallet") {
        axios.get(host + "/wholesale/wallet/pay/" + slug)
        .then(res => {
            setMessage(res.data.message)
            setFlag("success")
            setOpen(true)
            router.push(`/wallet/?congratulation=${slug}`)
        }).catch(err => {
          setMessage(!!err.response ? err.response.data.message : err.message)
          setFlag("error")
          setOpen(true)
        });
      } else if (pg === "phonepe") {
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
    <>
      <Grid container sx={{ padding: 5 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          Our Plans
        </Typography>
        <Grid container spacing={2}>
          {plans.map((plan, i) => (
            <Grid item key={i} xs={12} sm={4}>
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
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setPaymentDialogOpen(true);
                    }}
                  >
                    Get Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
        <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>




<Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
  <DialogTitle>Select Payment Method</DialogTitle>
  <DialogContent>
    <Button
      fullWidth
      sx={{ mb: 1 }}
      variant="outlined"
      onClick={() => {
        setPaymentDialogOpen(false);
        redirectForPayment(selectedPlan.slug, "wallet");
      }}
    >
      Pay with Wallet
    </Button>
    <Button
      fullWidth
      variant="outlined"
      onClick={() => {
        setPaymentDialogOpen(false);
        redirectForPayment(selectedPlan.slug, "cashfree");
      }}
    >
      Pay with Cashfree
    </Button>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
  </DialogActions>
</Dialog>


    </>
  )
}

Pricing.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Pricing