import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';


const Spinner = (props) => {

    const [show ,setShow] = useState("none")
    useEffect(()=>{
        console.log(props.show)
        setShow(props.show)
    },[props.show])
    return (
        <Spin 
            size='large' 
            style={{
                display : show,
                marginTop : 200,
                marginBottom : 200
            }} 
        />
    );
}

export default Spinner;