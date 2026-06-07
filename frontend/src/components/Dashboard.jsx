import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Dummy event data
  const eventData = {
    name: "Sarah & John's Wedding Celebration",
    date: "December 15, 2024",
    time: "6:00 PM - 11:00 PM",
    location: "Grand Ballroom, Downtown Hotel",
    totalGuests: 150,
    rsvpReceived: 89,
    pending: 45,
    declined: 16,
    image: "https://images.unsplash.com/photo-1519671482677-11e4e0d37545?w=1200&h=400&fit=crop"
  };

  // Dummy RSVP data
  const rsvpData = [
    { id: 1, name: 'Emma Johnson', status: 'accepted', adults: 2, children: 1, meal: 'Vegetarian', date: '2024-11-20' },
    { id: 2, name: 'Michael Chen', status: 'accepted', adults: 1, children: 0, meal: 'Beef', date: '2024-11-21' },
    { id: 3, name: 'Jessica Williams', status: 'pending', adults: 2, children: 0, meal: '-', date: '2024-11-22' },
    { id: 4, name: 'David Martinez', status: 'declined', adults: 1, children: 0, meal: '-', date: '2024-11-20' },
    { id: 5, name: 'Amanda Lee', status: 'accepted', adults: 3, children: 2, meal: 'Chicken', date: '2024-11-23' },
    { id: 6, name: 'Christopher Brown', status: 'accepted', adults: 1, children: 0, meal: 'Fish', date: '2024-11-21' },
    { id: 7, name: 'Lisa Anderson', status: 'pending', adults: 2, children: 1, meal: '-', date: '2024-11-25' },
    { id: 8, name: 'James Taylor', status: 'accepted', adults: 2, children: 0, meal: 'Vegetarian', date: '2024-11-20' },
  ];

  const filteredRsvps = selectedStatus === 'all' 
    ? rsvpData 
    : rsvpData.filter(rsvp => rsvp.status === selectedStatus);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      variants={itemVariants}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-30" />
      </div>
    </motion.div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'declined':
        return <MessageSquare size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Event Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 overflow-hidden"
      >
        <img
          src={eventData.image}
          alt="Event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <h1 className="text-5xl font-bold text-white mb-3">{eventData.name}</h1>
          <div className="flex gap-6 text-white">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{eventData.date} at {eventData.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{eventData.location}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 pb-12 relative z-10">
        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            icon={Users}
            label="Total Guests"
            value={eventData.totalGuests}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={CheckCircle}
            label="RSVP Accepted"
            value={eventData.rsvpReceived}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={Clock}
            label="Pending Response"
            value={eventData.pending}
            color="from-amber-500 to-amber-600"
          />
          <StatCard
            icon={MessageSquare}
            label="Declined"
            value={eventData.declined}
            color="from-red-500 to-red-600"
          />
        </motion.div>

        {/* RSVP Table Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">RSVP List</h2>
          </div>

          {/* Filters */}
          <div className="px-8 py-6 border-b border-slate-200 flex gap-4">
            {['all', 'accepted', 'pending', 'declined'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredRsvps.length})
              </motion.button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Guest Name</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Guests</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Meal Preference</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">RSVP Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((rsvp, index) => (
                  <motion.tr
                    key={rsvp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {rsvp.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{rsvp.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(rsvp.status)}`}>
                        {getStatusIcon(rsvp.status)}
                        <span className="text-sm font-semibold capitalize">{rsvp.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-slate-700">
                        {rsvp.adults} adults{rsvp.children > 0 ? `, ${rsvp.children} child` : ''}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-slate-700">{rsvp.meal || '-'}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-slate-500 text-sm">{rsvp.date}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm text-slate-600">
              Showing {filteredRsvps.length} of {rsvpData.length} responses
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Export to CSV
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
