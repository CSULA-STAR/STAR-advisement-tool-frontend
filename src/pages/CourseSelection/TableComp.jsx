import React from "react";

const TableComp = ({ data }) => {
  console.log("tabdata", data);
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Name</th>
          <th>Credits</th>
          <th>Taken</th>
          <th>Taken Semester</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.course_code?.join(", ")}</td>
            <td>{row.course_name}</td>
            <td>{row.credits}</td>
            <td>test</td>
            <td>test</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComp;
