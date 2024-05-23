import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CourseCard from "../CourseCard";

const CourseSelectorModal = ({ openModal, handleModalClose, courses }) => {
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

CourseSelectorModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  handleCommentClick: PropTypes.func.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      course_name: PropTypes.string.isRequired,
      course_code: PropTypes.array.isRequired,
      credits: PropTypes.number.isRequired,
      department: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
      pre_requisite: PropTypes.shape({
        description: PropTypes.string,
        course_code: PropTypes.array,
      }),
      co_requisite: PropTypes.shape({
        description: PropTypes.string,
        course_code: PropTypes.array,
      }),
      term: PropTypes.array,
    })
  ).isRequired,
};

export default CourseSelectorModal;
