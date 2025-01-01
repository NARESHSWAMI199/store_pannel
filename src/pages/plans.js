import { Badge, Box, Grid, Typography } from '@mui/material'
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
import { host} from 'src/utils/util';

function createData(planName, month, createdAt, updatedAt, status) {
  return { planName, month, createdAt, updatedAt, status };
}
const rows = [
  createData('Swami Sales Trial',1, '12 Dec 2024', '12 Jan 2025', "Expried"),
];


function dashboard() {

   const appBarRef = useRef(null);
   const [appBarHeight, setAppBarHeight] = useState(0);
  const [userPlans, setUserPlan] = useState([])
  const auth = useAuth()


  useEffect(()=>{
      axios.defaults.headers = {
        Authorization : auth.token
      }
      axios.get(host+"/wholesale/plan/all",{storeId : auth.store.id})
      .then(res => {
          const data = res.data;
          setUserPlan(data);
      })
      .catch(err => {
        console.log(err)
      } )
  },[])


    
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
 
  <HomeNavbar  navRef={appBarRef} />


<Grid container sx={{
    marginTop : (appBarHeight+10)+"px",
    display : 'flex',
    justifyContent : 'center'
  }}>
    <Grid md={10} xs={12}>
      <Grid xs={12} md={2.5}  sx={{
        boxShadow : 3,
        borderRadius : 2,
        m : 10
      }}>
        <Box sx={{px: 5}}>
          {/* <Badge badgeContent={"Active"} color="success" /> */}
            <Badge badgeContent={"Expired"} color="error" />
        </Box>

      <Box sx={{
        p : 2
      }}>
        <Box sx={{
          display : 'flex',
          flexDirection : 'column',
          justifyContent : 'center',
          alignItems : 'center',
        }}>
          <Typography  sx={{
            fontWeight : 'light',
            fontFamily : 'inherit',
            fontSize : 22
            }} variant='h4'>
            Active Plan
          </Typography>


          <Typography  sx={{
            my : 2
            }} variant='h4'>
            ₹ 100
            <br/>
            <span style={{
              color : '#6c757d!important',
              fontSize :14
            }}>
              6 month's plan
            </span>
          </Typography>

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
              05 Dec 2024
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
              12 Dec 2024
            </span>
          </Typography>
        </Box>
            {/* <Badge badgeContent={"Expired"} color="error" /> */}
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
                <TableCell align="center">Months</TableCell>
                <TableCell align="center">Purcahsed At</TableCell>
                <TableCell align="center">Expired At</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPlans.map((plan,i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {plan.name}
                  </TableCell>
                  <TableCell align="center">{plan.months}</TableCell>
                  <TableCell align="center">{plan.createdAt}</TableCell>
                  <TableCell align="center">{plan.expiryDate}</TableCell>
                  <TableCell align="center">
                    <Badge badgeContent={"Expired"} color='error' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  </Grid>
 </>
  )
}

export default dashboard