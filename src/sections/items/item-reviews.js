import {
    Avatar,
    Box,
    Card,
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
  import { useEffect, useState } from 'react';
  import { getInitials } from 'src/utils/get-initials';
  import { rowsPerPageOptions, toTitleCase, userImage } from 'src/utils/util';
  
  export const ItemReviews = (props) => {
    const {
      count = 0,
  
      onPageChange = () => {},
      onRowsPerPageChange,
      page = 0,
      rowsPerPage = 0,
      selected = []
    } = props;
    const [itemReviews,setItemReviews] = useState(props.itemReviews)
  
    useEffect(()=>{
      if(!!props.itemReviews){
        console.log("props.itemReviews.length : "+JSON.stringify(props.itemReviews) )
        setItemReviews(props.itemReviews)
      }
    },[props.itemReviews])
  
  
    return ( <>
      <Card sx={{overflowX: 'auto'}}>
          <Box sx={{ minWidth: 800}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                  </TableCell>
                  <TableCell>
                    Username
                  </TableCell>
                  <TableCell>
                    Rating
                  </TableCell>
  
                  <TableCell>
                      Message
                  </TableCell>
  
                  <TableCell>
                    Commetnd At
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemReviews.length > 0 ?  itemReviews.map((itemReview,index) => {
                  const isSelected = selected.includes(itemReview.slug);
                  const createdAt = format(parseInt(itemReview.createdAt), 'dd/MM/yyyy');
                  return (
                    <TableRow
                      hover
                      key={itemReview.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >      
                   
                      {!!itemReview.user?.avtar ? <Image src={userImage+itemReview.user?.slug+"/"+itemReview.avatar} style={{borderRadius : "50%" , width:"50px", height : "50px" }}/>  : 
                          <Avatar src={userImage+itemReview.userSlug+"/"+itemReview.user?.avatar} >
                            {getInitials(itemReview.user?.username)}
                          </Avatar>
                          }
                     
                        <Typography variant="subtitle2">
                        {toTitleCase(itemReview.user?.username)}
                      </Typography>
                           
                        </Stack>
                      </TableCell>
                 
         
                     <TableCell>
                      <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Rating name="read-only" value={itemReview.rating} readOnly titleAccess="Rating" />
                        </Stack>
                    </TableCell>
                
                      <TableCell>
                          {itemReview.message}
                      </TableCell>
  
                      <TableCell>
                          {createdAt}
                      </TableCell>
                  </TableRow>
                )})
              :
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Item Reviews Found
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
      </>
  
  
    );
  };
  
  ItemReviews.propTypes = {
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
  