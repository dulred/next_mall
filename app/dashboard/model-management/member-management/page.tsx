'use client'
import { goods_add, goods_all, goods_byId, goods_delete, goods_update, tmp_goods_upload } from "@/app/service/model-management/product";
import { useEffect, useState } from "react";
import React from 'react';
import { Button, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Switch, Table, Upload } from 'antd';
import type { GetProp, PopconfirmProps, TableColumnsType, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import Image from "next/image";
import { category_add, category_byId, category_delete, category_first, category_second, category_update } from "@/app/service/model-management/category";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { member_all } from "@/app/service/model-management/member";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: unset;
          }
        }
      }
    `,
  };
});

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


const App: React.FC = () => {

  const  [t_data,setTdata]  = useState([])
  const { styles } = useStyle();

  const fetchData = async() =>{
   const {data} = await member_all()
   setTdata(data.result.items)
  }

  useEffect(()=>{
    fetchData()
  },[])


    const confirm = async(id:string) => {
    try {
      await goods_delete(id)
      message.success('删除成功');
      fetchData()
    } catch (error:any) {
      message.error(error.message);
    }
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.warning('取消删除');
  };



const [isModalOpen, setIsModalOpen] = useState(false);
const [isSelectedFirst,setFirst] = useState(false);
const [secondArray,setSecondArray] = useState([]);
const [updateId,setupdateId] = useState('');
const [modelTag,setModelTag] = useState('添加商品');
const [loading, setLoading] = useState(false);
const [imageUrl, setImageUrl] = useState<string>();
const [imageHttpsUrl, setImageHttpsUrl] = useState<string>();



const showModal = async(id:string) => {
  setIsModalOpen(true);
  const {data} =  await category_second()
  setSecondArray(data.result)
  setupdateId(id)
  if(id != '-1'){
    setModelTag("修改商品")
    const _goods = await goods_byId(id)
    const url = _goods.data.result.pictureUrl
    setImageUrl(url)
    setImageHttpsUrl(url)
    form.setFieldsValue({
      name: _goods.data.result.name,
      price: _goods.data.result.price,
      discount: _goods.data.result.discount,
      description: _goods.data.result.description,
      categoryId: _goods.data.result.categoryId,
      pictureUrl: url,
      brandId: _goods.data.result.brandId,
      supplierId: _goods.data.result.supplierId,
      rank: _goods.data.result.rank,
      isDiscontinued:!_goods.data.result.isDisContinued
    })
  }else{
    setModelTag("添加商品")
  }
};


const columns: TableColumnsType = [
  {
    title: 'id',
    width: 100,
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
  },
  {
    title: '名称',
    width: 100,
    dataIndex: 'nickname',
    key: 'nickname',
    fixed: 'left',
  },
  {
    title: '图片',
    width: 100,
    dataIndex: 'avatar',
    key: 'avatar',
    fixed: 'left',
    render: (item) => <Image src={item} alt="s" width={68} height={68} />,
  },
  { title: '账户余额', dataIndex: 'balance', key: 'balance' ,width: 100},
  { title: '性别', dataIndex: 'gender', key: 'gender' ,width: 100},
  { title: '手机', dataIndex: 'mobile', key: 'mobile' ,width: 100},
  { title: '职业', dataIndex: 'profession', key: 'profession' ,width: 100},
  { title: '生日', dataIndex: 'birthday', key: 'birthday',width: 100 },
  { title: '角色', dataIndex: 'roleId', key: 'roleId' ,width: 100},
  { title: '省份编码', dataIndex: 'provinceCode', key: 'provinceCode' ,width: 100},
  { title: '城市编码', dataIndex: 'cityCode', key: 'cityCode',width: 100 },
  { title: '市区编码', dataIndex: 'countyCode', key: 'countyCode' ,width: 100},
  { title: '备注', dataIndex: 'remark', key: 'remark' ,width: 100},
  { title: '是否禁用', dataIndex: 'isActive', key: 'isActive',width: 100 },
  { title: '是否注销', dataIndex: 'isDeleted', key: 'isDeleted',width: 100 },
  { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime',width: 100 },
  { title: '登出时间', dataIndex: 'logoutTime', key: 'logoutTime',width: 100 },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: 
    (item) => 
    <Space>
      <Button type="primary">禁用</Button>
      <Button type="primary">注销</Button>
      {/* <Button type="primary" onClick={()=>showModal(item.id)}>修改</Button>
      <Popconfirm
        title="是否确认删除"
        description="您确认要删除吗?"
        onConfirm={()=>confirm(item.id)}
      >
        <Button type="primary" danger >删除</Button>
      </Popconfirm> */}
    </Space>,
  },
];


const handleCancel = () => {
  setIsModalOpen(false);
  form.resetFields();
  setImageUrl('');
  setLoading(false);
  setImageHttpsUrl('');
};

const [form] = Form.useForm();

const onFinish = async (values: any) => {
 const goodsData = {
    name: values.name,
    description: values.description,
    rank: Number(values.rank),
    categoryId:values.categoryId,
    pictureUrl: imageHttpsUrl,
    price: values.price,
    discount: values.discount,
    isDiscontinued: values.isDiscontinued == true ? 0 : 1,
    brandId:values.brandId,
    supplierId:values.supplierId,
    id : ""
  }
  if(updateId == '-1'){
    try {
      await goods_add(goodsData);
      message.success("添加分类数据成功")
    } catch (error) {
      message.error("添加数据失败")
    } 
  }else{
    try {
      goodsData.id = updateId;
      await goods_update(goodsData);
      message.success("修改分类数据成功")
    } catch (error) {
      message.error("修改分类数据失败")
    } 
  }


  fetchData()
  setIsModalOpen(false);
  form.resetFields();
  setImageUrl('');
  setLoading(false);
  setImageHttpsUrl('');
};

const onReset = () => {
  form.resetFields();
};
  const dataSource= t_data.map((item:any,index)=>{
    return {
      key: `${index}`,
      id: item.id,
      nickname: item.nickname,
      avatar: item.avatar,
      balance: item.balance,
      cityCode: item.cityCode,
      provinceCode: item.provinceCode,
      countyCode: item.countyCode,
      gender: item.gender,
      isActive: item.isActive,
      isDeleted: item.isDeleted,
      loginTime: item.loginTime,
      logoutTime: item.logoutTime,
      mobile:item.mobile,
      profession: item.profession,
      remark: item.remark,
      birthday: item.birthday,
      roleId: item.roleId
    } 
  })
  

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
        form.setFieldsValue({ pictureUrl: url }); // 仅更新 pictureUrl 字段
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <main>
      <h3 className='text-lg font-bold mb-5' >会员管理</h3>
        <Table
          className={styles.customTable}
          pagination={{ pageSize: 6 }}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 'max-content' }}
        />

<Modal title={modelTag} open={isModalOpen}
         footer={
          <Button type="primary" onClick={handleCancel}>
            取消
          </Button>
        }
        onCancel={handleCancel}
    >
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 400 ,marginTop: '30px'}}
    >
     
      <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="rank" label="排序值" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="pictureUrl" label="图片上传" rules={[{ required: true }]}>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={async ({ file, onSuccess, onError }) => {
            const formData = new FormData();
            formData.append('file', file);
            try {
              const response = await tmp_goods_upload(formData)
              setImageHttpsUrl(response.data.result.http_url)
              onSuccess(response.data);
            } catch (error) {
              onError(error);
            }
          }}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Form.Item>
      {
        !isSelectedFirst && 
        <Form.Item name="categoryId" label="父类Id" rules={[{ required: true }]}>
        <Select
          placeholder="选择商品分类"
          allowClear
        >
          {
            secondArray.map((item:any) => (
              <Option key={item.id} value={item.id}>{item.categoryName}</Option>
            ))
          }
        </Select>
      </Form.Item>
      }
      <Form.Item name="price" label="价格" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="discount" label="折扣" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="brandId" label="品牌" rules={[{ required: true }]}>
        <Select
          placeholder="选择品牌"
          allowClear
        >
            <Option key={1} value={1}>疼讯</Option>
            <Option key={2} value={2}>应特尔</Option>
        </Select>
      </Form.Item>
      <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]}>
      <Select
          placeholder="选择供应商"
          allowClear
        >
            <Option key={1} value={1}>特不</Option>
            <Option key={2} value={2}>划为</Option>
        </Select>
      </Form.Item>
      <Form.Item name="description" label="简单描述" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="isDiscontinued" valuePropName="checked" label="是否上架" rules={[{ required: true }]}>
        <Switch />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            提交表单
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置表单
          </Button>
        </Space>
      </Form.Item>
    </Form>
      </Modal>
    </main>
  
  );
};

export default App;