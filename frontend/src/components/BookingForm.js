import { useState } from "react";

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    adhaarCardNo: "",
    phoneNumber: "",
    email: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);  // Send data to parent component
    setFormData({ name: "", age: "", gender: "", adhaarCardNo: "", phoneNumber: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <div>
        <label className="block text-sm font-medium">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
  <label className="block text-sm font-medium">Aadhaar Card No:</label>
  <input
    type="text"
    name="adhaarCardNo"
    value={formData.adhaarCardNo}
    onChange={handleChange}
    required
    pattern="\d{12}"
    maxLength="12"
    title="Aadhaar number must be a 12-digit numeric value (e.g., 123412341234)"
    className="w-full p-2 border border-gray-300 rounded"
  />
</div>


      <div>
        <label className="block text-sm font-medium">Phone Number:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          maxLength="10"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default UserForm;
