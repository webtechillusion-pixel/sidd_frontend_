// components/Wallet.jsx
import React, { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, 
  Plus, 
  History, 
  IndianRupee,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import customerService from '../services/customerService';

const MyWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      // Fetch wallet balance and transactions
      const balanceResponse = await customerService.getWalletBalance();
      const transactionsResponse = await customerService.getWalletTransactions();
      
      if (balanceResponse.success) {
        setBalance(balanceResponse.data.balance);
      }
      
      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const response = await customerService.addToWallet({
        amount: parseFloat(amount)
      });

      if (response.success) {
        // Initiate Razorpay payment
        await initiateWalletPayment(response.data.order);
        setAmount('');
        setShowAddMoney(false);
        setMessage('Money added successfully!');
        fetchWalletData();
      }
    } catch (error) {
      setMessage(error.message || 'Failed to add money');
    } finally {
      setProcessing(false);
    }
  };

  const initiateWalletPayment = async (orderData) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Payment gateway not loaded'));
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Add to Wallet',
        description: 'Adding money to wallet',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyResponse = await customerService.verifyWalletPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              resolve(verifyResponse.data);
            } else {
              reject(new Error('Payment verification failed'));
            }
          } catch (error) {
            reject(error);
          }
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Wallet Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">My Wallet</h1>
              <p className="text-purple-100">Manage your wallet balance and transactions</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full">
              <WalletIcon className="h-8 w-8" />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Current Balance</p>
                <div className="flex items-center mt-1">
                  <IndianRupee className="h-6 w-6" />
                  <span className="text-3xl font-bold">{balance.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddMoney(true)}
                className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </button>
            </div>
          </div>
        </div>

        {/* Add Money Modal */}
        {showAddMoney && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Add Money to Wallet</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    min="1"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                
                {message && (
                  <div className={`p-3 rounded-lg ${
                    message.includes('success') 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddMoney}
                    disabled={processing}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-70"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : (
                      'Add Money'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddMoney(false);
                      setAmount('');
                      setMessage('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <History className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-bold">Recent Transactions</h2>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      transaction.type === 'CREDIT' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'CREDIT' ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <IndianRupee className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWallet;