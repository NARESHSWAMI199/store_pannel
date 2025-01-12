import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { Alert, Avatar, Box, Button, Grid, Link, Snackbar, SvgIcon, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from 'src/hooks/use-auth'
import { useRouter } from 'next/router'
import { format } from 'date-fns';
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

    useEffect(()=>{
        if(slug == undefined || slug == null) return;
        axios.defaults.headers = {
            Authorization : auth.token
        }
        axios.get(host + `/wholesale/auth/detail/${slug}`)
        .then(res => {
            setReciver(res.data.user)
        }).catch(err => {
            alert(err.message)
        })
    },[slug])

    useEffect(() => {
        if(slug == undefined || slug == null) return;
        document.cookie = "X-Username="+user?.slug+"_"+slug+"; path=/"
        const client = new Client({
            brokerURL: 'ws://localhost:8080/chat', // Replace with your WebSocket server URL
            reconnectDelay: 5000, 
            debug: function (str) {
                console.log(str);
            },
        });
        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            client.subscribe(`/user/${user?.slug}_${slug}/queue/private`, (message) => {
                const data = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, data]);
            });
            setClient(client)
        };

        client.onDisconnect = (frame) => {
            console.log('Disconnected: ' + frame);
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
        //   client.send('/app/chat/private/rakesh",', {}, JSON.stringify(message)); 
        client.publish({ destination: `/app/chat/private/${slug}_${user?.slug}`, body:  JSON.stringify(message)});

        } else {
          console.warn('Client not connected, unable to send message.');
        }
    };

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
                        online
                    </small>
                </Typography>

            </Box>
      
            <Box sx={{
                display : 'flex',
                flexDirection :'column',
                mt : 3
            }}>
                {messages.map((message, index) => {
                let time = format(!!message.time ? message.time : 0, "HH:mm"  )
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
                    maxWidth : 200,
                    mx : 1,
                    // my : 1,
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
            position : 'absolute',
            bottom : 1,
            left : 0,
            right : 0,
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',
            w : '100%'
        }}>
            <TextField alignItems={'center'}  fullWidth id='message' label='Type your message.' />
                <Button sx={{height : 55}} variant='contained' color='primary' onClick={() => {
                    let message= document.getElementById("message").value
                    let messageBody = { 
                        type: 'chat', 
                        message: message,
                        time : new Date().getTime()
                      }
                    sendMessage(messageBody);
                    setMessages((previous) => [...previous ,messageBody ])
                }}
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