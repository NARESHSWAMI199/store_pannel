import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Grid, Stack, SvgIcon, Typography } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import StoreIcon from '@mui/icons-material/Store';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useEffect, useMemo, useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DevicesFoldIcon from '@mui/icons-material/DevicesFold';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export const OverviewBox = (props) => {
  const { sx, title } = props;
  const [value, setValue] = useState(props.value)
  const [tag,setTag] = useState('success.main')


  useEffect(()=>{
    setValue(props.value)
  },[props.value])



  useEffect(()=>{
    if(title === "OLD ITEMS") {
      setTag('error.main')
    }else if(title === "NEW ITEMS") {
      setTag('success.main')
    }else if(title === "IN STOCK") {
      setTag('info.main')
    }else{
      setTag('primary.main')
    }
  },[title])


 
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {props.title}
            </Typography>
            <Typography variant="h4">
              {value.all}
            </Typography>
          </Stack>
          <Avatar
              sx={{
                backgroundColor : tag,
                height: 56,
                width: 56
              }}
            > 
              <SvgIcon>
              {title==="ITEMS" &&
                <ProductionQuantityLimitsIcon />
              }
              {title==="IN STOCK" &&
                <ShowChartIcon />
              }
              {title==="OUT OF STOCK" &&
                <TrendingDownIcon />
              }
              {title==="NEW ITEMS" &&
                <NewReleasesIcon />
              }

              {title==="OLD ITEMS" &&
                <DevicesFoldIcon />
              }

              </SvgIcon>
          </Avatar>
        </Stack>



<Box style={{display : 'flex', flexWrap : 'wrap'}}>



  
<Stack
            // alignItems="left"
            direction="row"
            spacing={1}
            sx={{ flex : "1 1 50%" ,mt:2 }}
          >
                <SvgIcon
                color='success'
                fontSize="small"
              >
                <ShowChartIcon />
              </SvgIcon>
              <Typography
                color='success.main'
                variant="body2"
                sx={{
                  fontWeight:'bold'
                }}
              >
                {value.inStock}
              </Typography>
              <Typography
                color='text.secondary'
                variant="caption"
              >
                IN STOCK
              </Typography>
          </Stack>


        <Stack
              // alignItems="RIGHT"
              direction="row"
              spacing={1}
              sx={{ flex :  "1 1 50%",mt:2 }}
            >
              <SvgIcon
                color='success'
                fontSize="small"
              >
                <PeopleOutline />
              </SvgIcon>
              <Typography
                color='success.main'
                variant="body2"
                sx={{
                  fontWeight:'bold'
                }}
              >
                {value.active}
              </Typography>
              <Typography
                color='text.secondary'
                variant="caption"
              >
                ACTIVE
              </Typography>
            </Stack>


         <Stack
            // alignItems="left"
            direction="row"
            spacing={1}
            sx={{ flex :  "1 1 50%", mt:0.5  }}
          >
                <SvgIcon
                color='error'
                fontSize="small"
              >
                <DevicesFoldIcon />
              </SvgIcon>
              <Typography
                color='error.main'
                variant="body2"
                sx={{
                  fontWeight:'bold'
                }}
              >
                {value.outStock}
              </Typography>
              <Typography
                color='text.secondary'
                variant="caption"
              >
                OUT OF STOCK
              </Typography>
          </Stack>

          <Stack
            // alignItems="left"
            direction="row"
            spacing={1}
            sx={{ flex :  "1 1 50%" ,mt:0.5 }}
          >
                <SvgIcon
                color='error'
                fontSize="small"
              >
                <PeopleOutline />
              </SvgIcon>
              <Typography
                color='error.main'
                variant="body2"
                sx={{
                  fontWeight:'bold'
                }}
              >
                {value.deactive}
              </Typography>
              <Typography
                color='text.secondary'
                variant="caption"
              >
                DEACTIVE
              </Typography>
          </Stack>
   

          </Box>
      </CardContent>
    </Card>
  );
};

OverviewBox.prototypes = {
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
