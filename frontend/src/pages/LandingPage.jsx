import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { eventAPI } from '../api';
import RSVPForm from '../components/RSVPForm';

function LandingPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getEvent();
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-white border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {event?.name}
            </h1>
            <p className="text-xl text-purple-100">{event?.description}</p>
          </motion.div>

          {/* Event Details Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                    Date & Time
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {event?.date} at {event?.time}
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                    Location
                  </h3>
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    {event?.location}
                  </p>
                  {event?.mapLink && (
                    <a
                      href={event.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      📍 View on Map
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">
                    Dress Code
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {event?.dressCode}
                  </p>
                </div>
              </div>

              {/* Right Column - Call to Action */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 flex flex-col justify-center items-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-5xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <p className="text-gray-700 mb-4 font-semibold">
                    We'd love for you to join us!
                  </p>
                  <p className="text-gray-600 text-sm">
                    Scroll down to confirm your attendance
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RSVP Form */}
          <motion.div variants={itemVariants}>
            <RSVPForm guestId={null} guestName={null} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;
