import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
// import LoginPage from "./pages/Login

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </>
  );
}

export default App;
