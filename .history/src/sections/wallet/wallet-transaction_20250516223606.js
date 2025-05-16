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
import { ru } from 'date-fns/locale';
  import PropTypes from 'prop-types';
  import { useEffect, useState } from 'react';
import CopyButton from 'src/components/CopyButton';
  import { getInitials } from 'src/utils/get-initials';
  import { rowsPerPageOptions, ruppeeIcon, toTitleCase, userImage } from 'src/utils/util';
  
  export const WalletTransactions = (props) => {
    const {
      count = 0,
  
      onPageChange = () => {},
      onRowsPerPageChange,
      page = 0,
      rowsPerPage = 0,
    } = props;
    const [transactions,setTransactions] = useState(props.transactions)
 

    useEffect(()=>{
      if(!!props.transactions){
        setTransactions(props.transactions)
      }
    },[props.transactions])
  
  
    return ( <>
      <Card sx={{overflowX: 'auto'}}>
          <Box sx={{ minWidth: 800}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                  </TableCell>
                    <TableCell>Payment Id</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Created At</TableCell>
                    <TableCell align="center">Payment Type</TableCell>
                    <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ?  transactions.map((transaction,index) => {
                  const createdAt = format(parseInt(transaction.createdAt), 'dd/MM/yyyy');
                  return (
                    <TableRow
                      hover
                      key={transaction.id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                            {toTitleCase(transaction?.slug)}
                            <CopyButton text={transaction?.slug}/>
                        </Typography>
                      </TableCell>
                 
         
                     <TableCell align="center">
                        <Typography variant="subtitle2" sx={{ fontWeight : 'bold', color: transaction?.transactionType === "CR" ? "green" : "red"}}>
                          {transaction?.transactionType === "CR" ? "+" : "-"}
                        {transaction.amount} {ruppeeIcon}
                        </Typography>
                    </TableCell>

                      <TableCell align="center">{createdAt}</TableCell>
                      <TableCell align="center">
                        {transaction.status === "CR" ? (
                          <Badge badgeContent={'Credit'} color="success" />
                        ) : (
                          <Badge badgeContent={'Debit'} color="error" />
                        )}
                      </TableCell>
                
                        <TableCell align="center">{createdAt}</TableCell>
                          <TableCell align="center">
                            {transaction.status === "S" ? (
                              <Badge badgeContent={'Sucess'} color="success" />
                            ) : (
                              <Badge badgeContent={'Failed'} color="error" />
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
  
  WalletTransactions.propTypes = {
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
  

