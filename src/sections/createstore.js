import {
    Alert,
    Box,
    FormControl,
    Unstable_Grid2 as Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import ImageInput from "src/sections/image-input";
import { host } from "src/utils/util";

const CreateStore = () => {

    const auth = useAuth()
    const [store,setStore] = useState(auth.store)
    const[cityList,setCityList] = useState([])
    const[stateList,setStateList] = useState([])
    const [selectedState , setSelectedState] = useState(1)
    const router = useRouter()
    const [categories,setItemCategories] = useState([])
    const [subcategories,setItemSubCategories] = useState([])
    const [values,setValues] = useState({})


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
    
    


      const handleChange = useCallback(
        (event) => {
          setValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
          }));
        },
        []
      );


    const onSubmit = (image) =>{
    setStore((pervious)=>({
        ...pervious,
        storePic : image.originFileObj,
    }))
    }

  return (
<>

    <Box>
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
            <form
            autoComplete="off"
            id={"createstore"}
            // noValidate
            >

                <Grid
                container
                spacing={3}
                >


        {/* store image input */}
        {/* Todo : Need to working on it */}
        {/* <div style={{marginLeft : '10px',marginTop: '10px'}}>
            <ImageInput onChange={onSubmit} />
        </div> */}

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
                    minRows={4}
                    InputLabelProps={{shrink : true}}
                    />

                </Grid>



                <Grid
                    xs={12}
                    md={6}
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
                >
                    <TextField
                    fullWidth
                    label="Zip Code"
                    name="zipCode"
                    type="number"
                    onChange={handleChange}
                    required
                    InputProps={{ maxLength: 6 }}
                    value={values.zipCode}
                    InputLabelProps={{shrink : true}}
                    />

                </Grid>



                {/* address */}

                <Grid
                    xs={12}
                    md={6}
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
            </form>
    </Box>
    </>
  )
}

export default CreateStore