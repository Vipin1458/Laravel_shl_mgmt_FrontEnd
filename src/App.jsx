import { Routes, Route, Navigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Login from "./pages/login";
import { useAuth } from "./context/AuthContext";
import StudentProfile from "./pages/StudentProfile";
import StudentsPage from "./pages/StudentListPage";
import AddStudentPage from "./pages/AddStudentsPageAdmin";
import TeachersPage from "./pages/TeacherList";
import AddTeacherPage from "./pages/AddTeachersPage";
import TeacherStudentsPage from "./pages/TeacherStudentPage";
import TeacherProfilePage from "./pages/TeacherProfile";
import AddStudentPageByTeacher from "./pages/AddstudentPageTeacher";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { auth } = useAuth();

  return (
     
      <>
         <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />

        {auth?.token ? (
          
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardHome />} />
             <Route path="studentme" element={<StudentProfile />} />
             <Route path="studentsPage" element={<StudentsPage />} />
              <Route path="addstudents" element={<AddStudentPage />} /> 
              <Route path="teachersPage" element={<TeachersPage />} /> 
              <Route path="addteacher" element={<AddTeacherPage />} />
              <Route path="my-students" element={<TeacherStudentsPage/>} />
               <Route path="profile" element={<TeacherProfilePage/>} /> 
               <Route path="addMyStudents" element={<AddStudentPageByTeacher/>} /> 
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      </>
 
  );
}
