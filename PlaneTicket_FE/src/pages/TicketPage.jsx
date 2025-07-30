"use client"
import { useEffect, useState } from "react"
import { Card, Button, Spin, Badge, Divider, Modal, Form, Input, message, Typography, Avatar, Select } from "antd"
import {
  CalendarOutlined,
  PhoneOutlined,
  EditOutlined,
  UserOutlined,
  MailOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text } = Typography

export default function TicketPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [form] = Form.useForm()
  const [seatOptions, setSeatOptions] = useState([])

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = () => {
    setLoading(true)
    fetch("https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Ticket")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        message.error("Không thể tải danh sách vé!")
      })
  }

  const handleOpenModal = async (ticket) => {
    setEditingTicket(ticket)
    form.setFieldsValue({
      buyerName: ticket.buyerName,
      buyerEmail: ticket.buyerEmail,
      buyerPhone: ticket.buyerPhone,
      seatNumber: ticket.seatNumber,
      totalPrice: ticket.totalPrice,
      status: ticket.status,
    })
    // Lấy danh sách ghế từ API chuyến bay
    const res = await fetch(
      `https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Flight/GetFlightById/${ticket.flightId}`,
    )
    const flight = await res.json()
    setSeatOptions(flight.seats.filter((s) => !s.isBooked || s.seatNumber === ticket.seatNumber))
    setIsModalOpen(true)
  }

  const handleUpdateTicket = async () => {
    try {
      setUpdateLoading(true)
      const values = await form.validateFields()

      const body = {
        ...editingTicket,
        ...values,
      }

      const res = await fetch(
        `https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Ticket/UpdateTicket/${editingTicket.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      )

      if (res.ok) {
        message.success("Cập nhật vé thành công!")
        setIsModalOpen(false)
        fetchTickets() // Reload tickets
      } else {
        message.error("Cập nhật thất bại!")
      }
    } catch (err) {
      message.error("Vui lòng nhập đủ thông tin!")
    } finally {
      setUpdateLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "đã xác nhận":
        return "#52c41a"
      case "pending":
      case "chờ xử lý":
        return "#faad14"
      case "cancelled":
      case "đã hủy":
        return "#ff4d4f"
      default:
        return "#1890ff"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative py-12 px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Vé máy bay đã đặt</h1>
          <p className="text-xl opacity-90">Quản lý và cập nhật thông tin vé của bạn</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">✈️</div>
              <Title level={4} type="secondary">
                Không có vé nào đã đặt
              </Title>
              <Text type="secondary">Hãy đặt vé đầu tiên của bạn!</Text>
            </div>
          ) : (
            tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="rounded-xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-4 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar size={40} className="bg-blue-500" icon={<UserOutlined />} />
                      <div>
                        <Title level={5} className="!mb-0 text-blue-700">
                          {ticket.buyerName}
                        </Title>
                        <Text type="secondary" className="text-sm">
                          Mã vé: {ticket.id}
                        </Text>
                      </div>
                    </div>
                    <Badge count={ticket.status} style={{ backgroundColor: getStatusColor(ticket.status) }} />
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-blue-500" />
                    <Text className="text-sm">{ticket.buyerEmail}</Text>
                  </div>

                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-green-500" />
                    <Text className="text-sm">{ticket.buyerPhone}</Text>
                  </div>

                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-purple-500" />
                    <Text className="text-sm">Ghế: {ticket.seatNumber}</Text>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <Text className="font-medium text-orange-700">Tổng giá</Text>
                      <Text className="text-lg font-bold text-orange-600">
                        {ticket.totalPrice?.toLocaleString()} VND
                      </Text>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarOutlined />
                    <Text className="text-sm">{dayjs(ticket.bookingTime).format("DD/MM/YYYY HH:mm")}</Text>
                  </div>
                  {!(ticket.status?.toLowerCase() === "cancelled" || ticket.status?.toLowerCase() === "đã hủy") && (
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        className="bg-blue-500 hover:bg-blue-600 border-0"
                        onClick={() => handleOpenModal(ticket)}
                      >
                        Cập nhật
                      </Button>
                      <Button
                        danger
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        className="bg-red-500 hover:bg-red-600 border-0"
                        onClick={async () => {
                          const res = await fetch(
                            `https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Ticket/CancelTicket/${ticket.id}`,
                            { method: "PUT" },
                          )
                          if (res.ok) {
                            message.success("Hủy vé thành công!")
                            fetchTickets()
                          } else {
                            message.error("Hủy vé thất bại!")
                          }
                        }}
                      >
                        Hủy vé
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Update Ticket Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <EditOutlined className="text-blue-600" />
            </div>
            <div>
              <Title level={4} className="!mb-0">
                Cập nhật thông tin vé
              </Title>
              <Text type="secondary" className="text-sm">
                Mã vé: {editingTicket?.id}
              </Text>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={updateLoading}
            onClick={handleUpdateTicket}
            icon={<CheckCircleOutlined />}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Cập nhật
          </Button>,
        ]}
        width={600}
        className="top-8"
      >
        <div className="py-4">
          <Form form={form} layout="vertical" className="space-y-4">
            {/* Thông tin khách hàng (có thể sửa) */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <UserOutlined className="text-blue-600" />
                <Title level={5} className="!mb-0 text-blue-700">
                  Thông tin hành khách
                </Title>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Họ và tên"
                  name="buyerName"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input
                    placeholder="Nhập họ và tên"
                    size="large"
                    prefix={<UserOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="buyerEmail"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập email" size="large" prefix={<MailOutlined className="text-gray-400" />} />
                </Form.Item>
              </div>

              <Form.Item
                label="Số điện thoại"
                name="buyerPhone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  size="large"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </div>

            {/* Thông tin chuyến bay (chỉ sửa số ghế) */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <EnvironmentOutlined className="text-purple-600" />
                <Title level={5} className="!mb-0 text-purple-700">
                  Thông tin chuyến bay
                </Title>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Số ghế"
                  name="seatNumber"
                  rules={[{ required: true, message: "Vui lòng chọn số ghế!" }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn số ghế"
                    size="large"
                    optionFilterProp="children"
                  >
                    {seatOptions.map((seat) => (
                      <Select.Option key={seat.seatNumber} value={seat.seatNumber}>
                        {seat.seatNumber} ({seat.seatPrice.toLocaleString()} VND)
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Input disabled value={editingTicket?.status} />
                </Form.Item>
              </div>
            </div>

            {/* Thông tin giá vé (bôi đen, không cho sửa) */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCardOutlined className="text-orange-600" />
                <Title level={5} className="!mb-0 text-orange-700">
                  Thông tin giá vé
                </Title>
              </div>
              <Form.Item label="Tổng giá vé (VND)" name="totalPrice">
                <Input
                  type="number"
                  disabled
                  value={editingTicket?.totalPrice}
                  prefix={<CreditCardOutlined className="text-gray-400" />}
                  suffix="VND"
                />
              </Form.Item>
            </div>
          </Form>
          {/* Warning Notice giữ nguyên */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-yellow-600 mt-0.5">⚠️</div>
              <div>
                <Text className="text-yellow-800 font-medium">Lưu ý quan trọng:</Text>
                <Text className="text-yellow-700 text-sm block mt-1">
                  Việc thay đổi thông tin vé có thể ảnh hưởng đến chuyến bay của bạn. Vui lòng kiểm tra kỹ thông tin
                  trước khi cập nhật.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
