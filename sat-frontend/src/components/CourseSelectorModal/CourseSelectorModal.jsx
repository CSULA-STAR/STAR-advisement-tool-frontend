import { Modal, Box, Typography, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CourseSelectorModal = ({
  openModal,
  handleModalClose,
  handleCommentClick,
}) => {
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
            <Typography variant="h5">Hello!</Typography>
            {/* Add your content here */}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default CourseSelectorModal;
