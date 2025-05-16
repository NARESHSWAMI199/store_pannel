import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TextField, Unstable_Grid2 as Grid, Snackbar, Alert, Container, Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {host} from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { WalletTransactions } from "src/sections/wallet/wallet-transaction";
const Page = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState("success");
  const auth = useAuth();
  const [values, setValues] = useState({
    amount: "",
  });
  const [transactions, setTransactions] = useState([]);

  const paginations = auth.paginations
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(paginations?.ITEMS?.rowsNumber);
  const itemSlugs = UseitemSlugs(items);
  const itemsSelection = useSelection(itemSlugs);
  const [totalElements, setTotalElements] = useState(0)


   const [data, setData] = useState({
          pageNumber: page,
          size: !!rowsPerPage ? parseInt(rowsPerPage) : rowsPerPageOptions[0]
      })
  
      useEffect(()=>{
          setData((previous)=>({...data , storeId : wholesale?.id}))
      },[])
      


  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  }, []);




  useEffect(() => {
    axios.defaults.headers = {
      Authorization: auth.token
    } 
    axios.post(host + "/wholesale/wallet/transactions/all",{})
      .then(res => {
        const data = res.data.content;
        setTransactions(data);
      })
      .catch(err => {
        console.log(err);
        setMessage(!!err.response ? err.response?.data.message : err.message);
        setFlag("error");
        setOpen(true);
      });
  },[]);



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.amount) {
      setMessage("Please fill in all fields");
      setFlag("error");
      setOpen(true);
      return;
    }
    // Call API to add money to wallet
    console.log(`Adding ${values.amount} to wallet`);
    window.location.href = host + "/cashfree/pay/"+ encodeURIComponent(auth.token.replace("Bearer ", ""))+"?amount="+values.amount;
    
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  });


  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      setData({ ...data, pageNumber: value })
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );



  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Grid xs={12} md={6} lg={8}>
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Card>
                <CardHeader subheader="From here you can add money to your wallet." title="Add Money to Wallet" />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ m: -1.5 }}>
                    <Grid container spacing={3}>
                      <Grid xs={12} md={12}>
                        <TextField
                          fullWidth
                          label="Amount"
                          name="amount"
                          onChange={handleChange}
                          required
                          value={values.amount}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained">
                    Add Money
                  </Button>
                </CardActions>
              </Card>
            </form>

          <Box>
            <Card sx={{ mt: 3 }}>
              <CardHeader title="Wallet Transactions" />
              <CardContent>
                <Box sx={{ minWidth: 800 }}>
                  <WalletTransactions  
                      transactions={transactions}
                      count={totalElements}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      selected={itemsSelection.selected}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          </Grid>
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} onClose={handleClose} key={'top' + 'right'}>
            <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;