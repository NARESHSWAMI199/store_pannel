
import { Button, Drawer, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';

const DrawerRight = (props) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');

  useEffect(()=>{
    setOpen(props.open)
  },[props])

  const onClose = () => {
    setOpen(false);
  };
 
  return (
    <>
      <Drawer
        title="Basic Drawer"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
      {props.children}
      </Drawer>
    </>
  );
};
export default DrawerRight;