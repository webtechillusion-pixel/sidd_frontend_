import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({
  length = 6,
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  error = false,
  className = '',
}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Notify parent of OTP change
    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Notify when OTP is complete
    if (otpString.length === length && !newOtp.includes('')) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Move to next input on arrow right or tab
    if ((e.key === 'ArrowRight' || e.key === 'Tab') && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }

    // Move to previous input on arrow left
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Paste OTP
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.split('').slice(0, length);
      const newOtp = [...otp];
      
      pastedArray.forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char;
        }
      });
      
      setOtp(newOtp);
      
      // Focus on next empty input or last input
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex].focus();
      } else {
        inputRefs.current[length - 1].focus();
      }
      
      const otpString = newOtp.join('');
      onChange?.(otpString);
      
      if (otpString.length === length) {
        onComplete?.(otpString);
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const clearOTP = () => {
    setOtp(Array(length).fill(''));
    onChange?.('');
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-center space-x-2 sm:space-x-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={handleFocus}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 sm:w-14 sm:h-14
              text-center text-2xl font-bold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">
          Invalid verification code. Please try again.
        </p>
      )}

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={clearOTP}
          className="text-sm text-gray-600 hover:text-gray-800"
          disabled={disabled}
        >
          Clear OTP
        </button>
        <div className="text-sm text-gray-500">
          {otp.filter(digit => digit !== '').length}/{length}
        </div>
      </div>
    </div>
  );
};

export default OTPInput;