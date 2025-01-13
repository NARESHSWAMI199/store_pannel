import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { Alert, Avatar, Box, Button, Grid, Link, Snackbar, SvgIcon, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from 'src/hooks/use-auth'
import { useRouter } from 'next/router'
import { format, setDate } from 'date-fns';
import axios from 'axios';
import { host, userImage } from 'src/utils/util';


function Page() {
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const auth = useAuth();
    const user = auth.user
    const router = useRouter()
    const {slug} = router.query
    const [reciver,setReciver] = useState()
    const [userStatus,setUserStatus] = useState()
    
    useEffect(()=>{
        if(slug == undefined || slug == null) return;
        axios.defaults.headers = {
            Authorization : auth.token
        }
        axios.get(host + `/wholesale/auth/detail/${slug}`)
        .then(res => {
            let user = res.data?.user;
            setReciver(user)
            setUserStatus("Last seen at "+format(!!user?.lastSeen ? user?.lastSeen : 0,"hh:mm"));
        }).catch(err => {
            alert(err.message)
        })
    },[slug])


    const updateUserLastSeen = () => {
        axios.get(host+`/wholesale/auth/last-seen`)
        .then(res => {
            let response = res.data;
            setUserStatus("Last seen at "+format(!!user?.lastSeen ? user?.lastSeen : 0,"hh:mm"));
        }).catch(err => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        if(slug == undefined) return;
        document.cookie = `X-Username=${user?.slug}_${slug}; path=/`
        const client = new Client({
            brokerURL: 'ws://localhost:8080/chat', // Replace with your WebSocket server URL
            reconnectDelay: 5000, 
            debug: function (str) {
                console.log(str);
            },
        });
        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            // /** send a request to connect */
            client.publish({destination : `/app/chat/connect/${user?.slug}` , body : JSON.stringify({slug : user?.slug})}); 

            /** send a request for update status */
            client.publish({ destination: `/app/chat/${slug}/userStatus`});
    
            client.subscribe('/topic/public/status', (user) => {
                const data = JSON.parse(user.body);
                if(data.online){
                    setUserStatus("Online");
                }
            
              });

             /** reciving the message */ 
            client.subscribe(`/user/${user?.slug}_${slug}/queue/private`, (message) => {
                const data = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, data]);
            });

            setClient(client)
        };

        client.onDisconnect = (frame) => {
            /** using servlet api here beacuse here client is closed or deactive */
            updateUserLastSeen()
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [slug]);

    



    const sendMessage = (message) => {
        client.activate();
        if (client && client.connected) {
            console.log(client)
        client.publish({ destination: `/app/chat/private/${slug}_${user?.slug}`, body:  JSON.stringify(message)});

        } else {
          console.warn('Client not connected, unable to send message.');
        }
    };


    const handleSendMessage = () =>{
        let message= document.getElementById("message").value
        let messageBody = { 
            type: 'chat', 
            message: message,
            time : new Date().getTime()
          }
        sendMessage(messageBody);
        setMessages((previous) => [...previous ,messageBody ])
    }

    return (
        <Box>
            {/* <Typography variant='h6'>
                WebSocket Messages
            </Typography> */}

            <Box sx={{
                display : 'flex',
                background : '#f0f0f5',
                minHeight : 60,
                // justifyContent : 'center',
                mx  : 1 ,
                alignItems : 'center'
            }}>

                <Avatar sx={{mx : 1}} src = {`${userImage}${slug}/${reciver?.avatar}`} />
                <Typography variant='subtitle2' sx={{
                    display : 'flex',
                    flexDirection : 'column'
                }}>
                    {reciver?.username}
                    <small>
                        {userStatus}
                    </small>
                </Typography>

            </Box>
      
            <Box sx={{
                display : 'flex',
                flexDirection :'column',
                mt : 3,
                mb : 10

            }}>
                {messages.map((message, index) => {
                let time = format(!!message.time ? message.time : 0, "hh:mm"  )
                let justifyMessage = 'flex-end';
                if(!!message.sender && message.sender != `${auth.slug}_${slug}`) {
                    justifyMessage = 'flex-start';
                }
               return (
               <Box key={index} sx={{
                    px : 1.5,
                    py : 1,
                    boxShadow : 2,
                    background : '#f0f0f5',
                    borderRadius : 2,
                    maxWidth : 400,
                    mx : 1,
                    my : 0.5,
                    alignSelf  : justifyMessage
                }}>
                    <Box sx={{
                        display : 'flex',
                        // flexDirection : 'column'
                    }}>
                        <Typography sx={{mx : 1}}>
                            {message.message}
                        </Typography>
                        <Typography variant='small' sx={{
                            fontSize : 10,
                            alignSelf : 'flex-end',
                            mr : 1
                        }}>
                            {time}
                        </Typography>
                    </Box>
                </Box>
     
                )})}

            </Box>



        <Box sx={{
            position : 'fixed',
            bottom : 0,
            left : 0,
            right : 0,
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',
            w : '100%',
            background : 'white'
        }}>
            <TextField alignItems={'center'}  fullWidth id='message' label='Type your message.' />
                <Button sx={{height : 55}} variant='contained' color='primary' onClick={handleSendMessage}
                onKeyDown={(e) =>{
                    if (e.key === 'Enter') {
                    e.preventDefault(); 
                    handleSendMessage();
                  }}
                }
                endIcon = {
                    <SvgIcon>
                       <SendIcon/> 
                    </SvgIcon>
                }
                >
                    Send
                </Button>
        </Box>
        

        </Box>
    );
}

export default Page