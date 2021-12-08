import React, { useState } from "react";
import { Drawer, Button, Space } from "antd";
import { SlidersOutlined } from "@ant-design/icons";

function Footer() {
  const [profileVisible, setProfileVisible] = useState(false);
  const showProfile = () => {
    setProfileVisible(true);
  };
  const onClose = () => {
    setProfileVisible(false);
  };

  return (
    <div
      style={{
        height: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        backgroundColor: "#eeeeee",
      }}
    >
      <Button
        type="default"
        shape="circle"
        icon={<SlidersOutlined />}
        size="large"
        onClick={showProfile}
      />
      <Drawer
        title="Basic Drawer"
        placement="bottom"
        height={500}
        className="menu_drawer"
        onClose={onClose}
        visible={profileVisible}
        extra={
          <Space>
            <Button onClick={onClose}>setting</Button>
          </Space>
        }
      ></Drawer>
    </div>
  );
}

export default Footer;
