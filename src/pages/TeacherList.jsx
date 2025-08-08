import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosPrivate";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  LinearProgress,
  Pagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { confirmAlert } from "react-confirm-alert";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [currentTeacherName, setCurrentTeacherName] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10; 
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const fetchTeachers = async (currentPage = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/teachers?page=${currentPage}&per_page=${perPage}`);
      setTeachers(response.data.data); 
      setTotalPages(response.data.last_page);
      setLoading(false);
    } catch (error) {
      console.error("API error:", error);
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleEdits=(teacher)=>{
    setSelectedTeacher(teacher);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
  };

  const handleChange = (e) => {
    setSelectedTeacher({ ...selectedTeacher, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.patch(`/teachers/${selectedTeacher.id}/`, selectedTeacher);
      fetchTeachers(page);
      handleClose();
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
              await axiosInstance.delete(`/teachers/${id}/`);
              fetchTeachers(page);
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

  const handleViewStudents = (teacher) => {
    axiosInstance.get(`/teachers/${teacher.id}/students`).then((res) => {
      setStudentList(res.data.students || []);
      setCurrentTeacherName(`${teacher.first_name} ${teacher.last_name}`);
      setStudentsDialogOpen(true);
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher List</h1>
        <button
          onClick={() => navigate("/addteacher")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Teacher
        </button>
      </div>

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Subject</th>
              <th className="px-4 py-2 border">Emp ID</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  <LinearProgress color="success" />
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  No Teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  className="text-center border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="px-4 py-2 border">
                    {teacher.first_name} {teacher.last_name}
                  </td>
                  <td className="px-4 py-2 border">{teacher.email}</td>
                  <td className="px-4 py-2 border">{teacher.phone_number}</td>
                  <td className="px-4 py-2 border">{teacher.subject_specialization}</td>
                  <td className="px-4 py-2 border">{teacher.employee_id}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        teacher.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  <td className="flex gap-2 justify-center">
                    <button onClick={() => handleViewStudents(teacher)}>
                      <VisibilityIcon fontSize="small" />
                    </button>
                    <button onClick={() => handleEdit(teacher)}>
                      <EditIcon fontSize="small" />
                    </button>
                    <button onClick={() => handleDelete(teacher.id)}>
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </div>

      {selectedTeacher && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit Teacher</DialogTitle>
          {errorMessages.length > 0 && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              <ul className="list-disc pl-5">
                {errorMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                label="First Name"
                fullWidth
                name="first_name"
                value={selectedTeacher.first_name}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Last Name"
                fullWidth
                name="last_name"
                value={selectedTeacher.last_name}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={selectedTeacher.email}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Phone Number"
                fullWidth
                name="phone_number"
                value={selectedTeacher.phone_number}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Subject Specialization"
                fullWidth
                name="subject_specialization"
                value={selectedTeacher.subject_specialization}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Employee ID"
                fullWidth
                name="employee_id"
                value={selectedTeacher.employee_id}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                select
                label="Status"
                fullWidth
                name="status"
                value={selectedTeacher.status}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={studentsDialogOpen}
        onClose={() => setStudentsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Students under {currentTeacherName}</DialogTitle>
        <DialogContent dividers>
          {studentList.length > 0 ? (
            <ul className="space-y-2">
              {studentList.map((student) => (
                <li key={student.id} className="border p-2 rounded shadow-sm">
                  <div className="font-semibold">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Email: {student.email}
                  </div>
                  <div className="text-sm text-gray-600">
                    Roll No: {student.roll_number}, Class: {student.class_grade}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No students assigned to this teacher.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
