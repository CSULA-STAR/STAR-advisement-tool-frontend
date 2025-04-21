import { Box, Button, Checkbox, FormControlLabel, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./GECourseListStyle.css";

// Key for localStorage
const LOCAL_STORAGE_KEY = 'selectedGECategories';

// Hardcoded GE categories
const GE_CATEGORIES = [
  { id: "american_institutions", name: "American Institutions" },
  { id: "block_a", name: "Block A - English Language Communication & Critical Thinking" },
  { id: "block_b", name: "Block B - Natural Science & Mathematics/Quantitative Reasoning" },
  { id: "block_c", name: "Block C - Arts & Humanities" },
  { id: "block_d", name: "Block D - Social Sciences" },
  { id: "block_e", name: "Block E - Lifelong Understanding & Self-Development" },
  { id: "block_f", name: "Block F - Ethnic Studies" }
];

const GECourseList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State to hold checkbox status for each category ID
  const [categorySelections, setCategorySelections] = useState({});
  // State to track if all categories are selected (for the toggle button label)
  const [allSelected, setAllSelected] = useState(true);

  // Load state from localStorage or set default on mount
  useEffect(() => {
    const savedSelections = localStorage.getItem(LOCAL_STORAGE_KEY);
    const initialSelections = {};
    let isAllInitiallySelected = true;

    if (savedSelections) {
      try {
        const selectedIds = JSON.parse(savedSelections);
        const selectedIdSet = new Set(selectedIds);
        GE_CATEGORIES.forEach(category => {
          initialSelections[category.id] = selectedIdSet.has(category.id);
          if (!initialSelections[category.id]) {
            isAllInitiallySelected = false;
          }
        });
         // Handle case where saved array was empty
        if (selectedIds.length === 0 && GE_CATEGORIES.length > 0) {
           isAllInitiallySelected = false;
        }
      } catch (error) {
        console.error("Error parsing saved GE category selections:", error);
        // Fallback to default if parsing fails
        GE_CATEGORIES.forEach(category => {
          initialSelections[category.id] = true;
        });
         isAllInitiallySelected = GE_CATEGORIES.length > 0;
      }
    } else {
      // Default: select all
      GE_CATEGORIES.forEach(category => {
        initialSelections[category.id] = true;
      });
      isAllInitiallySelected = GE_CATEGORIES.length > 0;
    }

    setCategorySelections(initialSelections);
    setAllSelected(isAllInitiallySelected);
  }, []);

  // Effect to update allSelected state when individual checkboxes change
  useEffect(() => {
    const totalCategories = GE_CATEGORIES.length;
    const selectedCount = Object.values(categorySelections).filter(Boolean).length;
    setAllSelected(totalCategories > 0 && selectedCount === totalCategories);
  }, [categorySelections]);

  const handleCheckboxChange = (categoryId, isChecked) => {
    setCategorySelections(prevState => ({
      ...prevState,
      [categoryId]: isChecked
    }));
  };

  const handleSelectAll = () => {
    const newSelections = {};
    GE_CATEGORIES.forEach(category => {
      newSelections[category.id] = true;
    });
    setCategorySelections(newSelections);
  };
  
  const handleUnselectAll = () => {
    const newSelections = {};
    GE_CATEGORIES.forEach(category => {
      newSelections[category.id] = false;
    });
    setCategorySelections(newSelections);
  };

  const handleBackClick = () => {
    navigate('/'); // Navigate to Home page
  };

  const handleNextClick = () => {
    // Get array of selected category IDs
    const selectedCategoryIds = Object.entries(categorySelections)
      .filter(([id, isSelected]) => isSelected)
      .map(([id]) => id);
      
    // Save selected IDs to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedCategoryIds));
    
    // Navigate to CourseList, passing the original state received from Home
    // (excluding course data which might be large and isn't needed here)
    const { courses, selectedGECourses, ...restState } = location.state || {};
    navigate("/courselist", {
      state: { 
        ...restState,
        // Optionally pass selectedCategoryIds if CourseList needs them
        // selectedCategoryIds: selectedCategoryIds 
       } 
    });
  };

  return (
    <Box className="ge-course-list-container">
      <Typography variant="h5" component="h1" gutterBottom>
        Please select the General Education (GE) categories for courses you have already completed
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
         <Button 
            variant="outlined"
            onClick={handleSelectAll}
            disabled={allSelected}
          >
            Select All
          </Button>
           <Button 
            variant="outlined"
            onClick={handleUnselectAll}
            disabled={!Object.values(categorySelections).some(Boolean)} // Disable if none selected
          >
            Unselect All
          </Button>
      </Box>

      <List sx={{ 
          width: '100%', 
          maxWidth: 600, 
          bgcolor: 'background.paper', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          paddingTop: 0, // Remove top padding
          paddingBottom: 0 // Remove bottom padding
        }}>
        {GE_CATEGORIES.map((category, index) => (
          <ListItem 
            key={category.id} 
            divider={index < GE_CATEGORIES.length - 1} 
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer'
              },
              transition: 'background-color 0.2s ease-in-out'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={categorySelections[category.id] || false}
                  onChange={(e) => handleCheckboxChange(category.id, e.target.checked)}
                />
              }
              label={category.name}
              sx={{ width: '100%' }}
            />
          </ListItem>
        ))}
      </List>

      {/* Floating Buttons */}
      <div className="floating-button">
        <Button
          variant="contained"
          onClick={handleBackClick}
          style={{ backgroundColor: "#FFCE00", borderRadius: 7, marginRight: "10px" }}
        >
          <NavigateBeforeIcon />
          <Typography variant="p" px={5} textTransform="none" fontSize={16}>
            Back
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={handleNextClick}
          style={{ backgroundColor: "#FFCE00", borderRadius: 7 }}
        >
          <Typography variant="p" px={5} textTransform="none" fontSize={16}>
            Next
          </Typography>
          <NavigateNextIcon />
        </Button>
      </div>
    </Box>
  );
};

export default GECourseList; 