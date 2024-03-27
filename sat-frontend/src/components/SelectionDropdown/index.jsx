/* eslint-disable no-unused-vars */
import * as React from "react";
import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectionDropdown({ label, options, value, onChange }) {
  console.log("valueee", value);
  return (
    <FormControl sx={{ m: 1 }} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{ width: 300, textAlign: "left" }}
        value={value}
        label={label}
        onChange={(event) => {
          const selectedOption = options.find(
            (option) => option.value === event.target.value
          );
          onChange(selectedOption);
        }}
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
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};
