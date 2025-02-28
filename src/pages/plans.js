import { Badge, Box, Button, Grid, SvgIcon, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import HomeNavbar from 'src/sections/top-nav'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import { useAuth } from 'src/hooks/use-auth';
import { host,dataNotFoundImage} from 'src/utils/util';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Plans() {


  const [open, setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")

  const router = useRouter()
  const appBarRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [recentPlan, setResetPlan] = useState({
    status : false,
    price : 0,
    months : 0,
    createdAt : null,
    expiryDate : null
  })
  const [userPlans, setUserPlan] = useState([])
  const auth = useAuth()
  const current = new Date().getTime()


  useEffect(()=>{
      axios.defaults.headers = {
        Authorization : auth.token
      }
      axios.post(host+"/wholesale/plan/my-plans",{})
      .then(res => {
          const data = res.data.content;
          setUserPlan(data);
          if(data.length > 0){
            setResetPlan(data[0])
          }
      })
      .catch(err => {
        setMessage(!!err.response ? err.response.data.message : err.message)
        setFlag("error")
        setOpen(true)
      } )
  },[])



  const fomratedDate = (millis) => {
    if(!!millis){
    return format(millis, 'dd/MM/yyyy');
    }else{
      "-"
    }
  }


  return (
 <>
<Grid container sx={{
    justifyContent : 'center',
  }}>
    <Grid md={10} xs={12} sx={{
        borderRadius : 2,
        p : 5
    }}>
      <Grid xs={12} md={4} lg={4} xl={4}  sx={{
        boxShadow : 3,
        borderRadius : 2,
        m : 5,
        p : 2
      }}>
        <Box sx={{px: 5}}>
          { current <= recentPlan.expiryDate ? 
            <Badge badgeContent={"Active"} color="success" />
            :
            <Badge badgeContent={"Expired"} color="error" />
          }
        </Box>

        <Box sx={{
          p : 2
        }}>
          <Box sx={{
            display : 'flex',
            flexDirection : 'column',
            justifyContent : 'center',
            alignItems : 'center',
            textAlign : 'center'
          }}>
            <Typography  sx={{
              fontWeight : 'light',
              fontFamily : 'inherit',
              fontSize : 22
              }} variant='h4'>
              Recent Plans
            </Typography>


            <Typography  sx={{
              my : 2
              }} variant='h4'>
                {recentPlan.servicePlan?.price > 0  ?   "₹ "+ recentPlan.servicePlan?.price : "Free"}
            
              <br/>
              <span style={{
                color : '#6c757d!important',
                fontSize :14,
              }}>
                {recentPlan.servicePlan?.months + " month's plan"}
              </span>
            </Typography>
          {current > recentPlan.expiryDate ?
            <Button sx={{mb : 2}} variant="contained" color='primary' onClick={(e)=>{
                router.push("/pricing")
              }}
              startIcon={
                <SvgIcon>
                    <ArrowForwardIcon size="small" />
                </SvgIcon>
              }>
              GET NEW PLAN
            </Button>
            :
            <Button sx={{mb : 2}} variant="contained" color='primary' onClick={(e)=>{
              router.push("/")
            }}
            startIcon={
              <SvgIcon>
                  <ArrowForwardIcon size="small" />
              </SvgIcon>
              }
            > 
            GO TO DASHBOARD 
          </Button>
          }
          </Box>    
          <Box sx={{
            display : 'flex',
            justifyContent : 'center',
          }}>
            <Typography  sx={{
              fontWeight : 'light',
              mx : 5
              }} variant='small'>
              Created Date
              <br/>
              <span style={{
                color : '#6c757d!important',
                fontSize : 14
              }}>
              {fomratedDate(recentPlan.createdAt)}
              </span>
            </Typography>

            <Typography  sx={{
              fontWeight : 'light'
              }} variant='small'>
              Expirys Date
              <br/>
              <span style={{
                color : '#6c757d!important',
                fontSize : 14
              }}>
                {fomratedDate(recentPlan.expiryDate)}
              </span>
            </Typography>
          </Box>
        </Box>

      </Grid>
      <Grid xs={12} md={12} sx={{
        p : 2
      }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Months</TableCell>
                <TableCell align="center">Purcahsed At</TableCell>
                <TableCell align="center">Expired At</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPlans.length > 0 ? 
              userPlans.map((plan,i) => {
                  const createdAt = format(!!plan.createdAt ? plan.createdAt : 0, 'dd/MM/yyyy');
                  const expiryDate = format(!!plan.expiryDate ? plan.expiryDate : 0, 'dd/MM/yyyy');
                  return <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {plan.servicePlan?.name}
                    </TableCell>
                    <TableCell align="center">
                    {plan.price === 0 ? 
                      <Badge badgeContent={"Free"} color='success' />
                      :
                      plan.servicePlan?.price
                    }
                    </TableCell> 
                    <TableCell align="center">{plan.servicePlan?.months}</TableCell>
                    <TableCell align="center">{createdAt}</TableCell>
                    <TableCell align="center">{expiryDate}</TableCell>
                    <TableCell align="center">
                      {plan.expiryDate > current ? 
                      <Badge badgeContent={"Active"} color='success' />
                      :
                      <Badge badgeContent={"Expired"} color='error' />
                      }
                    </TableCell>
                    </TableRow>
                })
              : 
              <TableRow>
                <TableCell colSpan={6}> 
                  <Box sx={{
                      display : 'flex',
                      flexDirection : 'column',
                      justifyContent : 'center',
                      alignItems : 'center',
                      p : 5
                  }} >
                      <img src={dataNotFoundImage} height={120}  alt='data not found.' />
                      <Typography variant='span'>
                            Data not found.
                      </Typography>
                  </Box>
                </TableCell>
              </TableRow>

              }
        
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
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
 </>
  )
}

Plans.getLayout = (page) =>(
  <HomeNavbar>
  {page}
</HomeNavbar>
)

export default Plans