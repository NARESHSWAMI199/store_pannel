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
import { useEffect, useState } from 'react';
import CopyButton from 'src/components/CopyButton';
import { getInitials } from 'src/utils/get-initials';
import { itemImage, rowsPerPageOptions, toTitleCase } from 'src/utils/util';

export const ItemsTable = (props) => {
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
  const [status,setStatus] = useState('')
  const [action,setAction] = useState('')
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const changeInStock = (slug,inStock) => {
      props.onChangeInStock(slug,inStock)
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
      props.onDelete(slug)
    }else if (action == 'status'){
      changeStatus(slug,status)
    }else if (action == 'stock'){
      changeInStock(slug,status)
    }
    setConfirm(false)
  }

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

                <TableCell sx={{width: '10%'}}>
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
                 
                    {!!item.avtar ? 
                      <Image 
                        src={itemImage+item.slug+"/"+item.avtars?.split(',')[0]} 
                        style={{borderRadius : "50%" , width:"50px", height : "50px" }}
                      />  
                      : 
                      <Avatar src={itemImage+item.slug+"/"+item.avtars?.split(',')[0]} >
                        {getInitials(item.name)}
                      </Avatar>
                    }
                   
                      <Typography variant="subtitle2">
                      {toTitleCase(item.name)}
                    </Typography>
                         
                      </Stack>
                    </TableCell>
               
       
                   <TableCell sx={{ color: 'text.secondary' }}>
                      <span style={{ color: 'green' }}>{item.slug} </span>
                      <CopyButton text={item.slug} />
                    </TableCell>

                    <TableCell align='center'>
                        {item.label === "O" && 
                          <Badge 
                            color="error" 
                            badgeContent={'Old'} 
                          />}
                        {item.label === "N" && 
                          <Badge 
                            color="success" 
                            badgeContent={'New'} 
                          />}
                    </TableCell>
                    <TableCell>
                        <Rating 
                          name="read-only" 
                          value={item.rating} 
                          readOnly 
                        />
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
                     {item.inStock !== 'Y' ? 
                      <CancelIcon 
                        sx={{ marginX : '2px', color : 'Red' }}  
                        titleAccess='In stock' 
                        onClick={(e)=> {
                          setMessage("We are going to add the item in stock.")
                          setSlug(item.slug)
                          setStatus('Y')
                          setAction('stock')
                          confirmBox()
                        }} 
                      />
                      : 
                      <CheckCircleIcon 
                        sx={{ marginX : '2px', color : 'Green' }} 
                        titleAccess='Out of stock' 
                        onClick={(e)=> {
                          setMessage("We are going to remove item from the stock.")
                          setSlug(item.slug)
                          setStatus('N')
                          setAction('stock')
                          confirmBox()
                        }} 
                      />
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
                      <VisibilityIcon 
                        sx={{ marginX : '5px', color : '#111927' }}
                        titleAccess='Edit'
                      />   
                    </Link>



                      <Link
                        href={{
                          pathname: '/items/update/[slug]',
                          query: { slug: item.slug },
                        }}
                      >
                        <EditIcon 
                          sx={{ marginX : '5px', color : '#111927' }}
                          titleAccess='Edit'
                        />   
                      </Link>
                      <DeleteIcon 
                        sx={{ marginX : '5px', color : 'Red' }}  
                        titleAccess='delete' 
                        onClick={(e)=>{
                          setSlug(item.slug)
                          setRowIndex(index)
                          setMessage("We are going to delete this item if you agree press agree otherwise press disagree.")
                          setAction("delete")
                          confirmBox()
                        }} 
                      />
                    </TableCell>
                  </TableRow>

                );
              })}

              {items.length === 0  && 
                <TableRow>
                  <TableCell
                    colSpan={10}
                    sx={{
                      textAlign: 'center',
                      py: 3
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      variant="body1"
                    >
                      No items found
                    </Typography>
                  </TableCell>
                </TableRow>
              }

            </TableBody>
          </Table>
        </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={!!rowsPerPage ? rowsPerPage : rowsPerPageOptions[0]}
        rowsPerPageOptions={rowsPerPageOptions}
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
          <Button 
            autoFocus 
            onClick={handleClose}
          >
            Disagree
          </Button>
          <Button 
            onClick={()=>takeAction(action)} 
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    
    </>


  );
};

ItemsTable.propTypes = {
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
