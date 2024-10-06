import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {  Alert, Avatar, Box, Button, Container, Snackbar, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { host, toTitleCase } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { ItemsTable } from 'src/sections/wholesale/wholesale-table';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getInitials } from 'src/utils/get-initials';
import { Image } from 'antd';
import DialogFormForExcelImport from 'src/layouts/excel/import-excel';

const now = new Date();


const useitems = (content,page,rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(content, page, rowsPerPage);
    },
    [page, rowsPerPage]
  )
};

const useitemSlugs = (items) => {
  return useMemo(
    () => {
      return items.map((item) => item.slug);
    },
    [items]
  );
};


const Page = () => {


  /** snackbar varibatles */

  const router = useRouter()
  const {slug} = router.query

  const [open,setOpen] = useState()
  const [message, setMessage] = useState("")
  const [flag, setFlag] = useState("warning")

  const auth = useAuth()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [items,setItems] = useState([])
  const itemSlugs = useitemSlugs(items);
  const itemsSelection = useSelection(itemSlugs);
  const [totalElements , setTotalElements] = useState(0)
  const [wholesale , setWholesale] = useState({})


  const [data,setData] = useState({
    pageNumber : page,
    size : rowsPerPage
  })

  /** Get wholesale using user slug. */
  useEffect(()=>{
    const updateStoreId = async() => {
        axios.defaults.headers = {
            Authorization : auth.token
        }
        await axios.get(host+'/admin/store/detailbyuser/'+slug)
        .then(res => {
            setWholesale(res.data.res)
            setData({...data, storeId : res.data.res.id})
        })
        .catch(err =>{
            setMessage(!!err.response ? err.response.data.message : err.message)
            setOpen(true)
        })
    }
    updateStoreId()
  },[])



    useEffect(()=>{
    const getData = async () => {
       axios.defaults.headers = {
         Authorization : auth.token
       }
       await axios.post(host+"/admin/item/all",data)
       .then(res => {
          const data = res.data.content;
           setTotalElements(res.data.totalElements)
           setItems(data);
       })
       .catch(err => {
         setMessage(err.message)
         setOpen(true)
       } )
     }
    getData();

   },[data,page,rowsPerPage])



   const  importItemExcelSheet = async (e) =>{
    let success = false
    let form = e.target;
    var formData = new FormData(form);
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    await axios.post(host+'/admin/item/importExcel/'+ wholesale.slug , formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
      setMessage(res.data.message)
      setFlag("success")
    })
    .catch(err => {
      setFlag("error")
      console.log(err)
      setMessage(err.response.data.message)
    })
    setOpen(true)
    return success;
   }


  const onStatusChange = (slug,status) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.post(host+`/admin/item/status`,{
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
    } )
  }
  


  const onChangeInStock = (slug,inStock) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.post(host+`/admin/item/stock`,{
      slug : slug,
      stock : inStock
    })
    .then(res => {
      if (inStock === "Y") {
        setFlag("success")
        setMessage("Successfully added in stock.")
      }else {
        setFlag("warning")
        setMessage("Successfully removed from stock.")
      }
      setOpen(true)
    }).catch(err => {
      console.log(err)
    } )
  }
  
  
  const onDelete = (slug) => {
    axios.defaults.headers = {
      Authorization :  auth.token  
    }
    axios.get(host+`/admin/item/delete/${slug}`)
    .then(res => {
        setFlag("success")
        setMessage(res.data.message)
        setOpen(true)
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


  const onSearch = (searchData) => {
    setData({
      ...data,
      ...searchData,
      userType : "R"
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
         {toTitleCase(wholesale.storeName)} | Swami Sales
        </title>
      </Head>
      <Box
      
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack 
              spacing={1}>
              <Stack
                direction={'row'}
                spacing={2}
              >
                  {!!wholesale.avtar ? <Image style={{height:'60px', width:'60px',borderRadius:"50%"}} src={wholesale.avtar} /> :
                  <Avatar sx={{height:'60px', width:'60px'}} src={wholesale.avtar} >
                              {getInitials(wholesale.storeName)}
                  </Avatar>
                   }
                    <Typography variant="h2">
                    {wholesale.storeName ? (wholesale.storeName).substring(0,1).toUpperCase()+ (wholesale.storeName).substring(1) : wholesale.storeName}
                    </Typography>
                </Stack>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <DialogFormForExcelImport importExcelSheet={importItemExcelSheet}  />
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
              <Link
                      href={{
                        pathname: '/item/create/[slug]/[us]',
                        query: { slug: wholesale.slug ,
                            us : slug
                        },
                      }}>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                     Add
                </Button>
                </Link>
              </div>
            </Stack>

            <ItemsTable
              count={totalElements}
              items={items}
              onDeselectAll={itemsSelection.handleDeselectAll}
              onDeselectOne={itemsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={itemsSelection.handleSelectAll}
              onSelectOne={itemsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={itemsSelection.selected}
              onStatusChange = {onStatusChange}
              onChangeInStock = {onChangeInStock}
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
