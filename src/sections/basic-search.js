import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Refresh, RefreshOutlined, SearchOutlined } from '@mui/icons-material';
import { Button, Card, Grid, InputAdornment, MenuItem, OutlinedInput, Select, SvgIcon, TextField } from '@mui/material';
import { format, toDate } from 'date-fns';
import { useCallback, useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';
import { status } from 'nprogress';
export const BasicSearch = (props) => {



  const previousDate = format(new Date().getTime()-(10 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  const currentDate = format(new Date().getTime()+(24 * 60 * 60 * 1000), 'yyyy-MM-dd')


  const [values,setValues] = useState({
    inStock : 'ALL',
    status : 'ALL',
    type : 'A',
    fromDate : previousDate,
    toDate : currentDate
  })

  const handleChange = (e) =>{
    setValues({
      ...values,
      [e.target.name] : [e.target.value]
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form)
    const data = {
      searchKey : formData.get("searchKey"),
      fromDate : new Date(formData.get("fromDate")).getTime(),
      toDate : new Date(formData.get("toDate")).getTime(),
      slug : formData.get("slug"),
      status :  formData.get("status"),
      userType : formData.get("type") !== "A" ? formData.get("type") : null,
      inStock :  formData.get("inStock")
    }
    props.onSearch(data);
  }



  const resetFilters = (e) => {
    /** reset default filters  */
    setValues({  inStock : 'Y',
      status : 'A',
      type : 'A',
      fromDate : previousDate,
      toDate : currentDate
    })
    props.onSearch();
  }
  

 return (<Card sx={{ p: 2 }}>
    <form
      id={"search"}
      onSubmit={(e)=>{handleSubmit(e)}}
    >
      <Grid
        spacing={1}
        container
      >

      <Grid
        item
        xs={12}
        md={2}
      >
          <OutlinedInput
          value={values.searchKey}
          onChange={handleChange}
          fullWidth
          placeholder="Search"
          name='searchKey'
          startAdornment={(
            <InputAdornment position="start" >
              
              <SvgIcon
                color="action"
                fontSize="small"
              >
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          )}
        />
      </Grid>





  { props.type !== "A" &&  props.type !== "item" &&
  <Grid
    item
    xs={12}
    md={2}
  >
    <OutlinedInput
          sx={{height : 54}}
          value={values.slug}
          fullWidth
          onChange={handleChange}
          placeholder="Token Id"
          name='slug'
          startAdornment={(
            <InputAdornment position="start" >
              
              <KeyIcon
                color="action"
                fontSize="small"
              >
                <MagnifyingGlassIcon />
              </KeyIcon>
            </InputAdornment>
          )}
        />
 </Grid>}



          { props.type === "A" &&  <Grid
                item
                xs={12}
                md={2}
              ><Select
                fullWidth
                sx={{height : 54}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='type'
                onChange={handleChange}
                value={values.type}
                label="User type"
              >
                <MenuItem value={"A"}>All</MenuItem>
                <MenuItem value={"S"}>Staff</MenuItem>
                <MenuItem value={"W"}>Wholesaler</MenuItem>
                <MenuItem value={'R'}>Retailer</MenuItem>
              </Select></Grid>}

             {props.type !== "G" && <Grid
                item
                xs={12}
                md={2}
              ><Select
                fullWidth
                sx={{height : 54}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='status'
                onChange={handleChange}
                value={values.status}
                label="Status"
              >
                <MenuItem value={"ALL"}>Select Status</MenuItem>
                <MenuItem value={"A"}>Active</MenuItem>
                <MenuItem value={"D"}>Deactive</MenuItem>
              </Select></Grid>}


              {props.type == "item" && <Grid
                item
                xs={12}
                md={2}
              ><Select
                fullWidth
                sx={{height : 54}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='inStock'
                onChange={handleChange}
                value={values.inStock}
                label="Status"
              >
                <MenuItem value={"ALL"}>Select Stock Status</MenuItem>
                <MenuItem value={"Y"}>In stock</MenuItem>
                <MenuItem value={"N"}>Out of stock</MenuItem>
              </Select></Grid>}
     
        <Grid
          item
          xs={12}
          md={2}
        >
          <TextField
            fullWidth
            sx={{height : 54}}
            id="datetime-local"
            label="From Date"
            type="date"
            name='fromDate'
            onChange={handleChange}
            value={values.fromDate}
            // defaultValue={previousDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
      </Grid>

      <Grid
        item
        xs={12}
        md={2}
      >
      <TextField
          fullWidth
          sx={{height : 54}}
          id="datetime-local"
          label="To Date"
          type="date"
          onChange={handleChange}
          value={values.toDate}
          // defaultValue={currentDate}
          name='toDate'
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid
        item
        xs={6}
        md={1}
      >
      <Button
        type='submit'
        sx={{height : 54,width: '100%'}} 
        startIcon={(
            <SvgIcon fontSize="small">
              <SearchOutlined />
            </SvgIcon>
          )}
          variant="contained"> Search 
        </Button>
        </Grid>


        <Grid
          item
          xs={6}
          md={1}
        >
        <Button
          type='reset'
          onClick={resetFilters}
          sx={{height : 54,width: '100%',background:'red',mx:1}} 
          startIcon={(
              <SvgIcon fontSize="small">
                <RefreshOutlined />
              </SvgIcon>
            )}
            variant="contained"> Reset 
          </Button>
        </Grid>

</Grid>
    </form>
  </Card>
)};
