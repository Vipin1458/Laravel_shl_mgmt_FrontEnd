import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, CircularProgress, Table,
  TableHead, TableRow, TableCell, TableBody, TablePagination,Stack
} from "@mui/material";
import { confirmAlert } from "react-confirm-alert";
import axiosPrivate from "../utils/AxiosPrivate";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage] = useState(5);
  const [errorMessages, setErrorMessages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    roll_number: "",
    class_grade: "",
    status: ""
  });

  const fetchStudents = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get(`/teacher-students?page=${pageNo}`);
      setStudents(res.data.data);
      setTotal(res.data.total);
      setPage(res.data.current_page - 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenEdit = (student) => {
    setEditStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone_number: student.phone_number,
      roll_number: student.roll_number,
      class_grade: student.class_grade,
      status: student.status
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditStudent(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axiosPrivate.patch(`/teacher-students/${editStudent.id}`, formData);
      handleClose();
      fetchStudents(page + 1);
    } catch (err) {
      console.error("Update error:", err);
      if(err.response && err.response.data){
        const data=err.response.data.errors || {}
        const errorList=[]
        const fieldErrs={}
        for(const key in data){
          const msg = data[key]
          if(Array.isArray(msg)){
            fieldErrs[key]=msg
            errorList.push(...msg)
          }else if( typeof msg === "string"){
            fieldErrs[key]=[msg]
            errorList.push(msg)

          }
        }
        setErrorMessages(errorList)
        setFieldErrors(fieldErrs);
      }else{
        setErrorMessages(["Failed to update student"])
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
            await axiosPrivate.delete(`/teacher-students/${id}`);
            fetchStudents(page + 1);
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

  const handlePageChange = (_, newPage) => {
    fetchStudents(newPage + 1);
  };

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-4">📘 My Students</Typography>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Table className="bg-white shadow rounded-xl">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((stu) => (
                <TableRow key={stu.id}>
                  <TableCell>{stu.first_name} {stu.last_name}</TableCell>
                  <TableCell>{stu.email}</TableCell>
                  <TableCell>{stu.phone_number}</TableCell>
                  <TableCell>{stu.roll_number}</TableCell>
                  <TableCell>{stu.class_grade}</TableCell>
                  <TableCell>{stu.status}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenEdit(stu)}
                      className="text-blue-600"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDelete(stu.id)}
                      className="text-red-600"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </>
      )}

     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
  <DialogTitle>Edit Student</DialogTitle>
  {errorMessages.length >0 && (
    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
      <ul className="list-disc pl-5">
        {errorMessages.map((msg,index)=>(
          <li key={index}>{msg}</li>
        ))}

      </ul>

    </div>
  )
   
  }

  <DialogContent>
    <Stack spacing={2} mt={1}>
      <TextField
        label="First Name"
        name="first_name"
        fullWidth
        value={formData.first_name}
        onChange={handleChange}
      />
      <TextField
        label="Last Name"
        name="last_name"
        fullWidth
        value={formData.last_name}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        label="Phone"
        name="phone_number"
        fullWidth
        value={formData.phone_number}
        onChange={handleChange}
      />
      <TextField
        label="Roll Number"
        name="roll_number"
        fullWidth
        value={formData.roll_number}
        onChange={handleChange}
      />
      <TextField
        label="Class"
        name="class_grade"
        fullWidth
        value={formData.class_grade}
        onChange={handleChange}
      />
      <TextField
        label="Status"
        name="status"
        fullWidth
        value={formData.status}
        onChange={handleChange}
      />
    </Stack>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleUpdate} variant="contained">
      Update
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
}
