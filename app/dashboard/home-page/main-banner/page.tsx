'use client'
import {sw_all,sw_update,sw_update_status,sw_upload} from '@/app/service/home-page/main-banner'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Flex, Modal, Radio, Upload,message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import  "./main-banner.css"

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG/JPEG/GIF file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default  function Page( ) {
  const [url1, setUrl1] = useState([]);
  const [url2, setUrl2] = useState([]);
  const fetchData = async () => {
    try {
      const banner = await sw_all();
      // 假设 `banner.data.result` 是一个对象或数组，包含 `url` 信息
      const fetchedUrl1= banner.data.result.s;
      setUrl1(fetchedUrl1);
      const fetchedUrl2 = banner.data.result.w;
      setUrl2(fetchedUrl2);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // https://via.placeholder.com/400x320  https://via.placeholder.com/400x589
  useEffect(() => {
    fetchData();
  }, []);


/* 选中图片 */
  const  selectPicture = async (flag:string,id:string)=>{
    const formData = new FormData();
    formData.append('imgType', flag);
    formData.append('id', id);
    await sw_update_status(formData)
    fetchData()
  }

  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
      });
    }
  };

  return (
    <main>
      <div className="top" style={{marginBottom:"50px"}}>
        <h3 className='text-lg font-bold mb-5' >顶部banner图</h3>
        <Flex gap="middle">
          {url1.map((item, index) => (
          <Flex key={item.id} gap="middle" vertical>
            <Image src={item.pictureUrl} alt={`image-${index}`} width={400} height={320} />
            <Flex gap="small" wrap>
              {
                item.id ? (
                  <>
                      <Upload
                  listType="picture-card" 
                  showUploadList={false}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('id', item.id);
                    try {
                      const response = await sw_update(formData)
                      fetchData();
                      onSuccess(response.data);
                    } catch (error) {
                      onError(error);
                    }
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <Button  type="primary">更新</Button>
                </Upload>
                 
                  </>
                ):(
                  <>
                  <Upload
                  listType="picture-card" 
                  showUploadList={false}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('imgType', "0");
                    try {
                      const response = await sw_upload(formData)
                      fetchData();
                      onSuccess(response.data);
                    } catch (error) {
                      onError(error);
                    }
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <Button  type="primary">上传</Button>
                </Upload>
                  </>
                )
              }
               {!item.isSelected && item.id &&  <Button type="primary" onClick={() => selectPicture(0,item.id)}>点击选中</Button>}
               {
               item.isSelected? (
                  <>
                  <Button type="text">已选中</Button>
                  </>
                ):(
                  item.id && <Button type="text">未选中</Button>
                )
              }
            </Flex>     
          </Flex>
        ))}
        </Flex>
      </div>
      <div className="bot">
        <h3  className='text-lg font-bold mb-5'>底部detail图</h3>
        <Flex gap="middle">
          {url2.map((item, index) => (
            <Flex key={item.id} gap="middle" vertical>
              <Image src={item.pictureUrl} alt={`image-${index}`} width={400} height={589} />
              <Flex gap="small" wrap>
              {
                item.id ? (
                  <>
                <Upload
                  listType="picture-card" 
                  showUploadList={false}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('id', item.id);
                    try {
                      const response = await sw_update(formData)
                      fetchData();
                      onSuccess(response.data);
                    } catch (error) {
                      onError(error);
                    }
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  <Button  type="primary">更新</Button>
                </Upload>
                  </>
                ):(
                  <>
                    <Upload
                    listType="picture-card" 
                    showUploadList={false}
                    customRequest={async ({ file, onSuccess, onError }) => {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('imgType', "1");
                      try {
                        const response = await sw_upload(formData)
                        fetchData();
                        onSuccess(response.data);
                      } catch (error) {
                        onError(error);
                      }
                    }}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                  <Button  type="primary">上传</Button>
                </Upload>
                  </>
                )
              }
               {!item.isSelected && item.id &&  <Button type="primary"  onClick={() => selectPicture(1,item.id)}>点击选中</Button>}
               {
               item.isSelected? (
                  <>
                  <Button type="text">已选中</Button>
                  </>
                ):(
                  item.id && <Button type="text">未选中</Button>
                )
              }
            </Flex> 
            </Flex>
          ))}
        </Flex>
      </div>
    </main>
  );
}