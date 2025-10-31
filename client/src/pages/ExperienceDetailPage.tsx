import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Make sure this path is correct for your project
import { type ExperienceDetail, type AvailableTime } from '../types'; 

// --- Utility Functions ---

// Converts "2025-10-22T00:00:00.000Z" to "Oct 22"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Converts "09:00" to "9:00 AM"
const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};


// --- The Main Component ---

const ExperienceDetailPage: React.FC = () => {
  // --- State ---
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for user selections
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // --- Hooks ---
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // For navigation

  // --- Data Fetching ---
  useEffect(() => {
    if (!id) {
      setError("No experience ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchExperienceDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/get-experince-detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setExperience(result.data);
          // Auto-select first date if available
          if (result.data.availableDates && result.data.availableDates.length > 0) {
            setSelectedDate(result.data.availableDates[0]);
          }
        } else {
          throw new Error(result.message || 'Failed to fetch experience data');
        }

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperienceDetail();
  }, [id]);

  // --- Helper Functions ---

  const renderTimeSlot = (timeSlot: AvailableTime) => {
    const isSelected = selectedTime === timeSlot.time;
    const isSoldOut = timeSlot.soldOut;

    let buttonClasses = "border rounded-md px-3 py-2 text-sm text-center transition-colors ";
    if (isSoldOut) {
      buttonClasses += "bg-gray-100 text-gray-400 cursor-not-allowed line-through";
    } else if (isSelected) {
      buttonClasses += "bg-yellow-500 border-yellow-500 font-semibold";
    } else {
      buttonClasses += "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
    }

    return (
      <button
        key={timeSlot.time}
        className={buttonClasses}
        onClick={() => !isSoldOut && setSelectedTime(timeSlot.time)}
        disabled={isSoldOut}
      >
        <div>{formatTime(timeSlot.time)}</div>
        {!isSoldOut && timeSlot.slotsLeft > 0 && timeSlot.slotsLeft <= 5 && (
          <div className="text-xs text-red-600 font-medium">{timeSlot.slotsLeft} left</div>
        )}
      </button>
    );
  };

  // --- Loading and Error States ---
  if (isLoading) {
    return <div className="text-center text-lg text-gray-600 p-10">Loading details...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600 p-10">Error: {error}</div>;
  }

  if (!experience) {
    return <div className="text-center text-lg text-gray-600 p-10">Experience not found.</div>;
  }

  // --- Calculations for Summary ---
  const subtotal = experience.price * quantity;
  const taxes = 59; // Hardcoded from image
  const total = subtotal + taxes;
  const canConfirm = selectedDate && selectedTime;

  // --- Event Handler ---
  const handleConfirm = () => {
    if (!canConfirm || !experience || !selectedDate || !selectedTime) return;

    // This is the data we'll pass to the booking page
    const bookingDetails = {
      experienceId: experience._id,
      experienceTitle: experience.title,
      date: selectedDate,
      time: selectedTime,
      quantity: quantity,
      subtotal: subtotal,
      taxes: taxes,
      total: total,
    };
    
    // Navigate to the booking page with state
    navigate('/booking', { state: { bookingDetails } });
  };

  // --- Main Render ---
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Back Button */}
      <Link 
        to="/" // Links back to the homepage
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
      >
        &lt; Details
      </Link>

      {/* Main Grid: 2 cols on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        
        {/* === Left Column: Details === */}
        <div className="lg:col-span-2 space-y-6">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
          />
          
          <h1 className="text-3xl font-bold text-gray-900">{experience.title}</h1>
          
          <p className="text-base text-gray-700 leading-relaxed">{experience.description}</p>

          {/* Date Picker */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Choose date</h2>
            <div className="flex flex-wrap gap-3">
              {experience.availableDates.length > 0 ? (
                experience.availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`border rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      selectedDate === date
                        ? 'bg-yellow-500 border-yellow-500'
                        // Faded for non-selected
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No dates available.</p>
              )}
            </div>
          </div>

          {/* Time Picker */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Choose time</h2>
            <div className="flex flex-wrap gap-3">
              {experience.availableTimes.length > 0 ? (
                experience.availableTimes.map(renderTimeSlot)
              ) : (
                <p className="text-sm text-gray-500">No times available for this experience.</p>
              )}
            </div>
            <p className="text-xs text-gray-500">All times are in IST (GMT +5:30)</p>
          </div>

          {/* About Section */}
          <div className="space-y-3 pt-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
              {experience.about || "No additional information available."}
            </p>
          </div>
        </div>

        {/* === Right Column: Summary === */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              
              {/* Price Row */}
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-700">Starts at</span>
                <span className="font-semibold text-gray-900">₹{experience.price}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Quantity</span>
                <div className="flex items-center gap-4 border border-gray-300 rounded">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <hr className="border-t border-gray-200" />
              
              {/* Subtotal */}
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>

              {/* Taxes */}
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-700">Taxes</span>
                <span className="font-medium text-gray-900">₹{taxes}</span>
              </div>

              <hr className="border-t border-gray-200" />
              
              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{total}</span>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className={`w-full px-6 py-3 text-lg font-semibold rounded-md transition-colors ${
                  canConfirm
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!canConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExperienceDetailPage;