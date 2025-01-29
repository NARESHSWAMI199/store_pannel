import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { SvgIcon } from '@mui/material';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { UploadOutlined } from '@ant-design/icons';
import { Space, Upload } from 'antd';
import { Form } from 'formik';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogFormForExcelImport({importExcelSheet}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const importExcelSheetSubmit = (e) => {
    e.preventDefault();
    let result =  importExcelSheet(e);
    if(result) handleClose();
  }

  return (
    <React.Fragment>
       <Button
          color="inherit"
          onClick={handleClickOpen}
          startIcon={(
            <SvgIcon fontSize="small">
              <ArrowUpOnSquareIcon />
            </SvgIcon>
          )}
        >
          Import
        </Button>


      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2}}
          id="customized-dialog-title"
        >
            Import Items
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        <form
          encType='multipart'
          onSubmit={ (e) => importExcelSheetSubmit(e)}
        >
          <label htmlFor="file" >Import Excel</label>
          <input
            type='file'
            name="excelfile"
            id="file"
          ></input>
          <Button
            type="primary"
            htmltype="submit"
          >
            UPLOAD EXCEL
        </Button>
        </form>
        </DialogContent>
        <DialogActions>
          {/* <Button type="submit" autoFocus onClick={handleClose}>
            Upload Excel
          </Button> */}

        </DialogActions> 
      </BootstrapDialog>
    </React.Fragment>
  );
}







