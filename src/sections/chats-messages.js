import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DoneAllTwoToneIcon from '@mui/icons-material/DoneAllTwoTone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';

const ShowMessages = ({ message, user, receiver, handleMouseEnter, handleMouseLeave, handleMenuOpen, isHovered, handleDownloadImage }) => {
    let time = format(message.createdAt || 0, "hh:mm");
    let justifyMessage = message.sender === user?.slug ? 'flex-end' : 'flex-start';
    let displayMessage = message.message;


    if((message.isSenderDeleted === 'Y' && message.sender === user?.slug)){
        return null;
    }else if(message.isReceiverDeleted === 'Y' && message.receiver === user?.slug){
        return null;
    }

    if ((message.isSenderDeleted === 'H' && message.isReceiverDeleted === 'H')) {
        displayMessage = "This message was deleted.";
    } else if ((message.isSenderDeleted === 'H' && (message.isReceiverDeleted === 'N' || message.isReceiverDeleted === 'Y' )  && message.sender === user?.slug)) {
        displayMessage = "You deleted this message.";
    } else if (((message.isSenderDeleted === 'N' || message.isSenderDeleted === 'Y' ) && message.isReceiverDeleted === 'H' && message.receiver === user?.slug)) {
        displayMessage = "You deleted this message.";
    }

    const shouldHideImages = (message.isSenderDeleted === 'H' && message.sender === user?.slug) || 
                             (message.isReceiverDeleted === 'H' && message.receiver === user?.slug);

    return (
        (message.sender === user?.slug && message.receiver === receiver?.slug) ||
        (message.sender === receiver?.slug && message.receiver === user?.slug)
    ) && (
        <Box key={message.id} sx={{ display: 'flex' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box sx={{ display: 'flex', justifyContent: justifyMessage, width: '100%' }}>
                <Box sx={{ display: 'flex', maxWidth: '40%' }}>
                    {/* Message block */}
                    <Box sx={{ px: 1.5, py: 1, boxShadow: 2, background: '#f0f0f5', borderRadius: 2, mx: 1, my: 0.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: message.imagesUrls?.length > 0 ? 'column' : 'row' }}>
                            {!shouldHideImages && message.imagesUrls && message.imagesUrls.map((url, imgIndex) => (
                                <Box key={imgIndex} sx={{ position: 'relative', marginBottom: '8px' }}>
                                    <img src={url} alt={`message-img-${imgIndex}`} style={{ width: '100%' }} />
                                    <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => handleDownloadImage(url)}>
                                        <OpenInNewIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Typography sx={{ mx: 1 }}>{displayMessage}</Typography>
                            <Typography variant='small' sx={{ fontSize: 10, alignSelf: 'flex-end', mr: 1 }}>{time}</Typography>
                            {message.sender === user?.slug &&
                                <DoneAllTwoToneIcon sx={{ fontSize: 14, alignSelf: 'flex-end', color: message.seen ? '#0e6f87' : 'black' }} />
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* Three dots menu */}
            <IconButton sx={{
                justifyContent: 'flex-end'
            }}
                onClick={(e) => handleMenuOpen(e, message)}>
                <MoreVertIcon sx={{
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    fontSize: 18,
                    color: 'black'
                }} />
            </IconButton>
        </Box>
    )
}

export default ShowMessages;
