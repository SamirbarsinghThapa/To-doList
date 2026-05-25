import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Completed from "./pages/Completed";
import Markets from "./pages/Markets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/markets" element={<Markets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
