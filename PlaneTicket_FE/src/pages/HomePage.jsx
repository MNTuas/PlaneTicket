"use client"

import { Input, Radio, DatePicker, Select, Checkbox, Button, Card } from "antd"
import { SearchOutlined, SwapOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

const { Option } = Select

export default function FlightBookingPage() {
  const [tripType, setTripType] = useState("oneway")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departureDate, setDepartureDate] = useState(null)
  const [flightList, setFlightList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Flight")
      .then(res => res.json())
      .then(data => setFlightList(data))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-100">
      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Search Form */}
        <div className="w-full lg:w-[520px] p-6 lg:p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4">
              <div className="flex items-center gap-3">
                <SearchOutlined className="text-xl" />
                <h1 className="text-xl font-semibold">Tìm kiếm chuyến bay</h1>
              </div>
            </div>

            <div className="p-6">
              {/* Trip Type */}
              <div className="mb-6">
                <Radio.Group value={tripType} onChange={(e) => setTripType(e.target.value)} className="w-full">
                  <div className="flex gap-6">
                    <Radio value="oneway" className="text-gray-700">
                      Một chiều
                    </Radio>
                    <Radio value="round" className="text-gray-700">
                      Khứ hồi
                    </Radio>
                    <Radio value="multi" className="text-gray-700">
                      Đa chặng
                    </Radio>
                  </div>
                </Radio.Group>
              </div>

              {/* Location Inputs */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        placeholder="Điểm đi"
                        size="large"
                        className="w-full rounded-lg"
                        value={from}
                        onChange={(value) => setFrom(value)}
                      >
                        <Option value="Hà Nội">Hà Nội</Option>
                        <Option value="TP.HCM">TP.HCM</Option>
                      </Select>
                    </div>
                    <Button
                      icon={<SwapOutlined />}
                      className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 rounded-lg"
                      size="large"
                      onClick={() => {
                        // Đảo chiều
                        const temp = from
                        setFrom(to)
                        setTo(temp)
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Select
                    placeholder="Điểm đến"
                    size="large"
                    className="w-full rounded-lg"
                    value={to}
                    onChange={(value) => setTo(value)}
                  >
                    <Option value="Hà Nội">Hà Nội</Option>
                    <Option value="TP.HCM">TP.HCM</Option>
                  </Select>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarOutlined className="text-gray-500" />
                    <span className="text-sm text-gray-600">Ngày đi</span>
                  </div>
                  <DatePicker
                    defaultValue={dayjs("02/08/2025", "DD/MM/YYYY")}
                    format="DD/MM/YYYY"
                    className="w-full rounded-lg"
                    size="large"
                    value={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarOutlined className="text-gray-500" />
                    <span className="text-sm text-gray-600">Ngày về</span>
                  </div>
                  <DatePicker
                    placeholder="Chọn ngày về"
                    format="DD/MM/YYYY"
                    className="w-full rounded-lg"
                    size="large"
                    disabled={tripType === "oneway"}
                  />
                </div>
              </div>

              {/* Passenger and Class */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserOutlined className="text-gray-500" />
                    <span className="text-sm text-gray-600">Hành khách</span>
                  </div>
                  <Select defaultValue="1 Người lớn" className="w-full" size="large">
                    <Option value="1 Người lớn">1 Người lớn</Option>
                  </Select>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">🎫</span>
                    <span className="text-sm text-gray-600">Hạng chỗ</span>
                  </div>
                  <Select defaultValue="Tất cả hạng chỗ" className="w-full" size="large">
                    <Option value="Tất cả hạng chỗ">Tất cả hạng chỗ</Option>
                    <Option value="Phổ thông">Phổ thông</Option>
                    <Option value="Thương gia">Thương gia</Option>
                  </Select>
                </div>
              </div>

              

              {/* Options */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-blue-500">⚙</span>
                  <span className="text-sm text-gray-600">Tùy chọn</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox>
                      <span className="text-sm">Tìm cả tháng</span>
                    </Checkbox>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button
                type="primary"
                icon={<SearchOutlined />}
                className="w-full bg-blue-500 hover:bg-blue-600 border-blue-500 font-semibold text-lg h-12 rounded-lg"
                size="large"
                onClick={() => {
                  if (from && to && departureDate) {
                    navigate(
                      `/flight?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departureDate=${departureDate.format("YYYY-MM-DD")}`
                    );
                  } else {
                    // Có thể hiện thông báo nếu thiếu thông tin
                  }
                }}
              >
                Tìm chuyến bay
              </Button>
            </div>
          </div>

          {/* Phone Icon */}
          <div className="fixed bottom-6 left-6 lg:absolute lg:bottom-8 lg:left-8">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
              <span className="text-white text-xl">📞</span>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/hero-image.png')",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-orange-100/30 to-pink-100/20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
            {/* Main Heading */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center lg:text-left max-w-2xl">
                <h1 className="text-4xl lg:text-6xl font-bold text-orange-600 mb-4 leading-tight">
                  Dễ dàng bay
                  <br />
                  <span className="text-red-500">giá trong tầm tay</span>
                </h1>

                <div className="mt-8 lg:mt-12">
                  <p className="text-lg text-blue-600 font-medium mb-2">
                    Đại lý vé máy bay <span className="font-bold text-blue-700">giá rẻ</span>
                  </p>
                  <p className="text-sm text-gray-600">(Liên hệ: 1900 3173)</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600 text-sm">Uy tín đặt lên</h3>
                    <p className="text-green-600 text-sm">hàng đầu</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">$</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600 text-sm">Luôn cung cấp mức</h3>
                    <p className="text-green-600 text-sm">giá hợp lý</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👍</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600 text-sm">99% khách hàng hài lòng</h3>
                    <p className="text-green-600 text-sm">dịch vụ của chúng tôi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    

      {/* List các chuyến bay */}
      <div className="bg-white py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh sách chuyến bay nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flightList.map((flight) => (
              <div key={flight.id} className="border-2 border-blue-300 rounded-2xl p-6 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <div className="w-full text-lg font-semibold text-gray-800 mb-2 text-center">
                  {flight.from} - {flight.to}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 px-3 py-1 rounded-full flex items-center text-green-700 text-sm font-medium">
                    <span className="mr-1"><svg width="16" height="16" fill="currentColor"><circle cx="8" cy="8" r="8" /></svg></span>
                    {Math.abs(dayjs(flight.departureTime).diff(dayjs(), "hour"))} Giờ Trước
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-sm">
                    {dayjs(flight.departureTime).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {flight.flightPrice.toLocaleString()}
                </div>
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  {/* Ảnh minh họa chuyến bay, có thể thay bằng ảnh thực tế nếu có */}
                  <span className="text-blue-400 font-bold text-xl">{flight.airline}</span>
                </div>
                <Button
                  type="primary"
                  className="w-full rounded-full font-semibold text-lg bg-blue-500 hover:bg-blue-600 mt-auto"
                  onClick={() => navigate(`/booking?id=${flight.id}`)}
                >
                  Đặt vé ngay
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
