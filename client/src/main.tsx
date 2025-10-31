import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"; 

import './index.css'
import App from './App.tsx'
import ExperiencePage from './pages/ExperiencePage.tsx'; 
import ExperienceDetailPage from './pages/ExperienceDetailPage.tsx';
import BookingPage from './pages/BookingPage.tsx'; // 1. Import the new page

// 2. Define your app's routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "/", 
        element: <ExperiencePage />,
      },
      {
        path: "/experience/:id", 
        element: <ExperienceDetailPage />,
      },
      {
        path: "/booking", // 3. Add the booking route
        element: <BookingPage />,
      },
    ],
  },
]);

// 4. Render the RouterProvider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)