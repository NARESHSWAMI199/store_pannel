
import { Modal } from 'antd';
import { useEffect, useState } from 'react';



const CustomModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setOpen(props.open)
    setLoading(props.loading)
  },[props.open,props.loading])

  return (
    <>
      {/* <Button type="primary" onClick={showLoading}>
        Open Modal
      </Button> */}
      <Modal 
      style={
        {
          resize: "none",
          width: '100%',
          transformOrigin: '85px 43px',
          overflow: 'scroll',
          height: 800,
          background : "white"
        }
      }
      centered = {false}
        title={<p>{props.title}</p>}
        // footer={
        //   <Button type="primary" onClick={showLoading}>
        //     Reload
        //   </Button>
        // }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
        footer ={false}
      >
       {props.children}
      </Modal>
    </>
  );
};
export default CustomModal;