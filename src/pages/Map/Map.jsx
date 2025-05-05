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
  CircularProgress,
  IconButton
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import './Map.css';

const Map = () => {
  // Hide Navbar by setting display: none on the navbar element if it exists
  useEffect(() => {
    const navbar = document.querySelector('.header');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = '';
    };
  }, []);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [schoolName, setSchoolName] = useState('');

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
          `http://localhost:3001/api/course-mapping?s_id=${s_id}&dept=${dept}`
        );
        // Only show mappings with at least one csula_course
        const mappings = response.data.mappings || [];
        setDepartmentName(response.data.department_name || 'Courses Mapping');
        setSchoolName(response.data.school_name || 'Transfer School');
        if (mappings.length === 0) {
          setRows([]);
          setError('no mapping course available');
          setLoading(false);
          return;
        }
        const flatRows = [];
        mappings.forEach((mapping) => {
          if (mapping.csula_course && mapping.csula_course.length > 0) {
            const ext = mapping.external_course;
            const extCodes = Array.isArray(ext.course_code) ? ext.course_code.join(', ') : ext.course_code;
            // Skip if the external course code is 'READY 0001'
            if (extCodes === 'READY 0001') return;
            mapping.csula_course.forEach((csula) => {
              const csulaCodes = Array.isArray(csula.course_code) ? csula.course_code.join(', ') : csula.course_code;
              flatRows.push({
                csula_course_code: csulaCodes,
                csula_course_name: csula.course_name,
                csula_credits: csula.course_credits,
                ext_course_code: extCodes,
                ext_course_name: ext.course_name,
                ext_credits: ext.course_credits,
              });
            });
          }
        });
        setRows(flatRows.sort((a, b) => {
          if (a.csula_course_code < b.csula_course_code) return -1;
          if (a.csula_course_code > b.csula_course_code) return 1;
          return 0;
        }));
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

  const handlePrint = () => {
    window.print();
  };

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
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Print Button */}
      <IconButton
        aria-label="print"
        onClick={handlePrint}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <PrintIcon fontSize="large" />
      </IconButton>
      <Typography variant="h4" gutterBottom>
        {departmentName}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="MuiTableRow-head">
              <TableCell align="center" className="transferschool-cell MuiTableCell-head" style={{ position: 'sticky', top: 0, zIndex: 2 }}>{`From: ${schoolName}`}</TableCell>
              <TableCell align="center" className="arrow-cell MuiTableCell-head" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                <span style={{ fontSize: 48, color: '#FFF', display: 'inline-block', lineHeight: 1 }}>&#8594;</span>
              </TableCell>
              <TableCell align="center" className="calstatela-cell MuiTableCell-head" style={{ position: 'sticky', top: 0, zIndex: 2 }}>To: CalState LA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {/* External Course */}
                <TableCell align="left" className="transferschool-cell">
                  <div className="course-block">
                    <div className="course-info">
                      <div className="course-code">{row.ext_course_code}</div>
                      <div className="course-name">{row.ext_course_name}</div>
                    </div>
                    <span className="credits-pill">{Number(row.ext_credits).toFixed(2)}</span>
                  </div>
                </TableCell>
                {/* Arrow (centered) */}
                <TableCell align="center" className="arrow-cell">
                  &#8594;
                </TableCell>
                {/* CSULA Course */}
                <TableCell align="left" className="calstatela-cell">
                  <div className="course-block">
                    <div className="course-info">
                      <div className="course-code">{row.csula_course_code}</div>
                      <div className="course-name">{row.csula_course_name}</div>
                    </div>
                    <span className="credits-pill">{Number(row.csula_credits).toFixed(2)}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Map; 