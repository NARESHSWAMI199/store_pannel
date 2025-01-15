import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Button, Grid, InputAdornment, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { format } from 'date-fns';
import TimeAgo from 'javascript-time-ago';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { host, userImage,defaultChatImage } from 'src/utils/util';

import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import ReactTimeAgo from 'react-time-ago';

import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

function Page() {
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const auth = useAuth();
    const user = auth.user
    const [receiver,setReceiver] = useState()
    const [userStatus,setUserStatus] = useState()

    const [senderChatKey,setSenderChatKey] = useState()
    const [recevierChatKey,setRecevierChatKey] = useState()
 
    const [chatUsers,setChatUsers] = useState([])
    const [chatMessage,setChatMessage] = useState()


    



    // Set sender and receiver key
    useEffect(()=>{
        if(!!receiver){
            setSenderChatKey(`${user.slug}_${receiver?.slug}`)
            setRecevierChatKey(`${receiver?.slug}_${user.slug}`)
        }
    },[receiver])

// Get all chats
    useEffect(()=>{
        axios.defaults.headers = {
            Authorization : auth.token
        }
        if(!!senderChatKey && !!recevierChatKey){
            axios.post(host+`/chats/all`,{
                senderKey : senderChatKey,
                receiverKey : recevierChatKey
            })
            .then(res => {
                setMessages(res.data)
                console.log(res.data)
            })
            .catch(err=>{
                console.log(err.message)
            })
        }
    },[senderChatKey,recevierChatKey])


    useEffect(()=>{
        if(!!receiver){
            setUserStatus(<div>Last seen at <ReactTimeAgo date={!!receiver?.lastSeen ? receiver?.lastSeen : new Date} locale="en-US"/></div>)
        }
    },[receiver])


    useEffect(() => {
        if(!!client && client.connected){
            client.deactivate()
        }
        if(senderChatKey == undefined) return;
        document.cookie = `X-Username=${senderChatKey}; path=/`
        const wsClient = new Client({
            brokerURL: 'ws://localhost:8080/chat', // Replace with your WebSocket server URL
            reconnectDelay: 5000, 
            debug: function (str) {
                console.log(str);
            },
        });
        wsClient.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            wsClient.publish({destination : `/app/chat/connect/${user?.slug}` , body : JSON.stringify({slug : user?.slug})}); 
        
            wsClient.subscribe('/topic/status', (user) => {
                if(data.online){
                    setUserStatus("Online");
                }
            
            });

            /** reciving the message */
            wsClient.subscribe(`/user/${senderChatKey}/queue/private`, (message) => {
                const data = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, data]);
            });

            setClient(wsClient)
        };

        wsClient.activate();
        wsClient.onDisconnect = (frame) => {
            console.log("Disconnected : "+frame)
        }
        window.addEventListener('beforeunload', async (event) => {
            event.preventDefault();
                await updateUserLastSeen()
                .then(data =>{
                    if(!!client)
                    client.deactivate();
                    window.removeEventListener('beforeunload', () => {});
                }).catch(err=>{
                    console.log(err.message)
                })
            });

        return () => {
            if(!!client)
            client.deactivate();
            window.removeEventListener('beforeunload', () => {});
        }
    }, [senderChatKey]);



    // Get all users
    useEffect(()=>{
        axios.defaults.headers = {
            Authorization : auth.token
        }
        axios.post(host + `/admin/auth/W/all`,{})
        .then(res => {
            let users = res.data?.content;
            setChatUsers(users)
        }).catch(err => {
            alert(err.message)
        })
    },[])


    const updateUserLastSeen = async () => {
        return axios.get(host+`/wholesale/auth/last-seen`)
        .then(res => res.data )
        .catch(err => {
            console.log(err.message)
        })
    }

    
    useEffect(()=>{
        if(!!client){
            client.activate();
            if(client && client.connected){
                client.publish({ destination: `/app/chat/${receiver?.slug}/userStatus`});
            }
        }
    },[client,receiver])


    const sendMessage = (message) => {
        if(!!client){
            client.activate();
            if (client && client.connected) {
                console.log(client)
            client.publish({ destination: `/app/chat/private/${recevierChatKey}`, body:  JSON.stringify(message)});
            } else {
                console.warn('Client not connected, unable to send message.');
            }
        }
    };


    const handleSendMessage = () =>{
        if (!!chatMessage){
            let messageBody = { 
                type: 'chat', 
                message: chatMessage,
                senderKey : senderChatKey,
                time : new Date().getTime()
            }
            sendMessage(messageBody);
            setMessages((previous) => [...previous ,messageBody ])
            setChatMessage('')
        }else{
            console.log("Message : "+chatMessage)
        }
    }




    const menuDivRef = useRef(null);
    const [menuDivWidth, setMenuDivWidth] = useState(0);
    const chatDivRef = useRef(null)
  
    useEffect(() => {
      const getAppBarHeight = () => {
        if (menuDivRef.current) {
            setMenuDivWidth(menuDivRef.current.clientWidth);
        }
      };
  
      getAppBarHeight(); 
  
      const resizeObserver = new ResizeObserver(getAppBarHeight);
      if (menuDivRef.current) {
        resizeObserver.observe(menuDivRef.current);
      }
  
      return () => {
        if (menuDivRef.current) {
          resizeObserver.unobserve(menuDivRef.current);
        }
      };
    }, []);


    useEffect(() => {
        const listener = event => {
            if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey) {
                handleSendMessage()
                event.preventDefault(); 
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }, [chatMessage]);


    const handleChange = (event) => {
        setChatMessage(event.target.value); 
    };

    return (
        <Box sx={{
            position : 'fixed',
            bottom : 0,
            left : 0,
            right : 0
        }}>
            <Grid container>
                <Grid ref={menuDivRef} item xs={3} md={3} lg={2} sx={{
                    backgroundColor: 'neutral.800',
                    color : 'white',
                    height : '100vh'
                }}>
                    <Stack spacing={1.5} sx={{
                        py : 1,
                        px : 1.5
                    }}>
                        <Typography variant='h6'>
                            Chats
                        </Typography>

                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center',backgroundColor : 'neutral.700' }}
                            >
                            <InputBase
                                sx={{ ml: 1, flex: 1, color : 'white' , fontSize : 14 }}
                                placeholder="Search Contacts "
                                inputProps={{ 'aria-label': 'search google maps' }}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Stack>
                

                {/* Chat users */}
                {chatUsers.filter((chatUser)=>(chatUser.slug !== user.slug)).map((chatUser , index) => {
                    return(
                        <Box sx={{
                            display : 'flex',
                            p : 2,
                            borderWidth : 1,
                            borderColor : '#f0f0f5',
                            cursor : 'pointer'
                        }}
                        key={index}
                        onClick={(e) => {
                            setReceiver(chatUser)
                        }}
                            
                        >
                            <Avatar  src={`${userImage}${chatUser.slug}/${chatUser?.avatar}`}/>
                            <Box>
                                <Typography sx={{
                                    mx  : 2,
                                    fontSize : 14,
                                }}>
                                    {chatUser.username}
                                </Typography>
                                <Typography sx={{
                                    fontSize : 10,
                                    mx  : 2
                                }}>
                                    <div>
                                        Last seen at <ReactTimeAgo date={!!chatUser.lastSeen ? chatUser?.lastSeen : new Date} locale="en-US"/>
                                    </div>
                                </Typography>
                            </Box>
                        </Box>)
                } )}
                </Grid>

                {/* Receiver top bar */}
                <Grid item xs={9} md={9} lg={10}
                    spacing = {5}
                    sx={{
                        height : '100vh'
                    }}
                >
                    {!!receiver ? 
                    <Box>
                        <Box sx={{
                            display : 'flex',
                            background : '#f0f0f5',
                            minHeight : 65,
                            alignItems : 'center'
                        }}>

                            <Avatar sx={{mx : 1}} src = {`${userImage}${receiver?.slug}/${receiver?.avatar}`} />
                            <Typography variant='subtitle2' sx={{
                                display : 'flex',
                                flexDirection : 'column'
                            }}>
                                {receiver?.username}
                                <small>
                                    {userStatus}
                                </small>
                            </Typography>

                        </Box>

                        <Box ref={chatDivRef} sx={{
                            display : 'flex',
                            flexDirection :'column',
                            mt : 3,
                            mx : 5,
                            pb : 50,
                            height : '85.1vh',
                            overflowY : 'scroll',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}>
                            {messages.map((message, index) => {
                            let time = format(!!message.time ? message.time : 0, "hh:mm"  )
                            let justifyMessage = 'flex-end';
                            if(message.senderKey != senderChatKey) {
                                justifyMessage = 'flex-start';
                            }
         
                        return (
                            ((message.senderKey == senderChatKey) || (message.senderKey == recevierChatKey)) &&
                            <Box key={index} sx={{
                                    px : 1.5,
                                    py : 1,
                                    boxShadow : 2,
                                    background : '#f0f0f5',
                                    borderRadius : 2,
                                    maxWidth : 500,
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
                            )
                        }
                            )}

                        </Box> 
                        <Box sx={{
                            position : 'absolute',
                            bottom : 2,
                            minWidth : `calc(100% - ${menuDivWidth}px)`,
                            display : 'flex',
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}>
                            <TextField  sx={{
                                backgroundColor : 'white',
                                justifyContent : 'flex-end'
                            }} 
                                fullWidth 
                                multiline
                                id='message' 
                                label='Type your message.' 
                                name = 'message'
                                value={chatMessage}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment : 
                                    <InputAdornment position='end' >
                                        <SendIcon 
                                            sx={{
                                                cursor : 'pointer'
                                            }}
                                            onClick={handleSendMessage}
                                            /> 
                                    </InputAdornment>
                                    }}
                            />
                        
                        </Box>


                        <Box sx={{
                            position : 'absolute',
                            right : 20,
                            bottom : 100,
                            borderRadius : 50,
                            height : 50,
                            width : 50,
                            display : 'flex',
                            justifyContent : 'center',
                            alignItems : 'center',
                            boxShadow : 6,
                            cursor : 'pointer'
                        }}
                        onClick={()=>{
                            if (chatDivRef.current) {
                                chatDivRef.current.scrollTo(0, chatDivRef.current.scrollHeight);
                              }
                        }}>
                    <KeyboardArrowDownIcon />
                </Box>


                    </Box>
                    :
                    <Box sx={{
                        display : 'flex',
                        flexDirection : 'column',
                        justifyContent : 'center',
                        alignItems : 'center',
                        height : '100vh'
                    }}>
                        <img  src={defaultChatImage} style={{
                            minHeight : 200,
                            minWidth : 200
                        }} alt="Live chat"/>
                        <Typography variant='h5' color={"#6c757d"} fontFamily={"sans-serif"}>
                            Let's live chat with your contacts
                        </Typography>
                    </Box>
                }
                </Grid>

            </Grid>
        </Box>
    );
}

export default Page