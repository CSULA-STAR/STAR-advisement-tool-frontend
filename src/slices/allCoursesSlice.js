import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const allCoursesSlice = createSlice({
  name: "allCourses",
  initialState,
  reducers: {
    addAllCourse(state, action) {
      return action.payload;
    },
  },
});

export const { addAllCourse } = allCoursesSlice.actions;
export default allCoursesSlice.reducer;
