
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { Link } from '@mui/material';

export default function AlignItemsList(props) {
    const [itemList,setItemsList] = useState([])
    const auth = useAuth()
    const user = auth.user;
    useEffect(()=>{
        setItemsList(props.itemList)
    },[])

  return (
    <List sx={{ width: '100%', maxWidth: "100%", bgcolor: 'background.paper' }}>


    {itemList.map(item=>{
     return( <><ListItem alignItems="flex-start" sx={{boxShadow :1}}>
        {/* <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar> */}
        
        <ListItemText
          primary={item.title}
          secondary={
            <Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                {"Dear "+ user.username}
              </Typography>
              
              {item.messageBody.length > 100 ? 
              <>
              {" ~ " +item.messageBody.substring(0,60)+".."} 
              <Link href="/" > Read more..</Link>
              </>
              : " ~ " +item.messageBody}
            </Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      </>)
    })}
    </List>
  );
}
