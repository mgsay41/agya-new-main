import React from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import GlobalState from "./context/GlobelContext.js";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalState>
    <PrimeReactProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrimeReactProvider>
    </GlobalState>
  </React.StrictMode>
);