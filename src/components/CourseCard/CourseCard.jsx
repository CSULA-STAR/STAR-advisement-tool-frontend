import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  Box,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
  Tooltip,
  Link,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import CustomModal from "../Modal";
import "./courseCardStyle.css";

const CourseCard = ({
  enableCheckbox,
  course,
  onCheckboxChange,
  isChecked,
  onCommentClick,
  addComment,
  hoverable,
  isBlock,
  onClick,
  compactView,
  requsiteRequired,
  handleUpdateCourse,
}) => {
  const {
    course_name,
    course_code,
    credits,
    _id,
    pre_requisite,
    co_requisite,
    term,
  } = course;
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const noRequisites =
    !pre_requisite?.course_code.length && !co_requisite?.course_code.length;

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };



  return (
    <>
      {!compactView ? (
        <Box>
          <Card
            elevation={3}
            // variant="outlined"
            className="course_card"
            onMouseEnter={hoverable && handleMouseEnter}
            onMouseLeave={hoverable && handleMouseLeave}
            onClick={onClick}
            sx={{ maxWidth: 360 }}
            style={{
              marginBottom: "10px",
              backgroundColor: requsiteRequired ? "" : "",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center">
                  {enableCheckbox && (
                    <Typography gutterBottom>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={isChecked}
                            onChange={(e) => onCheckboxChange(course._id, e.target.checked)}
                            gutterBottom
                          />
                        }
                      />
                    </Typography>
                  )}
                  {course_code?.map((code, index) => (
                    <Typography
                      gutterBottom
                      variant="h6"
                      key={index}
                      component="div"
                      className="course-code"
                    >
                      <strong>
                        {code}
                        {index < course_code.length - 1 ? "/ " : ""}
                      </strong>
                    </Typography>
                  ))}
                </Stack>
                <Typography gutterBottom variant="h6" className="credits">
                  {credits}
                </Typography>
              </Stack>
              {!isHovered ? <Divider style={{ marginBottom: "10px" }} /> : null}
              <Stack>
                <Tooltip title={course_name}>
                  <Typography
                    className="course-name"
                    color="text.secondary"
                    variant="body2"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course_name}
                  </Typography>
                </Tooltip>
                <Box style={{ display: "flex", justifyContent: "end" }}>
                  {addComment ? (
                    // Use Link component instead of Button
                    <Link
                      onClick={handleModalOpen}
                      style={{
                        textDecoration: "none",
                        marginTop: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Add Comment
                    </Link>
                  ) : null}
                </Box>
              </Stack>
              <CustomModal
                course={course}
                openModal={openModal}
                handleModalClose={handleModalClose}
                handleCommentClick={handleCommentClick}
                handleUpdateCourse={handleUpdateCourse}
              />
            </Box>
            {isHovered ? (
              <>
                <Divider />
                <Box sx={{ p: 2 }}>
                  {noRequisites ? null : (
                    <Stack direction="row" spacing={2}>
                      {pre_requisite?.course_code.length ? (
                        <>
                          <Typography variant="body2">
                            Pre-requisites:
                          </Typography>

                          <Tooltip title={pre_requisite?.description}>
                            <Typography
                              gutterBottom
                              variant="body2"
                              style={
                                requsiteRequired
                                  ? {
                                      color: "red",
                                      textDecoration: "underline",
                                      textDecorationColor: "red",
                                      textDecorationStyle: "solid",
                                    }
                                  : {}
                              }
                            >
                              {pre_requisite?.course_code?.join(", ")}
                            </Typography>
                          </Tooltip>
                        </>
                      ) : null}
                      {co_requisite?.course_code.length ? (
                        <>
                          <Typography variant="body2">Co-requsites:</Typography>

                          <Tooltip title={co_requisite?.description}>
                            <Typography gutterBottom variant="body2">
                              {co_requisite?.course_code?.join(", ")}
                            </Typography>
                          </Tooltip>
                        </>
                      ) : null}
                    </Stack>
                  )}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={!noRequisites ? { marginTop: 2 } : {}}
                  >
                    {term?.map((item) => (
                      <Chip
                        key={item}
                        color="primary"
                        label={item}
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              </>
            ) : null}
          </Card>
        </Box>
      ) : (
        <Box>
          <Card
            className="course_card"
            onClick={onClick}
            sx={{ maxWidth: 360 }}
            style={{
              marginBottom: "10px",
              backgroundColor: "#e3e2e7",
            }}
          >
            <Box sx={{ p: 1.2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center">
                  {enableCheckbox && (
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
                  {course_code?.map((code, index) => (
                    <Typography variant="subtitle2" key={index} component="div">
                      <strong className="course-code">
                        {code}
                        {index < course_code.length - 1 ? "/ " : ""}
                      </strong>
                    </Typography>
                  ))}
                </Stack>
                <Typography variant="subtitle2" component="div">
                  {credits}
                </Typography>
              </Stack>
              <Stack>
                <Tooltip title={course_name}>
                  <Typography
                    className="course-name"
                    color="text.secondary"
                    variant="body2"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course_name}
                  </Typography>
                </Tooltip>
              </Stack>
            </Box>
          </Card>
        </Box>
      )}
      {isBlock ? null : null}
    </>
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
    pre_requisite: PropTypes.shape({
      description: PropTypes.string,
      course_code: PropTypes.array,
    }),
    co_requisite: PropTypes.shape({
      description: PropTypes.string,
      course_code: PropTypes.array,
    }),
    term: PropTypes.array,
  }),
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool.isRequired,
  onCommentClick: PropTypes.func.isRequired,
  addComment: PropTypes.bool,
  hoverable: PropTypes.bool,
  isBlock: PropTypes.bool,
  onClick: PropTypes.func,
  compactView: PropTypes.bool,
  selected: PropTypes.bool,
  requsiteRequired: PropTypes.bool,
};

export default CourseCard;
