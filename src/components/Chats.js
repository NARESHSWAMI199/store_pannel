import React from 'react';
import { Box, Avatar, Typography, Switch } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';
import { userImage } from 'src/utils/util';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Import DarkMode icon

const Chats = ({ receiver, pastMessages, messages, showMessage, chatDivRef, setOpenEmojis, darkMode, handleDarkModeToggle }) => {
    return (
        <Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                        sx={{ 
                            mx: 1 
                        }} 
                        src={`${userImage}${receiver?.slug}/${receiver?.avatar}`} 
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
                            {receiver?.isOnline ? "Online" : <div>Last seen at <ReactTimeAgo date={receiver?.lastSeen || receiver?.createdAt} locale="en-US" style={{ fontSize: '10px' }} /></div>}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DarkModeIcon sx={{ color: darkMode ? '#fff' : '#000' }} /> {/* Use DarkMode icon */}
                    <Switch checked={darkMode} onChange={handleDarkModeToggle} />
                </Box>
            </Box>
            <Box 
                ref={chatDivRef} 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    mt: 3, 
                    mx: { xs: 2, lg: 15 }, 
                    pb: 20, 
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
                {Object.keys(pastMessages).map(date => (
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
                        {pastMessages[date].map((message, index) => (
                            showMessage(message, index)
                        ))}
                    </React.Fragment>
                ))}
                {messages.map((message, index) => (
                    showMessage(message, index)
                ))}
            </Box>
        </Box>
    );
};

export default Chats;
