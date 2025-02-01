import * as React from 'react';
import { Image } from "antd";
import Typography from '@mui/material/Typography';
import { Box, Button, Stack} from '@mui/material';
import { host, toTitleCase } from 'src/utils/util';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';



const Accept = (props) => {

const auth = useAuth()


const handleAppceptOrDecline = (status) =>{
    axios.defaults.headers = {
        Authorization : auth.token
    }
    axios.post(host+"/chat-users/accept",{
        receiverSlug : receiver.slug,
        status : status
    })
    .then(res =>{
        let response = res.data;
        /** currently we not show any kind of message */
        props.onChangeStatus(status)
    })
    .catch(err =>{
        console.log(err)
    })
}

const {receiver,darkMode} = props
  return (
    <>
     <Box 
        sx={{
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',
            flexDirection :  'column',
            p : 5,
            background : darkMode ? '#333' : '#fff',
            borderRadius : 5,

        }}
     >
        <Image 
            style={{
                height : 100,
                width : 100,
                borderRadius : 50
            }} 
            src={receiver.avatar}
        />    

        <Typography 
            sx={{
                py : 2,
                textAlign : 'center'
            }} 
            variant="h5" color={'info'}
        >
            {toTitleCase(receiver.username)}
        </Typography>

        <Stack 
            spacing={6}
            direction="row"
            justifyContent="space-between"
        >

                <Button 
                    variant='contained' 
                    color='success' 
                    onClick={()=>handleAppceptOrDecline("A")}
                    size='large'
                >
                    Accept
                </Button>



                <Button 
                    variant='contained' 
                    color='error' 
                    onClick={()=>handleAppceptOrDecline("R")}
                    size='large'
                >
                    Decline
                </Button>

        </Stack>

     </Box>

    </>
  )
}

export default Accept