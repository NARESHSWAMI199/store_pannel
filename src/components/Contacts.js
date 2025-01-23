import React from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemAvatar, Button,ListItemText } from '@mui/material';
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
            <List>
                {(activeTab === 'chats' ? contacts.filter(contact => contact.slug !== user.slug) : contacts).map((contact, index) => (
                    <ListItem 
                        key={index} 
                        button 
                        onClick={() => setReceiver(contact)}
                        sx={{
                            borderRadius: '8px',
                            margin: '8px 0',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            backgroundColor: activeTab === 'chats' ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar src={`${userImage}${contact.slug}/${contact.avatar}`} />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={contact.username} 
                            secondary={contact.isOnline ? "Online" : `Last seen at ${new Date(contact.lastSeen).toLocaleTimeString()}`} 
                        />
                    </ListItem>
                ))}
            </List>
            {activeTab === 'contacts' &&
                <Button color='inherit' size='large' sx={{ m: 2 }} startIcon={<SvgIcon><AddIcon /></SvgIcon>}>
                    Add new contact
                </Button>
            }
        </Box>
    );
};

export default Contacts;
