import { Modal, Box, Typography, Paper, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CourseCard from "../CourseCard";
import { useState } from "react";

const CourseSelectorModal = ({
  openModal,
  handleModalClose,
  handleCommentClick,
  courses,
}) => {
  const handleCheckboxChange = () => {};
  const handleSubmitClick = () => {};
  return (
    <Modal
      open={openModal}
      onClose={handleModalClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box style={{ outline: "none" }}>
        <Paper
          style={{
            width: "90vw",
            maxWidth: 600,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box p={2}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "20px",
              }}
            >
              <Typography variant="h5">Select Courses from Block</Typography>
              <Button onClick={handleModalClose} variant="text">
                <CloseIcon />
              </Button>
            </Box>
            {courses?.map((course) => (
              <CourseCard
                compactView={true}
                key={course._id}
                enableCheckbox
                hoverable={false}
                course={course}
                addComment={true}
                onCheckboxChange={(isChecked) =>
                  handleCheckboxChange(course._id, isChecked)
                }
              />
            ))}

            <Button variant="contained" onClick={handleSubmitClick}>
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default CourseSelectorModal;
