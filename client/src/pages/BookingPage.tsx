import  { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;
// --- Type Definitions ---

// Data we expect to RECEIVE from the detail page
interface BookingDetails {
  experienceId: string;
  experienceTitle: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

// Data we will SEND to the API (matches your schema)
interface BookingPayload {
  fullName: string;
  email: string;
  promoCode?: string;
  agreedToTerms: boolean;
  experienceId: string;
  experienceTitle: string;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

// --- NEW: Types for your API Response ---
interface BookingData {
  // ... all the fields from the 'data' object
  _id: string;
  fullName: string;
  email: string;
  status: string;
}

interface BookingIdResponse {
  bookingId: string; // The string ID we want to display
  email: string;
  _id: string;
}

interface FullApiResponse {
  success: boolean;
  message: string;
  data: BookingData;
  BookingId: BookingIdResponse; // Matches your API response
}
// ---

// Type for the location state
interface LocationState {
  bookingDetails: BookingDetails;
}

// --- The Main Component ---
const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the booking details passed from the previous page
  const { bookingDetails } = (location.state as LocationState) || {};

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // API submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // --- FIX #1: Store the ID string, not the whole object ---
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // If user lands here directly without data, redirect to homepage
  if (!bookingDetails) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: BookingPayload = {
      ...bookingDetails,
      fullName,
      email,
      promoCode,
      agreedToTerms,
    };

    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      
      const result: FullApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Booking failed. Please try again.');
      }


      setBookingSuccess(true);
      
    
      setConfirmedBookingId(result.BookingId.bookingId);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // Show a success message
  if (bookingSuccess) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
        
        {/* --- FIX #3: Render the state string, which is no longer an object --- */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Booking ID: {confirmedBookingId}
        </h3>

        <p className="text-lg text-gray-700">Thank you, {fullName}.</p>
        <p className="text-gray-600 mt-2">A confirmation email has been sent to {email}.</p>
        
        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full px-6 py-3 text-lg font-semibold rounded-md bg-gray-800 text-white hover:bg-gray-900"
        >
          Book Another Experience
        </button>
      </div>
    );
  }

  // Show the booking form
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
      
      {/* === Left Column: Form === */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Confirm and pay</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Promo Code */}
          <div>
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">Promo Code (Optional)</label>
            <input
              type="text"
              id="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="agreedToTerms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-1"
            />
            <label htmlFor="agreedToTerms" className="ml-3 block text-sm text-gray-700">
              I agree to the <a href="#" className="font-medium text-yellow-700 hover:underline">Terms and Conditions</a>.
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 text-lg font-semibold rounded-md transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            {isSubmitting ? 'Processing...' : `Pay ₹${bookingDetails.total}`}
          </button>
        </form>
      </div>

      {/* === Right Column: Summary === */}
      <div className="lg:col-span-1 mt-8 lg:mt-0">
        <div className="sticky top-24 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{bookingDetails.experienceTitle}</h2>
          <img
            src="https://placehold.co/400x300/f0f0f0/333?text=Experience" // You could pass the imageUrl here too
            alt={bookingDetails.experienceTitle}
            className="w-full h-auto object-cover rounded-lg mb-4"
          />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">{new Date(bookingDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-900">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium text-gray-900">{bookingDetails.quantity}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">₹{bookingDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes:</span>
              <span className="font-medium text-gray-900">₹{bookingDetails.taxes}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="font-medium text-gray-900">₹{bookingDetails.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;