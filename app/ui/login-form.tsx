'use client';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import {login} from '@/app/service/user/login';
import { useRouter} from 'next/navigation';
import { message } from "antd" ;

export default function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const onFinish = async (values: any) => {

    try {
      const response = await login(values.username,values.password)
      const data = response.data;
      if(data.code == 200){
        messageApi.open({
          type: 'success',
          content: data.msg,
        });
        router.push('/dashboard');
      }else{
        messageApi.open({
          type: 'error',
          content: data.msg,
        }); 
      }
  } catch (error) {
      console.error(error); // 处理错误
  }
    

  };


  return (
    <>
     {contextHolder}
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{backgroundColor: "rgba(249, 250, 251)",padding: "2rem 0.75rem"}}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};
