import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Snackbar, Alert } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host, suId } from 'src/utils/util';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tr } from 'date-fns/locale';
import { ArrowButtons } from 'src/layouts/arrow-button';

const Page = () => { 

    /** snackbar varibatles */

    const router = useRouter()
    const {slug} = router.query
    const [open,setOpen] = useState()
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("warning")
    const auth = useAuth()
    const [user,setUser] = useState({})
    const [content, setContent] = useState(user)
    const [groups,setGroups] = useState([])
    const [assignGroup , setAssignGroup] = useState([])
    const [data,setData] = useState({
      pageNumber : 0,
      size : 1000000
    })




    useEffect( ()=>{
      const getData = async () => {
         axios.defaults.headers = {
           Authorization : auth.token
         }
         await axios.get(host+"/admin/auth/groups/"+slug)
         .then(res => {
            const data = res.data.content;
            setAssignGroup(data);
         })
         .catch(err => {
           setFlag("error")
           setMessage(!!err.response ? err.response.data.message : err.message)
           if(user.userType =="S" && user.userType =="SA" )
           setOpen(true)
         } )
       }
      getData();
  
     },[data])


    useEffect( ()=>{
      const getData = async () => {
         axios.defaults.headers = {
           Authorization : auth.token
         }
         await axios.post(host+"/group/all",data)
         .then(res => {
            const data = res.data.content;
            if(auth.user.id != suId){
             setGroups(data.filter((group)=>(group.id != 0)));
            }else{
              setGroups(data);
            }
         })
         .catch(err => {
           //setErrors(err.message)
           setFlag("error")
           setMessage(!!err.response ? err.response.data.message : err.message)
           setOpen(true)
         } )
       }
      getData();
  
     },[data])


    useEffect(()=>{
        axios.defaults.headers = {
            Authorization : auth.token
        }
        axios.get(host+`/admin/auth/detail/${slug}`)
        .then(res =>{
            const data = res.data.res
            setUser(data)
            setContent(data)
        }).catch(err=>{
            console.log(err)
            setFlag("error")
            setMessage(!!err.response ? err.response.data.message : err.message)
            setOpen(true)
        })
    },[slug])


    const updateProfile = async (updatedUser) =>{
        axios.defaults.headers = {
          Authorization : auth.token
        }
        const data = {
          ...user,
          ...updatedUser,
          storeSlug  : user.userType == "W" ? "only-profile" : null 
        }
        await axios.post(host+"/admin/auth/update",data)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          setContent(data)
          setOpen(true)
        }).catch(err=>{
          setFlag('error')
          setMessage(!!err.response ? err.response.data.message : err.message)
          console.log(err.message)
          setOpen(true)
        })

    }

      /** for snackbar close */
      const handleClose = () => {
        setOpen(false)
      };


    return (<>

    
<Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
     <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
        {message}
    </Alert>
    </Snackbar>
      <Head>
        <title>
          Account | Swami Sales
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Account
              </Typography>
            </div>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfile user={content} />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                 <AccountProfileDetails user={content} updateProfile={updateProfile} assignGroup={assignGroup} groups={groups} /> 
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
    }
Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
