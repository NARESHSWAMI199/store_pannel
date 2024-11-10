import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, Container, Divider, Snackbar, Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { host } from 'src/utils/util';
import ImageInput from "src/sections/image-input";
import Spinner from '../sections/spinner';
import { Typography } from 'antd';
import { saveAs } from 'file-saver'

const Page = () => {


    /** snackbar varibatles */
    const [open, setOpen] = useState()
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("warning")
    const [imageUrl , setImageUrl] = useState('')
    const [showPreview,setShowPerview] = useState(false)
    const [values, setValues] = useState({})
    const auth = useAuth()
    const [showSpinner , setShowSpinner] = useState("none")


    const handleSubmit = useCallback(
       async (e) => {
            e.preventDefault()
            let data = {
                image : values.image
            }
            axios.defaults.headers = {
                Authorization: auth.token,
                "Content-Type" : "multipart/form-data"
            }
           setShowSpinner("block")
           setShowPerview(false)
           await axios.post(host + "/removebg/", data)
            .then(res => {
                let requestImageUrl = res.data.downloadPath
                axios.get(host+requestImageUrl, { responseType: 'blob' })
                .then(response => {
                    setImageUrl(URL.createObjectURL(response.data))
                    setShowPerview(true)
                    setShowSpinner("none")
                })
                .catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag("error")
                    setOpen(true)
                    setShowSpinner("none")
                    return err;
                });
                setMessage("Background removed successfully")
                setFlag("success")
                setOpen(true)
            }).catch(err => {
                setMessage(!!err.response ? err.response.data.message : err.message)
                setFlag("error")
                setOpen(true)
                setShowSpinner("none")
            })
        
        })


    /** for snackbar close */
    const handleClose = () => {
        setOpen(false)
    };


    const onSubmit = (image) =>{
        setValues((pervious)=>({
          ...pervious,
          image : image.originFileObj
        }))
      }

   

    const downloadImage = () => {
        saveAs(imageUrl, 'swamisale.png') // Put your image URL here.
    }
    

    return (
        <>

            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                onClose={handleClose}
                key={'top' + 'right'}
            >
                <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
    
            <Container maxWidth={'xl'} >
            <Card>
            <CardHeader
                //subheader="From here you can add a new item."
                title="Remove Image Background"
            />

                <Container maxWidth="xl">
            
                <CardContent>
                <Stack spacing={3}>

                    <Box>
                        <ImageInput  totalImage = {1} onChange={onSubmit} />
                        <Typography variant="p">
                            Upload image here
                        </Typography>
                    </Box>
                    <Spinner show={showSpinner}/>
                    {showPreview ? 
                    <Box sx={{
                        display : 'flex',
                        flexDirection : 'column',
                        justifyContent : 'center',
                        alignItems : 'center'
                    }} >
                        <img width='500px'  style={{
                            objectFit : 'contain',
                        }} src={imageUrl}/>
                        <Typography variant="b" style={{my: 2}}>
                            Note : If your processed image loosing opacity. you should need incress background size
                        </Typography>
                    </Box>  : ''
                    }
                 </Stack>

            </CardContent>
            <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" onClick={handleSubmit}>
                            Remove Background
                        </Button>
                        {showPreview ? 
                        <Button type="submit" variant="contained" sx={{background:'green'}}  onClick={downloadImage}>
                            Download Image
                        </Button> :''
                        }

                    </CardActions>
                
                </Container>
            </Card>
            </Container>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
