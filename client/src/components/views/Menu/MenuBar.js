import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  VideoCameraOutlined,
  YoutubeOutlined,
  PlusCircleOutlined,
  PushpinOutlined,
} from "@ant-design/icons";

function MenuBar() {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed((collapsed) => !collapsed);
  };
  return (
    <div>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{
          paddingTop: "70px",
          minHeight: "100%",
        }}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}>
            <a href="/exchangerate">ExchangeRate</a>
          </Menu.Item>
          <SubMenu key="sub1" icon={<VideoCameraOutlined />} title="Video">
            <Menu.Item key="3" icon={<YoutubeOutlined />}>
              <a href="/">List</a>
            </Menu.Item>
            <Menu.Item key="4" icon={<PlusCircleOutlined />}>
              <a href="/video/upload">Upload</a>
            </Menu.Item>
            <Menu.Item key="5" icon={<PushpinOutlined />}>
              <a href="/subscription">Subscription</a>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </div>
  );
}

export default MenuBar;
