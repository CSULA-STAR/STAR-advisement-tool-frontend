import { useState } from "react";
import PropTypes from "prop-types";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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
        <Card
          onMouseEnter={hoverable && handleMouseEnter}
          onMouseLeave={hoverable && handleMouseLeave}
          onClick={onClick}
          sx={{ maxWidth: 360, marginBottom: "10px" }}
          style={{
            backgroundColor: requsiteRequired ? "#a4a7b0" : "#e3e2e7",
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
                  <Typography variant="h6" key={index} component="div">
                    <strong>
                      {code}
                      {index < course_code.length - 1 ? "/ " : ""}
                    </strong>
                  </Typography>
                ))}
              </Stack>
              <Typography variant="h6" component="div">
                {credits}
              </Typography>
            </Stack>
            {!isHovered ? <Divider style={{ marginBottom: "10px" }} /> : null}
            <Stack>
              <Tooltip title={course_name}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {course_name}
                </Typography>
              </Tooltip>
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                {addComment ? (
                  <Link
                    onClick={handleModalOpen}
                    sx={{
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
              openModal={openModal}
              handleModalClose={handleModalClose}
              handleCommentClick={handleCommentClick}
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
                        <Typography variant="body2">Pre-requisites:</Typography>
                        <Tooltip title={pre_requisite?.description}>
                          <Typography
                            variant="body2"
                            gutterBottom
                            sx={
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
                          <Typography variant="body2" gutterBottom>
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
      ) : (
        <Card
          onClick={onClick}
          sx={{
            maxWidth: 360,
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
                    <strong>
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
                  color="text.secondary"
                  variant="body2"
                  sx={{
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
