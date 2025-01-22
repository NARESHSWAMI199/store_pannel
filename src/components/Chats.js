import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';
import { userImage } from 'src/utils/util';

const Chats = ({ receiver, pastMessages, messages, showMessage, chatDivRef, setOpenEmojis }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', background: '#f0f0f5', minHeight: 65, alignItems: 'center' }}>
                <Avatar sx={{ mx: 1 }} src={`${userImage}${receiver?.slug}/${receiver?.avatar}`} />
                <Typography variant='subtitle2' sx={{ display: 'flex', flexDirection: 'column' }}>
                    {receiver?.username}
                    <small>{receiver?.isOnline ? "Online" : <div>Last seen at <ReactTimeAgo date={receiver?.lastSeen || receiver?.createdAt} locale="en-US" /></div>}</small>
                </Typography>
            </Box>
            <Box ref={chatDivRef} sx={{ display: 'flex', flexDirection: 'column', mt: 3, mx: { xs: 2, lg: 15 }, pb: 20, height: '85.1vh', overflowY: 'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none' }} onClick={() => setOpenEmojis(false)}>
                {Object.keys(pastMessages).map(date => (
                    <React.Fragment key={date}>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
                            <Typography sx={{ mx: 2, fontSize: 14 }}>{date}</Typography>
                            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
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
