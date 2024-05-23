import React from "react";
import { useParams } from "react-router-dom";

const CourseTable = () => {
  const { blockName } = useParams();

  return <div>Block Detail for {blockName}</div>;
};

export default CourseTable;
