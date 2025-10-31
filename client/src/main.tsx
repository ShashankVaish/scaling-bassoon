import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"; // 1. Import router tools

import './index.css'
import App from './App.tsx'
import ExperiencePage from './pages/ExperiencePage.tsx'; // 2. Import your pages
import ExperienceDetailPage from './pages/ExperienceDetailPage.tsx';

// 3. Define your app's routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // <App /> is the layout (Header, etc.)
    children: [
      {
        path: "/", // Homepage
        element: <ExperiencePage />,
      },
      {
        path: "/experience/:id", // Detail page
        element: <ExperienceDetailPage />,
      },
    ],
  },
]);

// 4. Render the RouterProvider, not <App />
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)