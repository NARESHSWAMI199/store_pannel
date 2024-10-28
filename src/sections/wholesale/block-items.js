import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DeleteIcon from '@mui/icons-material/Delete';
import DiscountIcon from '@mui/icons-material/Discount';
import {
  Avatar,
  Badge,
  Box,
  Card,
  Checkbox,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { CopyOutlined } from '@ant-design/icons';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Image } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { itemImage, toTitleCase } from 'src/utils/util';

export const BlockedItems = (props) => {
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
  const [isCopied, setIsCopied] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
        setItems((items).filter(customer => {
         if(customer.slug == slug){
          customer.isCopied = true
          setIsCopied(true);
         }
         return customer
      }))
        setTimeout(() => {
          setItems((items).filter(customer => {
            if(customer.slug == slug){
             customer.isCopied = false
             setIsCopied(false);
            }
            return customer
         }))
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
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



  return ( <>
    <Card>
        <Box sx={{overflow : 'auto'}}>
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
                  Token
                </TableCell>

                <TableCell>
                  label
                </TableCell>

                <TableCell>
                  Rating
                </TableCell>
         
                <TableCell>
                 M.R.P
                </TableCell>

                <TableCell>
                  Discount
                </TableCell>

                <TableCell>
                  Price
                </TableCell>

                <TableCell>
                  Stock
                </TableCell>

                <TableCell>
                  Created at
                </TableCell>

                <TableCell>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item,index) => {
                const isSelected = selected.includes(item.slug);
                const createdAt = format(item.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={item.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(item.slug);
                          } else {
                            onDeselectOne?.(item.slug);
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
                 
                    {!!item.avtar ? <Image src={itemImage+item.slug+"/"+item.avtar} style={{borderRadius : "50%" , width:"50px", height : "50px" }}/>  : 
                        <Avatar src={itemImage+item.slug+"/"+item.avtar} >
                          {getInitials(item.name)}
                        </Avatar>
                        }
                   
                      <Typography variant="subtitle2">
                      {toTitleCase(item.name)}
                    </Typography>
                         
                      </Stack>
                    </TableCell>
               
       
                    <TableCell sx={{color:'text.secondary'}}>
                     <span style={{color:'green'}}>{item.slug} </span> 
                      {!!item.isCopied && item.isCopied && isCopied ? <Badge color="primary"  badgeContent="copied" style={{marginBottom:'35px'}} /> : <></>}
                      <CopyOutlined onClick={() => { handleCopyClick(item.slug) }} />
                    </TableCell>

                    <TableCell align='center'>
                        {item.label === "O" && <Badge color="error" badgeContent={'Old'} />}
                        {item.label === "N" && <Badge color="success" badgeContent={'New'} />}
                    </TableCell>
                    <TableCell>
                        <Rating name="read-only" value={item.rating} readOnly />
                    </TableCell>

                    <TableCell>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        {item.price}
                      <CurrencyRupeeIcon sx={{fontSize:'15px',mt:'20px'}}/>
                      </Stack>
                    </TableCell>


                    <TableCell>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        {item.discount}
                      <CurrencyRupeeIcon sx={{fontSize:'15px',mt:'20px'}}/>
                      <DiscountIcon sx={{color:'red',fontSize:'20px',mt:'20px',px:'0px'}} />

                      </Stack>
                    </TableCell>
                    <TableCell>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        {item.price-item.discount}
                      <CurrencyRupeeIcon sx={{fontSize:'15px',mt:'20px'}}/>
                      </Stack>
                    </TableCell>

                    
                    <TableCell>
                     {item.inStock !== 'Y' ? <CancelIcon sx={ {
                        marginX : '2px',
                        color : 'Red'
                        
                        } }  titleAccess='In stock'  />

                      : 
                      <CheckCircleIcon sx={ {
                        marginX : '2px',
                        color : 'Green'
                        
                        } } titleAccess='Out of stock' />
                      }
                    </TableCell>

                    <TableCell>
                      {createdAt}
                    </TableCell>

                    <TableCell>
                                        

                    <Link
                            href={{
                              pathname: '/items/comments/[slug]',
                              query: { slug: item.slug },
                            }}
                          >
                              <VisibilityIcon sx = {{
                                  marginX : '5px',
                                  color : '#111927'
                            }}
                            titleAccess='Edit'
                            />   
                      </Link>

                      <EditIcon sx = {{
                              marginX : '5px',
                              color : '#111927'
                        }}
                        titleAccess='Edit'
                        />   
                     
                      <DeleteIcon sx={ {
                        marginX : '5px',
                        color : 'Red'
                        
                        } }  titleAccess='delete'  />
                    </TableCell>
                  </TableRow>

                );
              })}
            </TableBody>
          </Table>
        </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[1, 10, 25]}
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

BlockedItems.propTypes = {
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
