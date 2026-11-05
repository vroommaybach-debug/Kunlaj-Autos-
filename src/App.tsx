import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Showroom from "./pages/Showroom";
import PartsCenter from "./pages/PartsCenter";
import ServiceDesk from "./pages/ServiceDesk";
import Legal from "./pages/Legal";
import SoldArchive from "./pages/SoldArchive";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/parts" element={<PartsCenter />} />
          <Route path="/service" element={<ServiceDesk />} />
          <Route path="/archive" element={<SoldArchive />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
