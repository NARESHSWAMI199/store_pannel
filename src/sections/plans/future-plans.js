import {
    Badge,
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import { rowsPerPageOptions, toTitleCase } from 'src/utils/util';
import CopyButton from 'src/components/CopyButton';  
  export const FuturePlans = (props) => {
    const {
      count = 0,
      onActivate,
      onPageChange = () => {},
      onRowsPerPageChange,
      page = 0,
      rowsPerPage = 0,
    } = props;
    const [plans,setPlans] = useState(props.plans)
    // Add state for the confirmation dialog
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null); // To store the plan to be activated


      // Function to handle opening the confirmation dialog
      const handleConfirmDialogOpen = (plan) => {
        setSelectedPlan(plan);
        setConfirmDialogOpen(true);
      };

      // Function to handle closing the confirmation dialog
      const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setSelectedPlan(null);
      };


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
                    <TableCell width={'20%'}>Pland Id</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Months</TableCell>
                    <TableCell align="center">Purchased At</TableCell>
                    <TableCell align="right">Activate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.length > 0 ?  plans.map((plan,index) => {
                  const createdAt = format(plan.createdAt ? parseInt(plan.createdAt) : 0, 'dd/MM/yyyy');
                  return (
                    <TableRow
                      hover
                      key={plan?.slug}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                            {toTitleCase(plan?.servicePlan?.name)}
                        </Typography>
                      </TableCell>

                    <TableCell sx={{ color: 'text.secondary' }}>
                      <span style={{ color: 'green' }}>{plan?.slug} </span>
                      <CopyButton text={plan?.slug} />
                    </TableCell>
                 
         
                     <TableCell align="center">
                            {plan.price === 0 ? (
                              <Badge badgeContent={'Free'} color="success" />
                            ) : (
                              plan.servicePlan?.price
                            )}
                    </TableCell>
                
                      <TableCell align="center">
                          {plan?.servicePlan?.months}
                      </TableCell>

                        <TableCell align="center">{createdAt}</TableCell>

                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => {
                                handleConfirmDialogOpen(plan);
                              }}
                            >
                              Activate
                            </Button>
                          </TableCell>

                  </TableRow>
                )})
              :
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No future plans found.
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
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Activation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Do you want to set this plan as your active plan? If you activate this plan, it will replace your current active plan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={()=>{
            onActivate(selectedPlan)
            handleConfirmDialogClose(); // Close the dialog after activation
          }
          } color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      </>
  
  
    );
  };
  
  FuturePlans.propTypes = {
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
  

