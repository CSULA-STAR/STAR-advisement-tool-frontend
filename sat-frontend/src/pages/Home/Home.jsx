import axios from "axios";
import { useEffect, useState } from "react";
import SelectionDropdown from "../../components/SelectionDropdown";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Button } from "@mui/material";
import { TERMS } from "../../constants";
import { getNextYears } from "../../utils";
import "./HomeStyle.css";
import { Typography } from "@mui/material";

const Home = () => {
  const [college, setCollege] = useState("");
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [startYear, setStartYear] = useState(new Date().getFullYear());

  const [selectedProgram, setSelectedProgram] = useState();
  const [selectedTerm, setSelectedTerm] = useState();

  const navigate = useNavigate();

  const handleChange = (event) => {
    setCollege(event.value);
    setSelectedProgram("");
  };

  const handleProgramChange = (selectedProgram) => {
    console.log("selectedProgram", selectedProgram);
    setSelectedProgram(selectedProgram.value);
  };

  const handleTermChange = (term) => {
    setSelectedTerm(term);
  };

  const handleStartYearChange = (year) => {
    setStartYear(year);
  };

  const handleSubmit = () => {
    if (!college || !selectedProgram || !selectedTerm) {
      alert("Please select all fields before submitting.");
      return;
    }

    navigate("/courselist", {
      state: {
        program: selectedProgram,
        college: college,
        term: selectedTerm,
        startyear: startYear,
      },
    });
  };

  useEffect(() => {
    localStorage.removeItem("selectedCourses");

    const fetchColleges = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/fetch-institutes"
        );
        console.log("re", response.data[0].name);
        setSchools(
          response.data.map((college) => ({
            label: college.name,
            value: college,
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
      console.log("COLLEGE", college);

      if (college) {
        try {
          const response = await axios.get(
            `http://localhost:3001/fetch-programs?collegeId=${college.id}`
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
    <Box sx={{ textAlign: "center" }}>
      <Stack direction="column" alignItems="center" spacing={2}>
        <Typography variant="h5" component="div">
          Select your school
        </Typography>
        <SelectionDropdown
          label="Select College"
          options={schools}
          value={college.value}
          onChange={handleChange}
        />
        {college && (
          <SelectionDropdown
            label="Select Program"
            options={programs}
            value={selectedProgram.value}
            onChange={handleProgramChange}
          />
        )}
        {selectedProgram && (
          <SelectionDropdown
            label="Start Term"
            options={TERMS}
            value={selectedTerm}
            onChange={handleTermChange}
          />
        )}
        {selectedProgram && (
          <SelectionDropdown
            label="Start Year"
            options={getNextYears(3)}
            value={startYear.value}
            onChange={handleStartYearChange}
          />
        )}
        <Button
          onClick={handleSubmit}
          // disabled={isSubmitDisabled}
          variant="contained"
          style={{ backgroundColor: "#FFCE00", color: "#000" }}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
