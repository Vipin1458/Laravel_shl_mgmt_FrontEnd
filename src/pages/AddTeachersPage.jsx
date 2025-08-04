import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/AxiosPrivate";

export default function AddTeacherPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "teacher",
    phone_number: "",
    subject_specialization: "",
    employee_id: "",
    date_of_joining: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/teachers", formData);
      setSuccess(" Teacher added successfully");
      setTimeout(() => navigate("/teachersPage"), 1000);
    } catch (err) {
      console.error(err);
      setError(" Failed to add teacher");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          First Name
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Last Name
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Phone Number
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Subject Specialization
          <input type="text" name="subject_specialization" value={formData.subject_specialization} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Employee ID
          <input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col">
          Date of Joining
          <input type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} required className="border p-2 rounded" />
        </label>
        <label className="flex flex-col col-span-2">
          Status
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Add Teacher
        </button>
      </form>
    </div>
  );
}
