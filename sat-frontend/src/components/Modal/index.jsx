import {
  Modal,
  Typography,
  Paper,
  TextareaAutosize,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomModal = ({
  openModal,
  handleModalClose,
  handleCommentClick,
  fullSize,
}) => {
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
          />
          <Button variant="contained" onClick={handleModalClose} fullWidth>
            Submit Comment
          </Button>
        </Paper>
      </div>
    </Modal>
  );
};

export default CustomModal;
