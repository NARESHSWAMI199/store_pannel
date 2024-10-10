
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import {Button, Avatar, Link, ListItemAvatar } from '@mui/material';
import { toTitleCase, userImage } from 'src/utils/util';
import Moment from 'react-moment'
export default function AlignItemsList(props) {
    const [itemList,setItemsList] = useState([])
    const auth = useAuth()
    const user = auth.user;
  
    useEffect(()=>{
        setItemsList(props.itemList)
    },[props.itemList])


    const viewMore = () =>{
      props.viewMore();
    }


  return (<>
    <List sx={{ width: '100%', maxWidth: "100%", bgcolor: 'background.paper',p:0,m:0, boxShadow : 1}}>


    {itemList.map((item, i)=>{
    let sendBy = item.createdBy;
     return( <><ListItem 
      alignItems="flex-start"
      sx={{m:0}} >
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
              
              {item.messageBody.length > 40 ? 
              <>
              <span id={"messageBody"+i}>{" ~ " + item.messageBody.substring(0,40)+".." }</span> <br/>
              

              <Typography
                component="span"
                variant="body4"
                sx={{ color: 'text.secondary',fontSize : '12px',float:'left', mt : 1}}
              >
            <Moment interval={1000} fromNow>
            {item.createAt}
          </Moment>
              </Typography>

              <Button id={"readMore"+i} sx={{float:'right'}} variant='outlined' size='small' onClick={(e)=>{
                  document.getElementById("messageBody"+i).innerText =  " ~ " + item.messageBody
                  document.getElementById("readMore"+i).style.display = "none"
                  document.getElementById("readLess"+i).style.display = "block"
                }} > Read more</Button>

                <Button id={"readLess"+i} sx={{float:'right', display:'none'}} variant='outlined' size='small' onClick={(e)=>{
                  document.getElementById("messageBody"+i).innerText = " ~ " + item.messageBody.substring(0,40)+".."
                  document.getElementById("readLess"+i).style.display = "none"
                  document.getElementById("readMore"+i).style.display = "block"
                }} > Read less</Button>
              </>
              : " ~ " +item.messageBody}
            </Fragment>
          }
        />
      </ListItem>
      <Divider 
      // variant="inset"
       component="li" />
      </>)
    })}
    </List>
      <Button onClick={e=>viewMore()} color='primary' sx={{float:'right'}} variant='outline'>View More</Button>
    </>
  );
}
