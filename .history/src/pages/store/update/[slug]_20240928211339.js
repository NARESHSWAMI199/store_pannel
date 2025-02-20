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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { host } from "src/utils/util";




const  UpdateWholesale = () =>{
const [open,setOpen] = useState(false)
const [message,setMessage] = useState("")
const [flag,setFlag] = useState("success")
const auth = useAuth()
const[cityList,setCityList] = useState([])
const[stateList,setStateList] = useState([])
const [selectedState , setSelectedState] = useState(1)
const [store,setStore] = useState({})
const [address,setAddress] = useState(store.address)

const router = useRouter()
const {slug} = router.query



useEffect(()=>{
    axios.defaults.headers={
        Authorization : auth.token
    }
    axios.get(host+"/admin/store/detail/"+slug)
    .then(res=>{
        let response = res.data.res;
        setStore(response)
        console.log(response)
        setAddress(response.address)
        setSelectedState(response.address.state)
})
    .catch(err=>console.log(err))
},[slug])


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
        setAddress({...address, state : stateId})
    },
    []
  );


  const changeCity = (event) => {
      let cityId =  event.target.value
      setAddress({...address, city : cityId})
  }


  const handleChange = useCallback ((event) => {
      setStore((preState) =>({
        ...preState,
        [event.target.name]: event.target.value
      }));
    },[])


  const handleSubmit = useCallback((e) =>{
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form)
    let storeData = {
      ...store,
      storeSlug : store.slug,
      addressSlug : store.address.slug,
      description : formData.get("description"),
      storeEmail : formData.get("storeEmail"),
      storePhone : formData.get("storePhone"),
      state:  formData.get("state"),
      city :  formData.get("city"),
      storeName :  formData.get("storeName"),
    }

    axios.defaults.headers = {
        Authorization : auth.token
    }
    axios.post(host+"/admin/store/update",storeData)
    .then(res => {
      console.log(res.data)
      setMessage(res.data.message)
      setFlag("success")
      form.reset();
      //reset()
    }).catch(err=>{
        setMessage(err.message)
        setFlag("error")
    })
    setOpen(true)
  })

  const handleClose = useCallback(()=>{
        setOpen(false)
  })
   

const reset = () =>{
  setStore({})
}


return ( <>

  <Box
    component="main"
    sx={{
      flexGrow: 1,
      py: 8
    }}
  >
    <Container maxWidth="xl">
      <Stack spacing={3}>


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
                value={store.storeName}
                InputLabelProps={{ shrink: true }}
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
                value={!!address ? address.state: 0}
                label="State"
                onChange={changeState}
                InputLabelProps={{ shrink: true }}
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
                value={!!address ? address.city : 0}
                onChange={changeCity}
                InputLabelProps={{ shrink: true }}
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
                value={store.email}
                InputLabelProps={{ shrink: true }}
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
                value={store.phone}
                InputLabelProps={{ shrink: true }}
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
                value={store.description}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
    </Card>

    <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Save details
        </Button>
      </CardActions>
    </Card>
  </form>
  </Grid>
</Stack>
</Container>
</Box>


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


UpdateWholesale.getLayout = (page) => (
<DashboardLayout>
  {page}
</DashboardLayout>
);

export default UpdateWholesale;