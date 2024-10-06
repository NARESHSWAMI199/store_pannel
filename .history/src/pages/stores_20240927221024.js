import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {  Alert, Box, Button, CardActions, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { BasicSearch, CustomersSearch } from 'src/sections/basic-search';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { host } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { CustomerHeaders } from 'src/sections/customer/customers-header';
import { StoresCard } from 'src/sections/wholesale/stores-table';
import { Divider } from 'antd';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import { useRouter } from 'next/router';
import { ro } from 'date-fns/locale';



const now = new Date();

const Page = () => {

  const [open,setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")

  const auth = useAuth()
  const router = useRouter()
  const {userSlug}  = router.query

  const [error,setErrors] = useState("")
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stores,setStores] = useState([])
  const [userStore, setUserStore] = useState({})
  const[deleted , setDeleted] = useState(false)
  const [storeSlug, setStoreSlug] = useState(null)
  
  const [data,setData] = useState({
    pageNumber : page,
    size : rowsPerPage,
    slug : storeSlug
  })

  const [totalElements , setTotalElements] = useState(0)


  /** Get wholesale using user slug. */
  useEffect(() => {
    const updateStoreId = async () => {
      axios.defaults.headers = {
        Authorization: auth.token
      }
      await axios.get(host + '/admin/store/detailbyuser/' + userSlug)
        .then(res => {
          let store = res.data.res;
          setUserStore(store)
          setStoreSlug(store.slug)
        })
        .catch(err => {
          setMessage(!!err.response ? err.response.data.message : err.message)
          setFlag('error')
          setOpen(true)
        })
    }
    updateStoreId()
  }, [])


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
      setMessage(!!err.response ? err.response.data.message : err.message)
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
  },[] )

  const getMore = () => {
    setData({
      ...data,
      size : data.size + 10
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
            <CustomerHeaders  headerTitle={"All Store"}/>
            <BasicSearch onSearch={onSearch} />

          {stores.map((store,i) =>{
             return(<StoresCard key={i} 
              deleteStore={onDelete}
              store={store}  />)
          } ) }


      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={getMore}
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View more
        </Button>
      </CardActions>
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
