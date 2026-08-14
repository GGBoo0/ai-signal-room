import React from "react";
import { createRoot } from "react-dom/client";
import { QuoteLedgerApp } from "./QuoteLedgerApp.jsx";
import "./ledger.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QuoteLedgerApp />
  </React.StrictMode>,
);
