import { useState } from "react";



const UserForm = ({ index, onFormChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    adhaarCardNo: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onFormChange(index, updatedFormData);
  };

  // Validate form data
  const validate = (e) => {
    console.log("Validating:", e.target.name);
    const { name, value } = e.target;
    const newErrors = {};
  
    if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Name is required.";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.name = "Name should only contain alphabets.";
      }
    }
  
    if (name === "age") {
      if (!value.trim()) {
        newErrors.age = "Age is required.";
      } else if (isNaN(value) || value <= 0 || value > 120) {
        newErrors.age = "Please enter a valid age.";
      }
    }
  
    if (name === "gender") {
      if (!value.trim()) {
        newErrors.gender = "Gender is required.";
      }
    }
  
    if (name === "adhaarCardNo") {
      if (!/^\d{12}$/.test(value)) {
        newErrors.adhaarCardNo =
          "Aadhaar Card No must be exactly 12 digits and contain only numbers.";
      }
    }
  
    if (name === "phoneNumber") {
      if (!/^\d{10}$/.test(value)) {
        newErrors.phoneNumber =
          "Phone Number must be exactly 10 digits and contain only numbers.";
      }
    }
  
    if (name === "email") {
      if (
        !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
      ) {
        newErrors.email = "Invalid email address.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onFormChange(index, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h3 className="text-lg font-bold">Person {index + 1}</h3>

      <div>
        <label className="block text-sm font-medium">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => {
            handleChange(e);
            validate(e);
          }}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={(e) => {
            handleChange(e);
            validate(e);
          }}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={(e) => {
            handleChange(e);
            validate(e);
          }}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Aadhaar Card No:</label>
        <input
          type="text"
          name="adhaarCardNo"
          value={formData.adhaarCardNo}
          onChange={(e) => {
            handleChange(e);
            validate(e);
          }}
          required
          pattern="\d{12}"
          maxLength="12"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.adhaarCardNo && <p className="text-red-500 text-sm">{errors.adhaarCardNo}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone Number:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => {
            handleChange(e);
            validate(e);
          }}
          required
          pattern="[0-9]{10}"
          maxLength="10"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => {
            handleChange(e);
            validate(e);
          }}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
    </form>
  );
};




const BookingForm = ({ count, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleFormChange = (index, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [`person${index + 1}`]: data,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Booking Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[...Array(count)].map((_, index) => (
          <UserForm key={index} index={index} onFormChange={handleFormChange} />
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Submit All
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
