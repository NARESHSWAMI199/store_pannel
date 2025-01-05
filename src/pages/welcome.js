import { ArrowRightAltOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Grid, SvgIcon, Typography } from '@mui/material'
import Link from 'next/link'
import bg from 'public/assets/bg2.png'
import logo from 'public/assets/logos/logo.png'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import HomeNavbar from 'src/sections/top-nav'
function Page() {     

const auth = useAuth()
  return (
    <Grid container 
    sx={{
        justifyContent : 'center',
        alignItems : 'center',
        display : 'flex'
    }}>
    <Box sx={{
        display : 'flex' , 
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center'
        
    }}>
    <Box sx={{
        display :'flex',
        alignItems : 'center',
        justifyContent :'center',
        height : 150,
        width : 150,
        background : 'white',
        borderRadius : 50,
        boxShadow : 1
    }}> 


        <Avatar  sx={{
            height : 100,
            width : 150,
            objectFit :'contain',

        }} src={logo.src} /> 
    </Box>
        <Typography 
            variant='h1'
            sx={{
                fontFamily : 'Georgia, serif',
                fontSize : '4vw',
                textAlign : 'center',
                fontWeight : 'light',
                color : '#ffffff',
                mt : 2
            }}
        >
            WELCOME TO <br/>
            <span style={{  fontSize : '120px',}}> SWAMI SALES </span>
        </Typography>

        <Typography 
            variant='h3'
            sx={{
                fontFamily : 'serif',
                fontSize : '24px'
            }}
        >
         Grow your bussinus with swami sales.
        </Typography>
        <Typography 
            variant='p'
            sx={{
                fontFamily : 'serif'
            }}
        > Hey ! It's time to switch online.
        </Typography>


            
        <Link href={{
            pathname :  !!auth.token ? "/pricing" : "/auth/register"
        }} style={{
                height : 60,
                width: 300,
                fontWeight : 'bold',
                fontSize : 18,
                marginTop : 25,
                background : 'white',
                color : 'black',
                position : 'relative',
                borderRadius : 20,
                textDecoration : 'none',
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                // alignSelf : 'flex-end'
                // top : '25%',
                // left : '35%'
            }} > 
            <Box sx={{
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center',
                }}>
                Register Now / Try Now
                <ArrowRightAltOutlined sx={{fontWeight : 'bold', mx : 1}}/>
            </Box>
          </Link>
    </Box>
    </Grid>
  )
}

Page.getLayout = (page) => (
    <HomeNavbar bg={bg}>
        {page}
    </HomeNavbar>
)


export default Page

