
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
    props.onClose()
  };
 
  return (
    <>
      <Drawer
        bodyStyle={{ padding:'0px' }}
        title="Basic Drawer"
        placement={placement}
        open={open}
        key={placement}
        onClose={onClose}
      >
      {props.children}
      </Drawer>
    </>
  );
};
export default DrawerRight;