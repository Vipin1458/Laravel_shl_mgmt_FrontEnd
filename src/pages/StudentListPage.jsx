import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosPrivate";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, User, Mail, Phone, Calendar, GraduationCap, Users, Activity } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import { Skeleton } from "@mui/material";

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
      setErrorMessages([]);
      setFieldErrors({});
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
        setErrorMessages(["Failed to update student"]);
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

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(6)].map((_, i) => (
     <div key={i}>
       <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="circular" width={40} height={40} />
       <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
     </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Student List</h1>
        <button
          onClick={() => navigate("/addstudents")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Student
        </button>
      </div>

      <div className="hidden lg:block overflow-x-auto shadow-lg border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold border-b">#</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Full Name</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Email</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Phone</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Roll No</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Class</th>
              <th className="px-4 py-3 text-left font-semibold border-b">DOB</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Teacher</th>
              <th className="px-4 py-3 text-left font-semibold border-b">Status</th>
              <th className="px-4 py-3 text-center font-semibold border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isloading ? (
              <tr>
                <td colSpan="10" className="text-center p-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading students...</span>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No students found</p>
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-gray-900">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.email}</td>
                  <td className="px-4 py-3 text-gray-600">{student.phone_number || '-'}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{student.roll_number}</td>
                  <td className="px-4 py-3 text-gray-600">{student.class_grade}</td>
                  <td className="px-4 py-3 text-gray-600">{student.date_of_birth}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.teacher?.first_name} {student.teacher?.last_name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowModal(true);
                          setErrorMessages([]);
                          setFieldErrors({});
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150"
                        title="Edit student"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150"
                        title="Delete student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        {isloading ? (
          <LoadingSkeleton />
        ) : students.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow border">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No students found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student, index) => (
              <div key={student.id} className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">#{(currentPage - 1) * 10 + index + 1}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowModal(true);
                        setErrorMessages([]);
                        setFieldErrors({});
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
                      title="Edit student"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
                      title="Delete student"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 break-all">{student.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{student.phone_number || '-'}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Roll: {student.roll_number}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Class: {student.class_grade}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{student.date_of_birth}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {student.teacher?.first_name} {student.teacher?.last_name}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center">
                  <Activity className="h-4 w-4 text-gray-400 mr-2" />
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      student.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Previous
          </button>
          
          <div className="flex flex-wrap justify-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-150 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Next
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Previous
          </button>
          
          <div className="flex flex-wrap justify-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-150 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Next
          </button>
        </div>
      )}

      {showModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Edit Student</h2>
              
              {errorMessages.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <ul className="list-disc pl-5 space-y-1">
                    {errorMessages.map((msg, index) => (
                      <li key={index} className="text-sm">{msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input
                    name="first_name"
                    value={selectedStudent.first_name || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {fieldErrors.first_name && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.first_name[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input
                    name="last_name"
                    value={selectedStudent.last_name || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {fieldErrors.last_name && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.last_name[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={selectedStudent.email || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {fieldErrors.email && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.email[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    name="phone_number"
                    value={selectedStudent.phone_number || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.phone_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {fieldErrors.phone_number && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.phone_number[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Roll Number</label>
                  <input
                    name="roll_number"
                    value={selectedStudent.roll_number || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.roll_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter roll number"
                  />
                  {fieldErrors.roll_number && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.roll_number[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Class</label>
                  <input
                    name="class_grade"
                    value={selectedStudent.class_grade || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.class_grade ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter class"
                  />
                  {fieldErrors.class_grade && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.class_grade[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={selectedStudent.date_of_birth || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.date_of_birth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.date_of_birth && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.date_of_birth[0]}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={selectedStudent.status || ''}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.status ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {fieldErrors.status && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.status[0]}</span>
                  )}
                </div>

                <div className="flex flex-col sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Assigned Teacher</label>
                  <select
                    name="teacher_id"
                    value={selectedStudent.teacher_id || ""}
                    onChange={handleEditChange}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.teacher_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.teacher_id && (
                    <span className="text-red-500 text-xs mt-1">{fieldErrors.teacher_id[0]}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setErrorMessages([]);
                    setFieldErrors({});
                  }}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Update Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}