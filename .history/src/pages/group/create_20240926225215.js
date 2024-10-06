
import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {  Alert, Box, Button, CardActions, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputAdornment, Link, OutlinedInput, Snackbar, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { BasicHeaders } from 'src/sections/basic-header';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { host } from 'src/utils/util';
import { useRouter } from 'next/router';

const Page = ()=> {


  
  const [flag,setFlag] = useState('warning')
  const [open,setOpen] = useState(false)
  const [message,setMessage] = useState("")
  const [permissions, setPermissions] = useState({})
  const [givenPermissions, setGivenPermissions] = useState([])
  let permissionsIds = []
  const auth = useAuth();
  const [checkAll, setCheckAll] = useState(false)



  useEffect(() => {
    axios.defaults.headers = {
      Authorization: auth.token
    }

    // Get all permmission 
    axios.get(host + "/group/permissions/all/")
      .then(res => {
        let response = res.data;
        setPermissions(response)
      })
      .catch(err => {
        setMessage(!!err.response  ? err.response.data.message : err.message)
        setFlag("error")
        setOpen(true)
      })
      // end here.

  }, [])


  const allowAll = (event) => {
    let isChecked = event.target.checked
    let allPermission = []
    if (isChecked) {
      Object.keys(permissions).map((key) => {
        //allPermission = [...allPermission, ...permissions[key].permission]
        (permissions[key].map((permission) => allPermission.push(permission.id))
        )
      })
      setGivenPermissions(allPermission)
      //setGivenPermissions([...(permissions.permissions)])
      setCheckAll(true)
    } else {
      //setGivenPermissions([...(permissions.permissions)])
      setCheckAll(false)
      setGivenPermissions([])
    }


    //console.log(givenPermissions)
  }


  const createGroup = (event) =>{
    event.preventDefault()
    let form = event.target;
    let formData = new FormData(form)
    
    let data = {
      name : formData.get("groupName"),
      permissions : givenPermissions

    }
    axios.defaults.headers = {
      Authorization: auth.token
    }
    axios.post(host + "/group/create",data)
      .then(res => {
        let response = res.data;
        console.log(response)
        setMessage(response.message)
        setFlag("success")
        setOpen(true)
      })
      .catch(err => {
        setMessage(!!err.response  ? err.response.data.message : err.message)
        setFlag("error")
        setOpen(true)
      })
  }



  const handleChange = (event) => {

    const permissionId =  event.target.name
    let isChecked =  event.target.checked
    if(isChecked){
      setGivenPermissions([...givenPermissions,parseInt(permissionId)])
    }else {
      setGivenPermissions(givenPermissions.filter((item)=> item != parseInt(permissionId)))
    } 

    console.log(permissionsIds)

  };


 /** for snackbar close */
const handleClose = () => {
    setOpen(false)
  };


  return (
    <>

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
          Retailer | Swami Sales
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
                    
          
          
          <form onSubmit={(e)=>createGroup(e)}>
          <Stack spacing={3}>
          <BasicHeaders  headerTitle={"Create Group"}/>

              <Grid spacing={3}>
                {/* Group input */}
                <Grid xs={2}>
                  <OutlinedInput
                    defaultValue=""
                    fullWidth
                    placeholder="Group Name"
                    name='groupName'            
                    startAdornment={(
                      <InputAdornment position="start" >

                        <WorkspacePremiumIcon
                          color="action"
                          fontSize="small"
                        >
                          <MagnifyingGlassIcon />
                        </WorkspacePremiumIcon>
                      </InputAdornment>
                    )}
                    sx={{ maxWidth: 540 }}
                  />

                  {/* end here... */}

                  <FormControlLabel sx={{ mx: 5 }}
                    control={
                      <Checkbox checked={checkAll} onChange={allowAll} name={0} />
                    }
                    label={"All Permissions"} />
                </Grid>
              </Grid>

          {/* permissions */}
          <Grid container spacing={3}>
                {Object.keys(permissions).map(element => {
                return (<Grid xs={3}>
                  <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">{element}</FormLabel>
                    {<FormGroup>
                      {permissions[element].map((item)=>{
                       return( <FormControlLabel
                          control={
                            <Checkbox checked={givenPermissions.includes(item.id) || checkAll} onChange={handleChange} name={item.id} />
                          }
                         label={item.permission}
                        />)
                      })}
                    </FormGroup>}
                </FormControl>
                </Grid>)
                })}        
               
            </Grid>
              {/* end here... */}
 
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained">
                      Save details
                    </Button>
              </CardActions>
            


            </Stack>
            </form>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);


export default Page;
