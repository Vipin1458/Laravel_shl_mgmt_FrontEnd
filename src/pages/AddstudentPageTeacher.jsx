
import { useForm } from "react-hook-form";
import axiosPrivate from "../utils/AxiosPrivate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStudentPageByTeacher() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState("");
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const response = await axiosPrivate.post("/teacher-students", data);
      setMessage("Student added successfully!");
      navigate('/my-students')
      reset();
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.response?.data?.errors?.email?.[0] || "Error adding student.";
      setMessage(errMsg);
    }
  };

  return (
<div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
  <h2 className="text-2xl font-bold mb-6 text-center">Add Student</h2>

  {message && (
    <div className="mb-6 text-sm font-medium text-blue-700 text-center">{message}</div>
  )}

  <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block mb-1 font-medium">First Name</label>
      <input {...register("first_name", { required: "First name is required" })} className="input w-full" />
      {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Last Name</label>
      <input {...register("last_name", { required: "Last name is required" })} className="input w-full" />
      {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Email</label>
      <input {...register("email", { required: "Email is required" })} type="email" className="input w-full" />
      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Phone Number</label>
      <input
        {...register("phone_number", {
          required: "Phone is required",
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Phone must be 10 digits",
          },
        })}
        className="input w-full"
      />
      {errors.phone_number && <p className="text-red-600 text-sm mt-1">{errors.phone_number.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Roll Number</label>
      <input {...register("roll_number", { required: "Roll number is required" })} className="input w-full" />
      {errors.roll_number && <p className="text-red-600 text-sm mt-1">{errors.roll_number.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Class/Grade</label>
      <input {...register("class_grade", { required: "Class/Grade is required" })} className="input w-full" />
      {errors.class_grade && <p className="text-red-600 text-sm mt-1">{errors.class_grade.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Date of Birth</label>
      <input {...register("date_of_birth", { required: "Date of birth is required" })} type="date" className="input w-full" />
      {errors.date_of_birth && <p className="text-red-600 text-sm mt-1">{errors.date_of_birth.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Admission Date</label>
      <input {...register("admission_date", { required: "Admission date is required" })} type="date" className="input w-full" />
      {errors.admission_date && <p className="text-red-600 text-sm mt-1">{errors.admission_date.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Status</label>
      <select {...register("status", { required: "Status is required" })} className="input w-full">
        <option value="">Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Password</label>
      <input {...register("password", { required: "Password is required" })} type="password" className="input w-full" />
      {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
    </div>

    <div className="md:col-span-2 text-center mt-4">
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Add Student
      </button>
    </div>
  </form>
</div>



  );
}


