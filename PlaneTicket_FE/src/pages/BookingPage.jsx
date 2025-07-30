"use client"

import { useState, useEffect } from "react"
import { Card, Button, Input, Select, Divider, Form, Typography, Tag, Avatar, Tooltip, Spin } from "antd"
import {
  UserOutlined,
  PhoneOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { useLocation } from "react-router-dom"

const { Option } = Select
const { Title, Text } = Typography
const { TextArea } = Input

export default function BookingPage() {
  // Mock location and params for demo
  // Thay thế dòng mock này:
  // const flightId = "123" // In real app, get from useLocation

  // Bằng code gốc của bạn:
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const flightId = params.get("id")

  const [flight, setFlight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    if (flightId) {
      setLoading(true)
      fetch(
        `https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Flight/GetFlightById/${flightId}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setFlight(data)
          setTotalPrice(data.flightPrice || 0)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching flight:", error)
          setLoading(false)
        })
    }
  }, [flightId])

  // State cho các trường cần thiết
  const [buyerName, setBuyerName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [seatNumber, setSeatNumber] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [bookingTime] = useState(dayjs().toISOString())
  const [status] = useState("pending")
  const [separateName, setSeparateName] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [seatPrice, setSeatPrice] = useState(0)

  // Hàm đặt vé
  const handleBookTicket = async () => {
    if (!flight) {
      alert("Thông tin chuyến bay chưa được tải!")
      return
    }

    try {
      const values = await form.validateFields()
      if (!selectedSeat) {
        alert("Vui lòng chọn ghế!")
        return
      }

      const body = {
        id: "",
        flightId,
        seatNumber: selectedSeat.seatNumber,
        buyerName,
        buyerEmail,
        buyerPhone,
        totalPrice: (flight.flightPrice || 0) + (seatPrice || 0),
        bookingTime,
        status,
      }

      const res = await fetch(
        "https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Ticket/BookTicket",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      )

      const data = await res.json()
      alert("Đặt vé thành công!")
    } catch (err) {
      console.error("Booking error:", err)
      alert("Đặt vé thất bại!")
    }
  }

  const getAirlineLogo = (airline) => {
    const logos = {
      "Vietnam Airlines": "https://upload.wikimedia.org/wikipedia/vi/3/3b/Vietnam_Airlines_logo.png",
      "Vietjet Air": "https://cdn3657.cdn4s7.io.vn/media/logo/logo-vietjet-air.png",
      default: "https://cdn-icons-png.flaticon.com/512/69/69524.png",
    }
    return logos[airline] || logos.default
  }

  const getFlightDuration = (departure, arrival) => {
    const duration = dayjs(arrival).diff(dayjs(departure), "minute")
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return `${hours}h ${minutes}m`
  }

  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return
    setSelectedSeat(seat)
    setSeatNumber(seat.seatNumber)
    setSeatPrice(seat.seatPrice)
  }

  const getSeatColor = (seat) => {
    if (seat.isBooked) return "bg-red-100 text-red-400 cursor-not-allowed"
    if (selectedSeat?.seatNumber === seat.seatNumber) return "bg-blue-500 text-white"
    return "bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer"
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text className="text-lg">Đang tải thông tin chuyến bay...</Text>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <Title level={3} className="text-red-600">
            Không tìm thấy thông tin chuyến bay
          </Title>
          <Text type="secondary">Vui lòng kiểm tra lại hoặc chọn chuyến bay khác</Text>
          <div className="mt-4">
            <Button type="primary" size="large">
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Title level={2} className="!mb-0 !text-gray-800">
              Đặt vé máy bay
            </Title>
            <div className="flex items-center gap-4">
              <Tag color="processing" className="px-3 py-1">
                <SafetyCertificateOutlined className="mr-1" />
                Bảo mật SSL
              </Tag>
              <Text type="secondary" className="text-sm">
                Bước 2/3: Thông tin hành khách
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Booking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chuyến bay đã chọn */}
            <Card
              className="!border-0 shadow-lg rounded-2xl overflow-hidden"
              styles={{
                body: { padding: 0 },
              }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <EnvironmentOutlined className="text-lg" />
                  </div>
                  <Title level={4} className="!mb-0 !text-white">
                    Chuyến bay đã chọn
                  </Title>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Flight Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar src={getAirlineLogo(flight.airline)} size={48} className="border-2 border-gray-100" />
                      <div>
                        <Title level={5} className="!mb-1 !text-blue-600">
                          {flight.airline}
                        </Title>
                        <Text type="secondary" className="text-sm">
                          {dayjs(flight.departureTime).format("DD/MM/YYYY")} • Airbus 330
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500">
                        {flight.flightPrice?.toLocaleString() || "0"} VND
                      </div>
                      <Text type="secondary" className="text-sm">
                        Mã chuyến bay: {flight.id}
                      </Text>
                    </div>
                  </div>
                  {/* Flight Route */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">
                          {dayjs(flight.departureTime).format("HH:mm")}
                        </div>
                        <div className="text-lg font-semibold text-blue-600 mt-1">
                          {flight.from === "Hà Nội" ? "HAN" : "SGN"}
                        </div>
                        <Text type="secondary" className="text-sm">
                          {flight.from}
                        </Text>
                      </div>
                      <div className="flex-1 mx-8">
                        <div className="relative">
                          <div className="h-px bg-gray-300 w-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3">
                            <div className="text-center">
                              <ClockCircleOutlined className="text-gray-400 mb-1" />
                              <div className="text-sm text-gray-600 font-medium">
                                {getFlightDuration(flight.departureTime, flight.arrivalTime)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">
                          {dayjs(flight.arrivalTime).format("HH:mm")}
                        </div>
                        <div className="text-lg font-semibold text-blue-600 mt-1">
                          {flight.to === "TP.HCM" ? "SGN" : "HAN"}
                        </div>
                        <Text type="secondary" className="text-sm">
                          {flight.to}
                        </Text>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button icon={<ReloadOutlined />} className="border-green-200 text-green-600 hover:bg-green-50">
                      Chọn lại chuyến bay
                    </Button>
                    <Button type="link" icon={<InfoCircleOutlined />} className="text-blue-500">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chọn ghế */}
            <Card className="!border-0 shadow-lg rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCardOutlined className="text-purple-600" />
                </div>
                <Title level={4} className="!mb-0">
                  Chọn ghế ngồi
                </Title>
              </div>
              {flight?.seats ? (
                <div className="space-y-6">
                  {/* Seat Map Legend */}
                  <div className="flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 border border-green-200 rounded"></div>
                      <Text className="text-sm">Ghế trống</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <Text className="text-sm">Ghế đã chọn</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 border border-red-200 rounded"></div>
                      <Text className="text-sm">Ghế đã đặt</Text>
                    </div>
                  </div>
                  {/* Seat Grid */}
                  <div className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-2xl border-2 border-dashed border-blue-200">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                        <span className="text-blue-600 font-semibold">✈️ Đầu máy bay</span>
                      </div>
                    </div>
                    {/* Simple seat grid for demo */}
                    <div className="max-w-md mx-auto">
                      <div className="grid grid-cols-3 gap-4">
                        {flight.seats.map((seat) => (
                          <Tooltip
                            key={seat.seatNumber}
                            title={
                              seat.isBooked
                                ? "Ghế đã được đặt"
                                : `${seat.seatNumber} - ${seat.seatPrice?.toLocaleString() || "0"} VND`
                            }
                          >
                            <div
                              className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 ${getSeatColor(seat)} ${
                                seat.isBooked
                                  ? "border-red-200"
                                  : selectedSeat?.seatNumber === seat.seatNumber
                                    ? "border-blue-600"
                                    : "border-green-200"
                              }`}
                              onClick={() => handleSeatSelect(seat)}
                            >
                              {seat.seatNumber}
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Selected Seat Info */}
                  {selectedSeat && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {selectedSeat.seatNumber}
                          </div>
                          <div>
                            <Text className="font-semibold">Ghế đã chọn: {selectedSeat.seatNumber}</Text>
                            <div className="text-sm text-gray-600">
                              {selectedSeat.seatNumber.startsWith("A") || selectedSeat.seatNumber.startsWith("F")
                                ? "Ghế cửa sổ"
                                : "Ghế giữa"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">
                            +{(selectedSeat.seatPrice || 0).toLocaleString()} VND
                          </div>
                          <div className="text-xs text-gray-500">Phí ghế</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Text type="secondary">Đang tải thông tin ghế...</Text>
                </div>
              )}
            </Card>

            {/* Hành khách */}
            <Card className="!border-0 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-blue-600" />
                  </div>
                  <Title level={4} className="!mb-0">
                    Thông tin hành khách
                  </Title>
                </div>
              </div>
              <Form form={form} layout="vertical" className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag color="blue" className="px-3 py-1">
                      1. Người lớn
                    </Tag>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Form.Item
                      label="Họ và tên"
                      name="buyerName"
                      rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                    >
                      <Input
                        placeholder="Nhập họ và tên"
                        size="large"
                        prefix={<UserOutlined className="text-gray-400" />}
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="buyerEmail"
                      rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                    >
                      <Input
                        placeholder="Nhập email"
                        size="large"
                        prefix={<UserOutlined className="text-gray-400" />}
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <Form.Item
                      label="SĐT"
                      name="buyerPhone"
                      rules={[{ required: true, message: "Vui lòng nhập sđt!" }]}
                    >
                      <Input
                        placeholder="Nhập SĐT"
                        size="large"
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </Card>
          </div>

          {/* Right: Giá vé và dịch vụ */}
          <div className="space-y-6">
            <Card className="!border-0 shadow-lg rounded-2xl sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <Title level={4} className="!mb-0">
                  Chi tiết giá vé
                </Title>
                <Tooltip title="Thông tin chi tiết về giá vé">
                  <Button type="text" icon={<InfoCircleOutlined />} className="text-gray-400" />
                </Tooltip>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <Text className="font-medium">Người lớn</Text>
                      <div className="text-xs text-gray-500">Số lượng: 1</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{(flight.flightPrice || 0).toLocaleString()} VND</div>
                  </div>
                </div>
                {selectedSeat && (
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCardOutlined className="text-purple-600 text-sm" />
                      </div>
                      <div>
                        <Text className="font-medium">Ghế {selectedSeat.seatNumber}</Text>
                        <div className="text-xs text-gray-500">Phí chọn ghế</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">+{(seatPrice || 0).toLocaleString()} VND</div>
                    </div>
                  </div>
                )}
                <Divider className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <Text type="secondary">Giá vé cơ bản</Text>
                    <Text>{(flight.flightPrice || 0).toLocaleString()} VND</Text>
                  </div>
                  {selectedSeat && (
                    <div className="flex justify-between text-sm">
                      <Text type="secondary">Phí chọn ghế</Text>
                      <Text>{(seatPrice || 0).toLocaleString()} VND</Text>
                    </div>
                  )}
                </div>
                <Divider className="my-4" />
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CreditCardOutlined className="text-orange-600" />
                    <Text className="font-bold text-lg">Tổng thanh toán</Text>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {((flight.flightPrice || 0) + (seatPrice || 0)).toLocaleString()} VND
                    </div>
                    <Text type="secondary" className="text-xs">
                      Đã bao gồm VAT
                    </Text>
                  </div>
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                block
                className="!h-14 !text-lg font-semibold mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleBookTicket}
              >
                Xác nhận đặt vé
              </Button>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <SafetyCertificateOutlined />
                  <Text className="text-green-700">Thanh toán an toàn với mã hóa SSL 256-bit</Text>
                </div>
              </div>
            </Card>

            {/* Support Card */}
            <Card className="!border-0 shadow-lg rounded-2xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CustomerServiceOutlined className="text-blue-600 text-xl" />
                </div>
                <Title level={5} className="!mb-2">
                  Cần hỗ trợ?
                </Title>
                <Text type="secondary" className="text-sm block mb-4">
                  Đội ngũ hỗ trợ 24/7 sẵn sàng giúp bạn
                </Text>
                <Button type="primary" ghost block size="large">
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Hotline Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip title="Hotline hỗ trợ 24/7" placement="left">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PhoneOutlined />}
            className="!w-14 !h-14 bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-2xl hover:from-green-600 hover:to-green-700 animate-pulse"
          />
        </Tooltip>
      </div>
    </div>
  )
}
