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
    Checkbox,
    Alert,
    Container,
    Stack,
    Autocomplete
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { host } from "src/utils/util";
import { apiRequest } from 'src/utils/api-request';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MultipleImageInput from "src/sections/multipleImage-input";


const CreateItem = () =>{    
const [open,setOpen] = useState(false)
const [message,setMessage] = useState("")
const [flag,setFlag] = useState("success")
const auth = useAuth()
const [values,setValues] = useState({})
const [categories,setItemCategories] = useState([])
const [subcategories,setItemSubCategories] = useState([])
const [newImages,setNewImages] = useState([])
/** This is a string becaouse don't get actual files again */
const [previousImages,setPreviousImages] = useState('')
const [removeImages, setRemoveImage] = useState(false)


const handleChange = useCallback(
  (event) => {
      if ([event.target.name] == 'subcategory'){
          for(let subcategory of subcategories){
              console.log(subcategory.id + " "+event.target.value )
              if(subcategory.id ==  event.target.value){
                  setValues((prevState) => ({
                      ...prevState,
                      unit : subcategory.unit,
                      [event.target.name]: event.target.value
                  }));
                  break
              }
          }
      }else{
          setValues((prevState) => ({
              ...prevState,
              [event.target.name]: event.target.value
          }));
      }
  },
  [subcategories]
);



  useEffect(() => {
    const getData = async () => {
        await apiRequest.get("/wholesale/item/category")
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
    getData();

}, [])


useEffect(() => {
  const getSubcategory = async () => {
      await apiRequest.get("/wholesale/item/subcategory/"+values.category?.id)
          .then(res => {
              const data = res.data;
              setItemSubCategories(data)
              let selectedSubcategory = data.find(subcategory => subcategory?.id == values?.subcategory?.id)
              setValues(prev => ({...prev , subcategory : {label : selectedSubcategory?.subcategory , id :  selectedSubcategory?.id}}))
          })
          .catch(err => {
              setMessage(!!err.response ? err.response.data.message : err.message)
              setFlag('error')
              setOpen(true)
          })
  }
  if(values.category?.id !=undefined){
      getSubcategory();
  }
}, [values.category]) 


  const handleSubmit = useCallback(
    (e) =>{
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form)
    let item = {
        name : formData.get("name"),
        price: formData.get("price"),
        discount: formData.get("discount"),
        inStock: formData.get("inStock") ? 'Y' : 'N',
        label: formData.get("itemLabel"),
        description: formData.get("description"),
        wholesaleSlug : auth.store.slug,
        categoryId: values?.category?.id,
        subCategoryId: values?.subcategory?.id,
        capacity : !!values.unit && values.unit != 'null' ? formData.get('capacity') : 0 ,
        // itemImage : values.itemImage
        previousItemImages : previousImages,
        newItemImages : newImages
      }

    apiRequest.post("/wholesale/item/add",item, {
        headers: {
            "Content-Type" : "multipart/form-data"
        }
    })
    .then(res => {
      setMessage(res.data.message)
      setFlag("success")
      form.reset();
      reset()
      setRemoveImage(true)
      setOpen(true)
    }).catch(err=>{
        setMessage(!!err.response  ? err.response.data.message : err.message)
        setFlag("error")
        setOpen(true)
    })

  })

  const handleClose = useCallback(()=>{
        setOpen(false)
  })

  const imagesRemoved = () => {
    setRemoveImage(false) // setting false after image removed
  }
   

const reset = () =>{
  setValues({})
}


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
    onSubmit={handleSubmit}
  >

<Card>
      <CardHeader
        subheader="From here you can add a new item."
        title="Create Item"
      />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>

        <Box sx={{
            my: 2
        }}>
             <MultipleImageInput remove={removeImages} totalImage={5} onChange={onSubmit} imagesRemoved={imagesRemoved}/>
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
                onChange={handleChange}
                required={true}
                value={values.itemName}
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
                inputProps={{min :10}}
                value={values.itemPrice}
                InputLabelProps={{shrink: true}}
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
                inputProps={{min :0}}
                value={values.itemDiscount}
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
          <InputLabel  style={{background : 'white'}} id="itemLabel">Label</InputLabel>
          <Select
            labelId="itemLabel"
            id="demo-simple-select"
            name='itemLabel'
            value={values.itemLabel}
            onChange={handleChange}
            required
          >
            <MenuItem value={"N"}>New</MenuItem>
            <MenuItem value={"O"}>Old</MenuItem>
      
        
          </Select>
          </FormControl>
          </Grid>
          
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
            value={values.itemDiscription}
            rows={4}
          />
        </Grid>

        <Grid
              xs={12}
              md={6}
            >
              <FormGroup>
        <FormControlLabel control={<Checkbox  
                    name="inStock"
                    onChange={handleChange}
                    value={values.itemInStock} />}
                  label="In stock" />
      </FormGroup>
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


CreateItem.getLayout = (page) => (
<DashboardLayout>
  {page}
</DashboardLayout>
);

export default CreateItem;