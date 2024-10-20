'use client'
import Link from 'next/link';
import { useAppDispatch } from '@/app/lib/hooks';
import { clearToken } from '@/app/lib/slices/authSlice';
import { usePathname, useRouter } from 'next/navigation';
// export default function SideNav() {
//   return (
//     <div className="flex h-full flex-col px-3 py-4 md:px-2">
//       <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
//         <NavLinks />
//         <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
//         <button onClick={logOut} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
//           <PowerIcon className="w-6" />
//           <div className="hidden md:block" >Sign Out</div>
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect,useState } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  PieChartOutlined,
  HomeOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { getOpenKeys } from '@/app/lib/utils';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '/dashboard', icon: <PieChartOutlined />, label: ( <Link href="/dashboard">大盘数据</Link> ) },
  {
    key: 'home-page',
    label: '首页配置',
    icon: <HomeOutlined />,
    children: [
      { key: '/dashboard/home-page/main-banner', label: ( <Link href="/dashboard/home-page/main-banner">主尾图配置</Link> ) },
      { key: '/dashboard/home-page/carousel', label: ( <Link href="/dashboard/home-page/carousel">轮播图配置</Link> ) },
      { key: '/dashboard/home-page/new-preview', label: ( <Link href="/dashboard/home-page/new-preview">新品速览配置</Link> ) },
      { key: '/dashboard/home-page/recommendations', label: ( <Link href="/dashboard/home-page/recommendations">精品推荐配置</Link> ) },
      { key: '/dashboard/home-page/top-ranking', label: ( <Link href="/dashboard/home-page/top-ranking">人气Top排行榜配置</Link> ) },
    ],
  },
  {
    key: 'model-management',
    label: '基本模块',
    icon: <AppstoreOutlined />,
    children: [
      { key: '/dashboard/model-management/category-management', label: ( <Link href="/dashboard/model-management/category-management">分类管理</Link> ) },
      { key: '/dashboard/model-management/product-management', label: ( <Link href="/dashboard/model-management/product-management">商品管理</Link> ) },
      { key: '/dashboard/model-management/member-management', label: ( <Link href="/dashboard/model-management/member-management">会员管理</Link> ) },
      { key: '/dashboard/model-management/order-management', label: ( <Link href="/dashboard/model-management/order-management">订单管理</Link> ) },
    ],
  },
  {
    key: 'sku',
    label: 'sku管理',
    icon: <AppstoreOutlined />,
    children: [
      { key: '/dashboard/sku/style', label: ( <Link href="/dashboard/sku/style">商品style配置</Link> ) },
      { key: '/dashboard/sku/spec', label: ( <Link href="/dashboard/sku/spec">商品spec规格</Link> ) },
      { key: '/dashboard/sku/sku', label: ( <Link href="/dashboard/sku/sku">商品sku配置</Link> ) },
      { key: '/dashboard/sku/detail', label: ( <Link href="/dashboard/sku/detail">商品detail图配置</Link> ) },
      { key: '/dashboard/sku/thumb', label: ( <Link href="/dashboard/sku/thumb">商品thumb图配置</Link> ) },
    ],
  },
  {
    key: 'system-setting',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      { key: '/dashboard/system-setting/admin-settings', label: ( <Link href="/dashboard/system-setting/admin-settings">管理员配置</Link> ) },
      { key: '/dashboard/system-setting/role-settings', label: ( <Link href="/dashboard/system-setting/role-settings">角色管理</Link> ) },
      { key: '/dashboard/system-setting/menu-settings', label: ( <Link href="/dashboard/system-setting/menu-settings">菜单配置</Link> ) },
      { key: '/dashboard/system-setting/permission-settings', label: ( <Link href="/dashboard/system-setting/permission-settings">权限配置</Link> ) },
      { key: '/dashboard/system-setting/buried-point', label: ( <Link href="/dashboard/system-setting/buried-point">埋点数据</Link> ) },
      { key: '/dashboard/system-setting/audit-log', label: ( <Link href="/dashboard/system-setting/audit-log">审计日志</Link> ) },
      { key: '/dashboard/system-setting/monitor', label: ( <Link href="/dashboard/system-setting/monitor">监控与告警</Link> ) }
    ],
  },
];


const App: React.FC = () => {
  const pathname = usePathname()  
  const dispatch = useAppDispatch()
  const logOut = ()=>{
    dispatch(clearToken())
  }
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  useEffect(() => {
    // 每次路径变化时更新 openKeys
    const newOpenKeys = getOpenKeys(pathname);
    setOpenKeys([newOpenKeys]);
  }, [pathname]);
   // 处理 Menu 的展开和关闭事件
   const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };
  console.log(pathname)
  return (
    <div style={{ width: 256,backgroundColor: "#001529"}}>
      {/* <Link href="/" style={{color:"red"}}>撒发顺丰发<MailOutlined /></Link> */}
      <Menu
        selectedKeys={[pathname]}
        openKeys={openKeys}
        defaultSelectedKeys={['/dashboard']}
        defaultOpenKeys={['/dashboard']}
        mode="inline"
        theme="dark"
        items={items}
        className='h-screen'
        onOpenChange={handleOpenChange}
        style={{paddingTop:"3rem"}}
      />
    </div>
  );
};

export default App;