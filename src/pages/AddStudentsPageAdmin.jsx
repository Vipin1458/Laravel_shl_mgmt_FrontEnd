import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosPrivate";

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    roll_number: "",
    class_grade: "",
    date_of_birth: "",
    admission_date: "",
    status: "Active",
    teacher_id: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchTeachers=async()=>{
    try {
      const res=await axiosInstance.get("/teachers")
    console.log(res.data);
    setTeachers(res.data)
    } catch (error) {
      console.error("Error loading teachers",error)
    }
    
  }

  useEffect(() => {
   fetchTeachers()
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
     if (name === "phone_number") {
    if (!/^\d{0,10}$/.test(value)) return;
  }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axiosInstance.post("/students", formData);
      setMessage("Student created successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        roll_number: "",
        class_grade: "",
        date_of_birth: "",
        admission_date: "",
        status: "Active",
        teacher_id: "",
      });
    } catch (err) {
      console.error(err);
      setError(" Failed to create student");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Student</h2>

      {message && <div className="text-green-600 mb-4">{message}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
                  <label>FirstName</label>
        <input name="first_name"  value={formData.first_name} onChange={handleChange} placeholder="John snow" className="input" required />

        </div>
        <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="input" required />
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="input" required />
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="input" required />
        <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" className="input" required />
        <input name="roll_number" value={formData.roll_number} onChange={handleChange} placeholder="Roll Number" className="input" required />
        <input name="class_grade" value={formData.class_grade} onChange={handleChange} placeholder="Class (e.g., 10-A)" className="input" required />
        <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="input" required />
        <input  name="admission_date" value={formData.admission_date} onChange={handleChange} type="date" className="input" required />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          name="teacher_id"
          value={formData.teacher_id}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.first_name} {teacher.last_name}
            </option>
          ))}
        </select>

        <div className="col-span-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Student
          </button>
        </div>
      </form>
    </div>
  );
}


