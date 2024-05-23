import { configureStore } from "@reduxjs/toolkit";
import selectedCourseReducer from "./slices/selectedCourseSlice";
import allCoursesReducer from "./slices/allCoursesSlice";

const store = configureStore({
  reducer: {
    allCourses: allCoursesReducer,
    selectedCourses: selectedCourseReducer,
  },
});

export default store;
