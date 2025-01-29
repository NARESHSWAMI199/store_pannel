import { Box, Grid } from "@mui/material";
import { ArrowLeftIcon, ArrowRightIcon } from "@mui/x-date-pickers";

export const ArrowButtons = () => (
  <Grid 
    container 
    spacing={3}
  >
    <Grid 
      item 
      variant='div'
      xs={6}
      md={6}
    >
      <Box 
        item 
        variant='div'
        display={'flex'}
        justifyContent="center"
        alignItems="center"
        xs={6}
        md={6}
        sx={{
          height: '40px',
          width: '40px',
          // boxShadow : 3,
          // mx:4, 
          borderRadius: '50%',
        }}
        onClick={(e) => history.back()}
      >
        <ArrowLeftIcon />
      </Box>
    </Grid>

    <Grid 
      item
      xs={6}
      md={6}
    >
      <Box 
        item 
        variant='div'
        display={'flex'}
        justifyContent="center"
        alignItems="center"
        xs={6}
        md={6}
        sx={{
          height: '40px',
          width: '40px',
          // boxShadow : 3,
          // mx:6, 
          ml: 'auto',
          borderRadius: '50%',
        }}
        onClick={(e) => history.forward()}
      >
        <ArrowRightIcon />
      </Box>
    </Grid>
  </Grid>
)