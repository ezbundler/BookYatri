import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportButton = ({ bookings }) => {
  const exportToExcel = () => {
    // Process JSON to Excel-compatible format
    const formattedData = bookings.map((booking) => {
      const userRows = Object.values(booking.userDetails).map((person, index) => ({
        "Booking ID": booking.id,
        "User Email": booking.useremail,
        "Seat Number": booking.seatno[index],
        "Bus ID": booking.busId,
        Date: booking.date,
        Name: person.name,
        Age: person.age,
        Gender: person.gender,
        "Aadhaar Card No": person.adhaarCardNo,
        "Phone Number": person.phoneNumber,
        Email: person.email,
      }));
      return userRows;
    }).flat();

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Write the file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "Bookings.xlsx");
  };

  return (
    <button onClick={exportToExcel}>
      Get Data
    </button>
  );
};

export default ExportButton;





{/* <ExportButton bookings={yourBookingData} /> */}
