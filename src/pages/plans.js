import { Badge, Box, Button, Grid, Typography } from '@mui/material'
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
import { useRouter } from 'next/router';


function Plans() {

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


  useEffect(()=>{
      axios.defaults.headers = {
        Authorization : auth.token
      }
      axios.get(host+"/wholesale/plan/all")
      .then(res => {
          const data = res.data;
          setUserPlan(data);
          if(data.length > 0){
            setResetPlan(data[0])
          }
      })
      .catch(err => {
        console.log(err)
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
        background : 'white',
        borderRadius : 2,
        p : 5
    }}>
      <Grid xs={12} md={2.5}  sx={{
        boxShadow : 3,
        borderRadius : 2,
        m : 5
      }}>
        <Box sx={{px: 5}}>
          {recentPlan.status ? 
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
              ₹ {recentPlan.price}
              <br/>
              <span style={{
                color : '#6c757d!important',
                fontSize :14,
              }}>
                {recentPlan.months} month's plan
              </span>
            </Typography>
          {!recentPlan.status &&
            <Button sx={{mb : 2}} variant="contained" color='primary' onClick={(e)=>{
                router.push("/pricing")
              }}> 
              Get New Plan 
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
                      {plan.name}
                    </TableCell>
                    <TableCell align="center">{plan.price}</TableCell>
                    <TableCell align="center">{plan.months}</TableCell>
                    <TableCell align="center">{fomratedDate(plan.createdAt)}</TableCell>
                    <TableCell align="center">{fomratedDate(plan.expiryDate)}</TableCell>
                    <TableCell align="center">
                      {plan.status ? 
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
 </>
  )
}

Plans.getLayout = (page) =>(
  <HomeNavbar>
  {page}
</HomeNavbar>
)

export default Plans