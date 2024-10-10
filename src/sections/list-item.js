
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { Link, ListItemAvatar } from '@mui/material';
import { Avatar } from 'antd';
import { toTitleCase, userImage } from 'src/utils/util';

export default function AlignItemsList(props) {
    const [itemList,setItemsList] = useState([])
    const auth = useAuth()
    const user = auth.user;
    useEffect(()=>{
        setItemsList(props.itemList)
    },[])

  return (
    <List sx={{ width: '100%', maxWidth: "100%", bgcolor: 'background.paper',p:0,m:0,boxShadow : 2 }}>


    {itemList.map(item=>{
    let sendBy = item.createdBy;
     return( <><ListItem alignItems="flex-start" >
        <ListItemAvatar>
          <Avatar alt={toTitleCase(sendBy.username)} src={userImage+sendBy.slug+"/"+sendBy.avatar} />
        </ListItemAvatar>
        
        <ListItemText
          primary={toTitleCase(sendBy.username)}
          secondary={
            <Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                {item.title}
              </Typography>
              
              {item.messageBody.length > 100 ? 
              <>
              {" ~ " +item.messageBody.substring(0,40)+".."} 
              <Link href="/" > Read more..</Link>
              </>
              : " ~ " +item.messageBody}
            </Fragment>
          }
        />
      </ListItem>
      <Divider variant="" component="li" />
      </>)
    })}
    </List>
  );
}
