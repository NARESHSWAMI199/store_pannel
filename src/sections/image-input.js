import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import ImgCrop from "antd-img-crop";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ImageInput = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [avtar, setAvtar] = useState(props.avtar)
  const [fileList, setFileList] = useState([]);
  const [totalImage,setTotalImage] = useState(2)
  const accept = {
    accept: '.png,.jpg,.jpeg',
 };
  useEffect(()=>{
    if(!!props.totalImage || props.totalImage == 0){
      setTotalImage(props.totalImage)
    }
    if(!!props.avtar){
      setAvtar(props.avtar)
      setFileList([{
        url: props.avtar
      }])
    }
  },[props.avtar,props.totalImage])

  const handlePreview = async (file) => {
    debugger
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = (info) => {
    console.log(info)
    let files = info.fileList;
    setFileList(files);
    if(!!files[files.length-1])props.onChange(files[files.length-1]);
  }
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <>
       <ImgCrop showGrid rotationSlider aspectSlider showReset>
      <Upload
        //action={props.action}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        {...accept}
      >
        {fileList.length >= totalImage ? null : uploadButton}
      </Upload>
      </ImgCrop>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}

    </>
  );
};
export default ImageInput;