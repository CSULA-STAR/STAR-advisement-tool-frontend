import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";

export default function SelectionDropdown({
  label,
  options,
  selectedValue,
  onChange,
}) {
  const handleSelectChange = (event) => {
    const selectedOption = options.find(
      (option) => option.value === event.target.value
    );
    onChange(selectedOption);
  };

  return (
    <FormControl sx={{ m: 1 }} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{ width: 300, textAlign: "left" }}
        value={selectedValue}
        label={label}
        onChange={handleSelectChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SelectionDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};
