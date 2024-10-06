import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {  Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { host } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { CustomerHeaders } from 'src/sections/customer/customers-header';
import { StoresCard } from 'src/sections/wholesale/stores-table';


const now = new Date();

const Page = () => {

  const [open,setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")

  const auth = useAuth()
  const [error,setErrors] = useState("")
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stores,setStores] = useState([{}])
  const[deleted , setDeleted] = useState(false)
  
  const [data,setData] = useState({
    pageNumber : page,
    size : rowsPerPage
  })

  const [totalElements , setTotalElements] = useState(0)

  useEffect( ()=>{
    const getData = async () => {
       axios.defaults.headers = {
         Authorization : auth.token
       }
       await axios.post(host+"/admin/store/all",data)
       .then(res => {
          const response = res.data.content;
          setTotalElements(res.data.totalElements)
          setStores(response);
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
    axios.post(host+`/admin/store/status`,{
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
    }).catch(err => {
      console.log(err)
      setFlag("error")
      setMessage(!!err.response ? err.response.data.message : err.message)
      setOpen(true)
    } )
  }
  

  const udpateDeltedStore = (slug)=>{
    setStores((stores)=> stores.filter((storeItem) => storeItem.slug !==slug ) )
  }


  
  const onDelete = (slug) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.get(host+`/admin/store/delete/${slug}`)
    .then(res => {
        setFlag("success")
        setMessage(res.data.message)
        setDeleted(true)
        setOpen(true)
        udpateDeltedStore(slug)
    }).catch(err => {
      console.log(err)
      setMessage(err.message)
      setFlag("error")
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


  const onSearch = useCallback (
    (searchData) => {
    setData({
      ...data,
      ...searchData
    })
  },[] 
  )



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
            <CustomerHeaders  headerTitle={"All Store"}/>
            <CustomersSearch  onSearch={onSearch} userType="" />

          {stores.size > 0 ? stores.map((store,i) =>{
             return(<StoresCard key={i} 
              updateStatus={onStatusChange}
              deleteStore={onDelete}
              store={store}  />)
          } ) : <></>}


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
