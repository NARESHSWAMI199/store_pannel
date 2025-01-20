import SendIcon from '@mui/icons-material/Send';
import {
    Avatar, Badge, Box,
    Button,
    Grid, InputAdornment, Stack,
    SvgIcon,
    TextField, Typography
} from '@mui/material';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { defaultChatImage, host, userImage } from 'src/utils/util';


import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';

import AddIcon from '@mui/icons-material/Add';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import EmojiPicker from 'emoji-picker-react';
import { Howl } from 'howler';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import ReactTimeAgo from 'react-time-ago';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

function Page() {
    const [newMessage, setNewMessage] = useState();
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const auth = useAuth();
    const user = auth.user;
    const [receiver, setReceiver] = useState();
    const [chatUsers, setChatUsers] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [activeTab, setActiveTab] = useState("chats");
    const [contactUsers, setContactUsers] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [openEmojis, setOpenEmojis] = useState(false);
    const [pastMessages, setPastMessages] = useState({});
    const audioRef = useRef(null);
    const menuDivRef = useRef(null);
    const chatDivRef = useRef(null);
    const [menuDivWidth, setMenuDivWidth] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.cookie = `X-Username=${user?.slug}; path=/`;
        const wsClient = createWebSocketClient(user, setNewMessage, setMessages, setChatUsers, setIsPlaying);
        setClient(wsClient);
        wsClient.activate();

        window.addEventListener('beforeunload',(e) => handleBeforeUnload(e,client));

        return () => {
            window.removeEventListener('beforeunload', (e) => handleBeforeUnload(e,client));
            wsClient.deactivate();
        };
    }, []);

    useEffect(() => {
        if (client && client.connected && receiver) {
            client.publish({ destination: `/app/chats/was-seen/${receiver.slug}` });
            subscribeToSeenMessages(client, user, setMessages);
        }
    }, [receiver, messages]);

    useEffect(() => {
        if (receiver) {
            fetchPastMessages(receiver, setPastMessages, auth.token);
        }
    }, [receiver]);

    useEffect(() => {
        setOpenEmojis(false);
    }, [receiver]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateChatUsersStatus(chatUsers, setChatUsers, auth.token);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [chatUsers]);

    useEffect(() => {
        fetchContactUsers(setContactUsers, auth.token);
    }, []);

    useEffect(() => {
        fetchChatUsers(setChatUsers, auth.token);
    }, []);

    useEffect(() => {
        if (receiver) {
            updateSeenMessages(receiver, setChatUsers, auth.token);
        }
    }, [receiver, messages, chatMessage]);

    useEffect(() => {
        const listener = event => {
            if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey) {
                handleSendMessage();
                event.preventDefault();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [chatMessage]);

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
        const sound = new Howl({
            src: ['/assets/notification.mp3'],
            html5: true,
            sound: 1
        });
        audioRef.current = sound;

        return () => {
            sound.stop();
            sound.unload();
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        }
        setIsPlaying(false);
    }, [isPlaying]);

    const handleSendMessage = () => {
        if (chatMessage || selectedImages.length > 0) {
            const messageBody = createMessageBody(chatMessage, user, receiver, selectedImages);
            sendMessage(client, messageBody);
            setMessages(prev => [...prev, messageBody]);
            setChatMessage('');
            setSelectedImages([]);
            setImagePreviews([]);
        } else {
            console.log("Message: " + chatMessage);
        }
    };

    const handleChange = (event) => {
        setChatMessage(event.target.value);
    };

    const handleImageChange = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setSelectedImages(prevImages => [...prevImages, ...filesArray]);
            const previewsArray = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...previewsArray]);
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Reset the input value to allow selecting the same file again
            }
        }
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Reset the input value to allow selecting the same file again
        }
    };

    const scrollDown = useCallback(() => {
        setNewMessage(undefined);
        if (chatDivRef.current) {
            chatDivRef.current.scrollTo(0, chatDivRef.current.scrollHeight);
        }
    }, []);

    useEffect(() => {
        if (chatDivRef.current) {
            chatDivRef.current.scrollTo(0, chatDivRef.current.scrollHeight);
        }
    }, [chatMessage]);

    return (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
            <Grid container>
                <Grid ref={menuDivRef} item xs={3} md={3} lg={2} sx={{ backgroundColor: 'neutral.800', color: 'white', height: '100vh' }}>
                    <Stack spacing={1.5} sx={{ py: 1, px: 1.5 }}>
                        <Box sx={{ display: 'flex', mx: 2 }}>
                            <Button variant='outlined' color='inherit' onClick={() => setActiveTab("chats")} sx={{ border: activeTab === 'chats' ? 1 : 0, flex: 1 }}>
                                Chats
                            </Button>
                            <Button variant='outlined' color='inherit' onClick={() => setActiveTab("contacts")} sx={{ border: activeTab === 'contacts' ? 1 : 0, flex: 1 }}>
                                Contacts
                            </Button>
                        </Box>
                        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', backgroundColor: 'neutral.700' }}>
                            <InputBase sx={{ ml: 1, flex: 1, color: 'white', fontSize: 14 }} placeholder="Search Contacts" inputProps={{ 'aria-label': 'search google maps' }} />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Stack>
                    {(activeTab === 'chats' ? chatUsers.filter(chatUser => chatUser.slug !== user.slug) : contactUsers).map((chatUser, index) => (
                        <Box key={index} sx={{ display: 'flex', p: 2, borderWidth: 1, borderColor: '#f0f0f5', cursor: 'pointer', flex: '1' }} onClick={() => setReceiver(chatUser)}>
                            <Avatar src={`${userImage}${chatUser.slug}/${chatUser?.avatar}`} />
                            <Box sx={{ width: menuDivWidth + 'px' }}>
                                <Typography sx={{ mx: 2, fontSize: 14 }}>{chatUser.username}</Typography>
                                <Box fontSize={10} mx={2}>
                                    {chatUser?.isOnline ? "Online" : <div>Last seen at <ReactTimeAgo date={chatUser?.lastSeen || chatUser?.createdAt} locale="en-US" /></div>}
                                </Box>
                            </Box>
                            {activeTab === 'chats' && chatUser.chatNotification > 0 && receiver?.slug !== chatUser.slug &&
                                <Badge sx={{ justifySelf: 'flex-end', alignSelf: 'center', mx: 2 }} color="error" badgeContent={chatUser.chatNotification} />
                            }
                        </Box>
                    ))}
                    {activeTab === 'contacts' &&
                        <Button color='inherit' size='large' sx={{ m: 2 }} startIcon={<SvgIcon><AddIcon /></SvgIcon>}>
                            Add new contact
                        </Button>
                    }
                </Grid>
                <Grid item xs={9} md={9} lg={10} sx={{ height: '100vh' }}>
                    {!!receiver ?
                        <Box>
                            <Box sx={{ display: 'flex', background: '#f0f0f5', minHeight: 65, alignItems: 'center' }}>
                                <Avatar sx={{ mx: 1 }} src={`${userImage}${receiver?.slug}/${receiver?.avatar}`} />
                                <Typography variant='subtitle2' sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {receiver?.username}
                                    <small>{receiver?.isOnline ? "Online" : <div>Last seen at <ReactTimeAgo date={receiver?.lastSeen || receiver?.createdAt} locale="en-US" /></div>}</small>
                                </Typography>
                            </Box>
                            <Box ref={chatDivRef} sx={{ display: 'flex', flexDirection: 'column', mt: 3, mx: 5, pb: 20, height: '85.1vh', overflowY: 'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none' }} onClick={() => setOpenEmojis(false)}>
                                {Object.keys(pastMessages).map(date => (
                                    <>
                                        <Typography sx={{ alignSelf: 'center', fontSize: 14 }}>{date}</Typography>
                                        {pastMessages[date].map((message, index) => {
                                            let time = format(message.time || 0, "hh:mm");
                                            let justifyMessage = message.sender === user?.slug ? 'flex-end' : 'flex-start';
                                            return (
                                                (message.sender === user?.slug && message.receiver === receiver?.slug) ||
                                                (message.sender === receiver?.slug && message.receiver === user?.slug)
                                            ) && (
                                                <Box key={index} sx={{ px: 1.5, py: 1, boxShadow: 2, background: '#f0f0f5', borderRadius: 2, maxWidth: '45%', mx: 1, my: 0.5, alignSelf: justifyMessage }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography sx={{ mx: 1 }}>{message.message}</Typography>
                                                        <Typography variant='small' sx={{ fontSize: 10, alignSelf: 'flex-end', mr: 1 }}>{time}</Typography>
                                                        {message.sender === user?.slug &&
                                                            <DoneAllTwoToneIcon sx={{ fontSize: 14, alignSelf: 'flex-end', color: message.seen ? '#0e6f87' : 'black' }} />
                                                        }
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </>
                                ))}
                                {messages.map((message, index) => {
                                    let time = format(message.time || 0, "hh:mm");
                                    let justifyMessage = message.sender === user?.slug ? 'flex-end' : 'flex-start';
                                    return (
                                        (message.sender === user?.slug && message.receiver === receiver?.slug) ||
                                        (message.sender === receiver?.slug && message.receiver === user?.slug)
                                    ) && (
                                        <Box key={index} sx={{ px: 1.5, py: 1, boxShadow: 2, background: '#f0f0f5', borderRadius: 2, maxWidth: '45%', mx: 1, my: 0.5, alignSelf: justifyMessage }}>
                                            <Box sx={{ display: 'flex' }}>
                                                <Typography sx={{ mx: 1 }}>{message.message}</Typography>
                                                <Typography variant='small' sx={{ fontSize: 10, alignSelf: 'flex-end', mr: 1 }}>{time}</Typography>
                                                {message.sender === user?.slug &&
                                                    <DoneAllTwoToneIcon sx={{ fontSize: 14, alignSelf: 'flex-end', color: message.seen ? '#0e6f87' : 'black' }} />
                                                }
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                            <Box sx={{ position: 'absolute', bottom: 2, minWidth: `calc(100% - ${menuDivWidth}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <EmojiPicker open={openEmojis} width={'100%'} onEmojiClick={(emojiObj) => setChatMessage(prev => `${prev || ''} ${emojiObj.emoji}`)} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                                        {imagePreviews.map((preview, index) => (
                                            <Box key={index} sx={{ position: 'relative', m: 1 }}>
                                                <img src={preview} alt={`preview-${index}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                                <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => handleRemoveImage(index)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                    <TextField sx={{ backgroundColor: 'white', justifyContent: 'flex-end' }} fullWidth multiline id='message' label='Type your message.' name='message' value={chatMessage} onChange={handleChange} InputProps={{
                                        endAdornment: <InputAdornment position='end'>
                                            <SendIcon sx={{ cursor: 'pointer' }} onClick={handleSendMessage} />
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="icon-button-file"
                                                type="file"
                                                multiple
                                                onChange={handleImageChange}
                                                onClick={handleFileInputClick}
                                                ref={fileInputRef}
                                            />
                                            <label htmlFor="icon-button-file">
                                                <IconButton color="primary" aria-label="upload picture" component="span">
                                                    <PhotoCamera />
                                                </IconButton>
                                            </label>
                                        </InputAdornment>,
                                        startAdornment: <InputAdornment><EmojiEmotionsOutlinedIcon sx={{ cursor: 'pointer' }} onClick={() => setOpenEmojis(prev => !prev)} /></InputAdornment>,
                                        sx: { borderRadius: 0 }
                                    }} />
                                </Box>
                            </Box>
                            <Box sx={{ position: 'absolute', right: 20, bottom: 100, height: 50, width: 50 }} onClick={scrollDown}>
                                <Badge color='success' variant="dot" invisible={!(newMessage?.sender === receiver.slug)}>
                                    <KeyboardArrowDownIcon sx={{ borderRadius: 50, justifySelf: 'center', alignSelf: 'center', boxShadow: 6, cursor: 'pointer' }} />
                                </Badge>
                            </Box>
                        </Box>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <img src={defaultChatImage} style={{ minHeight: 200, minWidth: 200 }} alt="Live chat" />
                            <Typography variant='h5' color={"#6c757d"} fontFamily={"sans-serif"}>Let's live chat with your contacts</Typography>
                        </Box>
                    }
                </Grid>
            </Grid>
        </Box>
    );
}

export default Page;

// Helper functions
const createWebSocketClient = (user, setNewMessage, setMessages, setChatUsers, setIsPlaying) => {
    const wsClient = new Client({
        brokerURL: 'ws://localhost:8080/chat',
        debug: function (str) {
            console.log(str);
        },
    });

    wsClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        wsClient.publish({ destination: `/app/chat/connect/${user?.slug}` });

        wsClient.subscribe(`/user/${user?.slug}/queue/private`, (data) => {
            const message = JSON.parse(data.body);
            setNewMessage(message);
            setMessages(prevMessages => [...prevMessages, message]);
            const visitedUser = [];
            setChatUsers(prevChatUsers => prevChatUsers.map(chatUser => {
                if (chatUser.slug === message.sender && !message.seen && !visitedUser.includes(chatUser.slug)) {
                    chatUser.chatNotification += 1;
                    visitedUser.push(chatUser.slug);
                    setIsPlaying(true);
                }
                return chatUser;
            }));
        });
    };

    wsClient.onDisconnect = (frame) => {
        console.log("Disconnected: " + frame);
    };

    return wsClient;
};

const handleBeforeUnload = async (event,client) => {
    event.preventDefault();
    await updateUserLastSeen()
        .then(data => {
            if (client) client.deactivate();
            window.removeEventListener('beforeunload', () => { });
        })
        .catch(err => {
            console.log(err.message);
        });
};

const subscribeToSeenMessages = (client, user, setMessages) => {
    client.subscribe(`/user/${user?.slug}/queue/private/chat/seen`, (data) => {
        const seen = JSON.parse(data.body);
        setMessages(prevMessages => prevMessages.map(message => {
            message.seen = seen;
            return message;
        }));
    });
};

const fetchPastMessages = (receiver, setPastMessages, token) => {
    axios.defaults.headers = { Authorization: token };
    axios.post(`${host}/chats/all`, { receiver: receiver.slug })
        .then(res => {
            setPastMessages(res.data);
        })
        .catch(err => {
            console.log(err.message);
        });
};

const updateChatUsersStatus = (chatUsers, setChatUsers, token) => {
    axios.defaults.headers = { Authorization: token };
    setChatUsers(prevUsers => prevUsers.map(chatUser => {
        axios.get(`${host}/chat/status/${chatUser.slug}`)
            .then(res => {
                let user = res.data;
                chatUser.isOnline = user.slug === chatUser.slug ? user.isOnline : false;
            })
            .catch(err => {
                console.log(err.message);
            });
        return chatUser;
    }));
};

const fetchContactUsers = (setContactUsers, token) => {
    axios.defaults.headers = { Authorization: token };
    axios.get(`${host}/contacts/all`)
        .then(res => {
            setContactUsers(res.data);
        })
        .catch(err => {
            alert(err.message);
        });
};

const fetchChatUsers = (setChatUsers, token) => {
    axios.defaults.headers = { Authorization: token };
    axios.get(`${host}/chat-users/all`)
        .then(res => {
            setChatUsers(res.data);
        })
        .catch(err => {
            alert(err.message);
        });
};

const updateSeenMessages = (receiver, setChatUsers, token) => {
    axios.defaults.headers = { Authorization: token };
    axios.post(`${host}/chat/seen`, { sender: receiver?.slug })
        .then(res => {
            setChatUsers(prevChatUsers => prevChatUsers.map(chatUser => {
                if (chatUser.slug === receiver.slug) {
                    chatUser.chatNotification = 0;
                }
                return chatUser;
            }));
        })
        .catch(err => {
            console.log(err);
        });
};

const createMessageBody = (chatMessage, user, receiver, images) => {
    const messageBody = {
        type: 'chat',
        message: chatMessage,
        sender: user?.slug,
        receiver: receiver?.slug,
        time: new Date().getTime(),
        images : images
    };
    // if (images.length > 0) {
    //     const formData = new FormData();
    //     let newImages= []
    //     images.forEach((image, index) => {
    //         formData.append(`file${index}`, image);
    //         newImages.push(image)
    //     });
    //     formData.append("images",newImages)
    //     formData.append('message',JSON.stringify(messageBody));
    //     return formData;
    // }
    return messageBody;
};

const sendMessage = (client, messageBody) => {
    if (client) { 
        client.activate();
        if (client.connected) {
            if (messageBody?.images?.length > 0) {
                axios.defaults.headers = {
                    Authorization : token,
                    "Content-Type" : "multipart/form-data"
                }
                axios.post(`${host}/chat/upload`,messageBody).then(response => {
                    console.log('Images sent successfully');
                }).catch(error => {
                    console.error('Error sending images:', error);
                });
            } else {
                client.publish({ destination: `/app/chat/private/${messageBody.receiver}`, body: JSON.stringify(messageBody) });
            }
        } else {
            console.warn('Client not connected, unable to send message.');
        }
    }
};

const updateUserLastSeen = async () => {
    return axios.get(`${host}/wholesale/auth/last-seen`)
        .then(res => res.data)
        .catch(err => {
            console.log(err.message);
        });
};