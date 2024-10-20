'use client'
import { goods_add, goods_all, goods_byId, goods_delete, goods_update, tmp_goods_upload } from "@/app/service/model-management/product";
import { useEffect, useState } from "react";
import React from 'react';
import { Button, Flex, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, Upload } from 'antd';
import type { GetProp, PopconfirmProps, TableColumnsType, TableProps, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import Image from "next/image";
import { category_add, category_byId, category_delete, category_first, category_second, category_update } from "@/app/service/model-management/category";
import { goods_styles_add_random, goods_styles_bycategoryId, goods_styles_delete, goods_styles_update } from "@/app/service/sku/style";


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: any;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App: React.FC = () => {

  const  [t_date,setTdata] =useState([])
  const [category,setCategory] = useState([])
  const [skuData,setSkuData] = useState({})
  const fetchData = async ()=>{
    const res = await category_second()
    setCategory(res.data.result)
  }
  useEffect(()=>{
    fetchData()
  },[])
  

  const onChange = async (id: string) => {
    const skuData = {
      categoryId: id,
      page: 1,
      pageSize: 10
    }
    setSkuData(skuData)
    const res = await goods_styles_bycategoryId(skuData)
    setTdata(res.data.result)
  };
  
  const handleAdd = async(id:string) => {
    // 调用数据库接口生成一行随机数据
    await goods_styles_add_random(id)
    // 更新渲染数据
    const res = await goods_styles_bycategoryId(skuData)
    setTdata(res.data.result)
  };

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
        <Button type="primary" onClick={()=>handleAdd(record.id)}>添加一行</Button>
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
      styles:item.styles
    }
  })


// xx

const [form] = Form.useForm();
const [data3, setData3] = useState<any[]>([]);
const [editingKey, setEditingKey] = useState('');

const isEditing = (record:any) => record.id === editingKey;

const edit = (record:any) => {
  form.setFieldsValue({ style_key: '', style_value: '', ...record });
  setEditingKey(record.id);
};

const handledelete = async(record:any) => {
  await goods_styles_delete(record.id)
  const res = await goods_styles_bycategoryId(skuData)
  setTdata(res.data.result)
};

const cancel = () => {
  setEditingKey('');
};

const save = async (id: any) => {
  try {
    const row = (await form.validateFields()) as any;
    console.log(row)
    const styleData = {
      id: id,
      ...row
    }
    await goods_styles_update(styleData)
    setEditingKey('');
    const res = await goods_styles_bycategoryId(skuData)
    setTdata(res.data.result)
  } catch (errInfo) {
    console.log('Validate Failed:', errInfo);
  }
};

const columns2 = [
  { title: 'id', dataIndex: 'id', key: 'id' },
  { title: '属性名', dataIndex: 'style_key', key: 'style_key', editable: true },
  { title: '属性值', dataIndex: 'style_value', key: 'style_value' , editable: true},
  {
    title: '操作',
    dataIndex: 'operation',
    render: (_: any, record: any) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Typography.Link onClick={() => save(record.id)} style={{ marginInlineEnd: 8 }}>
            保存
          </Typography.Link>
          <Popconfirm title="确定取消吗?" onConfirm={cancel}>
            <a>取消</a>
          </Popconfirm>
        </span>
      ) : (
        <Space>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Typography.Link>
          <Popconfirm title="确认删除吗?" onConfirm={() => handledelete(record)}>
            <Typography.Link disabled={editingKey !== ''}>
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>

      );
    },
  },
];

const mergedColumns = columns2.map((col) => {
  if (!col.editable) {
    return col;
  }
  return {
    ...col,
    onCell: (record:any) => ({
      record,
      // inputType: col.dataIndex === 'age' ? 'number' : 'text',
      inputType: 'text',
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditing(record),
    }),
  };
});



// xx



  return (
    <main>
      <h3 className="text-lg font-bold mb-5">商品sytle配置</h3>

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
                <Form form={form} component={false}>
                  <Table
                    bordered
                    columns={mergedColumns}
                    components={{
                      body: { cell: EditableCell },
                    }}
                    pagination={false}
                    dataSource={record.styles}
                    rowClassName="editable-row"
                    rowKey={(item:any) => item.id} // 为每一行定义唯一的 key
                  />
                 </Form>
              )},
            }}
          />

    </main>
  
  );
};

export default App;