import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';

const ShowMessages = ({ message, user, receiver, handleMouseEnter, handleMouseLeave, handleMenuOpen, isHovered, handleDownloadImage, darkMode }) => {
    // Format message time
    let time = format(message.createdAt || 0, "hh:mm a");

    // Determine alignment of the message
    let justifyMessage = message.sender === user?.slug ? 'flex-end' : 'flex-start';

    // Handle deleted messages
    let displayMessage = message.message;

    if((message.isSenderDeleted === 'Y' && message.sender === user?.slug)){
        return null;
    }else if(message.isReceiverDeleted === 'Y' && message.receiver === user?.slug){
        return null;
    }

    if ((message.isSenderDeleted === 'H' && message.isReceiverDeleted === 'H')) {
        displayMessage = "This message was deleted.";
    } else if ((message.isSenderDeleted === 'H' && (message.isReceiverDeleted === 'N' || message.isReceiverDeleted === 'Y' )  && message.sender === user?.slug)) {
        displayMessage = "Message was deleted";
    } else if (((message.isSenderDeleted === 'N' || message.isSenderDeleted === 'Y' ) && message.isReceiverDeleted === 'H' && message.receiver === user?.slug)) {
        displayMessage = "Message was deleted";
    }

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

export default ShowMessages;
