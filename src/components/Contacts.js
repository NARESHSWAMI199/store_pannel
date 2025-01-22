import React from 'react';
import { Box, Avatar, Typography, Badge, Button, SvgIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReactTimeAgo from 'react-time-ago';
import { userImage } from 'src/utils/util';

const Contacts = ({ contacts, activeTab, setActiveTab, setReceiver, menuDivWidth, user }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', mx: 2 }}>
                <Button variant='outlined' color='inherit' onClick={() => setActiveTab("chats")} sx={{ border: activeTab === 'chats' ? 1 : 0, flex: 1 }}>
                    Chats
                </Button>
                <Button variant='outlined' color='inherit' onClick={() => setActiveTab("contacts")} sx={{ border: activeTab === 'contacts' ? 1 : 0, flex: 1 }}>
                    Contacts
                </Button>
            </Box>
            {(activeTab === 'chats' ? contacts.filter(contact => contact.slug !== user.slug) : contacts).map((contact, index) => (
                <Box key={index} sx={{ display: 'flex', p: 2, borderWidth: 1, borderColor: '#f0f0f5', cursor: 'pointer', flex: '1' }} onClick={() => setReceiver(contact)}>
                    <Avatar src={`${userImage}${contact.slug}/${contact?.avatar}`} />
                    <Box sx={{ width: menuDivWidth + 'px' }}>
                        <Typography sx={{ mx: 2, fontSize: 14 }}>{contact.username}</Typography>
                        <Box fontSize={10} mx={2}>
                            {contact?.isOnline ? "Online" : <div>Last seen at <ReactTimeAgo date={contact?.lastSeen || contact?.createdAt} locale="en-US" /></div>}
                        </Box>
                    </Box>
                    {activeTab === 'chats' && contact.chatNotification > 0 && contact.slug !== user.slug &&
                        <Badge sx={{ justifySelf: 'flex-end', alignSelf: 'center', mx: 2 }} color="error" badgeContent={contact.chatNotification} />
                    }
                </Box>
            ))}
            {activeTab === 'contacts' &&
                <Button color='inherit' size='large' sx={{ m: 2 }} startIcon={<SvgIcon><AddIcon /></SvgIcon>}>
                    Add new contact
                </Button>
            }
        </Box>
    );
};

export default Contacts;
