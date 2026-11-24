import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Automatically inject Tailwind CSS if not already loaded
if (!document.getElementById("tailwind-cdn")) {
  const script = document.createElement("script");
  script.id = "tailwind-cdn";
  script.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(script);
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);