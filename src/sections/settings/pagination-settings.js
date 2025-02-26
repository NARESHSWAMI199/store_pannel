import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { host } from 'src/utils/util';



export const  PaginationSettings = (props) => {
    const [sortingLables, setSortingLabels] = useState([])
    const [rowsPerPageObj , setRowPerPageObj] = useState({})

    useEffect(()=> {
        // get all pagination setting labels
        axios.get(host + "/wholesale/pagination/all")
        .then(res => {
            let sortingLables = Object.values(res.data);  // there we get a object with key ; value where in value we all detail about keys and rowNumbers
            setSortingLabels(sortingLables)
            sortingLables.map(label => {
                let fieldFor = label.pagination?.fieldFor;
                rowsPerPageObj[fieldFor] = label.rowsNumber
                setRowPerPageObj({...rowsPerPageObj})
            })
        })
        .catch(err=>{
            props.showError(err);
        })
        
    },[])

    // TODO ; make sure call from auth-context or redux side 
    const handleChange = (event,pagination) => {
        let rowsNumber = event.target.value;
        axios.post(host + "/wholesale/pagination/update", {
            paginationId : pagination.id,
            rowsNumber : rowsNumber
        })
        .then(res => {
            props.showSuccess(res.data.message)
        })
        .catch(err => {
            props.showError(err);
        })
        rowsPerPageObj[pagination?.fieldFor] = rowsNumber
        setRowPerPageObj({...rowsPerPageObj})
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
                            let fieldFor = label.pagination?.fieldFor;
                            return (
                                <Box key={key} sx={{display  : 'flex', alignItems : 'center',justifyContent : 'center'}}>
                                        <Typography sx={{minWidth : 150}} variant="h6">
                                            {label.pagination?.fieldFor}
                                        </Typography>

                                        <FormControl fullWidth sx={{mx : 3}}> 
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={rowsPerPageObj[fieldFor]}
                                                onChange={(e) => handleChange(e,label.pagination)}
                                            >
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
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
