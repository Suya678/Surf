import React, { useState } from "react";
import {
  Search,
  Menu,
  User,
  Globe,
  Heart,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  MessageSquare,
  Bell,
} from "lucide-react";

export default function DashBoardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const listings = [
    {
      id: 1,
      title: "Cozy Beach House",
      location: "Malibu, California",
      image:
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
      price: 250,
      rating: 4.9,
      reviews: 127,
      bookings: 45,
      revenue: 11250,
    },
    {
      id: 2,
      title: "Mountain Cabin Retreat",
      location: "Aspen, Colorado",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
      price: 180,
      rating: 4.8,
      reviews: 89,
      bookings: 38,
      revenue: 6840,
    },
    {
      id: 3,
      title: "Downtown Loft",
      location: "New York, NY",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      price: 320,
      rating: 4.7,
      reviews: 156,
      bookings: 52,
      revenue: 16640,
    },
    {
      id: 4,
      title: "Desert Villa",
      location: "Scottsdale, Arizona",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      price: 290,
      rating: 4.9,
      reviews: 94,
      bookings: 41,
      revenue: 11890,
    },
  ];

  const upcomingBookings = [
    {
      guest: "Sarah Johnson",
      listing: "Cozy Beach House",
      checkIn: "Nov 15",
      checkOut: "Nov 18",
      amount: 750,
    },
    {
      guest: "Michael Chen",
      listing: "Mountain Cabin Retreat",
      checkIn: "Nov 16",
      checkOut: "Nov 20",
      amount: 720,
    },
    {
      guest: "Emma Davis",
      listing: "Downtown Loft",
      checkIn: "Nov 18",
      checkOut: "Nov 21",
      amount: 960,
    },
  ];

  const messages = [
    {
      from: "Alex Turner",
      message: "Is early check-in available?",
      time: "2h ago",
      unread: true,
    },
    {
      from: "Lisa Martinez",
      message: "Thank you for the wonderful stay!",
      time: "5h ago",
      unread: false,
    },
    {
      from: "David Kim",
      message: "Question about parking",
      time: "1d ago",
      unread: true,
    },
  ];

  const totalRevenue = listings.reduce((sum, l) => sum + l.revenue, 0);
  const totalBookings = listings.reduce((sum, l) => sum + l.bookings, 0);
  const avgRating = (
    listings.reduce((sum, l) => sum + l.rating, 0) / listings.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Home className="w-8 h-8 text-rose-500" />
                <span className="text-xl font-semibold text-rose-500">
                  Hostly
                </span>
              </div>
              <nav className="hidden md:flex gap-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`font-medium ${
                    activeTab === "overview"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`font-medium ${
                    activeTab === "listings"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Listings
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`font-medium ${
                    activeTab === "bookings"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`font-medium ${
                    activeTab === "messages"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Messages
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                <Menu className="w-5 h-5 text-gray-700" />
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                Welcome back, Host!
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Total Revenue
                    </span>
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Total Bookings
                    </span>
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900">
                    {totalBookings}
                  </p>
                  <p className="text-sm text-blue-600 mt-2">This month</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Avg Rating
                    </span>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900">
                    {avgRating}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Across all properties
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Active Listings
                    </span>
                    <Home className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="text-3xl font-semibold text-gray-900">
                    {listings.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">All properties</p>
                </div>
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Bookings
                </h2>
                <button className="text-rose-500 text-sm font-medium hover:text-rose-600">
                  View all
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {upcomingBookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className={`p-4 flex items-center justify-between ${
                      idx !== upcomingBookings.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {booking.guest
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.guest}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.listing}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.checkIn} - {booking.checkOut}
                      </p>
                      <p className="text-sm text-gray-500">${booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "listings" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold text-gray-900">
                Your Listings
              </h1>
              <button className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition">
                + Add Listing
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-64 object-cover"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">
                          {listing.rating}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({listing.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-semibold text-gray-900">
                          ${listing.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bookings</p>
                        <p className="font-semibold text-gray-900">
                          {listing.bookings}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price/night</p>
                        <p className="font-semibold text-gray-900">
                          ${listing.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "bookings" && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              All Bookings
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {upcomingBookings.map((booking, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {booking.guest
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="font-medium text-gray-900">
                              {booking.guest}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {booking.listing}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {booking.checkIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {booking.checkOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          ${booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "messages" && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Messages
            </h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 flex items-start gap-4 ${
                    idx !== messages.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {msg.from
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{msg.from}</p>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-gray-600">{msg.message}</p>
                  </div>
                  {msg.unread && (
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
