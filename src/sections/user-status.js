import { useEffect, useState } from 'react';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import ReactTimeAgo from 'react-time-ago';

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


function UserStatus({client,receiver}) {

    const [online,setOnline] = useState(false)

    useEffect(() => {
        if (!!client) {
            client.activate();
            if (client && client.connected) {
                const publishDestination = `/app/chat/${receiver.slug}/userStatus`; 
                client.publish({ destination: publishDestination }); 
                client.subscribe('/topic/status', (data) => {
                    let user = data.body
                    user = JSON.parse(user);
                    console.log(user)
                    if(user.slug == receiver.slug){
                        setOnline(user.isOnline)
                    } else{
                        setOnline(false)
                    }
                });
            }
        }
    }, [receiver,client]);
    
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