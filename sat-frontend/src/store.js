import { configureStore } from "@reduxjs/toolkit";
import selectedCourseReducer from "./slices/selectedCourseSlice";

const store = configureStore({
  reducer: selectedCourseReducer,
});

export default store;
