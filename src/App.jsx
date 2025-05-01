import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RemainingCourseList from "../src/pages/RemainingCourseList/RemainingCourseList.jsx";
import Navbar from "./components/Navbar/Navbar";
import CourseList from "./pages/CourseList/CourseList";
import CourseSelection from "./pages/CourseSelection/CourseSelection.jsx";
import Home from "./pages/Home/Home";
import SelectedCourses from "./pages/SelectedCourses/SelectedCourses";
import GECourseList from "./pages/GECourseList/GECourseList";
import HomeMapping from "./pages/Map/HomeMapping";
import Map from "./pages/Map/Map";
import store from "./store";

const App = () => {
  return (
    <Router>
      <Provider store={store}>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gecourselist" element={<GECourseList />} />
            <Route path="/courselist" element={<CourseList />} />
            <Route path="/selected-courses" element={<SelectedCourses />} />
            <Route path="/course-selection" element={<CourseSelection />} />
            <Route path="/mapping" element={<HomeMapping />} />
            <Route path="/map" element={<Map />} />
            <Route
              path="/justify-unselected"
              element={<RemainingCourseList />}
            />
          </Routes>
        </main>
      </Provider>
    </Router>
  );
};

export default App;
