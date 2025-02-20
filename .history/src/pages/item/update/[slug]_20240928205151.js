import {
    Box,
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
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";


const createItem = () => {

    const router = useRouter()
    const { slug} = router.query

    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("success")

    const auth = useAuth()
    const [values, setValues] = useState({})


    useEffect(() => {
        const getData = async () => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            await axios.get(host + "/admin/item/detail/"+slug,)
                .then(res => {
                    const data = res.data.res;
                    setValues(data)
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


    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault()
            const form = e.target;
            const formData = new FormData(form)
            let item = {
                name: formData.get("name"),
                price: formData.get("price"),
                discount: formData.get("discount"),
                inStock: formData.get("inStock") ? 'Y' : 'N',
                label: formData.get("itemLabel"),
                description: formData.get("description"),
            }

            axios.defaults.headers = {
                Authorization: auth.token
            }
            axios.post(host + "/admin/item/update", item)
                .then(res => {
                    setMessage(res.data.message)
                    setFlag("success")
                    form.reset();
                    reset()
                    router.push("/wholesale/" + us)
                }).catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag("error")
                })
            setOpen(true)
        })

    const handleClose = useCallback(() => {
        setOpen(false)
    })


    const reset = () => {
        setValues({})
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
                noValidate
                onSubmit={handleSubmit}
            >
                <Card >
                    <Card>
                        <CardHeader
                            //subheader="From here you can add a new item."
                            title="Edit Item"
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <Box sx={{ m: -1.5 }}>
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
                                            value={values.discount}
                                            InputLabelProps={{ shrink: true }}
                                        />

                                    </Grid>



                                    <Grid
                                        xs={12}
                                        md={6}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel id="itemLabel">Label</InputLabel>
                                            <Select
                                                labelId="itemLabel"
                                                id="demo-simple-select"
                                                name='itemLabel'
                                                            value={values.label}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={"O"}>Old</MenuItem>
                                                <MenuItem value={"N"}>New</MenuItem>

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
                                            value={values.description}
                                            rows={2}
                                            InputLabelProps={{ shrink: true }}
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
                                                required={true}
                                                value={values.inStock == "Y"} />}
                                                label="In stock" />
                                        </FormGroup>
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


createItem.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default createItem;