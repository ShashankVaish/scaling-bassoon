// src/types.ts

// Represents one time slot
export interface AvailableTime {
  time: string;
  slotsLeft: number;
  soldOut: boolean;
}

// Represents the full Experience object (as from your schema)
export interface ExperienceDetail {
  _id: string;
  id?: number; // The 'id' from your schema (if it's different from _id)
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
  availableDates: string[]; // Dates usually come as ISO strings
  availableTimes: AvailableTime[];
  about: string;
}

// Represents the API wrapper
export interface ApiResponse {
  success: boolean;
  data: ExperienceDetail;
}