import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import {
    Avatar, Badge, Box,
    Button,
    Grid, InputAdornment, Menu, MenuItem, MenuList, Stack,
    SvgIcon,
    TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import ShowMessages from 'src/sections/chats-messages'
import Contacts from 'src/components/Contacts';
import Chats from 'src/components/Chats';

TimeAgo.addLocale(en);
TimeAgo.addLocale(ru);

function Page() {
    const router = useRouter();
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
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteType, setDeleteType] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');



    const handleScroll = () => {
        if (chatDivRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatDivRef.current;
            setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
        }
    };

    useEffect(() => {
        return () => {
            if (chatDivRef.current) {
                chatDivRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [ chatDivRef.current?.addEventListener('scroll',handleScroll)]);


    useEffect(() => {
        document.cookie = `X-Username=${user?.slug}; path=/`;
        const wsClient = createWebSocketClient(user, setNewMessage, setMessages,setPastMessages, setChatUsers, setIsPlaying,showNotification,auth);
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
    }, [receiver, newMessage]);

    useEffect(() => {
        if (receiver) {
            fetchPastMessages(receiver, setPastMessages,auth.token,setMessages);
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
    }, [receiver,newMessage]);

    useEffect(() => {
        const listener = event => {
            if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey) {
                handleSendMessage(auth.token);
                event.preventDefault();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [chatMessage, auth.token]);

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

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (!auth.token) {
            router.push('/auth/login');
        }
    }, [auth.token]);

    const handleSendMessage = (token) => {
        if (chatMessage || selectedImages.length > 0) {
            const messageBody = createMessageBody(chatMessage, user, receiver, selectedImages);
            sendMessage(client, token, messageBody);
            setMessages(prev => [...prev, { ...messageBody, imagesUrls: selectedImages.map(file => URL.createObjectURL(file)) }]);
            setChatMessage('');
            setSelectedImages([]);
            setImagePreviews([]);
        } else {
            console.log("Message: " + chatMessage);
        }
    };

    const handleKeyDown = (event) => {
        if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey) {
            handleSendMessage(auth.token);
            event.preventDefault();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [chatMessage, selectedImages, auth.token]);

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

    const handleDownloadImage = (url) => {
        window.open(url)
    };

    const handleMenuOpen = (event, message) => {
        setAnchorEl(event.currentTarget);
        setSelectedMessage(message);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMessage(null);
    };

    const handleReply = () => {
        setChatMessage(`@${selectedMessage.sender}: ${selectedMessage.message}`);
        handleMenuClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedMessage.message);
        handleMenuClose();
    };

    const handleDelete = (type) => {
        setDeleteType(type);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        let isDeleted;
        if (selectedMessage?.isSenderDeleted === 'H') {
            isDeleted = 'SY'; // if sender delete temporary delete message
        } else if (selectedMessage?.isReceiverDeleted === 'H') {
            isDeleted = 'RY'; // if receiver delete temporary delete message
        } else if (deleteType === 'both') {
            isDeleted = 'B'; // temporary delete from both sides
        } else {
            isDeleted = selectedMessage?.sender === user?.slug ? 'S' : 'R';
        }

        const deleteParams = { ...selectedMessage, isDeleted };
        if (deleteParams.imagesUrls) {
            delete deleteParams.images;
        }

        await axios.post(`${host}/chat/delete`, deleteParams, {
            headers: { Authorization: auth.token }
        }).then(res => {
            setMessages(prevMessages => prevMessages.map(message => {
                if (message.id === selectedMessage.id) {
                    return { ...message, isDeleted, message: 'You deleted this message.', imagesUrls: [] }; // Hide images after delete action
                }
                return message;
            }));
            setPastMessages(prevPastMessages => {
                const updatedPastMessages = { ...prevPastMessages };
                Object.keys(updatedPastMessages).forEach(date => {
                    updatedPastMessages[date] = updatedPastMessages[date].map(message => {
                        if (message.id === selectedMessage.id) {
                            return { ...message, isDeleted, message: 'You deleted this message.', imagesUrls: [] }; // Hide images after delete action
                        }
                        return message;
                    });
                });
                return updatedPastMessages;
            });
            setOpenDialog(false);
            handleMenuClose();
            setSnackbarMessage('Message was deleted');
            setSnackbarOpen(true);
        }).catch(err => {
            setSnackbarMessage('Error deleting message');
            setSnackbarOpen(true);
            setOpenDialog(false);
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showMessage = (message, index) => {
        return (
            <ShowMessages
                key={index}
                message={message}
                user={user}
                receiver={receiver}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleMenuOpen={handleMenuOpen}
                isHovered={isHovered}
                handleDownloadImage={handleDownloadImage}
            />
        );
    };


    return (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
            <Grid container>
                <Grid ref={menuDivRef} item xs={3} md={3} lg={2} sx={{ backgroundColor: 'neutral.800', color: 'white', height: '100vh' }}>
                    <Stack spacing={1.5} sx={{ py: 1, px: 1.5 }}>
                        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', backgroundColor: 'neutral.700' }}>
                            <InputBase sx={{ ml: 1, flex: 1, color: 'white', fontSize: 14 }} placeholder="Search Contacts" inputProps={{ 'aria-label': 'search google maps' }} />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Stack>
                    <Contacts
                        contacts={activeTab === 'chats' ? chatUsers : contactUsers}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setReceiver={setReceiver}
                        menuDivWidth={menuDivWidth}
                        user={user}
                    />
                </Grid>
                <Grid item xs={9} md={9} lg={10} sx={{ height: '100vh' }}>
                    {!!receiver ?
                        <>
                            <Chats
                                receiver={receiver}
                                pastMessages={pastMessages}
                                messages={messages}
                                showMessage={showMessage}
                                chatDivRef={chatDivRef}
                                setOpenEmojis={setOpenEmojis}
                            />
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
                                            <SendIcon sx={{ cursor: 'pointer' }} onClick={() => handleSendMessage(auth.token)} />
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
                                        startAdornment: <InputAdornment position='start'><EmojiEmotionsOutlinedIcon sx={{ cursor: 'pointer' }} onClick={() => setOpenEmojis(prev => !prev)} /></InputAdornment>,
                                        sx: { borderRadius: 0 }
                                    }} />
                                </Box>
                            </Box>
                            {!isAtBottom && (
                                <Box sx={{ position: 'absolute', right: 20, bottom: 100, height: 50, width: 50 }} onClick={scrollDown}>
                                    <Badge color='success' variant="dot" invisible={!(newMessage?.sender === receiver.slug)}>
                                        <KeyboardArrowDownIcon sx={{ borderRadius: 50, justifySelf: 'center', alignSelf: 'center', boxShadow: 6, cursor: 'pointer' }} />
                                    </Badge>
                                </Box>
                            )}
                        </>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <img src={defaultChatImage} style={{ minHeight: 200, minWidth: 200 }} alt="Live chat" />
                            <Typography variant='h5' color={"#6c757d"} fontFamily={"sans-serif"}>Let's live chat with your contacts</Typography>
                        </Box>
                    }
                </Grid>
            </Grid>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuList>
                    <MenuItem onClick={handleReply}>
                        <ListItemIcon>
                            <ReplyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Reply</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleCopy}>
                        <ListItemIcon>
                            <ContentCopy fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Copy</ListItemText>
                    </MenuItem>
                    <Divider />
                    {selectedMessage?.sender === user?.slug && (
                        <MenuItem onClick={() => handleDelete('both')}>
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete for both</ListItemText>
                        </MenuItem>
                    )}
                    <MenuItem onClick={() => handleDelete('self')}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete for self</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this message?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>confirmDelete(setMessages)} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                action={
                    <Button color="inherit" size="small" onClick={handleSnackbarClose}>
                        Close
                    </Button>
                }
            />
        </Box>
    );
}

export default Page;


// Helper functions
const createWebSocketClient = (user, setNewMessage, setMessages,setPastMessages, setChatUsers, setIsPlaying, showNotification,auth) => {
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
            showNotification(message,auth.token);
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

        wsClient.subscribe(`/user/${user?.slug}/queue/private/deleted`, (data) => {
            const deletedMessage = JSON.parse(data.body);
            setMessages(prevMessages => prevMessages.map(message => {
                if (message.message === deletedMessage.message && message.createdAt === deletedMessage.createdAt) {
                    return { ...message, isDeleted: 'Y', message: 'You deleted this message.' };
                }
                return message;
            }));
            setPastMessages(prevPastMessages => {
                const updatedPastMessages = { ...prevPastMessages };
                Object.keys(updatedPastMessages).forEach(date => {
                    updatedPastMessages[date] = updatedPastMessages[date].map(message => {
                        if (message.message === deletedMessage.message && message.createdAt === deletedMessage.createdAt) {
                            return { ...message, isDeleted: 'Y', message: 'You deleted this message.' };
                        }
                        return message;
                    });
                });
                return updatedPastMessages;
            });
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

const fetchPastMessages = (receiver, setPastMessages,token,setMessages) => {
    axios.defaults.headers = { Authorization: token };
    axios.post(`${host}/chats/all`, { receiver: receiver.slug })
        .then(res => {
            setPastMessages(res.data);
            setMessages([])
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
        createdAt: new Date().getTime(),
        images : images
    };
    return messageBody;
};

const sendMessage = (client,token,messageBody) => {
    if (client) { 
        client.activate();
        if (client.connected) {
            if (messageBody?.images?.length > 0) {
                console.log(token ," :  token ")
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

const showNotification = async (message,token) => {
    try {
        const response = await axios.get(`${host}/wholesale/auth/detail`, {
            params: { slug: message.sender },
            headers: { Authorization: token }
        });
        const username = response.data.user?.username;
        if (Notification.permission === "granted") {
            new Notification("New Message", {
                body: `${username}: ${message.message}`,
                icon: `${userImage}${message.sender}/${message.avatar}`
            });
        }
    } catch (error) {
        console.error('Error fetching username:', error);
    }
};