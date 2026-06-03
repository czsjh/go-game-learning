import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Play from "@/pages/Play";
import Stats from "@/pages/Stats";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:levelId" element={<Play />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}
