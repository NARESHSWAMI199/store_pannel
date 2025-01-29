import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemAvatar, Button, SvgIcon, ListItemText, Badge, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { userImage, host } from 'src/utils/util';

const Contacts = ({ contacts, activeTab, setActiveTab, setReceiver, menuDivWidth, user, darkMode }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (openDialog) {
            axios.post(`${host}/admin/auth/W/all`,{})
                .then(response => {
                    setUserList(response.data.content);
                    setFilteredUsers(response.data.content);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [openDialog]);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setFilteredUsers(userList.filter(user => user.username.toLowerCase().includes(query.toLowerCase())));
    };

    const handleAddContact = (contact) => {
        // Implement the logic to add the contact
        console.log('Add contact:', contact);
    };

    const handleChat = (contact) => {
        setReceiver(contact);
        setOpenDialog(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', mx: 2 }}>
                <Button 
                    variant='outlined' 
                    color='inherit' 
                    onClick={() => setActiveTab("chats")} 
                    sx={{ border: activeTab === 'chats' ? 1 : 0, flex: 1 }}
                >
                    Chats
                </Button>
                <Button 
                    variant='outlined' 
                    color='inherit' 
                    onClick={() => setActiveTab("contacts")} 
                    sx={{ border: activeTab === 'contacts' ? 1 : 0, flex: 1 }}
                >
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
                                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            },
                            backgroundColor: activeTab === 'chats' ? (darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') : 'transparent',
                        }}
                    >
                        <ListItemAvatar>
                            <Badge 
                                color="secondary" 
                                badgeContent={contact.chatNotification} 
                                invisible={contact.chatNotification === 0}
                            >
                                <Avatar src={`${userImage}${contact.slug}/${contact.avatar}`} />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={contact.username} 
                            secondary={contact.isOnline ? "Online" : `Last seen at ${new Date(contact.lastSeen).toLocaleTimeString()}`} 
                        />
                    </ListItem>
                ))}
            </List>
            {activeTab === 'contacts' &&
                <Button 
                    color='inherit' 
                    size='large' 
                    sx={{ m: 2 }} 
                    startIcon={<SvgIcon><AddIcon /></SvgIcon>} 
                    onClick={() => setOpenDialog(true)}
                >
                    Add new contact
                </Button>
            }
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#fff' : '#000',
                    }
                }}
            >
                <DialogTitle sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>Add New Contact</DialogTitle>
                <DialogContent sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search Users"
                        type="text"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}
                        InputProps={{
                            sx: {
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: darkMode ? '#fff' : '#ccc',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: darkMode ? '#fff' : '#ccc',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: darkMode ? '#fff' : '#ccc',
                                    },
                                    '& input': {
                                        color: darkMode ? '#fff' : '#000',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: darkMode ? '#fff' : '#000',
                                    }
                                }
                            }
                        }}
                    />
                    <List>
                        {filteredUsers.map((user, index) => (
                            <ListItem key={index} 
                                sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <ListItemAvatar>
                                    <Avatar src={`${userImage}${user.slug}/${user.avatar}`} />
                                </ListItemAvatar>
                                <ListItemText primary={user.username} />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                        color="inherit" 
                                        onClick={() => handleAddContact(user)}
                                        startIcon={<AddIcon />}
                                        sx={{
                                            boxShadow: 1,
                                            '&:hover': {
                                                boxShadow: 3,
                                                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button 
                                        color="inherit" 
                                        onClick={() => handleChat(user)}
                                        startIcon={<ChatIcon />}
                                        sx={{
                                            boxShadow: 1,
                                            '&:hover': {
                                                boxShadow: 3,
                                                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        Chat
                                    </Button>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        sx={{ color: darkMode ? '#fff' : '#000' }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Contacts;
