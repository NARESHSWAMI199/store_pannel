import { CheckCircleOutline } from '@mui/icons-material'
import { Alert, Box, Button, Card, CardContent, Grid, Link, Snackbar, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import bg from 'public/assets/bg.png'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import HomeNavbar from 'src/sections/top-nav'
import { host, projectName } from 'src/utils/util'

function Pricing() {
  const [plans, setPlans] = useState([])
  const auth = useAuth()

  const [open, setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")
  const router = useRouter();

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
    <>
      <HomeNavbar bg={bg.src} />
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
                    {projectName} {plan.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {plan.months} Months Plan
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2 }}>
                    ₹ {plan.price}
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={(e) => redirectForPayment(plan.slug, "cashfree")}>
                    Get Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
    </>
  )
}

Pricing.getLayout = (page) => (
  <HomeNavbar bg={bg}>
    {page}
  </HomeNavbar>
)

export default Pricing