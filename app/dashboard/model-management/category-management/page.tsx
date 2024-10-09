'use client'
import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, message, Modal, Popconfirm, PopconfirmProps, Select, Space, Table, TableColumnsType } from 'antd';
import { category_add, category_byId, category_delete, category_first, category_list, category_update } from '@/app/service/model-management/category';

// 定义历史记录的类型
interface ChildrenItem {
  id: string;
  name: string;
  rank: string;
}

// 定义数据的主类型
interface DataType {
  key: string;
  id: string;
  name: string;
  rank: string;
  category2: ChildrenItem[]; // 用于存储展开的历史记录
}

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const App = () => {

  const [caData,setCaData] = useState([])
  const fetchData = async () =>{
    const res =  await category_list()
    setCaData(res.data.result)
  }
  useEffect(() =>{
    fetchData()
  },[])

  const confirm = async(id:string) => {
    try {
      await category_delete(id)
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

  // 定义表格列的类型
const columns: TableColumnsType<DataType> = [
  { title: 'id', dataIndex: 'id', key: 'id' },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '排序值', dataIndex: 'rank', key: 'rank' },
  {
    title: '操作',
    key: 'operation',
    render: (item) => (
      <Space size="middle">
        <Button type="primary" onClick={()=>showModal(item.id)}>修改</Button>

              <Popconfirm
                    title="是否确认删除"
                    description="您确认要删除吗?"
                    onConfirm={()=>confirm(item.id)}
                    onCancel={cancel}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="primary" danger>删除</Button>
              </Popconfirm>
      </Space>
    ),
  },
];
const dataSource = caData.map((item:any, i) => ({
  key: item.id,
  id: item.id,
  name: item.name,
  rank: item.rank,
  category2:item.children   //注意！antd不允许用children这个项，要不然重复渲染，奇怪的bug
}));


const [isModalOpen, setIsModalOpen] = useState(false);
const [isSelectedFirst,setFirst] = useState(false);
const [firstArray,setFirstArray] = useState([]);
const [updateId,setupdateId] = useState('');
const [modelTag,setModelTag] = useState('添加分类');




const showModal = async(id:string) => {
    setIsModalOpen(true);
    const {data} =  await category_first()
    setFirstArray(data.result)
    setupdateId(id)
    if(id != '-1'){
      setModelTag("修改分类")
      const _ca = await category_byId(id)
      form.setFieldsValue({
        rank: _ca.data.result.categoryRank,
        name: _ca.data.result.categoryName,
        parentId: _ca.data.result.parentId,
        categoryLevel: _ca.data.result.categoryLevel == 1 ? "first":"second",
      })
      if(_ca.data.result.categoryLevel == 1){
        setFirst(true)
      }else{
        setFirst(false)
      }
    }else{
      setModelTag("添加分类")
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };


  const [form] = Form.useForm();

  // 删除自身的一级分类
  const removeItemById = (id:string) => {
    setFirstArray((prevArray) => prevArray.filter(item => item.id !== id));
  };

  const onGenderChange = (value: string) => {
    if(value == "first"){
      setFirst(true)
      form.setFieldsValue({ parentId: 0 });
    }else{
      removeItemById(updateId)
      setFirst(false)
      form.setFieldsValue({ parentId: 1 });
    }
    
  };

  const onFinish = async (values: any) => {
   let level = 0;
   if(values.categoryLevel =="first"){
    level = 1;
   }else{
    level = 2;
   }
   const categoryData = {
      categoryRank: values.rank,
      categoryName: values.name,
      categoryLevel: level,
      parentId:values.parentId,
      id : ""
    }
    if(updateId == '-1'){
      try {
        await category_add(categoryData);
        message.success("添加分类数据成功")
      } catch (error) {
        message.error("添加数据失败")
      } 
    }else{
      try {
        categoryData.id = updateId;
        await category_update(categoryData);
        message.success("修改分类数据成功")
      } catch (error) {
        message.error("修改分类数据失败")
      } 
    }


    fetchData()
    setIsModalOpen(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
    <h3 className='text-lg font-bold mb-5' >分类管理</h3>
    <Flex justify='flex-end' style={{marginBottom:"30px"}}><Button type="primary" onClick={()=>showModal("-1")}>添加分类</Button></Flex>
  <Table<DataType>
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey={(item) => item.id} // 为每一行定义唯一的 key
      expandable={{
        expandedRowRender: (record) => (
          <Table<ChildrenItem>
            columns={[
              { title: 'id', dataIndex: 'id', key: 'id' },
              { title: '名称', dataIndex: 'name', key: 'name' },
              { title: '排序值', dataIndex: 'rank', key: 'rank' },
              {
                title: '操作',
                key: 'operation',
                render: (item) => (
                  <Space size="middle">
                    <Button onClick={()=>showModal(item.id)}>修改</Button>

                    <Popconfirm
                    title="是否确认删除"
                    description="您确认要删除吗?"
                    onConfirm={()=>confirm(item.id)}
                    onCancel={cancel}
                    okText="是"
                    cancelText="否"
                  >
                    <Button danger>删除</Button>
                  </Popconfirm>
                  </Space>
                ),
              },
            ]}
            dataSource={record.category2}
            pagination={false}
            rowKey={(item) => item.id} // 为每一行定义唯一的 key
          />
        ),
      }}
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
     
      <Form.Item name="categoryLevel" label="分类级别" rules={[{ required: true }]}>
        <Select
          placeholder="选择分类级别"
          onChange={onGenderChange}
          allowClear
        >
          <Option value="first">一级分类</Option>
          <Option value="second">二级分类</Option>
        </Select>
      </Form.Item>
      <Form.Item name="name" label="类别名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="rank" label="排序值" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      {
        !isSelectedFirst && 
        <Form.Item name="parentId" label="父类Id" rules={[{ required: true }]}>
        <Select
          placeholder="选择分类级别"
          onChange={onGenderChange}
          allowClear
        >
          {
            firstArray.map((item:any) => (
              <Option key={item.id} value={item.id}>{item.categoryName}</Option>
            ))
          }
        </Select>
      </Form.Item>
      }

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
    </>

  );
};

export default App;
