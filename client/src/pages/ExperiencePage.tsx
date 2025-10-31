import React, { useState, useEffect } from "react";
import ExperienceCard, { type Experience } from "../components/ExperienceCard";
import { Link } from "react-router-dom";

const ExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  interface ApiResponse {
    success: boolean;
    data: Experience[];
  }

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/get-experince");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ApiResponse = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setExperiences(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) {
    return <div className="text-center text-lg text-gray-600 p-10">Loading experiences...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600 p-10">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {experiences.map((exp) => (
        // Wrap the card in a Link component
        <Link 
          key={exp._id} 
          to={`/experience/${exp._id}`} // This creates the correct URL
        >
          <ExperienceCard experience={exp} />
        </Link>
      ))}
    </div>
  );
};

export default ExperiencePage;
