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
        Alert,
        Container,
        Stack,
        Autocomplete
    } from "@mui/material";
    import axios from "axios";
    import { useRouter } from "next/navigation";
    import { useCallback, useEffect, useState } from "react";
    import { useAuth } from "src/hooks/use-auth";
    import { ArrowButtons } from "src/layouts/arrow-button";
    import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
    import { BasicHeaders } from "src/sections/basic-header";
import ImageInput from "src/sections/image-input";
    import { host, storeImage, suId } from "src/utils/util";





    const Page = () =>{    

    const [open,setOpen] = useState(false)
    const [message,setMessage] = useState("")
    const [flag,setFlag] = useState("success")
    const auth = useAuth()
    const user = auth.user
    const [store,setStore] = useState(auth.store)
    const[cityList,setCityList] = useState([])
    const[stateList,setStateList] = useState([])
    const [selectedState , setSelectedState] = useState(1)
    const router = useRouter()
    const [categories,setItemCategories] = useState([])
    const [subcategories,setItemSubCategories] = useState([])
    const [values,setValues] = useState({...store, ...user,
      street : store?.address?.street,
      zipCode : store?.address?.zipCode,
      storeEmail : store?.email,
      storePhone : store?.phone,
      category : {label : store?.storeCategory?.category, id : store?.storeCategory?.id},
      subcategory : {label : store?.storeSubCategory?.subcategory, id : store?.storeSubCategory?.id},
    })


    useEffect(()=>{ 
      console.log(store)  
    }  ,[store])

    useEffect(()=>{
        axios.defaults.headers={
            Authorization : auth.token
        }
        axios.get(host+"/wholesale/address/state")
        .then(res=>{
          setStateList(res.data)
          let selectedState  = res.data.find(state=>state.id == store.address.state);
          setValues((prevState)=>({...prevState, state : {label : selectedState?.stateName  || '', id : selectedState.id} }))
        }
        )
        .catch(err=>{
          console.log(err)
          setMessage(!!err.response ? err.response.data.message : err.message)
          setFlag("error")
          setOpen(true)
          let status = (!!err.response ? err.response.status : 0);
          if (status == 401) {
            auth.signOut();
            router.push("/auth/login")
          }
        })
    },[])



    useEffect(()=>{
      const getCity = async () => { 
      axios.get(host+`/wholesale/address/city/${values.state?.id}`)
      .then(res=>{
          setCityList(res.data);
          let selectedCity = res.data.find(city=>city.id == store.address.city)
          setValues((prevState)=>({...prevState, city : {label : selectedCity?.cityName || '', id : selectedCity?.id}}))
      })
      .catch(err=>{
        console.log(err)
        setMessage(!!err.response ? err.response.data.message : err.message)
        setFlag("error")
        setOpen(true)
      })
    } 

    if(values.state != undefined){
      getCity()
    }
    },[values.state])




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
          await axios.get(host + "/wholesale/store/subcategory/"+values.category?.id)
              .then(res => {
                  const data = res.data;
                  setItemSubCategories(data)
                  setValues((prevState)=>({...prevState, subcategory : {label : store?.storeSubCategory?.subcategory || '', id : store?.storeSubCategory?.id}}))
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


      const handleSubmit = (e) =>{
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form)
        let data = {
            // ...store,
            addressSlug : store.address.slug,
            description : values.description,
            storeEmail : values.storeEmail,
            storePhone : values.storePhone,
            state:  values.state?.id,
            city :  values.city?.id,
            street:  values.street,
            zipCode :  values.zipCode,
            categoryId: values.category?.id,
            subCategoryId: values.subcategory?.id,
            storeName :  values.storeName,
            storePic : store.storePic
          }

        axios.defaults.headers = {
            Authorization : auth.token,
            "Content-Type" : "multipart/form-data"
        }
        axios.post(host+"/wholesale/store/update",data)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          setOpen(true)
          auth.updateUserDetail()
        }).catch(err=>{
            console.log(err)
            setMessage(!!err.response ? err.response.data.message : err.message)
            setFlag("error")
            setOpen(true)
        })
    
      }

      const handleClose = useCallback(()=>{
            setOpen(false)
      })
      

    const onSubmit = (image) =>{
      setStore((pervious)=>({
        ...pervious,
        storePic : image.originFileObj,
      }))
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
              // noValidate
                onSubmit={handleSubmit}
              >
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


                {/* store image input */}

                <div style={{marginLeft : '10px',marginTop: '10px'}}>
                      <ImageInput onChange={onSubmit} avtar={storeImage+store?.slug+"/"+store?.avtar}/>
                      </div>

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
                            value={values.storeName}
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
                            value={values.street}
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
                        item
                    >      
                    <FormControl fullWidth>
                        <Autocomplete
                            disablePortal
                            options={[...stateList.map((state)=>({label : state.stateName, id : state.id}))]}
                            fullWidth
                            name="state"
                            value={values.state?.label || ''}
                            onChange={(e,value)=>setValues((prevState)=>({...prevState, state : value }))}
                            renderInput={(params) => <TextField required {...params} label="State" />} >
                        </Autocomplete> 
                    </FormControl>
                    </Grid>


                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                    <FormControl fullWidth>
                        <Autocomplete
                            disablePortal
                            options={[...cityList.map((city)=>({label : city.cityName, id : city.id}))]}
                            fullWidth
                            value={values.city?.label || ''}
                            onChange={(e,value)=>setValues((prevState)=>({  ...prevState, city : value}))}
                            renderInput={(params) => <TextField name="city" required {...params} label="City" />} >
                        </Autocomplete> 
                        </FormControl>
                    </Grid>

                    {/* Category */}
                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <FormControl fullWidth>
                            <Autocomplete
                                disablePortal
                                options={[...categories.filter(category=> category.id !== 0).map((category)=>({label : category.category, id : category.id})),{label : 'Other', id : 0}]} 
                                fullWidth
                                name={"category"}
                                value={values.category?.label || ''}
                                onChange={(e,value)=>setValues((prevState)=>({...prevState, category : value    }))}
                                renderInput={(params) => <TextField required {...params} label="Categeory" />} >
                            </Autocomplete> 
                        </FormControl>
                    </Grid>

                    {/* Subcategory */}
                    <Grid
                        xs={12}
                        md={6}
                        item
                    >
                        <FormControl fullWidth>
                            <Autocomplete
                                disablePortal
                                required
                                options={[...subcategories.filter(subcategory => subcategory.id !== 0).map((subcategory)=>({label : subcategory?.subcategory, id : subcategory?.id})),{label : 'Other', id : 0}]}
                                fullWidth
                                name="subcategory"
                                value={values.subcategory?.label || ''}
                                onChange={(e,value)=>setValues((prevState)=>({  ...prevState, subcategory : value}))}
                                renderInput={(params) => <TextField  required {...params} label="Subcategory" />} >
                            </Autocomplete> 
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
                            value={values.storePhone}
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
                            value={values.description}
                            InputLabelProps={{shrink : true}}
                            multiline
                            rows={4}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  <Divider />
          
        
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
         </Stack>
      </Container>
    </Box>
        </>
    )
    }


    Page.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
    );

    export default Page;