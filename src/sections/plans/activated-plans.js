import {
    Avatar,
    Badge,
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
  
  export const ActivatedPlans = (props) => {
    const {
      count = 0,
  
      onPageChange = () => {},
      onRowsPerPageChange,
      page = 0,
      rowsPerPage = 0,
    } = props;
    const [plans,setPlans] = useState(props.plans)
    const current = new Date().getTime();

    useEffect(()=>{
      if(!!props.plans){
        console.log("props.plans.length : "+JSON.stringify(props.plans) )
        setPlans(props.plans)
      }
    },[props.plans])
  
  
    return ( <>
      <Card sx={{overflowX: 'auto'}}>
          <Box sx={{ minWidth: 800}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                  </TableCell>
                    <TableCell>Plan Name</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Months</TableCell>
                    <TableCell align="center">Purchased At</TableCell>
                    <TableCell align="center">Expired At</TableCell>
                    <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.length > 0 ?  plans.map((plan,index) => {
                  const createdAt = format(parseInt(plan.createdAt), 'dd/MM/yyyy');
                  const expiryDate = format(parseInt(plan.expiryDate), 'dd/MM/yyyy');
                  return (
                    <TableRow
                      hover
                      key={plan.id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                            {toTitleCase(plan.servicePlan?.name)}
                        </Typography>
                      </TableCell>
                 
         
                     <TableCell align="center">
                            {plan.price === 0 ? (
                              <Badge badgeContent={'Free'} color="success" />
                            ) : (
                              plan.servicePlan?.price
                            )}
                    </TableCell>
                
                      <TableCell align="center">
                          {plan.servicePlan?.months}
                      </TableCell>

                        <TableCell align="center">{createdAt}</TableCell>
                          <TableCell align="center">{expiryDate}</TableCell>
                          <TableCell align="center">
                            {plan.expiryDate > current ? (
                              <Badge badgeContent={'Active'} color="success" />
                            ) : (
                              <Badge badgeContent={'Expired'} color="error" />
                            )}
                          </TableCell>

                  </TableRow>
                )})
              :
              <TableRow>
                <TableCell colSpan={6} align="center">
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
  
  ActivatedPlans.propTypes = {
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
  

