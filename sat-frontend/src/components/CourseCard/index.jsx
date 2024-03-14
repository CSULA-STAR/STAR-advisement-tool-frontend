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
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import "./style.css";

const CourseCard = ({
  enableCheckbox,
  course,
  onCheckboxChange,
  isChecked,
  onCommentClick,
  addCommment,
  hoverable,
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
    <Card
      // variant="outlined"
      onMouseEnter={!hoverable ? handleMouseEnter : {}}
      onMouseLeave={!hoverable ? handleMouseLeave : {}}
      // onClick={!hoverable ? handleMouseEnter : {}}
      sx={{ maxWidth: 360 }}
      style={{ marginBottom: "10px", backgroundColor: "#e3e2e7" }}
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
                      onChange={handleCheckboxChange}
                      gutterBottom
                    />
                  }
                />
              </Typography>
            )}
            {course_code?.map((code, index) => (
              <Typography gutterBottom variant="h5" key={index} component="div">
                <strong>{code}</strong>
              </Typography>
            ))}
          </Stack>
          <Typography gutterBottom variant="h6" component="div">
            {credits}
          </Typography>
        </Stack>
        {!isHovered ? <Divider style={{ marginBottom: "10px" }} /> : null}
        <Typography color="text.secondary" variant="body2">
          {course_name}
        </Typography>
      </Box>
      {isHovered ? (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            {noRequisites ? null : (
              <Stack direction="row" spacing={2}>
                {pre_requisite?.course_code.length ? (
                  <>
                    <Typography variant="body2">Pre-requsites:</Typography>
                    <Tooltip title={pre_requisite?.description}>
                      <Typography gutterBottom variant="body2">
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
                <Chip key={item} color="primary" label={item} size="small" />
              ))}
            </Stack>
          </Box>
        </>
      ) : null}
    </Card>
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
      description: PropTypes.string.isRequired,
      course_code: PropTypes.array.isRequired,
    }),
    co_requisite: PropTypes.shape({
      description: PropTypes.string.isRequired,
      course_code: PropTypes.array.isRequired,
    }),
    term: PropTypes.array,
  }),
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool.isRequired,
  onCommentClick: PropTypes.func.isRequired,
  addCommment: PropTypes.bool,
  hoverable: PropTypes.bool,
};

export default CourseCard;
