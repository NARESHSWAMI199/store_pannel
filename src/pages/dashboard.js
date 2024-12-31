import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import HomeNavbar from 'src/sections/top-nav'

function dashboard() {

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
 
  <HomeNavbar  navRef={appBarRef} />


<Grid container sx={{
  marginTop : (appBarHeight+10)+"px",
  }}>
  <Grid xs={12} md={3}  sx={{
    boxShadow : 3,
    p : 10
  }}>
    <Box sx={{
      display : 'flex',
      flexDirection : 'column'
    }}>
      <Typography  sx={{
        textAlign : 'center',
        fontWeight : 'light',
        fontFamily : 'inherit',
        my : 1
        }} variant='h4'>
        Active Plan
      </Typography>


      <Typography  sx={{
        textAlign : 'center',
        my : 2
        }} variant='h4'>
        100
      </Typography>

    </Box>

    <Box sx={{
      display : 'flex'
    }}>
      <Typography  sx={{
        textAlign : 'center',
        fontWeight : 'light',
        mx : 5
        }} variant='small'>
        Created Date : 05 Dec 2024
      </Typography>

      <Typography  sx={{
        textAlign : 'center',
        fontWeight : 'light'
        }} variant='small'>
        Expirys Date : 12 Dec 2024
      </Typography>
    </Box>


  </Grid>
  </Grid>
 </>
  )
}

export default dashboard