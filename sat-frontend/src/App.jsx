import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CourseList from "./pages/CourseList/CourseList";
import Home from "./pages/Home/Home";
import SelectedCourses from "./pages/SelectedCourses";
import { CourseSelection } from "./pages/CourseSelection/CourseSelection";

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courselist" element={<CourseList />} />
          <Route path="/selected-courses" element={<SelectedCourses />} />
          <Route path="/course-selection" element={<CourseSelection />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
