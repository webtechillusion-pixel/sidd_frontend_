import React from "react";
import {
  ChevronRight,
  Calendar,
  MapPin,
  Car,
  Star,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const RideHistory = ({ rideHistory = [], onBack, onSubmitReview }) => {
  /* ---------------- STATUS DISPLAY ---------------- */
  const getStatusDisplay = (bookingStatus) => {
    switch (bookingStatus) {
      case "PENDING":
        return { label: "Pending", className: "bg-yellow-100 text-yellow-800" };
      case "CONFIRMED":
      case "ASSIGNED":
      case "DRIVER_ASSIGNED":
        return { label: "Driver Assigned", className: "bg-blue-100 text-blue-800" };
      case "ARRIVED":
      case "DRIVER_ARRIVED":
        return { label: "Driver Arrived", className: "bg-purple-100 text-purple-800" };
      case "ONGOING":
      case "TRIP_STARTED":
        return { label: "In Progress", className: "bg-orange-100 text-orange-800" };
      case "COMPLETED":
      case "TRIP_COMPLETED":
      case "PAYMENT_DONE":
        return { label: "Completed", className: "bg-green-100 text-green-800" };
      case "CANCELLED":
      case "REJECTED":
        return { label: "Cancelled", className: "bg-red-100 text-red-800" };
      default:
        return { label: bookingStatus || "Unknown", className: "bg-gray-100 text-gray-800" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ---------------- FILTER HISTORY ---------------- */
  const historyRides = rideHistory.filter((r) =>
    [
      "COMPLETED",
      "TRIP_COMPLETED",
      "PAYMENT_DONE",
      "CANCELLED",
      "REJECTED",
    ].includes(r.bookingStatus)
  );

  const completedCount = rideHistory.filter((r) =>
    ["COMPLETED", "TRIP_COMPLETED", "PAYMENT_DONE"].includes(
      r.bookingStatus
    )
  ).length;

  const cancelledCount = rideHistory.filter((r) =>
    ["CANCELLED", "REJECTED"].includes(r.bookingStatus)
  ).length;

  const totalSpent = rideHistory
    .reduce((sum, ride) => {
      const fare = ride.finalFare || ride.estimatedFare || 0;
      return sum + Number(fare);
    }, 0)
    .toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const avgRating =
    rideHistory.length > 0
      ? (
          rideHistory.reduce((sum, r) => sum + (r.userRating || 0), 0) /
          rideHistory.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2 text-sm font-medium"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Dashboard
          </button>

          <h2 className="text-xl font-bold text-gray-900">
            Ride History
          </h2>
          <p className="text-gray-600 text-sm">
            View all your past rides and reviews
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Total Rides: {historyRides.length}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {historyRides.length > 0 ? (
          historyRides.map((ride) => {
            const statusInfo = getStatusDisplay(ride.bookingStatus);
            const fare = ride.finalFare || ride.estimatedFare || 0;
            const distance =
              ride.distanceKm?.toFixed(1) ||
              ride.distance ||
              "0";

            return (
              <div
                key={ride._id || ride.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                {/* DATE + STATUS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(ride.createdAt)}
                    </span>
                    <span className="ml-3 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {formatTime(ride.createdAt)}
                    </span>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </div>
                </div>

                {/* LOCATIONS + INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">From</div>
                        <div className="text-sm font-medium">
                          {ride.pickup?.addressText ||
                            ride.pickupLocation ||
                            "Location not specified"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      <div>
                        <div className="text-xs text-gray-500">To</div>
                        <div className="text-sm font-medium">
                          {ride.drop?.addressText ||
                            ride.dropLocation ||
                            "Location not specified"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Vehicle
                      </span>
                      <span className="text-sm font-medium">
                        {ride.vehicleType || "Sedan"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Distance
                      </span>
                      <span className="text-sm font-medium">
                        {distance} km
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Fare
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        ₹{fare}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DRIVER + REVIEW */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {ride.riderId?.photo ? (
                      <img
                        src={ride.riderId.photo}
                        alt={ride.riderId?.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">D</span>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ride.riderId?.name || "Driver"}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-gray-600">
                          {ride.riderId?.overallRating
                            ? `${ride.riderId.overallRating}/5`
                            : "Not rated"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {["COMPLETED", "TRIP_COMPLETED", "PAYMENT_DONE"].includes(
                    ride.bookingStatus
                  ) && !ride.userRating ? (
                    <button
                      onClick={() =>
                        onSubmitReview &&
                        onSubmitReview({
                          rideId: ride._id || ride.id,
                          driverId: ride.riderId?._id,
                          driverName: ride.riderId?.name,
                        })
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Submit Review
                    </button>
                  ) : ride.userRating ? (
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-sm font-bold">
                        {ride.userRating}/5
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Ride History
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't taken any rides yet
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Book Your First Ride
            </button>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      {rideHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">
            Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-sm text-gray-600 flex justify-center items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Completed
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{cancelledCount}</div>
              <div className="text-sm text-gray-600 flex justify-center items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                Cancelled
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{totalSpent}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{avgRating}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideHistory;