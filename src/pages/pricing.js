
import { CheckCircleOutline } from '@mui/icons-material'
import { Alert, Box, Button, Grid, Link, Snackbar, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import bg from 'public/assets/bg.png'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'
import HomeNavbar from 'src/sections/top-nav'
import { host, projectName } from 'src/utils/util'


function Pricing() {
    const [plans,setPlans] = useState([])    
    const auth = useAuth()

    const [open, setOpen] = useState()
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("warning")
    const router = useRouter();


    useEffect(()=>{
        axios(host+"/wholesale/plan/all")
        .then(res => {
            setPlans(res.data)
        })
        .catch(err=>{
            console.log(err)
            setMessage(!!err.respone ? err.response.data.message : err.message)
            setFlag("error")
            setOpen(true)
        })
    },[])


    const redirectForPayment = (slug) =>{
        const redirect = async() => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            
            await axios.get(host+"/pg/pay/"+slug)
            .then(res => {
                window.open(res.data.url);
            })
            .catch(err => {
                setMessage(!!err.response ? err.response.data.message : err.message)
                setFlag("error")
                setOpen(true)
            });
        }

        /* Before payment we will check user must be logged in. */
        if(!!auth.token){
            redirect();
        }else{
            router.push("/auth/register")
        }

  
    }


    /** for snackbar close */
    const handleClose = () => {
        setOpen(false)
    };
    

  return (<>
    <Grid container 
      sx={{
          justifyContent : 'center'
      }}>
        <Grid md={10}>
            <Box sx={{
                textAlign : 'center',
                m : 10,
                alignItems : 'flex-start !important'
            }}>
                <Typography variant='h2' sx={{fontFamily : 'Georgia,Times,Times New Roman,serif;',fontWeight : 'light'}}>
                    Starter plans your online store
                </Typography>
            </Box>
                        
            <Grid container>
                    {plans.map( (plan,i) => {
                    return (
                        <Grid key={i} xs={12} md={4} sx={{
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
                                                {/* <Typography variant='span'>
                                                    *GST extra
                                                </Typography> */}
                                                <Button 
                                                    variant="contained" 
                                                    type='button' 
                                                    onClick={(e)=>redirectForPayment(plan.slug)} 
                                                    >Get Trial Plan
                                                </Button>
                                        </Box>
                                    </Box>
                                </Box>
                        </Grid>
                    )
                })}   
                                
            </Grid>
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