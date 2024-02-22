import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CourseList from "./pages/CourseList";
import SelectedCourses from "./pages/SelectedCourses";

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courselist" element={<CourseList />} />
          <Route path="/selected-courses" element={<SelectedCourses />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
