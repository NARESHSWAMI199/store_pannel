import { Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from 'public/assets/logos/logo.png';

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <Avatar src={logo.src} />
  );
};
