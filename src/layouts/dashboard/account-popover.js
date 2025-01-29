import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import Link from 'next/link';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const [user,setUser] = useState(props.user)


  useEffect(()=>{
    setUser(props.user)
  },[props.user])

  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
      router.push('/auth/login');
    },
    [onClose, auth, router]
  );


  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Typography     
        sx={{
          py: 1.5,
          px: 2
        }} 
        variant="overline"
      >
        Account
      </Typography>
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{
            display : 'flex',
            alignContent : 'center',
          }}
        >
          <AccountCircleOutlinedIcon />
          <Link 
            style={{
              textDecoration: 'none',
              color: 'black',
              marginLeft: 5
            }} 
            href={{
              pathname: "/account"
            }}
          > 
          {!!user.username ? (user.username).toUpperCase() : ""}
          </Link>
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          py : 1.5
        }}
      >
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{
            display : 'flex',
            alignContent : 'center',
          }}
        >
          <AccountBalanceWalletOutlinedIcon/>
          <Link 
            style={{
              textDecoration: 'none',
              color: 'black',
              marginLeft: 5
            }} 
            href={{
              pathname: "/plans"
            }}
          > 
              My Plans
          </Link>

        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
        <LogoutOutlinedIcon sx={{marginRight : 1}}/>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
