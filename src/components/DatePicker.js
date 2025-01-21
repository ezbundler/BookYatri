import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      // Format the date as dd/mm/yyyy
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
        (date.getMonth() + 1).toString().padStart(2, '0')
      }/${date.getFullYear()}`;
      
      onDateSelect(formattedDate);
    } else {
      onDateSelect(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-bold mb-2">Select a Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        className="border p-2 rounded-md shadow-md"
      />
      {selectedDate && (
        <p className="mt-2 text-green-600">
          Selected Date: {`${selectedDate.getDate().toString().padStart(2, '0')}/${
            (selectedDate.getMonth() + 1).toString().padStart(2, '0')
          }/${selectedDate.getFullYear()}`}
        </p>
      )}
    </div>
  );
};

export default DatePickerComponent;
