import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import StoreIcon from '@mui/icons-material/Store';
import { SvgIcon } from '@mui/material';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import ChatIcon from '@mui/icons-material/Chat';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Add } from '@mui/icons-material';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
export const items = (user) =>{

  return [
    {
      title: 'Dashboard',
      path: '/',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      )
    },
    {
      title: 'New Items',
      path: '/items/label/N',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <FiberNewIcon sx={{ color: 'gold' }} />
        </SvgIcon>
      )
    },
    {
      title: 'Old Items',
      path: '/items/label/O',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <ShoppingBagIcon />
        </SvgIcon>
      )
    },
  
    {
      title: 'In Stock',
      path: '/items/stock/Y',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <Inventory2Icon />
        </SvgIcon>
      )
    },

      
    {
      title: 'Out Of Stock',
      path: '/items/stock/N',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <RemoveShoppingCartIcon />
        </SvgIcon>
      )
    },
    {
      title: 'Blocked Items',
      path: '/blocked',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <BlockIcon />
        </SvgIcon>
      )
    },

        {
      title: 'Add Item',
      path: '/items/create',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <Add/>
        </SvgIcon>
      )
    },
  
    {
      title: 'Profile',
      path: '/account',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <UserIcon />
        </SvgIcon>
      )
    },
  
    {
      title: 'Store',
      path: '/store',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <StoreIcon />
        </SvgIcon>
      )
    },
    
    {
      title: 'Remove Background',
      path: '/removebg',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <WallpaperIcon />
        </SvgIcon>
      )
    },
      
    {
      title: 'Chats',
      path: '/chat',
      show: true,
      icon: (
        <SvgIcon fontSize="small">
          <ChatIcon />
        </SvgIcon>
      )
    },

    {
      title: 'My Plans',
      path: '/plans',
      show: true,
      icon: (
        <SvgIcon fontSize="small">
          <AccountBalanceWalletIcon />
        </SvgIcon>
      )
    },
  
    {
      title: 'Settings',
      path: '/settings',
      show : true,
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      )
    },

  
  
    // {
    //   title: 'Login',
    //   path: '/auth/login',
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <LockClosedIcon />
    //     </SvgIcon>
    //   )
    // },
    // {
    //   title: 'Register',
    //   path: '/auth/register',
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <UserPlusIcon />
    //     </SvgIcon>
    //   )
    // },
    // {
    //   title: 'Error',
    //   path: '/404',
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <XCircleIcon />
    //     </SvgIcon>
    //   )
    // }
  ];
}

