import {
    Alert,
    Autocomplete,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { ca, id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { set } from "nprogress";
import bg from 'public/assets/bg2.png';
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import ImageInput from "src/sections/image-input";
import HomeNavbar from 'src/sections/top-nav';
import { host } from "src/utils/util";

const CreateStore = () => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("success")
    const auth = useAuth()
    const [store, setStore] = useState({
        storePic: ''
    })
    const [cityList, setCityList] = useState([])
    const [stateList, setStateList] = useState([])
    const router = useRouter()
    const [categories, setItemCategories] = useState([])
    const [subcategories, setItemSubCategories] = useState([])
    const [values, setValues] = useState({ state: { id: 1 } })
    const [disable, setDisable] = useState(false)

    useEffect(() => {
        if (!auth.token) {
            router.push("/auth/login");
        } else if (auth.store !== null) {
            router.push("/");
        }
    },[])

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



    useEffect(() => {
        const getCity = async () => {
            await axios.get(host + `/wholesale/address/city/${values.state?.id}`)
                .then(res => {
                    setCityList(res.data)
                    setValues((prevState) => ({ ...prevState, city: { label: '' } }))
                })
                .catch(err => {
                    console.log(err)
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag("error")
                    setOpen(true)
                })
        }

        if (values.state != undefined) {
            getCity()
        }

    }, [values.state])

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
            await axios.get(host + "/wholesale/store/subcategory/" + values.category?.id)
                .then(res => {
                    const data = res.data;
                    setItemSubCategories(data)
                    setValues((prevState) => ({ ...prevState, subcategory: { label: '' } }))
                })
                .catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag('error')
                    setOpen(true)
                })
        }
        if (values.category != undefined) {
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

    const handleSubmit = (e) => {
            setDisable(true);
            e.preventDefault();
            if (store.storePic === '') {
                alert("Store Image can't be blank.");
                setDisable(false);
                return false;
            }
            const form = e.target;
            //const formData = new FormData(form);
            let data = {
                description: values.description,
                storeEmail: values.storeEmail,
                storePhone: values.storePhone,
                state: values.state?.id,
                city: values.city?.id,
                street: values.street,
                zipCode: values.zipCode,
                categoryId: values.category?.id,
                subCategoryId: values.subcategory?.id,
                storeName: values.storeName,
                storePic: store.storePic
            };

            axios.defaults.headers = {
                Authorization: auth.token,
                "Content-Type": "multipart/form-data"
            };
            axios.post(host + "/wholesale/store/add", data)
                .then(res => {
                    setMessage(res.data.message);
                    setFlag("success");
                    setOpen(true);
                    auth.updateUserDetail();
                    router.push("/");
                }).catch(err => {
                    console.log(err);
                    setMessage(!!err.response ? err.response.data.message : err.message);
                    setFlag("error");
                    setOpen(true);
                    setDisable(false);
                });
        };

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    const onSubmit = (image) => {
        setStore((pervious) => ({
            ...pervious,
            storePic: image.originFileObj,
        }))
    }

    return (
        <Grid container
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
            }}>
            <Grid xs={12} md={6} sx={{
                background: 'white',
                px: 3,
                py: 3,
                borderRadius: 2,
                boxShadow: 1
            }}>
                <Stack
                    spacing={1}
                    sx={{ my: 2 }}
                >
                    <Typography variant="h5">
                        {"Let's create your own store."}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        {"It's time switch online."}
                    </Typography>
                </Stack>

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
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                                    options={[...stateList.map((state) => ({ label: state.stateName, id: state.id }))]}
                                    fullWidth
                                    name="state"
                                    value={values.state?.label || ''}
                                    onChange={(e, value) => setValues((prevState) => ({ ...prevState, state: value }))}
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
                                    options={[...cityList.map((city) => ({ label: city.cityName, id: city.id }))]}
                                    fullWidth
                                    value={values.city?.label || ''}
                                    onChange={(e, value) => setValues((prevState) => ({ ...prevState, city: value }))}
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
                                    options={[...categories.filter(category => category.id !== 0).map((category) => ({ label: category.category, id: category.id })), { label: 'Other', id: 0 }]}
                                    fullWidth
                                    name={"category"}
                                    value={values.category?.label || ''}
                                    onChange={(e, value) => setValues((prevState) => ({ ...prevState, category: value }))}
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
                                    options={[...subcategories.filter(subcategory => subcategory.id !== 0).map(subcategory => ({ label: subcategory?.subcategory, id: subcategory?.id })), { label: 'Other', id: 0 }]}
                                    fullWidth
                                    name="subcategory"
                                    value={values.subcategory?.label || ''}
                                    onChange={(e, value) => setValues((prevState) => ({ ...prevState, subcategory: value }))}
                                    renderInput={(params) => <TextField required {...params} label="Subcategory" />} >
                                </Autocomplete>
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
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%'
                    }}>
                        <Button
                            size="large"
                            sx={{ mt: 3 }}
                            type="submit"
                            variant="contained"
                            disabled={disable}
                        >
                            {disable &&
                                <CircularProgress size={20} sx={{
                                    color: 'white',
                                    mx: 1
                                }} />
                            }
                            Save Store
                        </Button>

                    </Box>
                </form>

                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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