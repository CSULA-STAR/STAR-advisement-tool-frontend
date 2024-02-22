import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const CourseCard = ({
  enableCheckbox,
  course,
  onCheckboxChange,
  isChecked,
}) => {
  const { course_name, subject_code, credits, department, _id } = course;
  console.log("iddd", course);
  const handleCheckboxChange = (event) => {
    onCheckboxChange(_id, event.target.checked);
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {course_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Course Code: {subject_code}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Credits: {credits}
          </Typography>
          <Typography color="textSecondary">
            Department: {department.map((dept) => dept.name).join(", ")}
          </Typography>
          {enableCheckbox ? (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              }
              label="Select if you have completed this course"
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

CourseCard.propTypes = {
  enableCheckbox: PropTypes.bool,
  course: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    course_name: PropTypes.string.isRequired,
    subject_code: PropTypes.array.isRequired,
    credits: PropTypes.number.isRequired,
    department: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool.isRequired,
};

export default CourseCard;
