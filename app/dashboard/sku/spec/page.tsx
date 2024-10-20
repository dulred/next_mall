'use client'
import { goods_add, goods_all, goods_byId, goods_delete, goods_update, tmp_goods_upload } from "@/app/service/model-management/product";
import { useEffect, useState } from "react";
import React from 'react';
import { Button, Flex, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, Upload } from 'antd';
import type { GetProp, PopconfirmProps, TableColumnsType, TableProps, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import Image from "next/image";
import { category_add, category_byId, category_delete, category_first, category_second, category_update } from "@/app/service/model-management/category";
import { goods_styles_add_random, goods_styles_bycategoryId, goods_styles_delete, goods_styles_update } from "@/app/service/sku/sku";
import { goods_sku_generate, goods_spec_add_random, goods_spec_bycategoryId, goods_spec_delete, goods_spec_update } from "@/app/service/sku/spec";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};



const App: React.FC = () => {

  const  [t_date,setTdata] =useState([])
  const [category,setCategory] = useState([])
  const [skuData,setSkuData] = useState({})
  const [specId,setSpecId] = useState("")
  const fetchData = async ()=>{
    const res = await category_second()
    setCategory(res.data.result)
  }
  useEffect(()=>{
    fetchData()
  },[])
  

  const [form] = Form.useForm();

const showModal = (record:any) => {
  setSpecId(record.id)
  form.setFieldsValue({
    name: record.name,
    values: record.values.split(","),
    rank: record.rank,
  })
  setIsModalOpen(true);
};
const onFinish = async (values: any) => {
  const sData = {
    id: specId,
    name: values.name,
    values: values.values.join(","),
    rank: values.rank,
  }
  await goods_spec_update(sData)
  const res = await goods_spec_bycategoryId(skuData)
  setTdata(res.data.result)
  setIsModalOpen(false);
 };

 const onReset = () => {
   form.resetFields();
 };


  const onChange = async (id: string) => {
    const specData = {
      categoryId: id,
      page: 1,
      pageSize: 10
    }
    setSkuData(specData)
    const res = await goods_spec_bycategoryId(specData)
    setTdata(res.data.result)
  };
  
  const handleAdd = async(id:string) => {
    // 调用数据库接口生成一行随机数据
    await goods_spec_add_random(id)
    // 更新渲染数据
    const res = await goods_spec_bycategoryId(skuData)
    setTdata(res.data.result)
  };

  const handleGenerate  = async(id:string)=>{
    await goods_sku_generate(id)
    message.success("生成sku配置成功，您可以前往商品sku配置模块进行进一步配置")
  }

  const columns: TableProps['columns'] = [
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
        <>
        <Space size="middle">
          <Button type="primary" onClick={()=>handleAdd(record.id)}>添加一行</Button>
          <Popconfirm title="确认全量替换吗?" okText="确认" cancelText="取消"  onConfirm={() => handleGenerate(record.id)}>
          <Button type="primary">全量替换生成sku</Button>
          </Popconfirm>
          
        </Space>

        </>
        
      ),
    },
  ];
  
  const data = t_date.map((item:any,index)=>{
    return {
      key: `${index}`,
      id: item.id,
      name: item.name,
      pictureUrl: item.pictureUrl,
      description: item.description,
      isDiscontinued: item.isDiscontinued === 'true'? '是' : '否',
      specs:item.specs
    }
  })


const handledelete = async(record:any) => {
  await goods_spec_delete(record.id)
  const res = await goods_spec_bycategoryId(skuData)
  setTdata(res.data.result)
};
const [isModalOpen, setIsModalOpen] = useState(false);



const handleOk = () => {
  setIsModalOpen(false);
};

const handleCancel = () => {
  setIsModalOpen(false);
};



const columns2 = [
  { title: 'id', dataIndex: 'id', key: 'id' },
  { title: '属性名', dataIndex: 'name', key: 'name'},
  { title: '属性值', dataIndex: 'values', key: 'values'},
  { title: '排序值', dataIndex: 'rank', key: 'rank'},
  {
    title: '操作',
    dataIndex: 'operation',
    render: (_: any, record: any) => {
      return (
        <Space>
          <Typography.Link  onClick={() => showModal(record)}>
            编辑
          </Typography.Link>
          <Popconfirm title="确认删除吗?" okText="确认" cancelText="取消"  onConfirm={() => handledelete(record)}>
            <Typography.Link >
              删除
            </Typography.Link>
          </Popconfirm>
        
        </Space>

      );
    },
  },
];


  // Initialize the form with one input
  const initialValues = {
    values: [''], // 这里添加一个初始值
  };
  return (
    <main>
      <h3 className="text-lg font-bold mb-5">商品spec规格</h3>

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

        <Table columns={columns} dataSource={data} 
             expandable={{
              expandedRowRender: (record) => {
                return ( 
                  <Table
                    bordered
                    columns={columns2}
                    pagination={false}
                    dataSource={record.specs}
                    rowClassName="editable-row"
                    rowKey={(item:any) => item.id} // 为每一行定义唯一的 key
                  />
              )},
            }}
          />

      <Modal title="spec规格设置" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
        footer={
          <Button type="primary" onClick={handleCancel}>
            取消
          </Button>
        }
      >
      <Form
      initialValues={initialValues}
      {...formItemLayout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 400 ,marginTop: '30px'}}
    >
    
      <Form.Item name="name" label="属性名" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="rank" label="排序值" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.List
        name="values"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('At least 2 passengers'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '属性值: ' : ''}
                required={true}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入值或者删除此输入项",
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="sku值" style={{ width: '60%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    style={{ marginLeft: "5px" }}
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                添加输入项
              </Button>
              <Button
                type="dashed"
                onClick={() => {
                  add('', 0);
                }}
                style={{ width: '60%', marginTop: '20px' }}
                icon={<PlusOutlined />}
              >
                在顶部添加输入项
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

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