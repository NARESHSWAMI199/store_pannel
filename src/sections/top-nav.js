import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import logo from 'public/assets/logos/logow.png';
import * as React from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { projectName } from 'src/utils/util';




function HomeNavbar() {

  const auth = useAuth();
  const router = useRouter()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [pages,setPages] = React.useState(['Products','Pricing','Blog'])
// const settings = ['Profile', 'Account', 'Dashboard',"Register", 'Login'];


React.useEffect(()=>{
  console.log(auth.token)
  if(!!auth.token){
    setPages([...pages.filter(p => (((p != "Login") || (p !="Register")))) ,"Logout"])
  }else{
    setPages([...pages.filter(p => p != "Logout") ,"Login","Register"])
  }
},[auth.token])


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleRedirect = async(pageName) => {
    if(pageName == "Login") {
      router.push("/auth/login")
    } else if(pageName == "Logout") {
      await auth.signOut();
      router.push('/auth/login');
    }
    else if(pageName == "Register") {
      router.push("/auth/register")
    }else if(pageName == "Pricing"){
      router.push(!!auth.token ? "/pricing" : "/auth/register")
    }else {
      router.push("/welcome")
    }
  }


  return (
    <AppBar position="fixed"  sx={{boxShadow : 0}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar src={logo.src} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link 
              style={{
                textDecoration : 'none',
                color : 'inherit'
              }}
              href={{
                  pathname : '/welcome'
              }}>
              {projectName}
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={()=>handleRedirect(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'}, justifyContent : 'flex-end'}}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={()=>handleRedirect(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HomeNavbar;
