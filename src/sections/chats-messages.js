import React, { use, useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';
import axios from 'axios';
import { host } from 'src/utils/util';
import { set } from 'nprogress';

const ShowMessages = ({ message, user, receiver,handleMouseEnter, handleMouseLeave, handleMenuOpen, isHovered, handleDownloadImage, darkMode }) => {
    // Format message time
    let time = format(message.createdAt || 0, "hh:mm a");

    // Determine alignment of the message
    let justifyMessage = message.sender === user?.slug ? 'flex-end' : 'flex-start';

    // Handle deleted messages
    let displayMessage = message.message;

    // Hide images for deleted messages
    const shouldHideImages = (message.isSenderDeleted === 'H' && message.sender === user?.slug) || 
                             (message.isReceiverDeleted === 'H' && message.receiver === user?.slug);

    // Highlight URLs in the message
    const highlightText = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        return text.replace(urlRegex, (url) => `<a href="${url}" style="color: blue;" target="_blank">${url}</a>`);
    };

    return (
        (message.sender === user?.slug && message.receiver === receiver?.slug) ||
        (message.sender === receiver?.slug && message.receiver === user?.slug)
    ) && (
        <Box 
          key={message.id} 
          sx={{ display: 'flex', padding: '8px 16px' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
            {/* Message container */}
            <Box sx={{ display: 'flex', justifyContent: justifyMessage, width: '100%' }}>
                <Box sx={{ display: 'flex', maxWidth: '60%' }}>
                    {/* Message block */}
                    <Box 
                      sx={{ px: 2, py: 1.5, boxShadow: 3, background: darkMode ? '#666' : '#e0e0e0', borderRadius: 3, mx: 1, my: 0.5, wordBreak: 'break-word' }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: message.imagesUrls?.length > 0 ? 'column' : 'row' }}>
                            {/* Display images */}
                            {!shouldHideImages && message.imagesUrls && message.imagesUrls.map((url, imgIndex) => (
                                <Box 
                                  key={imgIndex} 
                                  sx={{ position: 'relative', marginBottom: '8px' }}
                                >
                                    <img 
                                      src={url} 
                                      alt={`message-img-${imgIndex}`} 
                                      style={{ width: '100%', borderRadius: '8px' }} 
                                    />
                                    <IconButton 
                                      sx={{ position: 'absolute', top: 0, right: 0 }} 
                                      onClick={() => handleDownloadImage(url)}
                                    >
                                        <OpenInNewIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            {/* Display message text */}
                            <Typography 
                              sx={{ mx: 1 }} 
                              dangerouslySetInnerHTML={{ __html: highlightText(displayMessage) }}
                            ></Typography>
                            {/* Display message time */}
                            <Typography 
                              variant='caption' 
                              sx={{ fontSize: 10, alignSelf: 'flex-end', mr: 1 }}
                            >
                              {time}
                            </Typography>
                            {/* Seen icon for sender */}
                            {message.sender === user?.slug && 
                                <DoneAllTwoToneIcon sx={{ fontSize: 14, alignSelf: 'flex-end', color: message.seen ? '#0e6f87' : 'black' }} />
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* Three dots menu */}
            <IconButton 
              sx={{ justifyContent: 'flex-end' }}
              onClick={(e) => handleMenuOpen(e, message)}
            >
                <MoreVertIcon 
                  sx={{
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    fontSize: 18,
                    color: darkMode ? '#fff' : 'black'
                  }} 
                />
            </IconButton>
        </Box>
    )
}


const ShowRepliedMessages = ({ message, user,receiver, handleMouseEnter, handleMouseLeave, handleMenuOpen, isHovered, handleDownloadImage, darkMode }) => {
    // Format message time
    let time = format(message.createdAt || 0, "hh:mm a");
  
    // Determine alignment of the message
    let justifyMessage = message.sender === user?.slug ? 'flex-end' : 'flex-start';
  
    // Handle deleted messages
    let displayMessage = message.message;
  
    const [parentMessage, setParentMessage] = useState(null);
  
    useEffect(() => {
        if (!message.parentId) return;
        axios.get(`${host}/chats/message/${message.parentId}`)
            .then(async (res) => {
               let parentMessage = res.data;
                if (res.data) {
                  parentMessage =  await axios.get(`${host}/wholesale/auth/detail/${parentMessage?.sender}`)
                    .then(res => {
                         let senderName = res.data?.user?.username;
                          if (parentMessage) {
                              return {
                                  ...parentMessage,
                                  senderName: parentMessage.sender === user?.slug ? "You" : (senderName || parentMessage.sender),
                              };
                          }
                          return parentMessage;
                    })
                }
                setParentMessage(parentMessage);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    
    // Highlight URLs in the message
    const highlightText = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        return text.replace(urlRegex, (url) => `<a href="${url}" style="color: blue;" target="_blank">${url}</a>`);
    };
  
    return (
            (message.sender === user?.slug && message.receiver === receiver?.slug) ||
            (message.sender === receiver?.slug && message.receiver === user?.slug)
        ) && (
        <Box sx={{ display: 'flex', padding: '8px 16px' }}>
        <Box 
            key={message.id} 
            sx={{ display: 'flex', flexDirection: 'column', alignItems: justifyMessage, width: '100%' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Parent message block */}
            {parentMessage && (
                <Box 
                    sx={{
                        backgroundColor: darkMode ? '#444' : '#f9f9f9',
                        padding: '8px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        borderLeft: `4px solid ${darkMode ? '#888' : '#ccc'}`,
                        maxWidth: '70%',
                        wordBreak: 'break-word',
                        fontStyle: 'italic',
                        fontSize: '0.9em',
                        color: darkMode ? '#ccc' : '#555'
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {parentMessage.senderName || parentMessage.sender}
                    </Typography>
                    <Typography 
                        dangerouslySetInnerHTML={{ __html: highlightText(parentMessage.message) }}
                    ></Typography>
                </Box>
            )}
  
            {/* Main message block */}
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: darkMode ? '#666' : '#e0e0e0',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: 3,
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                }}
            >
                {/* Display images */}
                {message.imagesUrls && message.imagesUrls.map((url, imgIndex) => (
                    <Box 
                        key={imgIndex} 
                        sx={{ position: 'relative', marginBottom: '8px' }}
                    >
                        <img 
                            src={url} 
                            alt={`message-img-${imgIndex}`} 
                            style={{ width: '100%', borderRadius: '8px' }} 
                        />
                        <IconButton 
                            sx={{ position: 'absolute', top: 0, right: 0 }} 
                            onClick={() => handleDownloadImage(url)}
                        >
                            <OpenInNewIcon />
                        </IconButton>
                    </Box>
                ))}
  
                {/* Display message text */}
                <Typography 
                    sx={{ marginBottom: '8px' }} 
                    dangerouslySetInnerHTML={{ __html: highlightText(displayMessage) }}
                ></Typography>
  
                {/* Display message time */}
                <Typography 
                    variant="caption" 
                    sx={{ fontSize: '0.8em', alignSelf: 'flex-end', color: darkMode ? '#bbb' : '#666' }}
                >
                    {time}
                </Typography>
            </Box>
            </Box>
            {/* Three dots menu */}
            <IconButton 
                sx={{ justifyContent: 'flex-end', marginTop: '8px' }}
                onClick={(e) => handleMenuOpen(e, message)}
            >
                <MoreVertIcon 
                    sx={{
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        fontSize: 18,
                        color: darkMode ? '#fff' : 'black'
                    }} 
                />
            </IconButton>
        </Box>
    );
};


export { ShowMessages, ShowRepliedMessages };
