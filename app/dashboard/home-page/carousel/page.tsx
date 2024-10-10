'use client'
import { carousel_delete, carousel_link, carousel_list, carousel_update, carousel_update_rank, carousel_upload } from "@/app/service/home-page/carousel";
import { Flex,Button, Upload, message, Tag, Modal, Input, Popconfirm, Space, Select, Table} from "antd";
import Image from 'next/image';
import { useEffect, useState } from "react";
import type { GetProp, PopconfirmProps, TableProps, UploadProps } from 'antd';
import  "./carousel.css"
import { category_second } from "@/app/service/model-management/category";
import { goods_list_byCategoryId } from "@/app/service/home-page/goods_config";

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
  const [modalConfig, setModalConfig] = useState(0);       // 用于保存输入框的值
  const [modalTitle, setModalTitle] = useState('');       // 用于保存输入框的值

  const  [t_date,setTdata] =useState([])
  const [category,setCategory] = useState([])

  const showModal = async (id:string,flag:number) => {
    setIsModalOpen(true);
    setSId(id);  // 保存 id
    if(flag === 0) {
      setModalConfig(0)
      setModalTitle("rank修改");
    }else{
      setModalConfig(1)
      setModalTitle("选择跳转的商品");
      const res = await category_second()
      setCategory(res.data.result)
    }

  };
  const onChange = async (value: string) => {
    const res = await goods_list_byCategoryId(value)
    setTdata(res.data.result)
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



  // table
  interface DataType {
    key: string;
    id:string;
    name: string;
    pictureUrl: string;
    description: string;
    isDiscontinued: string;
  }
  
  
  const handleSelect = async (id: string) => {

    const linkData = {
      id:s_id,
      goodsId:id
    }
    await carousel_link(linkData)
    await fetchData(); // 获取新的数据
    setIsModalOpen(false);
};

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width:100
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width:100
    },
    {
      title: '图片',
      dataIndex: 'pictureUrl',
      key: 'pictureUrl',
      render: (item: any) => (
        <Image src={item} alt="s" width={152} height={152} />
      ),
    },
    {
      title: '商品描述',
      dataIndex: 'description',
      key: 'description',
      width:150
    },
    {
      title: '是否下架',
      dataIndex: 'isDiscontinued',
      key: 'isDiscontinued',
      render: (item: any) => (
        <Tag color={item === 'true'?'error' : 'success'}>{item === 'true'? '是' : '否'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_,record) => (
        <Button type="primary" onClick={()=>handleSelect(record.id)}>选择</Button>
      ),
    },
  ];
  
  const data: DataType[] = t_date.map((item:any,index)=>{
    return {
      key: `${index}`,
      id: item.id,
      name: item.name,
      pictureUrl: item.pictureUrl,
      description: item.description,
      isDiscontinued: item.isDiscontinued === 'true'? '是' : '否',
    }
  })
  
  return (
  <>
  {contextHolder}
  <main>
     <h3 className='text-lg font-bold mb-5' >轮播图配置</h3>
     <Flex wrap gap="middle"  >
        {
          // 假数据
          cal.map((item:any, index) => (
         
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
                {item.goodsId && <Button type="primary" onClick={()=>showModal(item.id,0)}>rank:{item.rank}</Button>}
                {item.goodsId && <Button type="primary" onClick={()=>showModal(item.id,1)}>跳转配置:{item.goodsId}</Button>}
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

      <Modal title={modalTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={900}>
        {modalConfig===0 ? <Input placeholder="请输入rank值"  value={inputValue} onChange={handleInputChange} />
         :  <>
         <Space style={{margin:"30px 0px"}}>
               <h3 className="">分类选择</h3>
               <Select
             placeholder="请选择商品所属分类"
             optionFilterProp="label"
             onChange={onChange}
             options={category.map((item:any,index)=>{
               return {value:item.id, label:item.categoryName}  // 注意key和value的对应
             })}
           />
               </Space>
       
               <Table<DataType> columns={columns} dataSource={data} />
         </>
        
        }
      </Modal>
     
    </main>
  </>
   
  );
}