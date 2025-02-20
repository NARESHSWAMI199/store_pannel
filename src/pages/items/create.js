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
    Stack
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { host } from "src/utils/util";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import ImageInput from "src/sections/image-input";
import { margin } from "@mui/system";
import { useRouter } from "next/navigation";
import MultipleImageInput from "src/sections/multipleImage-input";



const CreateItem = () =>{    
const [open,setOpen] = useState(false)
const [message,setMessage] = useState("")
const [flag,setFlag] = useState("success")

const router = useRouter();
const {label,stock} = router.query
const auth = useAuth()
const [values,setValues] = useState({itemLabel:label})
const [categories,setItemCategories] = useState([])
const [subcategories,setItemSubCategories] = useState([])
const [newImages,setNewImages] = useState([])
/** This is a string becaouse don't get actual files again */
const [previousImages,setPreviousImages] = useState('')


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
        axios.defaults.headers = {
            Authorization: auth.token
        }
        await axios.get(host + "/wholesale/item/category")
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
      await axios.get(host + "/wholesale/item/subcategory/"+values.category)
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
        categoryId: formData.get("category"),
        subCategoryId: formData.get("subcategory"),
        capacity : !!values.unit && values.unit != 'null' ? formData.get('capacity') : 0 ,
        // itemImage : values.itemImage
        previousItemImages : previousImages,
        newItemImages : newImages
      }

    axios.defaults.headers = {
        Authorization : auth.token,
        "Content-Type" : "multipart/form-data"
    }
    axios.post(host+"/wholesale/item/add",item)
    .then(res => {
      setMessage(res.data.message)
      setFlag("success")
      form.reset();
      reset()
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
             <MultipleImageInput totalImage={5} onChange={onSubmit} />
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
                value={values.itemDiscount}
              />

            </Grid>





              {/* Category */}
              <Grid
                xs={12}
                md={6}
            >
                <FormControl fullWidth>
                    <InputLabel  style={{background : 'white'}} id="itemLabel">Category</InputLabel>
                    <Select
                        labelId="itemLabel"
                        id="category"
                        name='category'
                        value={values.category !=undefined ? ""+values.category : ""}
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
                    <InputLabel  style={{background : 'white'}} id="itemLabel">Subcategory</InputLabel>
                    <Select
                        labelId="itemLabel"
                        id="subcategory"
                        name='subcategory'
                        value={values.subcategory !=undefined ? ""+values.subcategory : ""}
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