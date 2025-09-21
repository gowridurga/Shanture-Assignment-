import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";    
import { Button, Stack, Typography } from "@mui/material";

export default function DateRangeSelector({ startDate, endDate, setStartDate, setEndDate, onApply }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
      
      <Stack spacing={0.5}>
        <Typography variant="body2">Start</Typography>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
        />
      </Stack>

      
      <Stack spacing={0.5}>
        <Typography variant="body2">End</Typography>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
        />
      </Stack>

      
      <Button variant="contained" onClick={onApply}>
        Apply
      </Button>
    </Stack>
  );
}

