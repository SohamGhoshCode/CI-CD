// main.jsx - Entry point for the React application
// This file mounts the root <App /> component into the DOM
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Get the #root div from index.html and render the app into it
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
