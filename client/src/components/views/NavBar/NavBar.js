import React, { useState } from "react";
import UserMenu from "./Sections/UserMenu";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./Sections/Navbar.css";

function NavBar() {
  // for Drawer start
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  // for Drawer end
  return (
    <nav
      className="menu"
      style={{ position: "fixed", zIndex: 5, width: "100%" }} //fixed 상단고정
    >
      <div className="menu__logo">
        <a href="/">PlayGround</a>
      </div>
      <div className="menu__container">
        <div className="menu_user">
          <UserMenu mode="horizontal" />
        </div>
        <Button
          className="menu_drawer-button"
          type="defalut"
          onClick={showDrawer}
          icon={<MenuOutlined />}
        />
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <UserMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
