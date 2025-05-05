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
import styles from './Map.module.css';

const Map = () => {
  // Hide Navbar by setting display: none on the navbar element if it exists
  useEffect(() => {
    const navbar = document.querySelector('.header');
    if (navbar) navbar.style.display = 'none';
    
    // Remove main-content class from main element
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.remove('main-content');
    }

    return () => {
      if (navbar) navbar.style.display = '';
      // Restore main-content class when component unmounts
      if (mainElement) {
        mainElement.classList.add('main-content');
      }
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
    <Box className={styles['map-content']} sx={{ p: 3, position: 'relative' }}>
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
            <TableRow className={`${styles['MuiTableRow-head']}`}>
              <TableCell align="center" className={`${styles['MuiTableCell-head']}`}>{`From: ${schoolName}`}</TableCell>
              <TableCell align="center" className={`${styles['arrow-cell']}`}>
                <span style={{color: '#FFF', lineHeight: 1 }}>&#8594;</span>
              </TableCell>
              <TableCell align="center" className={`${styles['MuiTableCell-head']}`}>To: CalState LA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} className={styles['MuiTableRow-root']}>
                {/* External Course */}
                <TableCell align="left" className={styles['transferschool-cell']}>
                  <div className={styles['course-block']}>
                    <div className={styles['course-info']}>
                      <div className={styles['course-code']}>{row.ext_course_code}</div>
                      <div className={styles['course-name']}>{row.ext_course_name}</div>
                    </div>
                    <span className={styles['credits-pill']}>{Number(row.ext_credits).toFixed(2)}</span>
                  </div>
                </TableCell>
                {/* Arrow (centered) */}
                <TableCell align="center" className={styles['arrow-cell']}>
                  &#8594;
                </TableCell>
                {/* CSULA Course */}
                <TableCell align="left" className={styles['calstatela-cell']}>
                  <div className={styles['course-block']}>
                    <div className={styles['course-info']}>
                      <div className={styles['course-code']}>{row.csula_course_code}</div>
                      <div className={styles['course-name']}>{row.csula_course_name}</div>
                    </div>
                    <span className={styles['credits-pill']}>{Number(row.csula_credits).toFixed(2)}</span>
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