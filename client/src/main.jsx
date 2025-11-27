import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './context/UserContext'; // Import the Provider
import './index.css'
import App from './App.jsx'
import About from './components/About.jsx'
import Memorize from './components/Memorize.jsx'
import Mapping from './components/Mapping.jsx'
import Test from './components/Test.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

// I'm using the modern React Router v6 method (createBrowserRouter) 
// to define a centralized structure for all your application's routes.
// What we learned from class is an old way
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        // Renders at: /
        // The index: true property is a specific, non-redundant 
        // way in React Router v6 to define the default child 
        // route when the parent's path is matched exactly.
        index: true,
        element: <Mapping />,
      },
      {
        path: "memorize", // NO leading slash here! Paths are relative to the parent.
        element: <Memorize />,
      },
      {
        path: "about", 
        element: <About />,
      },
      {
        path: "test", 
        element: <Test />,
      },
      // You can also add a catch-all 404 route here
      // { path: "*", element: <NotFound /> }
    ],
  },
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the router provider with your UserProvider */}
    <UserProvider>
      {/* <App /> */}
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
