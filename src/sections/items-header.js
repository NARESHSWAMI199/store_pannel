import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon"
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material"
import axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "src/hooks/use-auth"
import DialogFormForExcelImport from "src/layouts/excel/import-excel"
import { host, projectName } from "src/utils/util"

const exp = require("constants")



export function ItemHeaders(props){

    const auth = useAuth()
    const [open, setOpen] = useState()
    const [message, setMessage] = useState("")
    const [flag, setFlag] = useState("warning")

    const importItemExcelSheet = async (formData) => {
        let success = false;
        axios.defaults.headers = {
          Authorization: auth.token
        };
        await axios.post(host + '/admin/item/importExcel', formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
            let  resData = res.data;
            setMessage(resData.message);
            setFlag("success");
            if(res.status === 201) {
                let fileUrl = resData.fileUrl;
                alert(fileUrl);
                axios.get(fileUrl, { responseType: 'blob' })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data], 
                        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                    setDownloadUrl(url);
                })
                .catch(err => {
                    console.log(err);
                    setMessage("woops! something went wrong during excel file opening.");
                    setFlag("error");
                    setOpen(true);
                });
                setFlag("warning");
                setSnackbarOpen(true);
            }          
          success = true;
        })
        .catch(err => {
            console.log(err);
            setMessage(!!err.response ? err.response.data.message : err.message);
            setFlag("error");
            setOpen(true);
        });
        setOpen(true);
        return success;
      }


      const exportExcelSheet = async () => {
        const confirmDownload = window.confirm("Are you sure you want to download the Excel sheet?");
        if (!confirmDownload) {
            return;
        }

        axios.defaults.headers = {
            Authorization: auth.token
        }
        await axios.post(host + '/wholesale/item/exportExcel', !!props.searchFilters ? {...props.searchFilters} : undefined, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], 
                    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', projectName + '_items.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                setFlag("success")
                setMessage("Successfully exported.")
                setOpen(true)
            })
            .catch(err => {
                console.log(err)
                setMessage(!!err.response ? err.response.data.message : err.message)
                setFlag("error")
                setOpen(true)
            })
    }

    return (
        <>
            <Stack spacing={1}> 
                <Typography variant="h4"> 
                    {props.headerTitle}
                </Typography>
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
            >

                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
       
                    <DialogFormForExcelImport importExcelSheet={importItemExcelSheet} />
                    <Button
                        color="inherit"
                        startIcon={(
                            <SvgIcon fontSize="small">
                                <ArrowDownOnSquareIcon />
                            </SvgIcon>
                        )}
                        onClick={exportExcelSheet}
                    >
                        Export
                    </Button>
                </Stack>
                <div>
                    <Link
                        href={{
                            pathname: '/items/create/',
                            query : props.query
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
        </>
    )
}

