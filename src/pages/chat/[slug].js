import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { Alert, Box, Button, Grid, Link, Snackbar, SvgIcon, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from 'src/hooks/use-auth'
import { useRouter } from 'next/router'


function Page() {
    const [messages, setMessages] = useState([]);
    const [sendedMessage,setSendedMethod] = useState([])
    const [client, setClient] = useState(null);
    const auth = useAuth();
    const user = auth.user
    const router = useRouter()
    const {slug} = router.query

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
            <Typography variant='h6'>
                WebSocket Messages
            </Typography>
      
            {/* Sended */}
            <ul style={{
                display : 'flex',
                justifyContent : 'flex-end',
                alignItems : 'flex-end',
                flexDirection :'column'
            }}>
                {sendedMessage.map((message, index) => (
                    <Typography key={index} sx={{
                        px : 2,
                        py : 1,
                        boxShadow : 2,
                        background : '#f0f0f5',
                        borderRadius : 2,
                        my : 1,
                        maxWidth : 150,
                        minWidth : 100,

                    }}>
                        {message.message}
                    </Typography>
            ))}
            </ul>

            {/* Recived */}
            <ul style={{
                display : 'flex',
                justifyContent : 'flex-start',
                flexDirection :'column',
                alignItems : 'flex-start'
            }}>
                {messages.map((message, index) => (
                <Typography key={index} sx={{
                    px : 2,
                    py : 1,
                    boxShadow : 2,
                    background : '#f0f0f5',
                    borderRadius : 2,
                    my : 1,
                    maxWidth : 150,
                    minWidth : 100,
                }}>
                    {message.message}
                </Typography>
                ))}
            </ul>


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
                    let messages = document.getElementById("message").value
                    let messageBody = { 
                        type: 'chat', 
                        message: messages
                      }
                    sendMessage(messageBody);
                    setSendedMethod((previous) => [...previous ,messageBody ])
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