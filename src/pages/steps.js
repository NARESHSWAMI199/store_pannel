import React, { useCallback, useState } from 'react'
import HorizontalLinearStepper from 'src/sections/horizontal-stepper';
import Register from 'src/sections/register'
import CreateStore from 'src/sections/createstore'
import { Alert, Snackbar } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
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

    const handleClose = useCallback(()=>{
        setOpen(false)
    },[])
          
      

  return (
    <>
        <HorizontalLinearStepper saveProfile={saveProfile} register={<Register/>} store={<CreateStore/>}  />
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
