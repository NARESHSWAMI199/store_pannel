import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Grid,
    Snackbar,
    Alert
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import HomeNavbar from 'src/sections/top-nav';
import { host } from "src/utils/util";
import ImageInput from "src/sections/image-input";
import bg from 'public/assets/bg2.png'
import Spinner from '../sections/spinner';


const CreateStore = () => {
    const [open,setOpen] = useState(false)
    const [message,setMessage] = useState("")
    const [flag,setFlag] = useState("success")
    const auth = useAuth()
    const [store,setStore] = useState({
        storePic : ''
    })
    const[cityList,setCityList] = useState([])
    const[stateList,setStateList] = useState([])
    const [selectedState , setSelectedState] = useState(1)
    const router = useRouter()
    const [categories,setItemCategories] = useState([])
    const [subcategories,setItemSubCategories] = useState([])
    const [values,setValues] = useState({})
    const [showSpinner , setShowSpinner] = useState("none")


    useEffect(()=>{
        axios.defaults.headers={
            Authorization : auth.token
        }
        axios.get(host+"/wholesale/address/state")
        .then(res=>setStateList(res.data))
        .catch(err=>{
          console.log(err)
          setMessage(!!err.response ? err.response.data.message : err.message)
          setFlag("error")
          setOpen(true)
        })
    },[])



    useEffect(()=>{
      axios.defaults.headers={
        Authorization : auth.token
      }
      axios.get(host+`/wholesale/address/city/${selectedState}`)
      .then(res=>{
          setCityList(res.data)}
          )
      .catch(err=>{
        console.log(err)
        setMessage(!!err.response ? err.response.data.message : err.message)
        setFlag("error")
        setOpen(true)
      })
    },[selectedState])




    const changeState = useCallback(
          async (event) => {
            let stateId =  event.target.value
            setSelectedState(stateId)
        },
        []
      );




      useEffect(() => {
        const getData = async () => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            await axios.get(host + "/wholesale/store/category")
                .then(res => {
                    const data = res.data;
                    setItemCategories(data)
                })
                .catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag('error')
                    setOpen(true)
                })
        }
        getData();
    
    }, [])
    
    
    useEffect(() => {
      const getSubcategory = async () => {
          axios.defaults.headers = {
              Authorization: auth.token
          }
          await axios.get(host + "/wholesale/store/subcategory/"+values.category)
              .then(res => {
                  const data = res.data;
                  setItemSubCategories(data)
              })
              .catch(err => {
                  setMessage(!!err.response ? err.response.data.message : err.message)
                  setFlag('error')
                  setOpen(true)
              })
      }
      if(values.category !=undefined){
          getSubcategory();
      }
    }, [values.category]) 
    



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
        if(store.storePic === ''){
            alert("Store Image can't be blank.")
            return false
        }
        const form = e.target;
        const formData = new FormData(form)
        let data = {
            // ...store,
            // addressSlug : store.address.slug,
            description : formData.get("description"),
            storeEmail : formData.get("storeEmail"),
            storePhone : formData.get("storePhone"),
            state:  formData.get("state"),
            city :  formData.get("city"),
            street:  formData.get("street"),
            zipCode :  formData.get("zipCode"),
            categoryId: formData.get("category"),
            subCategoryId: formData.get("subcategory"),
            storeName :  formData.get("storeName"),
            storePic : store.storePic
          }

        setShowSpinner("block")
        axios.defaults.headers = {
            Authorization : auth.token,
            "Content-Type" : "multipart/form-data"
        }
        axios.post(host+"/wholesale/store/add",data)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          setOpen(true)
          auth.updateUserDetail()
          router.push("/")
          setShowSpinner("none")
        }).catch(err=>{
            console.log(err)
            setMessage(!!err.response ? err.response.data.message : err.message)
            setFlag("error")
            setOpen(true)
            setShowSpinner("none")
        })
    
      })

      const handleClose = useCallback(()=>{
            setOpen(false)
      })
      

    const onSubmit = (image) =>{
      setStore((pervious)=>({
        ...pervious,
        storePic : image.originFileObj,
      }))
    }

  return (
    <Grid container 
        sx={{
            justifyContent : 'center',
            alignItems : 'center',
            display : 'flex'
        }}>
    <Grid xs={12} md={6} sx={{
        background : 'white',
        px : 3,
        py : 3,
        borderRadius : 2,
        boxShadow : 1
    }}>
        <Stack
            spacing={1}
            sx={{ my: 2 }}
        >
            <Typography variant="h5">
            Let's create your own store.
            </Typography>
            <Typography
            color="text.secondary"
            variant="body2"
            >
            It's time switch online.
            </Typography>
        </Stack>        

            <Spinner show={showSpinner}/>
            <form
                autoComplete="off"
                id={"createstore"}
                onSubmit={handleSubmit}
            // noValidate
            >
                <Grid container spacing={3}>
                    {/* store image input */}
                    <Grid item>
                        <ImageInput onChange={onSubmit} />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        item /*make sure you adding this props. for proper spacing if you are not using unstable_grid2 as from mui*/
                    >
                        <TextField
                        fullWidth
                        label="Store Name"
                        name="storeName"
                        onChange={handleChange}
                        required
                        minRows={4}
                        InputLabelProps={{shrink : true}}
                        />

                    </Grid>

                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <TextField
                        fullWidth
                        label="Street Address"
                        name="street"
                        onChange={handleChange}
                        required
                        InputLabelProps={{shrink : true}}
                        />

                    </Grid>
                    
                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <TextField
                        fullWidth
                        label="Zip Code"
                        name="zipCode"
                        type="number"
                        onChange={handleChange}
                        required
                        InputProps={{ maxLength: 6 }}
                        InputLabelProps={{shrink : true}}
                        />

                    </Grid>

                    {/* address */}

                    <Grid
                        xs={12}
                        md={6}
                        item
                    >      
                    <FormControl fullWidth>
                    <InputLabel  style={{background : 'white'}}  id="stateLabel">State</InputLabel>
                        <Select
                        labelId="stateLable"
                        id="demo-simple-select"
                        name='state'
                        onChange={changeState}
                        required
                        InputLabelProps={{shrink : true}}
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
                        item
                    >
                    <FormControl fullWidth>
                        <InputLabel style={{background : 'white'}} id="cityLabel">City</InputLabel>
                        <Select
                        fullWidth
                        labelId="cityLabel"
                        name='city'
                        onChange={handleChange}
                        required
                        InputLabelProps={{shrink : true,values:'filled'}}
                        >
                        {cityList.map((city,i) => {
                            return (<MenuItem key={i} value={city.id}>{city.cityName}</MenuItem>)
                        })}
                        </Select> 
                        </FormControl>
                    </Grid>

                    {/* Category */}
                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <FormControl fullWidth>
                            <InputLabel  style={{background : 'white'}}  id="itemLabel">Category</InputLabel>
                            <Select
                                labelId="itemLabel"
                                id="category"
                                name='category'
                                onChange={handleChange}
                                required
                            >
                            {categories.map((categroyObj , i) => {
                                if(categroyObj.id !=0)
                                return ( <MenuItem key={i} value={categroyObj.id}>{categroyObj.category}</MenuItem>
                                )})
                            }
                                <MenuItem value={0}>{"Other"}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Subcategory */}
                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                    <FormControl fullWidth>
                        <InputLabel  style={{background : 'white'}}  id="itemLabel">Subcategory</InputLabel>
                        <Select
                            labelId="itemLabel"
                            id="subcategory"
                            name='subcategory'
                            onChange={handleChange}
                            required
                        >
                        {subcategories.map((subcategroyObj , i) => {
                            if(subcategroyObj.id !=0)
                            return ( <MenuItem key={i} value={subcategroyObj.id}>{subcategroyObj.subcategory}</MenuItem>
                            )})
                        }
                            <MenuItem value={0}>{"Other"}</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>


                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <TextField
                        fullWidth
                        label="Store Email Address"
                        name="storeEmail"
                        onChange={handleChange}
                        required
                        value={values.storeEmail}
                        InputLabelProps={{shrink : true}}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <TextField
                        fullWidth
                        label="Store Phone Number"
                        name="storePhone"
                        onChange={handleChange}
                        type="number"
                        required
                        InputLabelProps={{shrink : true}}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={12}
                        item
                    >
                        <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        onChange={handleChange}
                        required
                        InputLabelProps={{shrink : true}}
                        multiline
                        rows={4}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ 
                    display : 'flex',
                    justifyContent : 'flex-end',
                    width : '100%'
                }}>
                    <Button
                        size="large"
                        sx={{ mt: 3 }}
                        type="submit"
                        variant="contained"
                    >
                        Save Store
                    </Button> 

                </Box>
            </form>

            <Snackbar anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}
                    open={open}
                    onClose={handleClose}
                    key={'bottom' + 'left'}
                >
                <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
    </Grid>
    </Grid>
  )
}


CreateStore.getLayout = (page) => (
    <HomeNavbar bg={bg}>
        {page}
    </HomeNavbar>
)

export default CreateStore