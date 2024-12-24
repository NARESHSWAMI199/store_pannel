import { ArrowRightAltOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, SvgIcon, Typography } from '@mui/material'
import Link from 'next/link'
import bg from 'public/assets/bg.png'
import logo from 'public/assets/logos/logo.png'
import HomeNavbar from 'src/sections/top-nav'
function Page() {

  return (
    <Box
        sx={{
            backgroundImage:`url(${bg.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height : '100vh'
        }}
     >
    <HomeNavbar/>
    <Box 
        sx={{
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',
            height : '100%',
            width : '90%',
            m : '0 auto',
            flexDirection : 'column'
        }}
    >
    <Box sx={{
        display :'flex',
        alignItems : 'center',
        justifyContent :'center',
        height : 150,
        width : 150,
        background : 'white',
        borderRadius : 50,
        boxShadow : 1,
        my : 5
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
                fontSize : '6vw',
                textAlign : 'center',
                fontWeight : 'light'
            }}
        >WELCOME 
        <br/> TO <br/>
         <span style={{color : '#6366f1'}}>S</span>WAMI <span style={{color : '#6366f1'}}>S</span>ALES
        </Typography>

        <Typography 
            variant='h3'
            sx={{
                fontFamily : 'serif',
                fontSize : '1.5vw'
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
            pathname : "/pricing"
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
                alignSelf : 'flex-end'
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
   </Box>
  )
}


export default Page

