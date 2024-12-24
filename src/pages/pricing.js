
import { Avatar, Box, Button, Grid, Link, Typography } from '@mui/material'
import bg from 'public/assets/bg.png'
import HomeNavbar from 'src/sections/top-nav'
import { host, projectName } from 'src/utils/util'
import { CheckCircleOutline, CheckOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {useRouter } from 'next/router'
import { redirect } from 'next/dist/server/api-utils'


function Pricing() {
    const [plans,setPlans] = useState([])

    useEffect(()=>{
        axios(host+"/plans/all")
        .then(res => {
            setPlans(res.data)
        })
        .catch(err=>console.log(err))
    },[])


    const redirectForPayment = (slug) =>{
        window.open(host+"/pg/phonepe/"+slug)
    }


  return (<Box
        sx={{
            backgroundImage:`url(${bg.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height : '100vh'
        }}
     >
        <HomeNavbar />


        <Grid md={10} sx={{m :'0 auto'}} container>
        <Grid xs={12} md={12} sx={{
                    textAlign : 'center',
                    my : 10,
                    mt : 20
                }} >
            
                <Box>
                    <Typography variant='h3'>
                        Starter Plans For Your Online Store
                    </Typography>
                </Box>
                    
            </Grid>


            {plans.map( (plan,i) => {
            return (
                <Grid key={i} xs={12} md={3} sx={{
                    px : 2
                }} >
                    <Box sx={{
                            borderRadius : 2,
                            background : 'white',
                            // height : 550,
                            boxShadow : 6,
                            border : '4px solid #6366f1',
                            px : 3,
                            pb : 5,
                            mb : 5
                        }}>
                           <Box >
                                 <Box sx={{mt : 2}}>
                                    <Typography variant='h3'>
                                       {projectName} {plan.name}
                                    </Typography>
                                </Box>   
                         

                                    <Box sx={{my : 3}}>
                                         
                                        <Typography variant='h6'>
                                            ₹ {plan.price} <span> for {plan.months} month</span>
                                          
                                          </Typography>

                                          <Typography variant='p'>
                                            <Link 
                                            style={{
                                                textDecoration : 'none'
                                            }}
                                            href="/welcome"
                                            > {plan.months} Months Plan</Link>
                                          </Typography>
                                    </Box>

                                    <Box sx={{
                                        display : 'flex',
                                        flexDirection : 'column'
                                    }}>
                                        <Typography variant='span'>
                                            *GST extra
                                        </Typography>
                                        <Button 
                                            sx={{width : 200, my : 1}} 
                                            variant="outlined" 
                                            type='button' 
                                            onClick={(e)=>redirectForPayment(plan.slug)} 
                                            >Get Trial Plan
                                        </Button>
                                    <Box sx={{my:1}}>
                                        <Typography variant='h6'>Advanced Features</Typography>                                    
                                        <Box sx={{ml : 2}}>
                                            {[1,2,3,4,5,6].map(i =>{
                                                return (
                                                    <Box sx={{
                                                            my : 1,
                                                            display : 'flex',
                                                            alignItems : 'center',
                                                            textAlign : 'center'
                                                        }}>
                                                        <CheckCircleOutline sx={{color : 'green',mr : 1}}/>
                                                        <Typography variant='p'>
                                                            Al Reply/Compose
                                                        </Typography>
                                                    </Box>
                                                )
                                            })}
                                        </Box>         
                                    </Box>                        
                                </Box>
                            </Box>
                        </Box>
                </Grid>
            )
         })}   
   
       
        </Grid>
     </Box>
  )
}

export default Pricing