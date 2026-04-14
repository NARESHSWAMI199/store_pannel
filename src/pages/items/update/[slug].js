import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Divider,
    FormControl,
    Unstable_Grid2 as Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    SvgIcon,
    TextField
} from "@mui/material";
import axios from "axios";
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import MultipleImageInput from "src/sections/multipleImage-input";
import { host, itemImage } from "src/utils/util";


const CreateItem = () => {
    const router = useRouter()
    const {slug} = router.query
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("success")
    const [categories,setItemCategories] = useState([])
    const [subcategories,setItemSubCategories] = useState([])
    const auth = useAuth()
    const [values, setValues] = useState({})
    const [avtars,setAvtars] = useState([])
    const [newImages,setNewImages] = useState([])
    /** This is a string becaouse don't get actual files again */
    const [previousImages,setPreviousImages] = useState('')

    useEffect(() => {
        const getData = async () => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            await axios.get(host + "/wholesale/item/detail/"+slug,)
                .then(res => {
                    const data = res.data.res;
                    setValues({
                        ...data,
                        category : {label : data.itemCategory.category , id : data.itemCategory.id},
                        subcategory : {label : data.itemSubCategory.subcategory, id : data.itemSubCategory.id},
                        unit :  data.itemSubCategory.unit
                    })

                    // Setting avtars
                    if(!!data.avtars){
                        console.log(data.avtars)
                        let avatarImages = data.avtars.split(',')
                        let avatarImagesUrls = []
                        for(let avtarImage of avatarImages){
                            avatarImagesUrls.push(data.slug !=undefined ? itemImage+data.slug+"/"+avtarImage : '')
                        }
                        setAvtars(avatarImagesUrls)
                    }   

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
        const getData = async () => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            await axios.get(host + "/wholesale/item/category")
                .then(res => {
                    const data = res.data;
                    setItemCategories(data)
                    let selectedCategory = data.find(category => category?.id == values?.category?.id)
                    setValues(prev => ({...prev , category : {label : selectedCategory?.category , id :  selectedCategory?.id}}))
                })
                .catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag('error')
                    setOpen(true)
                })
        }
      console.log("======= CATEGORY ;  ", JSON.stringify(values.category ))
        getData();

    }, [])


    useEffect(() => {
        const getSubcategory = async () => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            await axios.get(host + "/wholesale/item/subcategory/"+values.category.id)
                .then(res => {
                    const data = res.data;
                    let selectedSubcategory = data.find(subcategory => subcategory?.id == values?.subcategory?.id)
                    setItemSubCategories(data)
                    setValues(prev => ({...prev , subcategory : {label : selectedSubcategory?.subcategory , id :  selectedSubcategory?.id}}))
                })
                .catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag('error')
                    setOpen(true)
                })
        }

        console.log("======= SUBCATEGORY ;  ", JSON.stringify(values.category ))

        if(values?.category?.id != undefined){
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
        [subcategories]
    );


    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault()
            const form = e.target;
            const formData = new FormData(form)
            let item = {
                slug: slug,
                name: formData.get("name"),
                price: formData.get("price"),
                discount: formData.get("discount"),
                inStock: formData.get("inStock") ? 'Y' : 'N',
                label: formData.get("label"),
                description: formData.get("description"),
                categoryId: values?.category?.id,
                subCategoryId: values?.subcategory?.id,
                capacity : !!values.unit && values.unit != 'null' ? formData.get('capacity') : 0 ,
                previousItemImages : previousImages,
                newItemImages : newImages
            }

            axios.defaults.headers = {
                Authorization: auth.token,
                "Content-Type" : "multipart/form-data"
            }
            axios.post(host + "/wholesale/item/update", item)
                .then(res => {
                    setMessage(res.data.message)
                    setFlag("success")
                    form.reset();
                    setValues({description : ''})
                    setAvtars([])
                    setOpen(true)
                }).catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag("error")
                    setOpen(true)
                })
           
        })

    const handleClose = useCallback(() => {
        setOpen(false)
    })



    const onSubmit = (images) =>{
        console.log(images)

        let previousImages = ''
        let newImages = []
        for(let image of images){
            if(image.hasOwnProperty("oldImage")){
                previousImages +=image.name + ","
            }else{
                newImages.push(image.originFileObj)
            }
        }
        setPreviousImages(previousImages)
        setNewImages(newImages)
      }

    return (<>

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
                onSubmit={handleSubmit}
            >
                    <Card>
                        <CardHeader
                            //subheader="From here you can add a new item."
                            title="Edit Item"
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <Box sx={{ m: -1.5 }}>
        
                            {/* <div style={{marginLeft : '10px',marginTop: '10px'}}>
                                <ImageInput onChange={onSubmit} avtar={values.slug !=undefined ?itemImage+values.slug+"/"+values.avtar : ''}/>
                            </div> */}


                            <Box sx={{
                                my: 2
                            }}>
                                <MultipleImageInput totalImage={5} onChange={onSubmit} avtars={avtars.length > 0 && avtars}/>
                            </Box>


                                <Grid
                                    container
                                    spacing={3}
                                >

                                    {/* ITEM NAME */}

                                    <Grid
                                        xs={12}
                                        md={12}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Item Name"
                                            name="name"
                                            InputLabelProps={{ shrink: true }}
                                            onChange={handleChange}
                                            required={true}
                                            value={values.name}
                                        />

                                    </Grid>

                                    {/* PRICE */}

                                    <Grid
                                        xs={12}
                                        md={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            name="price"
                                            onChange={handleChange}
                                            required={true}
                                            type="number"
                                            value={values.price}
                                            inputProps={{min : 10}}
                                            InputLabelProps={{shrink:true}}
                                        />

                                    </Grid>


                                    {/* DISCOUNT */}

                                    <Grid
                                        xs={12}
                                        md={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Discount"
                                            name="discount"
                                            onChange={handleChange}
                                            required={true}
                                            type="number"
                                            inputProps={{min : 0}}
                                            value={values.discount}
                                            InputLabelProps={{ shrink: true }}
                                        />

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
                                                options={[...categories.filter(category=> category.id !== 0).map((category)=>({label : category.category, id : category.id}))]} 
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
                                                options={[...subcategories.filter(subcategory => subcategory.id !== 0).map((subcategory)=>({label : subcategory?.subcategory, id : subcategory?.id}))]}
                                                fullWidth
                                                name="subcategory"
                                                value={values.subcategory?.label || ''}
                                                onChange={(e,value)=>setValues((prevState)=>({  ...prevState, subcategory : value}))}
                                                renderInput={(params) => <TextField  required {...params} label="Subcategory" />} >
                                            </Autocomplete> 
                                        </FormControl>
                                    </Grid>

                            {/* capacity */}
                            {!!values.unit && values.unit != 'null' ? 
                                    <Grid
                                        xs={12}
                                        md={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label={"Capacity/Weight in "+values.unit}
                                            name="capacity"
                                            onChange={handleChange}
                                            required={true}
                                            type="number"
                                            value={values.capacity}
                                            InputLabelProps={{ shrink: true }}
                                        />

                                    </Grid> : ''
                            }

                                    <Grid
                                        xs={12}
                                        md={6}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel id="itemLabel">Label</InputLabel>
                                            <Select
                                                labelId="itemLabel"
                                                id="demo-simple-select"
                                                name='label'
                                                value={""+values.label}
                                                label="Label"
                                                onChange={handleChange}
                                                required
                                            >
                                                <MenuItem value={"N"}>New</MenuItem>
                                                <MenuItem value={"O"}>Old</MenuItem>
                                        
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Description */}
                                    <Grid
                                        xs={12}
                                        md={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            onChange={handleChange}
                                            required={true}
                                            multiline
                                            value={values.description}
                                            rows={4}
                                            InputLabelProps={{ shrink: true }}
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
                        
                         <Button
                            startIcon = {
                                <SvgIcon fontSize="small">
                                <RefreshIcon />
                                </SvgIcon>
                            }
                            sx={{color:'text-secondary'}}
                            onClick={(e) => window.location.reload()}
                             variant="contained"
                        >
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </Grid>
        </Stack>
        </Container>
        </Box>



        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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


CreateItem.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default CreateItem;