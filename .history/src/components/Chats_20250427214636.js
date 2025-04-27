import React, { use, useEffect, useState } from 'react';
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, IconButton, Button } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';
import { host, toTitleCase, userImage } from 'src/utils/util';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Import DarkMode icon
import CloseIcon from '@mui/icons-material/Close';
import Accept from 'src/components/Accept'
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const Chats = (props) => {

    const auth = useAuth();
    const { pastMessages, activeTab, messages, showMessage, showReplyMessage, chatDivRef, setOpenEmojis, darkMode, handleDarkModeToggle, onChangeAcceptStatus, getInitials } = props
    const [receiver, setReceiver] = useState(props.receiver)
    const [accepted,setAccepted] = useState()
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility

    useEffect(() => {
        setReceiver(props.receiver);
    }, [props.receiver]);

    
    useEffect(() => {

        axios.defaults.headers = {
            Authorization: auth.token
        };
        axios.get(`${host}/chat-users/is-accepted/${props.receiver?.slug}`)
        .then(res => {
            let response = res.data;
            setAccepted(response);
        }).catch(error =>{
            console.error(`Error fetching accepted status for user ${props.receiver?.username}:`, error);
            setAccepted(undefined) // Default to pending if error occurs
        })
    }, [props.receiver]);

    // Function to handle status change
    const onChangeStatus = (status) =>{
        setAccepted(status)
        onChangeAcceptStatus(status)
    }    

    // Function to toggle the dialog visibility
    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen); // Toggle dialog visibility
    };

    // Function to get user type based on the code
    const getUserType = (type) => {
        switch (type) {
            case 'W': return 'Wholesaler';
            case 'R': return 'Retailer';
            case 'S': return 'Company Person';
            default: return 'Unknown';
        }
    };

    // Function to block the user
    const handleBlockUser = async (receiver) => {
        if(!receiver) return; // Check if receiver is defined
        try {
            axios.get(host+`/block/${receiver?.slug}`)
            .then(res => {
                let response = res.data;
                console.log(`User ${receiver?.username} has been blocked.`, response);
                setReceiver({...receiver, blocked: true}); // Update receiver state to reflect blocking
            }).catch(error =>{
                console.error(`Error blocking user ${receiver?.username}:`, error);
            });
        } catch (error) {
           
        }
    };

    // Function to unblock the user
    const handleUnblockUser = async () => { 
        try {
            axios.get(host+`/unblock/${receiver?.slug}`)
            .then(res => {
                let response = res.data;
                console.log(`User ${receiver?.username} has been unblocked.`, response);
                setReceiver({...receiver, blocked: false}); // Update receiver state to reflect unblocking
            }).catch(error =>{
                console.error(`Error unblocking user ${receiver?.username}:`, error);
            });
        } catch (error) {
           
        }
    }

    return (
        <Box>
            {/* Header section with receiver's profile and dark mode toggle */}
            <Box 
                sx={{ 
                    display: { xs: 'none', md: 'flex' }, 
                    background: darkMode ? '#333' : '#f0f0f5', 
                    height: 65, 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    borderRadius: '8px',
                    margin: '8px 0',
                    padding: '8px',
                }}
            >
                {/* Receiver's profile section */}
                <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                    onClick={toggleDialog} // Open dialog on profile click
                >
                    <Avatar 
                        sx={{ 
                            mx: 1 
                        }} 
                        src={receiver?.avatar} 
                    />
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column' 
                        }}
                    >
                        <Typography 
                            variant='subtitle2'
                            sx={{ color: darkMode ? '#fff' : '#000' }}
                        >
                            {receiver?.username}
                        </Typography>
                        <Typography 
                            variant='body2'
                            sx={{ fontSize: '0.8em', color: darkMode ? '#ccc' : '#000' }}
                        >
                            {receiver?.isOnline ? "Online" : (
                                <div>
                                    Last seen at 
                                    <ReactTimeAgo 
                                        date={receiver?.lastSeen || receiver?.createdAt} 
                                        locale="en-US" 
                                        style={{ fontSize: '10px' }} 
                                    />
                                </div>
                            )}
                        </Typography>
                    </Box>
                </Box>
                {/* Dark mode toggle button */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DarkModeIcon 
                        sx={{ color: darkMode ? '#fff' : '#000', cursor: 'pointer' , mr : 5 }} 
                        onClick={handleDarkModeToggle} 
                    /> {/* Use DarkMode icon */}
                </Box>
            </Box>
            {/* Chat messages container */}
            <Box 
                ref={chatDivRef} 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    mt: 3, 
                    mx: { xs: 2, lg: 15 }, 
                    height: '85.1vh', 
                    overflowY: 'scroll', 
                    msOverflowStyle: 'none', 
                    scrollbarWidth: 'none',
                    backgroundColor: darkMode ? '#444' : '#f0f0f5',
                    color: darkMode ? '#fff' : '#000',
                    borderRadius: '8px',
                    padding: '8px',
                }} 
                onClick={() => setOpenEmojis(false)}
            >
                
                {/* Accept component for pending status */}
                {(accepted === 'P' || receiver.blocked) &&
                    <Accept receiver={receiver} darkMode={darkMode} onChangeStatus={onChangeStatus} getInitials={getInitials} blockReceiver={handleBlockUser} />
                }
                
                {/* Display past messages */}
                {(accepted ===  "A") &&  Object.keys(pastMessages).map(date => (
                    <React.Fragment key={date}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                my: 2 
                            }}
                        >
                            <Box 
                                sx={{ 
                                    flex: 1, 
                                    height: '1px', 
                                    backgroundColor: darkMode ? '#666' : '#ccc' 
                                }} 
                            />
                            <Typography 
                                sx={{ 
                                    mx: 2, 
                                    fontSize: 14,
                                    color: darkMode ? '#ccc' : '#000'
                                }}
                            >
                                {date}
                            </Typography>
                            <Box 
                                sx={{ 
                                    flex: 1, 
                                    height: '1px', 
                                    backgroundColor: darkMode ? '#666' : '#ccc' 
                                }} 
                            />
                        </Box>
                        {pastMessages[date].map((message, index) => {
                            if(message.parentId) {
                                return showReplyMessage(message, index)
                            }else {
                                return showMessage(message, index)
                            }
                        })}
                    </React.Fragment>
                ))}
                {/* Display current messages */}
                {messages.map((message, index) => {
                if(message.parentId) {
                    return showReplyMessage(message, index)
                }else {
                    return showMessage(message, index)
                }
})}
            </Box>

            {/* Dialog for receiver details */}
            <Dialog 
                open={isDialogOpen} 
                onClose={toggleDialog} 
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#fff' : '#000',
                        width: 600,
                        borderRadius: '8px'
                    }
                }}
            >
                {/* Dialog header with close button */}
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {toTitleCase(receiver?.username)}
                    <IconButton onClick={toggleDialog} sx={{ color: darkMode ? '#fff' : '#000' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {/* Receiver details */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar 
                            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} 
                            src={receiver?.avatar} 
                        />
                        <Typography variant="h6">{receiver?.username}</Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#ccc' : '#666' }}>
                            {receiver?.email || 'No email provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#ccc' : '#666' }}>
                            {getUserType(receiver?.userType)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#ccc' : '#666' }}>
                            Last Seen: 
                            {receiver?.isOnline ? "Online" : (
                                <ReactTimeAgo 
                                    date={receiver?.lastSeen || receiver?.createdAt} 
                                    locale="en-US" 
                                    style={{ fontSize: '10px' }} 
                                />
                            )}
                        </Typography>

                        {receiver?.blocked ?     
                        //  Ublock button
                        <Button 
                            variant="contained" 
                            color="success" 
                            sx={{ mt: 2 }} 
                            onClick={handleUnblockUser}
                        >
                            Unblock
                        </Button>:

                         // Block button
                        <Button 
                            variant="contained" 
                            color="error" 
                            sx={{ mt: 2 }} 
                            onClick={()=>handleBlockUser(receiver)}
                        >
                            Block
                        </Button>
}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Chats;
