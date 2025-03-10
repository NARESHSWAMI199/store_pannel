import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Alert, Avatar, Box, Button, Container, Snackbar, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import axios from 'axios';
import { host, rowsPerPageOptions, toTitleCase } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { ItemsTable } from 'src/sections/wholesale/wholesale-table';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DialogFormForExcelImport from 'src/layouts/excel/import-excel';
import { StoresCard } from 'src/sections/wholesale/stores-table';
import { BasicSearch } from 'src/sections/basic-search';
import { ReloadOutlined } from '@ant-design/icons';
import { ArrowButtons } from 'src/layouts/arrow-button';
import { ItemHeaders } from 'src/sections/items-header';

const UseitemSlugs = (items) => {
    return useMemo(
        () => {
            return items.map((item) => item.slug);
        },
        [items]
    );
};


const Page = () => {


    /** snackbar varibatles */


    const [open, setOpen] = useState()
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("warning")

    const router = useRouter()
    const searchParams = useSearchParams();
    const stock = searchParams.get('stock');
    const auth = useAuth();
    const paginations = auth.paginations;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState();
    const [items, setItems] = useState([])
    const itemSlugs = UseitemSlugs(items);
    const itemsSelection = useSelection(itemSlugs);
    const [totalElements, setTotalElements] = useState(0)
    const [wholesale, setWholesale] = useState(auth.store)
    const [title,setTitle] = useState("Items")
    
    
    const [data, setData] = useState({
        inStock : stock,
        pageNumber: page,
        size:  !!rowsPerPage ? rowsPerPage : rowsPerPageOptions[0]
    })

    // setting default rows per page item
    useEffect(()=>{
        if(stock !== 'Y'){
            setRowsPerPage(paginations?.OUTOFSTOCK?.rowsNumber)
            setTitle("Out Of Stock")
        }else{
            setRowsPerPage(paginations?.INSTOCK?.rowsNumber)
            setTitle("In Stock")
        }
    },[stock])


    useEffect(()=>{
        setData((previous)=>({...data , 
            inStock : stock,
            storeId : wholesale?.id}))
    },[stock])
    


    useEffect(() => {
        const getData = async () => {
            axios.defaults.headers = {
                Authorization: auth.token
            }
            await axios.post(host + "/wholesale/item/all", data)
                .then(res => {
                    const data = res.data.content;
                    setTotalElements(res.data.totalElements)
                    setItems(data);
                })
                .catch(err => {
                    setMessage(!!err.response ? err.response.data.message : err.message)
                    setFlag("error")
                    setOpen(true)
                    let status = (!!err.response ? err.response.status : 0);
                    if (status == 401) {
                      auth.signOut();
                      router.push("/auth/login")
                    }
                })
        }
        getData();

    }, [data, page, rowsPerPage])



    const importItemExcelSheet = async (e) => {
        let success = false
        let form = e.target;
        var formData = new FormData(form);
        axios.defaults.headers = {
            Authorization: auth.token
        }
        await axios.post(host + '/wholesale/item/importExcel/' + wholesale?.slug, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            setMessage(res.data.message)
            setFlag("success")
            setOpen(true)
        })
            .catch(err => {
                setMessage(!!err.response ? err.response.data.message : err.message)
                setFlag("error")
                setOpen(true)
            })
      
        return success;
    }






 

    const onChangeInStock = (slug, inStock) => {
        axios.defaults.headers = {
            Authorization: auth.token
        }
        axios.post(host + `/wholesale/item/stock`, {
            slug: slug,
            stock: inStock
        })
            .then(res => {
                if (inStock === "Y") {
                    setFlag("success")
                    setMessage("Successfully added in stock.")
                } else {
                    setFlag("warning")
                    setMessage("Successfully removed from stock.")
                }
                setItems((items) => {
                    items.filter((_) => {
                      if(_.slug === slug) return _.inStock = inStock
                      return _;
                    })
                    return items
                });
                setOpen(true)
            }).catch(err => {
                setMessage(!!err.response ? err.response.data.message : err.message)
                setFlag("error")
                setOpen(true)
            })
    }


    const onDelete = (slug) => {
        axios.defaults.headers = {
            Authorization: auth.token
        }
        axios.post(host + `/wholesale/item/delete`,
            {
                slug: slug
            }
        )
            .then(res => {
                setFlag("success")
                setMessage(res.data.message)
                setOpen(true)
                setItems((items) =>items.filter((_) => _.slug !== slug));
            }).catch(err => {
                console.log(err)
                setMessage(!!err.respone ? err.response.data.message : err.message)
                setFlag("error")
                setOpen(true)
            })
    }


    /** for snackbar close */
    const handleClose = () => {
        setOpen(false)
    };


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


    const onSearch = (searchData) => {
        if(!!searchData){
            setData({
                ...data,
                ...searchData,
            })
        }else{
            setData({
                pageNumber: page,
                size: rowsPerPage,
                inStock : stock,
            })
        }
    }

    return (
        <>

            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                    {toTitleCase(wholesale?.storeName)} | Swami Sales
                </title>
            </Head>
            <Box

                component="main"
                sx={{
                    flexGrow: 1,
                    py :8
                }}
            >
                 <Container maxWidth="xxl" sx={{
                    px : {
                            xs : 1,
                            sm : 1,
                            md : 1,
                            lg : 5,
                            xl : 5
                        } 
                    }}>
                    <Stack spacing={3}>

                        <ItemHeaders headerTitle={title} searchFilters ={data} />

                        <BasicSearch onSearch={onSearch} type="item" />
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
                            onChangeInStock={onChangeInStock}
                            onDelete={onDelete}
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
