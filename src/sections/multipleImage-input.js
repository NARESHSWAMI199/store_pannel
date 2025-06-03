import React, { useCallback, useEffect, useState } from 'react';
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
const MultipleImageInput = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [avtars, setAvtars] = useState(props.avtars)
  const [fileList, setFileList] = useState([]);
  const [totalImage,setTotalImage] = useState(2)
  const accept = {
    accept: '.png,.jpg,.jpeg,',
 };
  useEffect(()=>{
    if(!!props.totalImage || props.totalImage == 0){
      setTotalImage(props.totalImage)
    }
    if(!!props.avtars){
      setAvtars(props.avtars)
      let allAvatars = []
      for(let avtar of props.avtars){
        let splitArr =  avtar.split('/')
        let avtarName = splitArr[splitArr.length-1]
        allAvatars.push({
            url: avtar,
            oldImage : true,
            name : avtarName
        })
      }
      setFileList(allAvatars)
    }else{
      setFileList([])
    }
  },[props.avtars,props.totalImage])


    const onRemove = (file) => {
        setFileList((previousImages) => previousImages.filter(image=>{
            console.log(image.name +" != "+ file.name + " : ",image.name != file.name)
            return image.name !=file.name
            }))
    }

  const handlePreview = async (file) => {
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
    if(!!files) {
      props.onChange(files);
    }
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
      <ImgCrop 
         showGrid 
         rotationSlider 
         aspectSlider 
         showReset
       >
      <Upload
        //action={props.action}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        {...accept}
        onRemove={onRemove}
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
export default MultipleImageInput;