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
        Stack
    } from "@mui/material";
    import axios from "axios";
    import { useRouter } from "next/router";
    import { useCallback, useEffect, useState } from "react";
    import { useAuth } from "src/hooks/use-auth";
    import { ArrowButtons } from "src/layouts/arrow-button";
    import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
    import { BasicHeaders } from "src/sections/basic-header";
import ImageInput from "src/sections/image-input";
    import { host, storeImage, suId } from "src/utils/util";





    const CreateUser = () =>{    

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
      city : store.address.city, 
      state : store.address.state,
      street : store.address.street,
      zipCode : store.address.zipCode,
      storeEmail : store.email,
      storePhone : store.phone,
      category : store.storeCategory.id,
      subcategory : store.storeSubCategory.id,
    })


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
          let status = (!!err.response ? err.response.status : 0);
          if (status == 401) {
            auth.signOut();
            router.push("/auth/login")
          }
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
        const form = e.target;
        const formData = new FormData(form)
        let data = {
            // ...store,
            addressSlug : store.address.slug,
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
                      <ImageInput onChange={onSubmit} avtar={storeImage+store.slug+"/"+store.avtar}/>
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
                        >      
                        <FormControl fullWidth>
                        <InputLabel  style={{background : 'white'}}  id="stateLabel">State</InputLabel>
                          <Select
                            labelId="stateLable"
                            id="demo-simple-select"
                            name='state'
                            value={values.state}
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
                            value={values.city}
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
                                value={values.category !=undefined ? ""+values.category : ""}
                                onChange={handleChange}
                                required
                            >
                            {categories.map((categroyObj , i) => {
                                return ( <MenuItem key={i} value={categroyObj.id}>{categroyObj.category}</MenuItem>
                                )})
                            }
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
                                value={values.subcategory !=undefined ? ""+values.subcategory : ""}
                                onChange={handleChange}
                                required
                            >
                            {subcategories.map((subcategroyObj , i) => {
                                return ( <MenuItem key={i} value={subcategroyObj.id}>{subcategroyObj.subcategory}</MenuItem>
                                )})
                            }
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


    CreateUser.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
    );

    export default CreateUser;