import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Badge,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import React, {useEffect, useState } from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { host } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';
import { CopyOutlined } from '@ant-design/icons';



export const GroupTable = (props) => {
  const {
    count = 0,
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;
  const [items,setItems] = useState(props.items)
  const [message,setMessage] = useState("")
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const [confirm,setConfirm] = useState(false)
  const [slug,setSlug] = useState(null)
  const [rowIndex,setRowIndex] = useState(-1)
  const [status,setStatus] = useState('')
  const [action,setAction] = useState('')
  const [assignGroup,setAssignGroup] = useState([])
  const [isCopied, setIsCopied] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const auth = useAuth()
  const user = auth.user


  const changeStatus = (slug,status) => {
    let isChanged = props.onStatusChange(slug,status)
    if(isChanged !=false){
      setItems((items) => {
          items.filter((_, index) => {
            if(_.slug === slug) return _.status = status
            return _;
          })
          return items
      });
      }
     
  }


  useEffect( ()=>{
    const getData = async () => {
       axios.defaults.headers = {
         Authorization : auth.token
       }
       await axios.get(host+"/admin/auth/groups/"+user.slug)
       .then(res => {
          const data = res.data.content
          setAssignGroup(data);
       })
       .catch(err => {
         setMessage(!!err.response ? err.response.data.message : err.message)
       } )
     }
    getData();

   },[])


  useEffect(()=>{
    setItems((props.items).filter(group => !assignGroup.includes(group.id)|| user.id == 0))
  },[props.items])

  

  const handleClose =  () =>{
      setConfirm(false)
  }
  const confirmBox = () => {
    setConfirm(true)
  };

  const takeAction = (action) =>{
    props.onDelete(slug,rowIndex)
    setConfirm(false)
  }


  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = (slug) => {
    // Asynchronously call copyTextToClipboard
      copyTextToClipboard(slug)
      .then(() => {
        // If successful, update the isCopied state value
        setItems((items).filter(group => {
         if(group.slug == slug){
          group.isCopied = true
          setIsCopied(true);
         }
         return group
      }))
        setTimeout(() => {
          setItems((items).filter(group => {
            if(group.slug == slug){
              group.isCopied = false
             setIsCopied(false);
            }
            return group
         }))
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return ( <>
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  {/* <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  /> */}
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  TOKEN ID
                </TableCell>

                <TableCell>
                    Created At
                </TableCell>

                <TableCell>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((group,index) => {
                const isSelected = selected.includes(group.id);
                const createdAt = format(group.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={group.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      {/* <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(group.slug);
                          } else {
                            onDeselectOne?.(group.slug);
                          }
                        }}
                      /> */}
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >      
                  <Link
                      href={{
                        pathname: '/group/[slug]',
                        query: { slug: group.slug },
                      }}
                    >
                        {/* <Avatar src={host+"/admin/auth/profile/"+group.avatar} >
                          {getInitials(group.username)}
                        </Avatar> */}
                        </Link>
                        <Typography variant="subtitle2">
                          {group.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{color:'text.secondary'}}>
                    <span style={{color:'green'}}>{group.slug} </span> 
                    {!!group.isCopied && group.isCopied && isCopied ? <Badge color="primary"  badgeContent="copied" style={{marginBottom:'35px'}} /> : <></>}
                    <CopyOutlined onClick={() => { handleCopyClick(group.slug) }} />
                    </TableCell>
        
                    <TableCell>
                      {createdAt}
                    </TableCell>

                    <TableCell>
                                        
                      <Link
                            href={{
                              pathname: '/group/[slug]',
                              query: { slug: group.slug },
                            }}
                          >
                              <EditIcon sx = {{
                                  marginX : '5px',
                                  color : '#111927'
                            }}
                            titleAccess='Edit'
                            />   
                      </Link>
                      <DeleteIcon sx={ {
                        marginX : '5px',
                        color : 'Red'
                        
                        } }  titleAccess='delete' onClick={(e)=>{
                          setSlug(group.slug)
                          setRowIndex(index)
                          setMessage("We are going to delete this group. if you agree press agree otherwise press disagree.")
                          setAction("delete")
                          confirmBox()
                          }} />
                    </TableCell>
                  </TableRow>

                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10,15,25]}
      />
    </Card>

   
    <Dialog
        fullScreen={fullScreen}
        open={confirm}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
           {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={()=>takeAction(action)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    
    </>


  );
};

GroupTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
