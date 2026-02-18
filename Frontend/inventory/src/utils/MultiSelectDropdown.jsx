import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Box,
} from "@mui/material";

const MultiSelectField = ({
  id,
  label,
  options = [],
  value,
  onChange,
  required = false,
  multiple = false, // 🔥 new prop
}) => {
  return (
    <FormControl
      fullWidth
      margin="normal"
      size="medium"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
        },
      }}
    >
      <InputLabel required={required}>{label}</InputLabel>

      <Select
        id={id}
        multiple={multiple}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          if (!multiple) {
            const option = options.find((o) => o.value === selected);
            return option?.label || "";
          }

          return (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {selected.map((val) => {
                const option = options.find((o) => o.value === val);
                return (
                  <Chip
                    key={val}
                    label={option?.label}
                    size="small"
                    sx={{
                      backgroundColor: "#e0e7ff",
                      color: "#4f46e5",
                      fontWeight: 500,
                    }}
                  />
                );
              })}
            </Box>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {multiple && (
              <Checkbox checked={value?.indexOf(option.value) > -1} />
            )}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectField;
