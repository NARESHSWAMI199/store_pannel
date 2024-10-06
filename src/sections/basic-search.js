import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { SearchOutlined } from '@mui/icons-material';
import { Button, Card, InputAdornment, MenuItem, OutlinedInput, Select, SvgIcon, TextField } from '@mui/material';
import { format } from 'date-fns';
import { useCallback } from 'react';
import KeyIcon from '@mui/icons-material/Key';
export const BasicSearch = (props) => {

  const previousDate = format(new Date().getTime()-(10 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  const currentDate = format(new Date().getTime()+(24 * 60 * 60 * 1000), 'yyyy-MM-dd')



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
  

 return (<Card sx={{ p: 2 }}>
    <form onSubmit={(e)=>{handleSubmit(e)}}>
    <OutlinedInput
      defaultValue=""
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
      sx={{ maxWidth: 240 }}
    />

  { props.type !== "A" &&  props.type !== "item" &&
   <OutlinedInput
        defaultValue=""
        fullWidth
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
        sx={{ maxWidth: 240 }}
      />
 }



          { props.type === "A" && <Select
                sx={{minWidth:200}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='type'
                defaultValue="A"
                label="User type"
              >
                <MenuItem value={"A"}>All</MenuItem>
                <MenuItem value={"S"}>Staff</MenuItem>
                <MenuItem value={"W"}>Wholesaler</MenuItem>
                <MenuItem value={'R'}>Retailer</MenuItem>
              </Select>}

             {props.type !== "G" && <Select
                sx={{minWidth:200}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='status'
                defaultValue="A"
                label="Status"
              >
                <MenuItem value={"A"}>Active</MenuItem>
                <MenuItem value={"D"}>Deactive</MenuItem>
              </Select>}


              {props.type == "item" && <Select
                sx={{minWidth:200}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='inStock'
                defaultValue="Y"
                label="Status"
              >
                <MenuItem value={"Y"}>In stock</MenuItem>
                <MenuItem value={"N"}>Out of stock</MenuItem>
              </Select>}
      <TextField
        sx={{minWidth:200}}
        id="datetime-local"
        label="From Date"
        type="date"
        name='fromDate'
        defaultValue={previousDate}
        InputLabelProps={{
          shrink: true,
        }}
      />

      
    <TextField
        sx={{minWidth:200}}
        id="datetime-local"
        label="To Date"
        type="date"
        defaultValue={currentDate}
        name='toDate'
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button type='submit' sx={{mx:2}} startIcon={(
                    <SvgIcon fontSize="small">
                      <SearchOutlined />
                    </SvgIcon>
                  )}
                  variant="contained"> Search </Button>
    </form>
  </Card>
)};
