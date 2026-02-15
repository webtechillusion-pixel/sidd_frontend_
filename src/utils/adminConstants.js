// frontend/src/utils/adminConstants.js
export const RIDER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED'
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ARRIVING: 'ARRIVING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export const CAB_TYPES = {
  HATCHBACK: { label: 'Hatchback', icon: '🚗', color: 'blue' },
  SEDAN: { label: 'Sedan', icon: '🚙', color: 'green' },
  SUV: { label: 'SUV', icon: '🚙', color: 'purple' },
  PREMIUM: { label: 'Premium', icon: '⭐', color: 'yellow' }
};

export const TRIP_TYPES = {
  ONE_WAY: 'ONE_WAY',
  ROUND_TRIP: 'ROUND_TRIP'
};

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  RAZORPAY: 'RAZORPAY',
  WALLET: 'WALLET'
};

export const PAYOUT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED'
};