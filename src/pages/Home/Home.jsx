import axios from "axios";
import { useEffect, useState } from "react";
import SelectionDropdown from "../../components/SelectionDropdown";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Button } from "@mui/material";
import { TERMS } from "../../constants";
import { getNextYears } from "../../utils";
import "./HomeStyle.css";
import { Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';




const Home = () => { 
  const [college, setCollege] = useState("");
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [startYear, setStartYear] = useState();

  const [selectedProgram, setSelectedProgram] = useState();
  const [selectedTerm, setSelectedTerm] = useState();

 
  const theme = createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCollege(event.value);
    setSelectedProgram("");
  };

  const handleProgramChange = (selectedProgram) => {
    setSelectedProgram(selectedProgram.value);
  };

  const filteredTerms = TERMS.filter(
    (term) => term.value === "fall" || term.value === "spring"
  );

  const handleTermChange = (term) => {
    setSelectedTerm(term);
  };

  const handleStartYearChange = (year) => {
    setStartYear(year);
    console.log("yearr", year);
  };

  const handleSubmit = () => {
    if (!college || !selectedProgram || !selectedTerm || !startYear) {
      alert("Please select all fields before submitting.");
      return;
    }

    navigate("/courselist", {
      state: {
        program: selectedProgram,
        college: college,
        startTerm: selectedTerm,
        startYear,
      },
    });
  };

  useEffect(() => {
    // Reset all localStorage items related to course selection
    localStorage.removeItem("selectedCourses");
    localStorage.removeItem("courseListCheckboxState");
    localStorage.removeItem("courseListLocationState");
    localStorage.removeItem("remainingCourseListLocationState");
    localStorage.removeItem("remainingCourseListCheckboxState");
    localStorage.removeItem("remainingCourseListCourses");

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
    <Box
      sx={{
        height: "80vh",
        width: "100vw",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Stack direction="column" alignItems="center" spacing={2}>
          <Box>
            <img src="calstatelaLogo.png" alt="" style={{width:150, height:150}} />
          </Box>
          <Typography
            variant="h5"
            component="div"
            px={50}
            pb={3}
            fontSize={{ sm: 20 }}
            textAlign={"center"}
            theme={theme}
          >
            Please select the school you transfer from, the Cal State LA program
            you want to transfer to, and the starting term
          </Typography>

          <SelectionDropdown
            id="college"
            label="From School"
            options={schools}
            value={college.value}
            onChange={handleChange}
          />

          <SelectionDropdown
            id="program"
            label="To Cal State LA program"
            options={programs}
            value={selectedProgram?.value}
            onChange={handleProgramChange}
          />
          <SelectionDropdown
            id="term"
            label="Start Term"
            options={filteredTerms}
            value={selectedTerm}
            onChange={handleTermChange}
          />
          <SelectionDropdown
            id="year"
            label="Start Year"
            options={getNextYears(3)}
            value={startYear}
            onChange={handleStartYearChange}
          />

          <Button
            onClick={handleSubmit}
            // disabled={isSubmitDisabled}
            variant="contained"
            style={{
              backgroundColor: "#FFCE00",
              paddingRight: 5,
            }}
          >
            Next <NavigateNextIcon />
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
