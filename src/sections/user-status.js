import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';
import { host } from 'src/utils/util';
import { Box } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';

function UserStatus({receiver,client}) {

    const [online,setOnline] = useState(false)
    const auth = useAuth()
    

    // Only called when receiver changed.
    useEffect(() => {
        axios.defaults.headers = {
            Authorization : auth.token
        }
        axios.get(`${host}/chat/status/${receiver.slug}`)
        .then(res => {
            let user = res.data;
            setOnline(user.slug == receiver.slug ? user.isOnline : false)
        })
        .catch(err => {
            console.log(err.message)
        })
    }, [receiver,client]);





    return (
        <>
            {online ? 
                "Online" :
                <div>
                    Last seen at 
                    <ReactTimeAgo 
                        date={!!receiver?.lastSeen ? receiver?.lastSeen : receiver?.createdAt} 
                        locale="en-US"
                    />
                </div>
            }
        </>
    )
}

export default UserStatus