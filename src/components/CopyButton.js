// components/CopyButton.js
import React, { useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { Badge } from '@mui/material';

const CopyButton = ({ text, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <>
      {isCopied ? (
        <Badge color="primary" badgeContent="copied" style={{ marginBottom: '35px' }} />
      ) : (
        <></>
      )}
      <CopyOutlined onClick={handleCopyClick} />
    </>
  );
};

export default CopyButton;