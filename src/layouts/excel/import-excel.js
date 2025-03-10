import { InboxOutlined } from '@ant-design/icons';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIcon } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Upload, message } from 'antd';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { host } from 'src/utils/util';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogFormForExcelImport({ importExcelSheet }) {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFileList([]);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('excelfile', fileList[0]);
    const success = await importExcelSheet(formData);
    if (success) {
      handleClose();
    }
  };

  const downloadTemplate = () => {
    axios.get(host+'/admin/item/download/update/template', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'import_template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('Error downloading the template', error);
        message.error('Error downloading the template');
      });
  };

  const props = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

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
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
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
          <Upload.Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single upload. Strictly prohibit from uploading company data or other band files</p>
          </Upload.Dragger>
        </DialogContent>
        <DialogActions>
          <Button onClick={downloadTemplate} color="primary">
            Download Template
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload Excel
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}







