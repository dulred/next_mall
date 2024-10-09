
import { Flex,Button } from "antd";
import Image from 'next/image';
import { useState } from "react";

export default async function Page( ) {
  
  return (
    <main>
      <h3 className='text-lg font-bold mb-5' >人气Top排行榜配置</h3>
      <Flex gap="middle" wrap>
        {
          Array.from({length: 4}).map((_,i)=>
           (

            <Flex vertical gap="middle" align="center" wrap style={{marginRight:"30px"}}>
                <Image
                  src="https://via.placeholder.com/152x152"
                  key={i}
                  alt={i.toString()}
                  width={152}
                  height={152}
                />
                <Flex gap="middle">
                  <Button type="primary">选择商品</Button>
                  <Button type="primary">上移</Button>
                  <Button type="primary">下移</Button>
                </Flex>
                
            </Flex>
         
            )
          )
        }
      
      </Flex>
    </main>
  );
}