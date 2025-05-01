import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import './Map.css';

const Map = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mappingData, setMappingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const s_id = searchParams.get('s_id');
  const dept = searchParams.get('dept');

  useEffect(() => {
    if (!s_id || !dept) {
      navigate('/mapping');
      return;
    }

    const fetchMappingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/fetch-mapping?s_id=${s_id}&dept=${dept}`
        );
        setMappingData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch mapping data');
        console.error('Error fetching mapping data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMappingData();
  }, [s_id, dept, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Course Mapping
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source Course</TableCell>
              <TableCell>Source Course Name</TableCell>
              <TableCell>Cal State LA Course</TableCell>
              <TableCell>Cal State LA Course Name</TableCell>
              <TableCell>Credits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.source_course_code}</TableCell>
                <TableCell>{row.source_course_name}</TableCell>
                <TableCell>{row.target_course_code}</TableCell>
                <TableCell>{row.target_course_name}</TableCell>
                <TableCell>{row.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Map; 