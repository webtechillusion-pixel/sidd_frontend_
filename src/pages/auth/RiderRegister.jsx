// src/pages/auth/RiderRegister.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, User, Car, FileText, Shield, Check, Mail, Phone, Lock, Eye, EyeOff, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RiderRegister = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const navigate = useNavigate();
  const { error, clearError } = useAuth();

  // Load initial form data from localStorage
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('riderFormData');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load form data from localStorage:', e);
    }
    
    return {
      // Step 1: Personal Information
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      aadhaarNumber: '',
      drivingLicenseNumber: '',
      
      // Step 2: Cab Information
      cabNumber: '',
      cabModel: '',
      cabType: '',
      seatingCapacity: '4',
      yearOfManufacture: '',
      acAvailable: true,
      
      // Step 3: Document Uploads
      photo: null,
      aadhaarFront: null,
      aadhaarBack: null,
      licenseFront: null,
      licenseBack: null,
      cabImages: [],
      
      // Step 4: Terms & Review
      agreeTerms: false,
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('riderFormData', JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to save form data to localStorage:', e);
    }
  }, [formData]);

  const cabTypes = ['Sedan', 'SUV', 'Hatchback', 'MPV', 'Luxury', 'Premium'];
  const seatingOptions = ['2', '4', '6', '8'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    
    if (name === 'cabImages') {
      const newFiles = Array.from(fileList);
      setFormData(prev => ({
        ...prev,
        [name]: [...prev.cabImages, ...newFiles].slice(0, 5)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: fileList[0] || null
      }));
    }
    
    setUploadProgress(prev => ({
      ...prev,
      [name]: 'Ready to upload'
    }));
  };

  const removeFile = (fileName, index = null) => {
    if (fileName === 'cabImages' && index !== null) {
      const newCabImages = [...formData.cabImages];
      newCabImages.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        cabImages: newCabImages
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fileName]: null
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const validateStep = (stepNumber) => {
    clearError();
    
    switch(stepNumber) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
          toast.error('Please fill all required fields in Personal Information');
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) {
          toast.error('Please enter a valid 12-digit Aadhaar number');
          return false;
        }
        if (!formData.drivingLicenseNumber) {
          toast.error('Please enter your driving license number');
          return false;
        }
        break;
      
      case 2:
        if (!formData.cabType || !formData.cabModel || !formData.cabNumber || !formData.seatingCapacity) {
          toast.error('Please fill all required cab details');
          return false;
        }
        break;
      
      case 3:
        const requiredFiles = ['photo', 'aadhaarFront', 'aadhaarBack', 'licenseFront', 'licenseBack'];
        const missingFiles = requiredFiles.filter(file => !formData[file]);
        
        if (missingFiles.length > 0) {
          toast.error(`Please upload all required documents: ${missingFiles.join(', ')}`);
          return false;
        }
        if (formData.cabImages.length === 0) {
          toast.error('Please upload at least one cab image');
          return false;
        }
        break;
      
      case 4:
        if (!formData.agreeTerms) {
          toast.error('You must agree to the terms and conditions');
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    if (!validateStep(4)) {
      setLoading(false);
      return;
    }

    // Create FormData for file uploads
    const formDataToSend = new FormData();
    
    // Append text fields
    const fieldsToSend = ['name', 'email', 'phone', 'password', 'aadhaarNumber', 
                         'drivingLicenseNumber', 'cabNumber', 'cabModel', 'cabType',
                         'seatingCapacity', 'yearOfManufacture', 'acAvailable'];
    
    fieldsToSend.forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append files
    const fileFields = ['photo', 'aadhaarFront', 'aadhaarBack', 'licenseFront', 'licenseBack'];
    fileFields.forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append cab images
    formData.cabImages.forEach((file, index) => {
      formDataToSend.append('cabImages', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/auth/register-rider', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success) {
        toast.success('Rider registration submitted successfully!');
        
        if (data.data?.rider) {
          localStorage.setItem('user', JSON.stringify(data.data.rider));
        }
        
        // Clear form data after successful submission
        localStorage.removeItem('riderFormData');
        setFormData({
          name: '', email: '', phone: '', password: '', confirmPassword: '',
          aadhaarNumber: '', drivingLicenseNumber: '',
          cabNumber: '', cabModel: '', cabType: '', seatingCapacity: '4',
          yearOfManufacture: '', acAvailable: true,
          photo: null, aadhaarFront: null, aadhaarBack: null,
          licenseFront: null, licenseBack: null, cabImages: [],
          agreeTerms: false
        });
        
        navigate('/rider/registration-success');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Personal Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+91 9876543210"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhaar Number *
          </label>
          <input
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="12-digit Aadhaar number"
            required
            pattern="^\d{12}$"
            title="12-digit Aadhaar number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driving License Number *
          </label>
          <input
            type="text"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="DL number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Cab Information
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Car className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold">Cab Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cab Type *
          </label>
          <select
            name="cabType"
            value={formData.cabType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select cab type</option>
            {cabTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cab Model *
          </label>
          <input
            type="text"
            name="cabModel"
            value={formData.cabModel}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Swift Dzire, Innova"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cab Number *
          </label>
          <input
            type="text"
            name="cabNumber"
            value={formData.cabNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
            placeholder="e.g., MH12AB1234"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seating Capacity *
          </label>
          <select
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {seatingOptions.map(capacity => (
              <option key={capacity} value={capacity}>{capacity} seats</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year of Manufacture
          </label>
          <input
            type="number"
            name="yearOfManufacture"
            value={formData.yearOfManufacture}
            onChange={handleInputChange}
            min="2000"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 2020"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="acAvailable"
            checked={formData.acAvailable}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Air Conditioning Available
          </label>
        </div>
      </div>
    </div>
  );

  // Step 3: Document Uploads
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold">Document Uploads</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Upload clear images of all required documents. Max file size: 5MB per image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="photo-upload"
              required
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {formData.photo ? formData.photo.name : 'Click to upload profile photo'}
              </p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP (max 5MB)</p>
            </label>
            {formData.photo && (
              <button
                type="button"
                onClick={() => removeFile('photo')}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Aadhaar Front & Back */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhaar Card *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Front Side</label>
              <div className="border border-gray-300 rounded-lg p-3 text-center">
                <input
                  type="file"
                  name="aadhaarFront"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="aadhaar-front"
                  required
                />
                <label htmlFor="aadhaar-front" className="cursor-pointer">
                  <FileText className="h-6 w-6 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.aadhaarFront ? 'Uploaded' : 'Upload'}
                  </p>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Back Side</label>
              <div className="border border-gray-300 rounded-lg p-3 text-center">
                <input
                  type="file"
                  name="aadhaarBack"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="aadhaar-back"
                  required
                />
                <label htmlFor="aadhaar-back" className="cursor-pointer">
                  <FileText className="h-6 w-6 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.aadhaarBack ? 'Uploaded' : 'Upload'}
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Driving License Front & Back */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Driving License *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Front Side</label>
              <div className="border border-gray-300 rounded-lg p-3 text-center">
                <input
                  type="file"
                  name="licenseFront"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="license-front"
                  required
                />
                <label htmlFor="license-front" className="cursor-pointer">
                  <FileText className="h-6 w-6 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.licenseFront ? 'Uploaded' : 'Upload'}
                  </p>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Back Side</label>
              <div className="border border-gray-300 rounded-lg p-3 text-center">
                <input
                  type="file"
                  name="licenseBack"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="license-back"
                  required
                />
                <label htmlFor="license-back" className="cursor-pointer">
                  <FileText className="h-6 w-6 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.licenseBack ? 'Uploaded' : 'Upload'}
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Cab Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cab Images * (Upload 1-5 images)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              name="cabImages"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
              id="cab-images"
            />
            <label htmlFor="cab-images" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload cab images (front, back, side, interior)
              </p>
              <p className="text-xs text-gray-500 mt-1">You can upload multiple images</p>
            </label>
            
            {formData.cabImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">
                  Uploaded: {formData.cabImages.length} image(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.cabImages.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-xs text-gray-700 mr-2">
                        {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile('cabImages', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> All documents will be verified by our team. 
          Your registration will be approved within 24-48 hours after verification.
          Maximum file size: 5MB each. Supported formats: PDF, JPG, PNG.
        </p>
      </div>
    </div>
  );

  // Step 4: Review & Terms
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Check className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold">Review & Submit</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Name: {formData.name}</div>
            <div>Email: {formData.email}</div>
            <div>Phone: {formData.phone}</div>
            <div>Aadhaar: {formData.aadhaarNumber}</div>
            <div>License: {formData.drivingLicenseNumber}</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Cab Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Cab Type: {formData.cabType}</div>
            <div>Model: {formData.cabModel}</div>
            <div>Number: {formData.cabNumber}</div>
            <div>Seats: {formData.seatingCapacity}</div>
            <div>Year: {formData.yearOfManufacture}</div>
            <div>AC: {formData.acAvailable ? 'Yes' : 'No'}</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Documents</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Profile Photo: {formData.photo ? '✓ Uploaded' : '✗ Missing'}</div>
            <div>Aadhaar Card: {formData.aadhaarFront && formData.aadhaarBack ? '✓ Uploaded' : '✗ Missing'}</div>
            <div>License: {formData.licenseFront && formData.licenseBack ? '✓ Uploaded' : '✗ Missing'}</div>
            <div>Cab Images: {formData.cabImages.length} uploaded</div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="mt-1 mr-2"
              required
            />
            <label htmlFor="agreeTerms" className="text-sm">
              I agree to the <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>. 
              I confirm that all information provided is accurate and I have read the rider agreement.
            </label>
          </div>
          
          <div className="flex items-start mt-3">
            <input
              type="checkbox"
              id="consent"
              className="mt-1 mr-2"
              required
            />
            <label htmlFor="consent" className="text-sm">
              I understand that my registration is subject to verification and approval. 
              I may be contacted for document verification.
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Cab', icon: Car },
    { number: 3, title: 'Documents', icon: FileText },
    { number: 4, title: 'Review', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Become a Rider Partner</h1>
          <p className="text-gray-600 mt-2">
            Complete your registration to start offering ride services
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepItem.number 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepItem.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <stepItem.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-xs mt-2 ${
                step >= stepItem.number ? 'text-green-600 font-medium' : 'text-gray-500'
              }`}>
                {stepItem.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                )}
              </div>
              
              <div>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    disabled={loading}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Already have a rider account?{' '}
            <Link to="/login/rider" className="text-green-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
          <p className="mt-2">
            Need help? Call us at +91-XXXXXXXXXX or email rider-support@siddharthtravel.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderRegister;