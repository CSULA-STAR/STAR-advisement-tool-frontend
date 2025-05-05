import axios from "axios";
import { useEffect, useState } from "react";
import SelectionDropdown from "../../components/SelectionDropdown";
import { Box, Stack, Button, Typography } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import "./Map.css";

const HomeMapping = () => { 
  const [college, setCollege] = useState("");
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState();

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

  const handleChange = (event) => {
    setCollege(event.value);
    setSelectedProgram("");
  };

  const handleProgramChange = (selectedProgram) => {
    setSelectedProgram(selectedProgram.value);
  };

  const handleSubmit = () => {
    if (!college || !selectedProgram) {
      alert("Please select both school and program before submitting.");
      return;
    }
    const url = `/map?s_id=${college.id}&dept=${selectedProgram.department}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/fetch-institutes"
        );
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
            Please select the school you transfer from and the Cal State LA program
            you want to transfer to
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

          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{
              backgroundColor: "#FFCE00",
              paddingRight: 5,
            }}
          >
            Show Mapping
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HomeMapping; 