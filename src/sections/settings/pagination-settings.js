import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { host, rowsPerPageOptions } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';



export const  PaginationSettings = (props) => {
    const [sortingLables, setSortingLabels] = useState([])
    const [pagination, setPegination] = useState([])
    const [rowsPerPageObj , setRowPerPageObj] = useState({})
    const auth = useAuth()

    useEffect(()=> {
        // get all pagination setting labels
        axios.get(host + "/wholesale/pagination/all")
        .then(res => {
            let result = res.data;
            setPegination(result)
            let sortingLables = Object.keys(result);  // there we get a object with keys
            setSortingLabels(sortingLables)
            sortingLables.map(label => {
                rowsPerPageObj[label] = result[label].rowsNumber // seting  the rows numbers
                setRowPerPageObj({...rowsPerPageObj})
            })
        })
        .catch(err=>{
            props.showError(err);
        })
        
    },[])

    // TODO ; make sure call from auth-context or redux side 
    const handleChange = (event,fieldFor) => {
        let rowsNumber = event.target.value;
        axios.post(host + "/wholesale/pagination/update", {
            paginationId : pagination[fieldFor]?.id,
            rowsNumber : rowsNumber
        })
        .then(res => {
            props.showSuccess(res.data.message)
        })
        .catch(err => {
            props.showError(err);
        })
        rowsPerPageObj[fieldFor] = rowsNumber
        setRowPerPageObj({...rowsPerPageObj})
        // updated with redux also 
        auth.updatePaginations(rowsNumber,pagination[fieldFor])
    };

  return (<>
        <Card>
                <CardHeader
                subheader="Show per page rows"
                title="Rows per page"
                />
                <Divider />
                <CardContent>
                <Grid
                    container
                    spacing={6}
                    wrap="wrap"
                >
            
                    <Grid
                    item
                    md={8}
                    sm={6}
                    xs={12}
                    >
                        <Stack spacing={1}>
                        {sortingLables.map((label,key)=>{
                            let fieldFor = label;
                            return (
                                <Box key={key} sx={{display  : 'flex', alignItems : 'center',justifyContent : 'center'}}>
                                        <Typography sx={{minWidth : 150}} variant="p">
                                            {fieldFor}
                                        </Typography>

                                        <FormControl fullWidth sx={{mx : 3}}> 
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name='pagination'
                                                value={rowsPerPageObj[fieldFor]}
                                                onChange={(e) => handleChange(e,fieldFor)}
                                            >
                                              {rowsPerPageOptions.map((value , index)=>{
                                                    return <MenuItem key={index} value={value}>{value}</MenuItem>
                                             })}
                                            </Select>
                                        </FormControl>
                                </Box>
                              
                         
                              
                            )
                        })}
                        </Stack>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
</>
  )
}
