'use client'
import { goods_jinpin, goods_list_byCategoryId, goods_new, update_goods_config } from "@/app/service/home-page/goods_config";
import { category_second } from "@/app/service/model-management/category";
import { Flex,Button, Modal, Select, Space, TableProps, Tag, Table } from "antd";
import Image from 'next/image';
import { useEffect, useState } from "react";




export default function Page() {
  const  [list_date,setListData] =useState([])
  const  [t_date,setTdata] =useState([])
  const [category,setCategory] = useState([])
  const [ids,setIds] = useState([])
  const [pos,setPos] = useState('')

  const fetchData = async ()=>{
   const res =  await goods_jinpin()
   setListData(res.data.result.items)
   setIds(res.data.result.ids)
  }
  useEffect(()=>{
    fetchData()
  },[])
  
  const changeIds = async (ids:any)=>{
    let config_value:string = ids[0]
    for (let i=1; i<ids.length; i++){
      config_value += ","+ids[i]
    }
    const configData = {
      config_type: 1,
      config_value: config_value
    }
    await update_goods_config(configData)
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const showModal = async(id:string) => {
    setPos(id)
    setIsModalOpen(true);
    const res = await category_second()
    setCategory(res.data.result)
  };
  const onChange = async (value: string) => {
    const res = await goods_list_byCategoryId(value)
    setTdata(res.data.result)
  };

  const handleSelect = async (id: string) => {
    // 使用 prevIds 更新 IDs
    const newIds = await new Promise((resolve) => {
        setIds((prevIds: any) => {
            const updatedIds = prevIds.map((item: any, i: any) => (i === Number(pos) ? id : item));
            resolve(updatedIds); // 解析 Promise
            return updatedIds;
        });
    });

    setIsModalOpen(false);
    await changeIds(newIds); // 确保在更新后再进行数据获取
    await fetchData(); // 获取新的数据
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
  
  const handleMove  = async(pos:number,flag:number)=>{
      if(flag === 0){
        const temp = ids[pos]
        ids[pos] = ids[pos-1]
        ids[pos-1] = temp
      }else{
        const temp = ids[pos]
        ids[pos] = ids[pos+1]
        ids[pos+1] = temp
      }
      await changeIds(ids); // 确保在更新后再进行数据获取
      await fetchData(); // 获取新的数据
  }
  
  return (
    <main>
      <h3 className='text-lg font-bold mb-5' >精品推荐配置</h3>
      <Flex gap="middle" wrap>
        {
          list_date.map((item:any,i)=>
           (

            <Flex vertical gap="middle" align="center" wrap style={{marginRight:"30px"}} key={i}>
                <Image
                  src={item.pictureUrl}
                  key={i}
                  alt={i.toString()}
                  width={152}
                  height={152}
                />
                <Flex gap="middle">
                  <Button type="primary" onClick={()=>showModal(i.toString())}>选择商品</Button>
                  {i!=0 &&<Button type="primary" onClick={()=>handleMove(i,0)}>上移</Button>}
                  {i!=(list_date.length-1)&&<Button type="primary" onClick={()=>handleMove(i,1)}>下移</Button>}
                </Flex>
              
            </Flex>
         
            )
          )
        }
      
      </Flex>

      <Modal title="选择商品" open={isModalOpen}
         footer={
          <Button type="primary" onClick={handleCancel}>
            取消
          </Button>
        }
        onCancel={handleCancel}
        width={900}
    > 
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

      </Modal>
    </main>
  );
}