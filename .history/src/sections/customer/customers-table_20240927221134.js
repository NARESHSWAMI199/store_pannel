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
import { host, toTitleCase } from 'src/utils/util';


export const CustomersTable = (props) => {
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const changeStatus = (slug,status) => {
    setItems((items) => {
        items.filter((_, index) => {
          if(_.slug === slug) return _.status = status
          return _;
        })
        return items
    });
      props.onStatusChange(slug,status)
  }


  useEffect(()=>{
    setItems(props.items)
  },[props.items])

  

  const handleClose =  () =>{
      setConfirm(false)
  }
  const confirmBox = () => {
    setConfirm(true)
  };

  const takeAction = (action) =>{
    if (action === 'delete'){
      setItems((items) =>items.filter((_, index) => index !== rowIndex));
      props.onDelete(slug)
    }else if (action == 'status'){
      changeStatus(slug,status)
    }
    setConfirm(false)
  }

  return ( <>
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  TOKEN ID
                </TableCell>
                <TableCell>
                  USER TYPE
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                {/* <TableCell>
                  Location
                </TableCell> */}
                <TableCell>
                  Phone
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Signed Up
                </TableCell>
                <TableCell>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer,index) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={customer.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.slug);
                          } else {
                            onDeselectOne?.(customer.slug);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >      
                  <Link
                      href={{
                        pathname: '/account/[slug]',
                        query: { slug: customer.slug },
                      }}
                    >
                        <Avatar src={host+"/admin/auth/profile/"+customer.avatar} >
                          {getInitials(customer.username)}
                        </Avatar>
                        </Link>
                        <Typography variant="subtitle2">
                          {toTitleCase(customer.username)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{color:'green'}}>
                      {customer.slug}
                    </TableCell>
                    <TableCell align='center'>
                        {customer.userType === "R" && <Badge color="error" badgeContent={'Retailer'} />}

                        {customer.userType === "W" && 
                          <Link
                                href={{
                                  pathname: '/stores/[slug]',
                                  query: { slug: customer.slug },
                                }}
                              >
                        <Badge color="success" badgeContent={'Wholesaler'} />
                        </Link>
                        }
                        
                        {customer.userType === "S" && <Badge color="primary" badgeContent={'Staff'} />}
                    </TableCell>
                    <TableCell>
                      {customer.email}
                    </TableCell>
                    {/* <TableCell>
                      {customer.address.city}, {customer.address.state}, {customer.address.country}
                    </TableCell> */}
                    <TableCell>
                      {customer.contact}
                    </TableCell>


                    <TableCell>
                      {/* {setStatus(customer.status)} */}
                     {customer.status !== 'A' ? <CancelIcon sx={ {
                        marginX : '2px',
                        color : 'Red'
                        
                        } }  titleAccess='activate' onClick={(e)=> {
                          setMessage("We are going to activate this user.")
                          setSlug(customer.slug)
                          setStatus('A')
                          setAction('status')
                          confirmBox()
                        }} />

                      : 
                      <CheckCircleIcon sx={ {
                        marginX : '2px',
                        color : 'Green'
                        
                        } } titleAccess='deactivate' onClick={(e)=> {
                          setMessage("We are going to deactivate this user.")
                          setSlug(customer.slug)
                          setStatus('D')
                          setAction('status')
                          confirmBox()
                        }} />
                      }
                    </TableCell>

                    <TableCell>
                      {createdAt}
                    </TableCell>

                    <TableCell>
                                        
                      <Link
                            href={{
                              pathname: '/account/[slug]',
                              query: { slug: customer.slug },
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
                          setSlug(customer.slug)
                          setRowIndex(index)
                          setMessage("We are going to delete this user if user type is wholesaler then user's store will also delete. if you agree press agree otherwise press disagree.")
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

CustomersTable.propTypes = {
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
