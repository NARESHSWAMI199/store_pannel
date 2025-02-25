import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { host } from 'src/utils/util';



export const  PaginationSettings = () => {
    const [sortingLables, setSortingLabels] = useState([])

    useEffect(()=> {
        // get all pagination setting labels
        axios.get(host + "/wholesale/pagination/all")
        .then(res => {
            setSortingLabels(res.data)
        })
    },[])


    const handleChange = (event) => {
        alert(event.target.value);
      };

  return (<>
        <Card>
                <CardHeader
                subheader="Show per page rows"
                title="Paginations"
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
                    md={6}
                    sm={6}
                    xs={12}
                    >
                        <Stack spacing={1}>
                        {sortingLables.map((label,key)=>{
                            return (
                                <Box sx={{display  : 'flex', alignItems : 'center',justifyContent : 'center'}}>
                                        <Typography sx={{minWidth : 100}} variant="h6">
                                            {label.pagination?.fieldFor}
                                        </Typography>

                                        <FormControl fullWidth sx={{mx : 3}}> 
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={label.rowsNumber}
                                                onChange={handleChange}
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
