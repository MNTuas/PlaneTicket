"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Input, Select, DatePicker, Button, Checkbox, Radio, Card, Badge, Divider, Spin } from "antd"
import {
  SwapOutlined,
  SearchOutlined,
  CalendarOutlined,
  SettingOutlined,
  PhoneOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Option } = Select

export default function FlightBookingPage() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Lấy query params
  const params = new URLSearchParams(location.search)
  const from = params.get("from")
  const to = params.get("to")
  const departureDate = params.get("departureDate")

  useEffect(() => {
    if (from && to && departureDate) {
      setLoading(true)
      fetch(
        `https://planeticket-c6ffe7c7h4eqa6by.canadacentral-01.azurewebsites.net/api/Flight/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departureDateFrom=${departureDate}T08:00:00Z&departureDateTo=${departureDate}T10:00:00Z`
      )
        .then(res => res.json())
        .then(data => {
          setFlights(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [from, to, departureDate])

  const [filter, setFilter] = useState("tax")
  const [selectedDate, setSelectedDate] = useState(3)

  const dateOptions = [
    { day: "Th 4", date: "30/07", price: "1,544,600" },
    { day: "Th 5", date: "31/07", price: "1,544,600" },
    { day: "Th 6", date: "1/08", price: "1,544,600" },
    { day: "Th 7", date: "2/08", price: "1,544,600" },
    { day: "CN", date: "3/08", price: "1,544,600" },
    { day: "Th 2", date: "4/08", price: "1,544,600" },
    { day: "Th 3", date: "5/08", price: "1,544,600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative py-12 px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Tìm kiếm vé máy bay giá rẻ
            <br />
            <span className="text-blue-200">và đa dạng khung giờ bay</span>
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            So sánh và tìm kiếm vé máy bay giá rẻ với nhiều khung giờ linh hoạt. 
            Đặt vé dễ dàng, nhiều hãng bay nội địa & quốc tế, hỗ trợ 24/7
          </p>
        </div>
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Filter Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl shadow-lg border-0 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <FilterOutlined className="mr-2 text-blue-600" />
                  Bộ lọc
                </h3>
                <Button type="link" className="text-blue-600 p-0">
                  Đặt lại
                </Button>
              </div>

              <Divider className="my-4" />

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Hiển thị giá</h4>
                <Radio.Group
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-3">
                    <Radio value="total" className="w-full">
                      <div>
                        <div className="font-medium text-gray-800">Tổng giá</div>
                        <div className="text-xs text-gray-500">cho tất cả các khách</div>
                      </div>
                    </Radio>
                    <Radio value="base" className="w-full">
                      <div>
                        <div className="font-medium text-gray-800">Giá cơ bản</div>
                        <div className="text-xs text-gray-500">cho 1 người lớn</div>
                      </div>
                    </Radio>
                    <Radio value="tax" className="w-full">
                      <div>
                        <div className="font-medium text-gray-800">Giá + thuế, phí</div>
                        <div className="text-xs text-gray-500">cho 1 người lớn</div>
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </div>

              <Divider className="my-4" />

              <div className="mb-4">
                <Checkbox className="text-gray-700">
                  <span className="ml-2">Thu gọn kết quả</span>
                </Checkbox>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Mẹo tiết kiệm</h4>
                <p className="text-sm text-blue-700">
                  Đặt vé sớm để có giá tốt nhất. Chuyến bay sáng sớm thường rẻ hơn.
                </p>
              </div>
            </Card>
          </div>

          {/* Enhanced Flight List */}
          <div className="lg:col-span-3">
            <Card className="rounded-xl shadow-lg border-0 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      Hà Nội → Hồ Chí Minh
                    </h2>
                    <div className="flex items-center text-blue-100">
                      <CalendarOutlined className="mr-2" />
                      <span>Thứ Bảy, 2 tháng 8, 2025</span>
                      <Badge 
                        count="64 chuyến bay" 
                        className="ml-4"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Sort & Date Selection */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-medium text-gray-700">Sắp xếp theo:</span>
                    <Select defaultValue="price" className="w-32">
                      <Option value="price">Giá vé</Option>
                      <Option value="depart">Giờ khởi hành</Option>
                      <Option value="arrive">Giờ hạ cánh</Option>
                      <Option value="duration">Thời gian bay</Option>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dateOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(index)}
                        className={`flex-shrink-0 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedDate === index
                            ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                            : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold text-lg">{option.price}</div>
                          <div className="text-xs mt-1">{option.day}, {option.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flight List */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flights.map((flight, index) => (
                      <Card key={index} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Airline */}
                          <div className="md:col-span-3 flex items-center gap-3">
                            <div>
                              <div className="font-semibold text-gray-800">{flight.airline}</div>
                              <div className="text-xs text-gray-500">
                                {dayjs(flight.departureTime).format("DD/MM/YYYY")}
                              </div>
                            </div>
                          </div>

                          {/* Flight Details */}
                          <div className="md:col-span-6">
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                  {dayjs(flight.departureTime).format("HH:mm")}
                                </div>
                                <div className="text-blue-600 font-semibold">HAN</div>
                              </div>
                              
                              <div className="flex-1 mx-4">
                                <div className="flex items-center justify-center mb-1">
                                  <div className="flex-1 h-px bg-gray-300"></div>
                                  <ClockCircleOutlined className="mx-2 text-gray-400" />
                                  <div className="flex-1 h-px bg-gray-300"></div>
                                </div>
                                <div className="text-center text-sm text-gray-500">
                                  30 phút bay
                                </div>
                                <div className="text-center text-xs text-gray-400">
                                  VJ
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                  {dayjs(flight.arrivalTime).format("HH:mm")}
                            
                                </div>
                                <div className="text-blue-600 font-semibold">SGN</div>
                              </div>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="md:col-span-3 text-center md:text-right">
                            <div className="text-2xl font-bold text-orange-600 mb-2">
                              {flight.flightPrice.toLocaleString()} VND
                            </div>
                            <Button 
                              type="primary" 
                              size="large"
                              className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => navigate(`/booking?id=${flight.id}`)}
                            >
                              Chọn chuyến bay
                            </Button>
                            <div className="mt-2">
                              <Button type="link" className="text-blue-600 p-0 text-sm">
                                Xem chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Hotline Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PhoneOutlined />}
            className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse"
          />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  )
}
