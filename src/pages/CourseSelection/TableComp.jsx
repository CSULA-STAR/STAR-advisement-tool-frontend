import PropTypes from "prop-types";

const TableComp = ({ data }) => {
  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Taken Semester</th>
            <th>Year</th>
            <th>Pre-requisites</th>
            <th>Co-requisites</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              style={{
                backgroundColor:
                  row?.selected_term?.term && row.isSelected
                    ? "lightgreen"
                    : row.isSelected
                    ? "yellow"
                    : "",
              }}
            >
              <td>{row.course_code?.join(", ")}</td>
              <td>{row.course_name}</td>
              <td>{row.credits}</td>
              <td>{row?.selected_term?.term || ""}</td>
              <td>{row?.selected_term?.year || ""}</td>
              <td>{row.pre_requisite?.course_code?.join(", ") || ""}</td>
              <td>{row.co_requisite?.course_code?.join(", ") || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "10px" }}
        >
          Currently Selected Course:{" "}
          <span
            style={{
              backgroundColor: "lightgreen",
              width: "20px",
              height: "20px",
              marginRight: "5px",
              display: "inline-block",
            }}
          ></span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          Transfer Course:{" "}
          <span
            style={{
              backgroundColor: "yellow",
              width: "20px",
              height: "20px",
              marginRight: "5px",
              display: "inline-block",
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

TableComp.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      course_code: PropTypes.arrayOf(PropTypes.string),
      course_name: PropTypes.string,
      credits: PropTypes.number,
      selected_term: PropTypes.shape({
        term: PropTypes.string,
        year: PropTypes.number,
      }),
      isSelected: PropTypes.bool,
    })
  ).isRequired,
};

export default TableComp;
