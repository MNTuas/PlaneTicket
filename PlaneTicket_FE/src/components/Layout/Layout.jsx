import React from "react";
import { Input, Button, Avatar } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1146d6] py-4 px-8 flex items-center justify-between rounded-b-3xl">
        <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://cdn3657.cdn4s7.io.vn/media/logo/layout-01.png"
            alt="Logo"
            className="w-full h-12 "
          />
        </div>
        {/* Search */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nhập nội dung cần tìm"
            className="w-64"
            size="large"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className="bg-[#0090ff] font-semibold"
            size="large"
          >
            Tìm kiếm
          </Button>
        </div>
        </div>
        {/* User Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-white text-xl" />
            <span className="text-white font-medium">Đăng nhập</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Đăng ký</span>
          </div>
          <Avatar src="https://cdn3657.cdn4s7.io.vn/media/icon/ellipse-1.png" />
          <Avatar src="https://cdn3657.cdn4s7.io.vn/media/icon/icon-plane.png" />
        </div>
      </div>
      {/* Navbar */}
      <div className="flex items-center px-8 py-4 gap-8">
        <img src="https://cdn3657.cdn4s7.io.vn/media/logo/logo-vietnam-tickets.webp" alt="VietnamTickets" className="h-16" />
        <nav className="flex gap-8 text-lg font-medium">
          <a href="/" className="text-[#1146d6]">TRANG CHỦ</a>
          <a href="/ticket">KIỂM TRA VÉ MÁY BAY ĐÃ ĐẶT</a>
          
        </nav>
        <Button type="primary" danger className="ml-auto px-6 font-bold">
          Trợ giúp
        </Button>
      </div>
      {/* Main Content */}
      <main className="px-8">{children}</main>
    </div>
  );
};

export default Layout;