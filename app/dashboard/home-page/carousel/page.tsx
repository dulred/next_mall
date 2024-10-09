'use client'
import { carousel_delete, carousel_list, carousel_update, carousel_update_rank, carousel_upload } from "@/app/service/home-page/carousel";
import { Flex,Button, Upload, message, Tag, Modal, Input, Popconfirm} from "antd";
import Image from 'next/image';
import { useEffect, useState } from "react";
import type { GetProp, PopconfirmProps, UploadProps } from 'antd';
import  "./carousel.css"

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

export default function Page( ) {

  const [messageApi, contextHolder] = message.useMessage();
  const [cal,setCalrousels] =  useState([])
  const fetchData = async ()=>{
    const res = await carousel_list()
    setCalrousels(res.data.result)
  }
  useEffect(()=>{
    fetchData()
  },[])


  const handleLink = async (id:string) => {
    const formdata = new FormData();
    formdata.append('id', id)

    messageApi.open({
      type: 'warning',
      content: '待开发中...',
    });
    
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


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');       // 用于保存输入框的值
  const [s_id, setSId] = useState('');       // 用于保存输入框的值

  const showModal = (id:string) => {
    setSId(id);  // 保存 id
    setIsModalOpen(true);
  };


 // 处理输入框值的改变
 const handleInputChange = (e:any) => {
  setInputValue(e.target.value);  // 更新输入框的值
};

// 处理点击确定按钮时的操作
const handleOk = async() => {
  console.log("Input value:", inputValue);  // 打印输入框的值
  const formdata = new FormData();
  formdata.append('id', s_id)
  formdata.append('rank', inputValue)
  try {
    await carousel_update_rank(formdata)
    
    messageApi.open({
      type: 'success',
      content: '更新成功...',
    });
    fetchData()
  } catch (error) {
    
  }

  // 在这里执行其他逻辑，例如将输入值提交给后台
  setIsModalOpen(false);  // 关闭 Modal
  setInputValue('')
};

// 处理点击取消按钮时的操作
const handleCancel = () => {
  setInputValue('')
  setIsModalOpen(false);  // 关闭 Modal
};

  
const confirm = async (id:string) => {
  try {
    await carousel_delete(id)
    fetchData()
  } catch (error) {
    messageApi.open({
      type: 'error',
      content: '删除失败',
    });
  }
  console.log(id)
  message.success('删除成功');
};

const cancel: PopconfirmProps['onCancel'] = (e) => {
  console.log(e);
  message.error('取消删除');
};
  return (
  <>
  {contextHolder}
  <main>
     <h3 className='text-lg font-bold mb-5' >轮播图配置</h3>
     <Flex wrap gap="middle"  >
        {
          // 假数据
          cal.map((item, index) => (
         
            <Flex  key={index} gap="middle" vertical wrap  align="flex-start" style={{marginBottom:"30px"}}>
              <Image
                  src={item.pictureUrl} 
                  alt={`image-${index}`}
                  width={375}
                  height={225}
              />
              <Flex gap="middle">
                {item.goodsId ?  
                    <Upload
                    listType="picture-card" 
                    showUploadList={false}
                    customRequest={async ({ file, onSuccess, onError }) => {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('id', item.id);
                      try {
                        const response = await carousel_update(formData)
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
                 : 
                 <Upload
                 listType="picture-card" 
                 showUploadList={false}
                 customRequest={async ({ file, onSuccess, onError }) => {
                   const formData = new FormData();
                   formData.append('file', file);
                   try {
                     const response = await carousel_upload(formData)
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
                 }
                {item.goodsId && <Button type="primary" onClick={()=>showModal(item.id)}>rank:{item.rank}</Button>}
                {item.goodsId && <Button type="primary" onClick={()=>handleLink(item.id)}>跳转信息</Button>}
                {item.goodsId && 
                  <Popconfirm
                  title="请确定是否删除"
                  description="你确定要删除这个图片吗？"
                  onConfirm={()=>confirm(item.id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                 <Button type="primary" danger>删除</Button>
                </Popconfirm>

                }
              </Flex>
            </Flex>

        ))
        }
     </Flex>

      <Modal title="rank修改" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="请输入rank值"  value={inputValue} onChange={handleInputChange}   />
      </Modal>
     
    </main>
  </>
   
  );
}