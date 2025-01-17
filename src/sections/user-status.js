import { useEffect, useState } from 'react';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import ReactTimeAgo from 'react-time-ago';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';
import { host } from 'src/utils/util';

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


function UserStatus({receiver}) {

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
            setOnline(user.isOnline)
        })
        .catch(err => {
            console.log(err.message)
        })
    }, [receiver]);

   // Calling in each 10 second
    useEffect(() => {
        const intervalId = setInterval(() => {
            axios.defaults.headers = {
                Authorization : auth.token
            }
            axios.get(`${host}/chat/status/${receiver.slug}`)
            .then(res => {
                let user = res.data;
                setOnline(user.isOnline)
            })
            .catch(err => {
                console.log(err.message)
            })
        }, 10000)

        return () => clearInterval(intervalId);

    }, []);



    return (
        <>
        {online ? 
            "Online" :
            <div>
                Last seen at <ReactTimeAgo date={!!receiver?.lastSeen ? receiver?.lastSeen : receiver?.createdAt} locale="en-US"/>
            </div>
        }
        </>
    )
}

export default UserStatus