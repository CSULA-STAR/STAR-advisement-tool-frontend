import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectionDropdown from "../../components/SelectionDropdown";
import "./style.css";

const Home = () => {
  const [college, setCollege] = useState("");
  const [data, setData] = useState(null);

  const handleChange = (event) => {
    setCollege(event.target.value);
  };

  const handleSubmit = () => {
    // You can perform any actions with the selected college here, like submitting form data
    console.log("Selected college:", college);
  };

  const collegeOptions = [
    { value: "harvard", label: "Harvard University" },
    { value: "stanford", label: "Stanford University" },
    { value: "mit", label: "Massachusetts Institute of Technology" },
    { value: "yale", label: "Yale University" },
    { value: "princeton", label: "Princeton University" },
  ];

  useEffect(() => {
    console.log("daat", data);
    axios
      .get("http://localhost:3001/fetch-institutes")
      .then((response) => {
        setData(response); // Set response data in state
        console.log("daat", data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [data]);

  return (
    <div className="home-container">
      {" "}
      {/* Applying container class */}
      <h1>Select your school</h1>
      <SelectionDropdown
        label="Select College"
        options={collegeOptions}
        value={college}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Home;
