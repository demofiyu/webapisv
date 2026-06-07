import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { rsvpAPI } from '../api';

function RSVPForm({ guestId, guestName }) {
  const [formData, setFormData] = useState({
    inviteId: guestId || '',
    name: guestName || '',
    email: '',
    adults: 1,
    children: 0,
    mealPreference: 'non-vegetarian',
    attending: true,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await rsvpAPI.submitRSVP(formData);
      setSuccess(true);
      setFormData({
        inviteId: guestId || '',
        name: guestName || '',
        email: '',
        adults: 1,
        children: 0,
        mealPreference: 'non-vegetarian',
        attending: true,
        message: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit RSVP');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          ✅
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-4">
          We've received your RSVP. A confirmation has been sent to your email.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Another Response
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        RSVP Now
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          >
            {error}
          </motion.div>
        )}

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>

        {/* Guests Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Adults *
            </label>
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              min="1"
              max="20"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Children
            </label>
            <input
              type="number"
              name="children"
              value={formData.children}
              onChange={handleChange}
              min="0"
              max="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Meal Preference */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Meal Preference *
          </label>
          <select
            name="mealPreference"
            value={formData.mealPreference}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>

        {/* Attending */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Will you be attending?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="true"
                checked={formData.attending === true}
                onChange={() => setFormData(prev => ({ ...prev, attending: true }))}
                className="mr-2"
              />
              <span className="text-gray-700">Yes, I'll be there! 🎉</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="false"
                checked={formData.attending === false}
                onChange={() => setFormData(prev => ({ ...prev, attending: false }))}
                className="mr-2"
              />
              <span className="text-gray-700">Sorry, can't make it</span>
            </label>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts or any dietary requirements..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.message.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default RSVPForm;
