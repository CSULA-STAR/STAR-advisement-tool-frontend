import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const selectedCourseSlice = createSlice({
  name: "selectedCourse",
  initialState,
  reducers: {
    addCourse(state, action) {
      state.push(...action.payload);
    },
    removeCourse(state, action) {
      state = state.filter((course) => course._id === action.payload._id);
    },
    reset: () => initialState,
  },
});

export const { addCourse, removeCourse, reset } = selectedCourseSlice.actions;
export default selectedCourseSlice.reducer;
