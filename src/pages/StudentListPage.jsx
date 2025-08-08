import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosPrivate";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { confirmAlert } from "react-confirm-alert";
import { LinearProgress, Skeleton } from "@mui/material";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessages, setErrorMessages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents(currentPage);
    fetchTeachers();
  }, [currentPage]);

  const fetchStudents = async (page = 1) => {
    try {
      setIsloading(true);
      const response = await axiosInstance.get(`/students?page=${page}`);
      setStudents(response.data.data);
      setTotalPages(response.data.last_page);
      setIsloading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeachers = () => {
    axiosInstance
      .get("/teachers")
      .then((res) => setTeachers(res.data.data))
      .catch((err) => console.error(err));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.patch(
        `/students/${selectedStudent.id}/`,
        selectedStudent
      );
      setShowModal(false);
      fetchStudents(currentPage);
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

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this student?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await axiosInstance.delete(`/students/${id}/`);
              fetchStudents(currentPage);
            } catch (err) {
              console.error("Delete error:", err);
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student List</h1>
        <button
          onClick={() => navigate("/addstudents")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </div>

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Roll No</th>
              <th className="px-4 py-2 border">Class</th>
              <th className="px-4 py-2 border">DOB</th>
              <th className="px-4 py-2 border">Teacher</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {isloading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="10" className="text-center p-2">
                      <Skeleton animation="wave" />
                    </td>
                  </tr>
                ))}
              </>
            ) : students.length == 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  <LinearProgress color="success" />
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-4 py-2 border">{student.email}</td>
                  <td className="px-4 py-2 border">{student.phone_number}</td>
                  <td className="px-4 py-2 border">{student.roll_number}</td>
                  <td className="px-4 py-2 border">{student.class_grade}</td>
                  <td className="px-4 py-2 border">{student.date_of_birth}</td>
                  <td className="px-4 py-2 border">
                    {student.teacher?.first_name} {student.teacher?.last_name}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowModal(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button onClick={() => handleDelete(student.id)}>
                      <DeleteIcon className="text-red-500" fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            {errorMessages.length > 0 && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                <ul className="list-disc pl-5">
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col">
                First Name
                <input
                  name="first_name"
                  value={selectedStudent.first_name}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                Last Name
                <input
                  name="last_name"
                  value={selectedStudent.last_name}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                Email
                <input
                  name="email"
                  value={selectedStudent.email}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col overflow-hidden">
                Phone Number
                <input
                  name="phone_number"
                  value={selectedStudent.phone_number}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                Roll Number
                <input
                  name="roll_number"
                  value={selectedStudent.roll_number}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                Class
                <input
                  name="class_grade"
                  value={selectedStudent.class_grade}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                Date of Birth
                <input
                  type="date"
                  name="date_of_birth"
                  value={selectedStudent.date_of_birth}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
              </label>
              <label className="flex flex-col">
                Status
                <select
                  name="status"
                  value={selectedStudent.status}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label className="flex flex-col col-span-2">
                Assigned Teacher
                <select
                  name="teacher_id"
                  value={selectedStudent.teacher_id || ""}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
