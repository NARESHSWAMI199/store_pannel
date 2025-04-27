import * as React from 'react';
import { Image } from "antd";
import Typography from '@mui/material/Typography';
import { Box, Button, Stack, Avatar } from '@mui/material';
import { host, toTitleCase } from 'src/utils/util';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const Accept = (props) => {
    const auth = useAuth();

    const handleAppceptOrDecline = (status) => {
        axios.defaults.headers = {
            Authorization: auth.token
        };
        axios.post(host + "/chat-users/accept", {
            receiverSlug: receiver.slug,
            status: status
        })
        .then(res => {
            let response = res.data;
            /** currently we not show any kind of message */
            props.onChangeStatus(status);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const { receiver, blockReceiver, darkMode } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                p: 4,
                background: darkMode ? '#2c2c2c' : '#f9f9f9',
                borderRadius: 3,
                boxShadow: darkMode ? '0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.1)',
                maxWidth: 400,
                margin: 'auto',
                textAlign: 'center',
            }}
        >
            {/* Avatar */}
            <Avatar
                src={receiver.avatar || ''}
                alt={receiver.username}
                sx={{
                    height: 120,
                    width: 120,
                    background: darkMode ? '#555' : '#ddd',
                    fontSize: '2rem',
                    color: darkMode ? '#fff' : '#000',
                    mb: 2,
                }}
            >
                {!receiver.avatar && props.getInitials(receiver?.username)}
            </Avatar>

            {/* Username */}
            <Typography
                sx={{
                    py: 1,
                    fontWeight: 'bold',
                    color: darkMode ? '#fff' : '#333',
                }}
                variant="h5"
            >
                {toTitleCase(receiver.username)}
            </Typography>

            {/* Action Buttons */}
            <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                sx={{ mt: 3 }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAppceptOrDecline("A")}
                    size="large"
                    sx={{
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Accept
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => blockReceiver(receiver.slug)}
                    size="large"
                    sx={{
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Block
                </Button>
            </Stack>
        </Box>
    );
};

export default Accept;