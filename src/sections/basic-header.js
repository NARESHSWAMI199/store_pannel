import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon"
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material"
import Head from "next/head"
import Link from "next/link"

const exp = require("constants")



export function BasicHeaders(props){
    return (
        <>
 
              <Stack spacing={1}>
                <Typography variant="h4">
                  {props.headerTitle}
                </Typography>
                
              </Stack>
        
        </>
    )
}

