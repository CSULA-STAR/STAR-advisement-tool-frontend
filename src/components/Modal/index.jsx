import { useState } from "react";
import PropTypes from "prop-types";
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
  handleUpdateCourse,
  fullSize,
}) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    const updatedCourse = {
      ...course,
      comment: comment,
    };
    handleUpdateCourse(updatedCourse);
    handleModalClose();
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
            value={comment}
            onChange={handleCommentChange}
          />
          <Button variant="contained" onClick={handleSubmitComment} fullWidth>
            Submit Comment
          </Button>
        </Paper>
      </div>
    </Modal>
  );
};

CustomModal.propTypes = {
  course: PropTypes.object.isRequired,
  openModal: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  handleUpdateCourse: PropTypes.func.isRequired,
  fullSize: PropTypes.bool,
};

export default CustomModal;
