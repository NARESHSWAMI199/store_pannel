import React, { useCallback, useState } from 'react'
import HorizontalLinearStepper from 'src/sections/horizontal-stepper';
import Register from 'src/sections/register'
import CreateStore from 'src/sections/createstore'
import { Alert, Snackbar } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';
import { host } from "src/utils/util";
const Page = () => {

    const [open,setOpen] = useState(false)
    const [message,setMessage] = useState("")
    const [flag,setFlag] = useState("success")
    const auth = useAuth();


    const saveProfile  =  async (values) => {
        try {
            if(values.password == values.password2){
                await auth.signUp(values.name, values.email, values.contact,values.password);
                setMessage("User profile successfully saved");
                setFlag("success")
                setOpen(true)
                return true;
            }else{
                throw new Error("Password and confrim password doesn't match");
            }
        } catch (err) {
            let errResponse = err.response
            setMessage(!!errResponse ? errResponse.data.message : err.message)
            setFlag("error")
            setOpen(true)
            return false;
        }
      }



    const createStore = async(form) =>{
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
            // storePic : store.storePic
          }

        axios.defaults.headers = {
            Authorization : auth.token
            // "Content-Type" : "multipart/form-data"
        }
        return await axios.post(host+"/wholesale/store/add",data)
        .then(res => {
          setMessage(res.data.message)
          setFlag("success")
          setOpen(true)
          auth.updateUserDetail(auth.token)
          return true;
        }).catch(err=>{
            console.log(err)
            setMessage(!!err.response ? err.response.data.message : err.message)
            setFlag("error")
            setOpen(true)
            return  false;
        })
    
    }


    const handleClose = useCallback(()=>{
        setOpen(false)
    },[])
          
      

  return (
    <>
        <HorizontalLinearStepper saveProfile={saveProfile} createStore={createStore} register={<Register/>} store={<CreateStore/>}  />
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

export default Page
