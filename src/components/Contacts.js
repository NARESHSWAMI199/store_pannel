import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Switch, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { host } from 'src/utils/util';

const Contacts = ({ contacts, activeTab, setActiveTab, setReceiver, menuDivWidth, user, darkMode ,setContactUsers,setChatUsers,setSnackbarMessage,setSnackbarOpen,onReceiverDeleted}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userList, setUserList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deleteChats, setDeleteChats] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const auth = useAuth()

    useEffect(() => {
        setContactList(contacts);
    }, [contacts]);

    const searchUsers = () =>{
        axios.defaults.headers = { Authorization: auth?.token };  
        axios.post(`${host}/wholesale/auth/chat/users`,{
            searchKey : searchQuery
        })
        .then(response => {
            setUserList(response.data.content);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }

    useEffect(() => {
        searchUsers();
    },[searchQuery]);
   
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const handleAddContact = (contact) => {
        axios.post(`${host}/contacts/add`, { contactSlug: contact.slug })
            .then(response => {
                console.log('Contact added successfully:', response.data);
                setContactUsers(prevList => [...prevList, response.data?.contact]);
                setUserList(prevList => prevList.map(user => 
                    user.slug === contact.slug ? { ...user, added: true } : user
                ));
                refreshContacts(); //TODO : make this dynamic
            })
            .catch(err => {
                console.error('Error adding contact:', err);
                let error = err.response?.data?.message || err.message;
                setSnackbarMessage(error);
                setSnackbarOpen(true);
            });
    };

    const handleRemoveContact = (contact) => {
        setSelectedContact(contact);
        setOpenConfirmDialog(true);
    };


    const confirmRemoveChatUser = () => {
        axios.post(`${host}/chat-users/remove`, { 
            contactSlug: selectedContact.slug, 
            deleteChats: deleteChats 
        })
        .then(response => {
            console.log('Chat user removed successfully:', response.data);
            setChatUsers(prevList => prevList.filter(c => c.slug !== selectedContact.slug));
            setOpenConfirmDialog(false);
            setDeleteChats(false);
            onReceiverDeleted();
        })
        .catch(err => {
            console.error('Error removing contact:', err);
            let error = err.response?.data?.message || err.message;
            setSnackbarMessage(error);
            setSnackbarOpen(true);
        });
    };

    const confirmRemoveContact = () => {
        axios.post(`${host}/contacts/remove`, { 
            contactSlug: selectedContact.slug, 
            deleteChats: deleteChats 
        })
        .then(response => {
            console.log('Contact removed successfully:', response.data);
            setContactUsers(prevList => prevList.filter(c => c.slug !== selectedContact.slug));
            setOpenConfirmDialog(false);
            setDeleteChats(false);
            onReceiverDeleted();
        })
        .catch(err => {
            console.error('Error removing contact:', err);
            let error = err.response?.data?.message || err.message;
            setSnackbarMessage(error);
            setSnackbarOpen(true);
        });
    };

    const handleChat = (contact) => {
        setReceiver(contact);
        setOpenDialog(false);
    };

    return (
        <Box>
            {/* Tabs for switching between chats and contacts */}
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
            {/* Contacts list */}
            <List>
                {(activeTab === 'chats' ? contactList.filter(contact => contact.slug !== user.slug) : contactList).map((contact, index) => (
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
                        {/* Contact avatar */}
                        <ListItemAvatar>
                            <Badge 
                                color="secondary" 
                                badgeContent={contact?.chatNotification} 
                                invisible={contact?.chatNotification === 0}
                            >
                                <Avatar src={contact?.avatar} />
                            </Badge>
                        </ListItemAvatar>
                        {/* Contact details */}
                        <ListItemText 
                            primary={contact?.username} 
                            secondary={contact?.isOnline ? "Online" : `Last seen at ${new Date(contact.lastSeen).toLocaleTimeString()}`} 
                        />
                        <IconButton 
                            color="error" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent onClick
                                handleRemoveContact(contact);
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: darkMode ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
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
            {/* Dialog for adding new contact */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#fff' : '#000',
                        border : '20px solid #444',
                        borderRadius : 4
                    }
                }}
            >
                <DialogTitle sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>Add New Contact</DialogTitle>
                <DialogContent 
                sx={{ 
                        backgroundColor: darkMode ? '#333' : '#fff', 
                        color: darkMode ? '#fff' : '#000',
                    }}>
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
                                },
                                color : darkMode ? 'white' : 'black'
                            }
                        ,
                        endAdornment: 
                        <InputAdornment position='end'>
                            <IconButton 
                                onClick={searchUsers}
                                color="inherit" 
                                aria-label="upload picture" 
                                component="span"
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                        }
                    
                    }
                    />
                    {/* List of users found by search */}
                    <List>
                        {userList.map((user, index) => (
                            <ListItem key={index} 
                                sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <ListItemAvatar>
                                    <Avatar src={user.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={user.username} />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {!contacts.some(contact => contact.slug === user.slug) && (
                                        <Button 
                                            color="inherit" 
                                            onClick={() => handleAddContact(user)}
                                            startIcon={<AddIcon />}
                                            disabled={user.added} // Disable button if already added
                                            sx={{
                                                boxShadow: 1,
                                                '&:hover': {
                                                    boxShadow: 3,
                                                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                                }
                                            }}
                                        >
                                            {user.added ? "Added" : "Add"}
                                        </Button>
                                    )}
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
                <DialogActions 
                    sx={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}
                >
                    <Button 
                        onClick={() => {
                            setOpenDialog(false);
                        }} 
                        sx={{ color: darkMode ? '#fff' : '#000' }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation dialog for removing contact */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Confirm Remove Contact</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this contact?
                    <FormControlLabel
                        control={<Switch checked={deleteChats} onChange={(e) => setDeleteChats(e.target.checked)} />}
                        label="Delete chats as well"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                    <Button color="error" onClick={ ()=>{
                        if(activeTab === 'contacts'){
                            confirmRemoveContact()
                        }
                        if(activeTab === 'chats'){
                            confirmRemoveChatUser()
                        }
                    }}>Remove</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Contacts;
