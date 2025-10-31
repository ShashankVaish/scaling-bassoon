import React from 'react';

// --- Type Definitions ---
// (You could move these to a separate 'types.ts' file)

// This matches the data you're fetching
export interface Experience {
    _id:string
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
}

// These are the props the component itself will receive
interface ExperienceCardProps {
  experience: Experience;
}

// --- Component ---c

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  // Destructuring is the same, but now TypeScript knows the type of each variable
  const { title, location, description, price, imageUrl } = experience;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      
      {/* Card Image */}
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover" 
      />

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Card Header */}
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-600 whitespace-nowrap ml-2">{location}</span>
        </div>

        {/* Card Description (using line-clamp) */}
        <p className="text-sm text-gray-700 leading-snug line-clamp-3 flex-grow mb-4">
          {description}
        </p>

        {/* Card Footer */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          <span className="text-lg font-bold text-black">
            From ₹{price}
          </span>
          <button className="px-3 py-1 text-sm font-semibold text-gray-800 bg-yellow-400 border border-yellow-600 rounded-md shadow-sm transition-colors hover:bg-yellow-500">
            View Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExperienceCard;