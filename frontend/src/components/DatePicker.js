import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();  // Get today's date

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
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-md shadow-lg">
      <h2 className="text-lg font-bold mb-2 text-red-600">Select a Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        minDate={today}  // Restrict past dates
        className="custom-datepicker border p-2 rounded-lg shadow-md bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
      />
      {selectedDate && (
        <p className="mt-2 text-green-600 font-medium">
          Selected Date: {`${selectedDate.getDate().toString().padStart(2, '0')}/${
            (selectedDate.getMonth() + 1).toString().padStart(2, '0')
          }/${selectedDate.getFullYear()}`}
        </p>
      )}
    </div>
  );
};

export default DatePickerComponent;
