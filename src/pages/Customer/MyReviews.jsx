// components/customer/MyReviews.js
import React, { useState } from 'react';
import { ChevronRight, Star, StarHalf, User, Car, Calendar, Clock, Edit2, Trash2, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const MyReviews = ({ reviews, onSubmitReview, onBack }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    bookingId: '',
    rating: {
      overall: 5,
      behavior: 5,
      driving: 5,
      vehicleCondition: 5,
      punctuality: 5,
      cleanliness: 5
    },
    review: '',
    images: []
  });

  // Mock bookings removed for production deployment
  // const mockBookings = [ ... ];
  const mockBookings = [];

  const ratingCategories = [
    { key: 'overall', label: 'Overall Experience', icon: Star },
    { key: 'behavior', label: 'Driver Behavior', icon: User },
    { key: 'driving', label: 'Driving Skills', icon: Car },
    { key: 'vehicleCondition', label: 'Vehicle Condition', icon: Car },
    { key: 'punctuality', label: 'Punctuality', icon: Clock },
    { key: 'cleanliness', label: 'Cleanliness', icon: Star }
  ];

  const handleRatingChange = (category, value) => {
    setReviewForm(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: value
      }
    }));
  };

 // Update handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!reviewForm.bookingId) {
    toast.error('Please select a booking to review');
    return;
  }

  try {
    await onSubmitReview({
      bookingId: reviewForm.bookingId,
      rating: reviewForm.rating.overall,
      review: reviewForm.review
    });
    
    toast.success('Review submitted successfully!');
    resetForm();
    setShowReviewForm(false);
  } catch (error) {
    // Error is handled in parent
  }
};

  const resetForm = () => {
    setReviewForm({
      bookingId: '',
      rating: {
        overall: 5,
        behavior: 5,
        driving: 5,
        vehicleCondition: 5,
        punctuality: 5,
        cleanliness: 5
      },
      review: '',
      images: []
    });
    setSelectedBooking(null);
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setReviewForm(prev => ({ ...prev, bookingId: booking.id }));
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      toast.success('Review deleted');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange('overall', star)}
            className="p-1"
          >
            <Star className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ChevronRight className="h-5 w-5 rotate-180 mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
          <p className="text-gray-600 text-sm">Share your experience and help other travelers</p>
        </div>
        <Star className="h-8 w-8 text-yellow-500" />
      </div>

      {/* Write Review Button */}
      {!showReviewForm && (
        <div className="mb-8">
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Write a Review
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Write Your Review</h3>
            <button
              onClick={() => {
                setShowReviewForm(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Select Booking */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Booking to Review
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockBookings.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => handleSelectBooking(booking)}
                    className={`p-4 border rounded-lg text-left ${
                      selectedBooking?.id === booking.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium">{booking.date}</span>
                      </div>
                      {selectedBooking?.id === booking.id && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-900 font-medium mb-1">{booking.driver}</p>
                    <p className="text-xs text-gray-600 mb-1">{booking.vehicle}</p>
                    <p className="text-xs text-gray-500">
                      {booking.from} → {booking.to}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating
              </label>
              <div className="flex items-center space-x-4">
                {renderStars(reviewForm.rating.overall)}
                <span className="text-2xl font-bold text-gray-900">
                  {reviewForm.rating.overall}.0
                </span>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Detailed Ratings
              </label>
              <div className="space-y-4">
                {ratingCategories.slice(1).map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <category.icon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">{category.label}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(category.key, star)}
                          className="p-1"
                        >
                          <Star className={`h-5 w-5 ${star <= reviewForm.rating[category.key] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Review
              </label>
              <textarea
                value={reviewForm.review}
                onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Share your experience with this ride..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum 20 characters. Be honest and helpful to other travelers.
              </p>
            </div>

            {/* Image Upload (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Upload photos of your ride</p>
                <p className="text-xs text-gray-500">Max 5 photos, 5MB each</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Existing Reviews */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Your Reviews</h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id || review.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating?.overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {review.rating?.overall}.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id || review.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.review}</p>
                
                {review.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Detailed Ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {ratingCategories.slice(1).map((category) => (
                    <div key={category.key} className="flex items-center justify-between">
                      <span className="text-gray-600">{category.label}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-medium">{review.rating?.[category.key] || 0}.0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">Share your experience to help other travelers</p>
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write Your First Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* Review Guidelines */}
      <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
        <h4 className="font-bold text-gray-900 mb-3">Review Guidelines</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-2"></div>
            <span>Be honest and specific about your experience</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-2"></div>
            <span>Focus on the driver, vehicle, and service quality</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-2"></div>
            <span>Respect privacy and avoid personal information</span>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-2"></div>
            <span>Reviews help improve our service for everyone</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyReviews;