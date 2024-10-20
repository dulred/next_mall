'use client'
import { goods_add, goods_all, goods_byId, goods_delete, goods_update, tmp_goods_upload } from "@/app/service/model-management/product";
import { useEffect, useState } from "react";
import React from 'react';
import { Button, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Upload } from 'antd';
import type { GetProp, PopconfirmProps, TableColumnsType, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import Image from "next/image";
import { category_add, category_byId, category_delete, category_first, category_second, category_update } from "@/app/service/model-management/category";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { member_all, member_update } from "@/app/service/model-management/member";
import { admin_all } from "@/app/service/system-setting/admin";


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


const App: React.FC = () => {

  const  [t_data,setTdata]  = useState([])
  const { styles } = useStyle();

  const fetchData = async() =>{
   const {data} = await admin_all()
   setTdata(data.result.items)
  }

  useEffect(()=>{
    fetchData()
  },[])


    const confirm = async(id:string,type:number,value:any) => {
      if(value == "-1"){
        message.success('注销成功');
        value = 1
      }else{
        const v = value ? 0 : 1
        if(v==1){
          message.success('禁用成功');
        }else{
          message.success('激活成功');
        }
        value = v
      }
      const userData = {
        id: id,
        type: type,
        value: value,
      }
      await member_update(userData)
      fetchData()
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
  { title: '角色Id', dataIndex: 'roleId', key: 'roleId' ,width: 100},
  { title: '性别', dataIndex: 'gender', key: 'gender' ,width: 100},
  { title: '手机', dataIndex: 'mobile', key: 'mobile' ,width: 100},
  { title: '生日', dataIndex: 'birthday', key: 'birthday',width: 150 },
  { title: '省份编码', dataIndex: 'provinceCode', key: 'provinceCode' ,width: 100},
  { title: '城市编码', dataIndex: 'cityCode', key: 'cityCode',width: 100 },
  { title: '市区编码', dataIndex: 'countyCode', key: 'countyCode' ,width: 100},
  { title: '备注', dataIndex: 'remark', key: 'remark' ,width: 200},
  { title: '是否禁用', dataIndex: 'isActive', key: 'isActive',width: 100,
    render: (item: any) => (
      <Tag color={item ? 'success' : 'error'}>{item? '否' : '是'}</Tag>
    ),
  },
  { title: '是否注销', dataIndex: 'isDeleted', key: 'isDeleted',width: 100,
    render: (item: any) => (
      <Tag color={item?'error' : 'success'}>{item? '是' : '否'}</Tag>
    ),

   },
  { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime',width: 200 },
  { title: '登出时间', dataIndex: 'logoutTime', key: 'logoutTime',width: 200 },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: 
    (item) => 
    <Space>
      
      
      <Popconfirm
        title={item.isActive ? `禁用操作` : "激活操作"}
        description={item.isActive ? `你确定要禁用吗？` : "你确定要激活吗？"}
        onConfirm={()=>confirm(item.id,0,item.isActive)}
            okText="是"
        cancelText="否"
      >
        <Button type="primary">{item.isActive ? "禁用": "激活"}</Button>
      </Popconfirm>
      <Popconfirm
        title="注销操作"
        description="您确认要注销此用户吗?"
        onConfirm={()=>confirm(item.id,1,"-1")}
        okText="是"
        cancelText="否"
      >
       <Button type="primary" danger>注销</Button>
      </Popconfirm>
    </Space>,
  },
];


  const dataSource= t_data.map((item:any,index)=>{
    return {
      key: `${index}`,
      id: item.id,
      nickname: item.nickname,
      avatar: item.avatar,
      roleId: item.roleId,
      cityCode: item.cityCode,
      provinceCode: item.provinceCode,
      countyCode: item.countyCode,
      gender: item.gender,
      isActive: item.isActive,
      isDeleted: item.isDeleted,
      loginTime: item.loginTime,
      logoutTime: item.logoutTime,
      mobile:item.mobile,
      remark: item.remark,
      birthday: item.birthday,
    } 
  })
  

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
    </main>
  
  );
};

export default App;