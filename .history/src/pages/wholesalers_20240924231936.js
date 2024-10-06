import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {  Alert, Box, Container, Snackbar, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { host } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { CustomerHeaders } from 'src/sections/customer/customers-header';






const now = new Date();


const useCustomers = (content,page,rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(content, page, rowsPerPage);
    },
    [page, rowsPerPage]
  )
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};


const Page = () => {


  /** snackbar varibatles */

  const [open,setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")


  const auth = useAuth()
  let [status,setStatus] = useState(null)
  const [error,setErrors] = useState("")
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customers,setCustomers] = useState([])
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [deleted,setDeleted] = useState(false);
  const [data,setData] = useState({
    userType : "W",
    pageNumber : page,
    size : rowsPerPage
  })

  const [totalElements , setTotalElements] = useState(0)

  useEffect( ()=>{
    const getData = async () => {
       axios.defaults.headers = {
         Authorization : auth.token
       }
       await axios.post(host+"/admin/auth/all",data)
       .then(res => {
          const data = res.data.content;
           setTotalElements(res.data.totalElements)
           setCustomers(data);
       })
       .catch(err => {
         setFlag("error")
         setMessage(!!err.response ? err.response.data.message : err.message)
         setOpen(true)
       } )
     }
    getData();

   },[data,page,rowsPerPage])



  const onStatusChange = (slug,status) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.post(host+`/admin/auth/status`,{
      slug : slug,
      status : status
    })
    .then(res => {
      if (status === "A") {
        setFlag("success")
        setMessage("Successfully activated.")
      }else {
        setFlag("warning")
        setMessage("Successfully deactivated.")
      }
      setOpen(true)
      setStatus(status)
    }).catch(err => {
      console.log(err)
      setFlag("error")
      setMessage(!!err.response ? err.response.data.message : err.message)
      setOpen(true)
    } )
  }
  

  
  const onDelete = (slug) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.get(host+`/admin/auth/delete/${slug}`)
    .then(res => {
        setFlag("success")
        setMessage(res.data.message)
        setDeleted(true)
        setOpen(true)
    }).catch(err => {
      console.log(err)
      setFlag("error")
      setMessage(!!err.response ? err.response.data.message : err.message)
      setOpen(true)
    } )
  }
  

  /** for snackbar close */
  const handleClose = () => {
    setOpen(false)
  };


  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      setData({...data, pageNumber : value})
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );


  const onSearch = (searchData) => {
    setData({
      ...data,
      ...searchData,
      userType : "W"
    })
  } 

  return (
    <>

    <Snackbar anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
        open={open}
        onClose={handleClose}
        key={'top' + 'right'}
      >
     <Alert onClose={handleClose} severity={flag} sx={{ width: '100%' }}>
        {message}
    </Alert>
    </Snackbar>
      <Head>
        <title>
          Wholesaler | Swami Sales
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
        
          <CustomerHeaders  headerTitle={"Wholesalers"}/>
            <CustomersSearch  onSearch={onSearch} />

             <CustomersTable
              count={totalElements}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
              onStatusChange = {onStatusChange}
              onDelete = {onDelete}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
