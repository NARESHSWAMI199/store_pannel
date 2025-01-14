    import SendIcon from '@mui/icons-material/Send';
    import { Avatar, Box, Button, Grid, Stack, SvgIcon, TextField, Typography } from '@mui/material';
    import { Client } from '@stomp/stompjs';
    import axios from 'axios';
    import { format } from 'date-fns';
    import TimeAgo from 'javascript-time-ago';
    import { useRouter } from 'next/router';
    import { useEffect, useState } from 'react';
    import { useAuth } from 'src/hooks/use-auth';
    import { host, userImage } from 'src/utils/util';

    import en from 'javascript-time-ago/locale/en';
    import ru from 'javascript-time-ago/locale/ru';
    import ReactTimeAgo from 'react-time-ago';


    TimeAgo.addDefaultLocale(en)
    TimeAgo.addLocale(ru)

    function Page() {
        const [messages, setMessages] = useState([]);
        const [client, setClient] = useState(null);
        const auth = useAuth();
        const user = auth.user
        const router = useRouter()
        const {slug} = router.query
        const [reciver,setReciver] = useState()
        const [userStatus,setUserStatus] = useState()
        const [disabled,setDisabled] = useState(true)
        // const result = useTimeAgo(new Date())

        useEffect(()=>{
            if(slug == undefined || slug == null) return;
            axios.defaults.headers = {
                Authorization : auth.token
            }
            axios.get(host + `/wholesale/auth/detail/${slug}`)
            .then(res => {
                let user = res.data?.user;
                setReciver(user)
                setUserStatus(<div>
                    Last seen at <ReactTimeAgo date={!!user.lastSeen ? user.lastSeen : new Date} locale="en-US"/>
                </div>);
            }).catch(err => {
                alert(err.message)
            })
        },[slug])


        const updateUserLastSeen = () => {
            return axios.get(host+`/wholesale/auth/last-seen`)
            .then(res => res.data )
            .catch(err => {
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
                client.publish({destination : `/app/chat/connect/${user?.slug}` , body : JSON.stringify({slug : user?.slug})}); 
            
                client.subscribe('/topic/status', (user) => {
                    const data = JSON.parse(user.body);
                    // alert(data.slug + " : "+data.online)
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

            client.activate();


            client.onDisconnect = (frame) => {
                console.log("Disconnected : "+frame)
            }

            window.addEventListener('beforeunload', async (event) => {
                event.preventDefault();
                    await updateUserLastSeen()
                    .then(data =>{
                        client.deactivate();
                        window.removeEventListener('beforeunload', () => {});
                    }).catch(err=>{
                        alert(err)
                    })
            });
        

            return () => {
                client.deactivate();
                window.removeEventListener('beforeunload', () => {});
            };
        }, [slug]);

        
        useEffect(()=>{
            if(slug == undefined && client && client.connected) return;
            if(client && client.connected){
                client.publish({ destination: `/app/chat/${slug}/userStatus`});
            }
        },[slug,client,userStatus])


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
            let messageInputBox = document.getElementById("message");
            let message = messageInputBox.value
            if (!!message){
                let messageBody = { 
                    type: 'chat', 
                    message: message,
                    time : new Date().getTime()
                }
                sendMessage(messageBody);
                setMessages((previous) => [...previous ,messageBody ])
                messageInputBox.value = ''
            }
        }

        return (
            <Box sx={{
                position : 'fixed',
                bottom : 0,
                left : 0,
                right : 0
            }}>
                {/* <Typography variant='h6'>
                    WebSocket Messages
                </Typography> */}


                <Grid container>
                    <Grid item xs={12} md={2} sx={{
                        backgroundColor: 'neutral.800',
                        color : 'white',
                        height : '100vh'
                    }}>
                        <Box sx={{
                            display : 'flex',
                            p : 2,
                            borderWidth : 1,
                            borderColor : '#f0f0f5',
                        }}>
                            <Avatar  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7oW68XJ4ALiEinBb8O-Lwqco4npKrqxxU_w&s' />
                            <Box>
                                <Typography sx={{
                                    mx  : 2,
                                    fontSize : 14,
                                }}>
                                    Naresh Swami
                                </Typography>
                                <Typography sx={{
                                    fontSize : 10,
                                    mx  : 2
                                }}>
                                    Last updated at 2 days ago
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={10}
                        spacing = {5}
                        sx={{
                            height : '100vh'
                        }}
                    >
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
                            // mb : 10,
                            height : '85.7vh',
                            overflowY : 'scroll'
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
                            display : 'flex',
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}>
                            <TextField alignItems={'center'} sx={{
                                backgroundColor : 'white'
                            }} fullWidth id='message' label='Type your message.' />
                                <Button sx={{height : 56.5,width : 120}} variant='contained' color='primary' onClick={handleSendMessage}
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
                    </Grid>

                </Grid>

            

            </Box>
        );
    }

    export default Page