import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import { useAuth } from 'src/hooks/use-auth';
import { host, userImage } from 'src/utils/util';
import { ArrowButtons } from '../arrow-button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomModal from 'src/sections/modal';
import AlignItemsList from 'src/sections/list-item';
import DrawerRight from 'src/sections/drawer';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();
  const auth = useAuth()
  const user = auth.user!=null ? auth.user : {};
  const [notifications,setNotifications] = useState([])
  const [totalElements,setTotalElements] = useState()
  const [open, setOpen] = useState(false);
  const [seenIds,setSeenIds]= useState([])


  useEffect(() => {
    const getData = async () => {
        axios.defaults.headers = {
            Authorization: auth.token
        }
        await axios.post(host + "/wholesale/store/notifications", {})
            .then(res => {
                const data = res.data.content;

                setNotifications(data);
                let newNotifications= 0
                let seenNotifications = []
                for(let item of data){
                  if (item.seen == "N"){
                    seenNotifications.push(item.id)
                    newNotifications +=1;
                  }
                }
                setSeenIds(seenNotifications)
                setTotalElements(newNotifications)
            })
            .catch(err => {
              console.log(err)
            })
    }
    getData();

 

}, [])



const showLoading = () => {
    setOpen(open ? false : true)
      let data = {seenIds : seenIds }
      axios.defaults.headers = {
          Authorization: auth.token
      }
       axios.post(host + "/wholesale/store/update/notifications", data)
          .then(res => {
              const data = res.data;
              setTotalElements((0))
          })
          .catch(err => {
            console.log(err)
          })
}

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: 'sticky',
          left: {
            lg: `${SIDE_NAV_WIDTH}px`
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
          },
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
            {/* <Tooltip title="ADMIN">
              <IconButton>
                <SvgIcon fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip> */}
            ADMIN PANNEL
          </Stack>
          <Box>
            <ArrowButtons/>
          </Box>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Tooltip title="Contacts">
              <IconButton>
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>z
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton onClick={showLoading}>
              {/* {contextHolder} */}
              <DrawerRight open={open}  >
                <AlignItemsList  itemList={notifications} />
                </DrawerRight>
                <Badge
                  badgeContent={totalElements}
                  color="success"
                  //variant="dot"
                >
                  <SvgIcon fontSize="small">
                    <BellIcon/>
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: 'pointer',
                height: 40,
                width: 40
              }}
              src={!!user ? userImage+user.slug+"/"+user.avatar : ""}
            />
          </Stack>
        </Stack>
      </Box>
       <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
        user = {user}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
