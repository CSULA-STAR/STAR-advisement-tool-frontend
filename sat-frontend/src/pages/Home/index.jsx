import axios from "axios";
import { useEffect, useState } from "react";
import SelectionDropdown from "../../components/SelectionDropdown";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Home = () => {
  const [college, setCollege] = useState("");
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const navigate = useNavigate();

  const handleChange = (event) => {
    console.log("-->16", event);
    setCollege(event.target.value);
    setSelectedProgram(""); // Reset selected program
    setIsSubmitDisabled(true);
  };

  const handleProgramChange = (selectedProgram) => {
    console.log("handleProgramChange", selectedProgram);
    setSelectedProgram(selectedProgram.target.value); // Set selected program object
    setIsSubmitDisabled(!selectedProgram); // Disable submit if no program is selected
  };

  const handleSubmit = () => {
    if (!college || !selectedProgram) {
      alert("Please select both college and program before submitting.");
      return;
    }

    console.log("Selected college:", college);
    console.log("Selected program:", selectedProgram);
    navigate("/courselist", {
      state: { program: selectedProgram, sId: college },
    });
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/fetch-institutes"
        );
        console.log("re", response.data[0].name);
        setSchools(
          response.data.map((college) => ({
            label: college.name,
            value: college.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (college) {
        try {
          const response = await axios.get(
            `http://localhost:3001/fetch-programs?collegeId=${college}`
          );
          setPrograms(
            response.data.map((program) => ({
              label: program.name,
              value: program,
            }))
          );
        } catch (error) {
          console.error("Error fetching programs:", error);
        }
      } else {
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, [college]);

  return (
    <div className="home-container">
      <h1>Select your school</h1>
      <SelectionDropdown
        label="Select College"
        options={schools}
        value={college}
        onChange={handleChange}
      />
      {college && (
        <SelectionDropdown
          label="Select Program"
          options={programs}
          value={selectedProgram}
          onChange={handleProgramChange}
        />
      )}
      <button onClick={handleSubmit} disabled={isSubmitDisabled}>
        Submit
      </button>
    </div>
  );
};

export default Home;
