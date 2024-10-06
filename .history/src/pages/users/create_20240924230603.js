import { Box,
        Button, 
        Card,
        CardActions,
        CardContent,
        CardHeader,
        Divider,
        MenuItem,
        Select,
        TextField,
        Unstable_Grid2 as Grid,
        InputLabel,
        FormControl,
        Snackbar,
        Alert
    } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { host } from "src/utils/util";




const createUser = () =>{    

    const [open,setOpen] = useState(false)
    const [message,setMessage] = useState("")
    const [flag,setFlag] = useState("success")
    const auth = useAuth()
    const[cityList,setCityList] = useState([])
    const[stateList,setStateList] = useState([])
    const [selectedState , setSelectedState] = useState(1)
    const [values,setValues] = useState({})
    const [userType,setUserType] = useState(null)
    useEffect(()=>{
        axios.defaults.headers={
            Authorization : auth.token
        }
        axios.get(host+"/admin/address/state")
        .then(res=>setStateList(res.data))
        .catch(err=>console.log(err))
    },[])



    useEffect(()=>{
      axios.defaults.headers={
        Authorization : auth.token
      }
      axios.get(host+`/admin/address/city/${selectedState}`)
      .then(res=>{
          setCityList(res.data)}
          )
      .catch(err=>console.log(err))
    },[selectedState])




    const changeState = useCallback(
          async (event) => {
            let stateId =  event.target.value
            setSelectedState(stateId)
        },
        []
      );


      const handleChange = useCallback(
        (event) => {
          setValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
          }));
        },
        []
      );


      const handleSubmit = useCallback(
        (e) =>{
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        let store = {
            username : formData.get("username"),
            userType: formData.get("userType"),
            email: formData.get("email"),
            contact: formData.get("contact"),
          }

        if (userType === "W"){
          store = {
            ...store,
            description : formData.get("description"),
            storeEmail : formData.get("storeEmail"),
            storePhone : formData.get("storePhone"),
            state:  formData.get("state"),
            city :  formData.get("city"),
            storeName :  formData.get("storeName"),
          }
        }

        axios.defaults.headers = {
            Authorization : auth.token
        }
        axios.post(host+"/admin/auth/add",store)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          form.reset();
          reset()
        }).catch(err=>{
            setMessage(err)
            setFlag("error")
        })
        setOpen(true)
      })

      const handleClose = useCallback(()=>{
            setOpen(false)
      })
       

    const reset = () =>{
      setValues({})
    }
  

    return ( <>
    <Grid
        xs={12}
        md={6}
        lg={8}
      >

        <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
    <Card >
    <Card>
          <CardHeader
            subheader="From here you can add user."
            title="Create User"
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    onChange={handleChange}
                    required={true}
                    value={values.username}
                  />
  
                </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <FormControl fullWidth>
              <InputLabel id="userTypeLabel">User type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='userType'
                value={values.userType}
                label="User type"
                onChange={(e)=>{
                  handleChange(e)
                  setUserType(e.target.value)
                }
                }
              >
                <MenuItem value={"S"}>Staff</MenuItem>
                <MenuItem value={"W"}>Wholesaler</MenuItem>
                <MenuItem value={'R'}>Retailer</MenuItem>
              </Select>
              </FormControl>
              </Grid>

                {/* address */}
{/* 
                <Grid
                  xs={12}
                  md={6}
                >      
                <FormControl fullWidth>
                <InputLabel id="stateLabel">State</InputLabel>
                  <Select
                    labelId="stateLable"
                    id="demo-simple-select"
                    name='state'
                    value={values.state}
                    label="State"
                    onChange={changeState}
                  >
                  {stateList.map((state,i)=>{
                      return (<MenuItem key={i+state.stateName} value={state.id}>{state.stateName}</MenuItem>)
                  })}
          
                  </Select>
              </FormControl>
                </Grid>


                <Grid
                  xs={12}
                  md={6}
                >
                <FormControl fullWidth>
                  <InputLabel id="cityLabel">City</InputLabel>
                  <Select
                    fullWidth
                    labelId="cityLabel"
                    name='city'
                    label="City"
                    value={values.city}
                    onChange={handleChange}
                  >
                  {cityList.map((city,i) => {
                      return (<MenuItem key={i} value={city.id}>{city.cityName}</MenuItem>)
                  })}
                  </Select> 
                  </FormControl>
                </Grid> */}


                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                    required
                    value={values.email}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="contact"
                    onChange={handleChange}
                    type="number"
                    value={values.contact}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
        </Card>

      {userType =='W' && 
        <Card>
          <CardHeader
            subheader="From here you can add store."
            title="Store Detail"
          />
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    label="Store Name"
                    name="storeName"
                    onChange={handleChange}
                    required
                    value={values.storeName}
                  />
  
                </Grid>

                {/* address */}

                <Grid
                  xs={12}
                  md={6}
                >      
                <FormControl fullWidth>
                <InputLabel id="stateLabel">State</InputLabel>
                  <Select
                    labelId="stateLable"
                    id="demo-simple-select"
                    name='state'
                    value={values.state}
                    label="State"
                    onChange={changeState}
                  >
                  {stateList.map((state,i)=>{
                      return (<MenuItem key={i+state.stateName} value={state.id}>{state.stateName}</MenuItem>)
                  })}
          
                  </Select>
              </FormControl>
                </Grid>


                <Grid
                  xs={12}
                  md={6}
                >
                <FormControl fullWidth>
                  <InputLabel id="cityLabel">City</InputLabel>
                  <Select
                    fullWidth
                    labelId="cityLabel"
                    name='city'
                    label="City"
                    value={values.city}
                    onChange={handleChange}
                  >
                  {cityList.map((city,i) => {
                      return (<MenuItem key={i} value={city.id}>{city.cityName}</MenuItem>)
                  })}
                  </Select> 
                  </FormControl>
                </Grid>


                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Store Email Address"
                    name="storeEmail"
                    onChange={handleChange}
                    required
                    value={values.storeEmail}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Store Phone Number"
                    name="storePhone"
                    onChange={handleChange}
                    type="number"
                    value={values.storePhone}
                  />
                </Grid>
                 <Grid
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    onChange={handleChange}
                    required
                    value={values.description}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
        </Card>
}
        <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">
              Save details
            </Button>
          </CardActions>
        </Card>
      </form>
      </Grid>


   
      <Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
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


createUser.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );

export default createUser;