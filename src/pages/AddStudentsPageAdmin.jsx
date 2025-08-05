import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosPrivate";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const [errorMessages, setErrorMessages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate=useNavigate()


  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axiosInstance.get("/teachers");
        setTeachers(res.data);
      } catch (error) {
        console.error("Error loading teachers", error);
      }
    };

    fetchTeachers();
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
    setErrorMessages([]);
    setFieldErrors({});

    try {
      await axiosInstance.post("/students", formData);
      toast.success("Student created successfully!");
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
      navigate("/studentsPage")
    } catch (err) {
      console.error("API error:", err);

      if (err.response && err.response.data) {
        const data = err.response.data.errors || {};
        const errorList = [];
        const fieldErrs = {};

        for (const key in data) {
          const msgs = data[key];
          if (Array.isArray(msgs)) {
            fieldErrs[key] = msgs;
            errorList.push(...msgs);
          } else if (typeof msgs === "string") {
            fieldErrs[key] = [msgs];
            errorList.push(msgs);
          }
        }

        setErrorMessages(errorList);
        setFieldErrors(fieldErrs);
      } else {
        setErrorMessages(["Failed to create student"]);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Add New Student</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "First Name", name: "first_name", required: true },
          { label: "Last Name", name: "last_name" },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Password", name: "password", type: "password", required: true },
          { label: "Phone Number", name: "phone_number", required: true },
          { label: "Roll Number", name: "roll_number", required: true },
          { label: "Class Grade", name: "class_grade", required: true },
          { label: "Date of Birth", name: "date_of_birth", type: "date", required: true },
          { label: "Admission Date", name: "admission_date", type: "date", required: true },
        ].map(({ label, name, type = "text", required }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="mb-1 font-medium">
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              placeholder={label}
              required={required}
            />
            {fieldErrors[name] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors[name][0]}</p>
            )}
          </div>
        ))}

        <div className="flex flex-col">
          <label htmlFor="status" className="mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {fieldErrors.status && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.status[0]}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="teacher_id" className="mb-1 font-medium">Teacher</label>
          <select
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
          {fieldErrors.teacher_id && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.teacher_id[0]}</p>
          )}
        </div>

        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Student
          </button>
        </div>
      </form>
    </div>
  );
}
