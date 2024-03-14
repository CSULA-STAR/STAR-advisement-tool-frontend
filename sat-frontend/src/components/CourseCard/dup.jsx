import { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import CustomModal from "../Modal";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import "./style.css";

const CourseCard = ({
  enableCheckbox,
  course,
  onCheckboxChange,
  isChecked,
  onCommentClick,
  addCommment,
}) => {
  const { course_name, course_code, credits, _id, prereq, coreq } = course;
  const [openModal, setOpenModal] = useState(false);

  const handleCheckboxChange = (event) => {
    onCheckboxChange(_id, event.target.checked);
  };

  const handleCommentClick = () => {
    onCommentClick(course);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  // Function to replace "SUBJECT1" with its corresponding value
  const replaceSubjectCode = (title, courseCode) => {
    if (courseCode && "SUBJECT1" in courseCode) {
      return title.replace("SUBJECT1", courseCode["SUBJECT1"]);
    }
    return title;
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <Card
        variant="outlined"
        style={{
          borderRadius: "20px",
          boxShadow: "0 0 0 2px #000, 0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFCE00",
        }}
      >
        <CardContent
          style={{
            display: "grid",
            // gridTemplateColumns: "1fr 2fr 1fr",
            gridTemplateRows: "1fr 1fr",
            alignItems: "center",
            justifyContent: "space-between",
            height: "120px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {!enableCheckbox && (
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                }
              />
            )}
            {course_code.map((code, index) => (
              <div key={index}>
                <Typography variant="subtitle1" component="subtitle1">
                  <strong>{code}</strong>
                </Typography>
              </div>
            ))}
          </div>
          <Divider />
          <Typography variant="subtitle1" className="multiline-ellipsis">
            <strong>{course_name}</strong>
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end", // Align to the right
              alignItems: "center",
            }}
          >
            <Chip
              label={credits}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                marginRight: "10px",
              }}
            />
          </div>

          {addCommment ? (
            <Button
              onClick={handleModalOpen}
              style={{
                textTransform: "none",
                position: "absolute",
                bottom: "5px",
                right: "10px",
              }}
            >
              {"Add Comment"}
            </Button>
          ) : null}
          <CustomModal
            openModal={openModal}
            handleModalClose={handleModalClose}
            handleCommentClick={handleCommentClick}
          />
        </CardContent>
        {/* <div style={{ padding: "10px" }}>
          <Typography variant="body2">
            <strong>Prerequisites:</strong>{" "}
            {prereq ? (
              <Tooltip
                title={prereq
                  .map((p) => replaceSubjectCode(p.title, p.course_code))
                  .join(", ")}
              >
                <span className="ellipsis">
                  {prereq
                    .map((p) => replaceSubjectCode(p.title, p.course_code))
                    .join(", ")}
                </span>
              </Tooltip>
            ) : (
              "None"
            )}
          </Typography>
          <Typography variant="body2">
            <strong>Corequisites:</strong>{" "}
            {coreq ? (
              <Tooltip title={coreq.map((c) => c.title).join(", ")}>
                <span className="ellipsis">
                  {coreq.map((c) => c.title).join(", ")}
                </span>
              </Tooltip>
            ) : (
              "None"
            )}
          </Typography>
        </div> */}
      </Card>
    </div>
  );
};

CourseCard.propTypes = {
  enableCheckbox: PropTypes.bool,
  course: PropTypes.shape({
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
    prereq: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        course_code: PropTypes.object.isRequired,
      })
    ),
    coreq: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool.isRequired,
  onCommentClick: PropTypes.func.isRequired,
  addCommment: PropTypes.bool,
};

export default CourseCard;
