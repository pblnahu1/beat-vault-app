import React from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className=" min-h-screen mx-auto">
        {/* inserta automaticamente el contenido de la ruta correspondiente */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout