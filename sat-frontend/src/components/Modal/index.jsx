import React, { useState } from "react";
import {
  Modal,
  Typography,
  Paper,
  TextareaAutosize,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomModal = ({
  course,
  openModal,
  handleModalClose,
  handleUpdateCourse, // New callback prop to handle the updated course
  fullSize,
}) => {
  // State to manage the input comment
  const [comment, setComment] = useState("");

  // Handle comment input change
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // Function to handle submission of the comment
  const handleSubmitComment = (event) => {
    event.preventDefault(); // Prevent the form from causing a page reload
    const updatedCourse = {
      ...course,
      comment: comment, // Add the comment to the course object
    };
    handleUpdateCourse(updatedCourse); // Call the callback with the updated course
    handleModalClose(); // Close the modal
  };

  return (
    <Modal open={openModal} onClose={handleModalClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: fullSize ? "80%" : "auto",
          height: fullSize ? "80%" : "auto",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        <Paper sx={{ p: 4, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <Button onClick={handleModalClose} variant="text">
              <CloseIcon />
            </Button>
          </div>
          <Typography variant="h6" gutterBottom>
            Add Comment
          </Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Enter your comment..."
            style={{
              width: "100%",
              marginBottom: "16px",
              padding: "12px",
              fontFamily: "Arial, sans-serif",
            }}
            value={comment} // Controlled component
            onChange={handleCommentChange} // Update the state on change
          />
          <Button variant="contained" onClick={handleSubmitComment} fullWidth>
            Submit Comment
          </Button>
        </Paper>
      </div>
    </Modal>
  );
};

export default CustomModal;
