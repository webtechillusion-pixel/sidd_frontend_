// frontend/src/components/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, CreditCard, Wallet, Calendar, Check, X } from 'lucide-react';
import customerService from "../../services/customerService";


const PaymentHistory = ({ onBack }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await customerService.getPaymentHistory();
      setPayments(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          <p className="text-gray-600 text-sm">View all your payment transactions</p>
        </div>
        <CreditCard className="h-8 w-8 text-blue-600" />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading payments...</p>
        </div>
      ) : payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {payment.paymentMethod === 'wallet' ? (
                    <Wallet className="h-5 w-5 mr-3 text-green-600" />
                  ) : (
                    <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.paymentMethod === 'wallet' ? 'Wallet Payment' : 'Card Payment'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Booking: {payment.bookingId?.slice(-8) || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center ${
                  payment.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {payment.status === 'success' ? (
                    <Check className="h-5 w-5 mr-1" />
                  ) : (
                    <X className="h-5 w-5 mr-1" />
                  )}
                  <span className="font-medium capitalize">{payment.status}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(payment.createdAt).toLocaleDateString()}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{payment.amount}
                </div>
              </div>
              
              {payment.description && (
                <p className="text-sm text-gray-600 mt-2">{payment.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No payment history</p>
          <p className="text-sm text-gray-500 mt-2">
            Your payment transactions will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;