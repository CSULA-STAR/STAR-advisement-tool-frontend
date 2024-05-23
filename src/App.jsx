import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CourseList from "./pages/CourseList/CourseList";
import CourseSelection from "./pages/CourseSelection/CourseSelection.jsx";
import Home from "./pages/Home/Home";
import SelectedCourses from "./pages/SelectedCourses/SelectedCourses";
import RemainingCourseList from "../src/pages/CourseList/RemainingCourseList";
import store from "./store";
import CourseTable from "./pages/CourseSelection/CourseTable.jsx";

const App = () => {
  return (
    <Router>
      <Provider store={store}>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courselist" element={<CourseList />} />
            <Route path="/selected-courses" element={<SelectedCourses />} />
            <Route path="/course-selection" element={<CourseSelection />} />
            <Route
              path="/justify-unselected"
              element={<RemainingCourseList />}
            />
            <Route path="/:blockName" component={CourseTable} />
          </Routes>
        </main>
      </Provider>
    </Router>
  );
};

export default App;
