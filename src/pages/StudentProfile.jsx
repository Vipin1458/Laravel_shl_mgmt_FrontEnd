import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/AxiosPrivate'

const StudentProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState(null)

  const fetchStudentProfile = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/student/profile')
      setProfile(res.data)
      setFormData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentProfile()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance.patch(`/student/profile`, formData)
      setMessage({ type: 'success', text: res.data.message })
      setProfile(res.data.student)
      setIsEditing(false)
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        setMessage({ type: 'error', text: firstError })
      } else {
        setMessage({ type: 'error', text: 'Update failed' })
      }
    }
  }

  if (loading) return <p className="text-center text-lg">Loading...</p>
  if (!profile) return <p className="text-center text-lg text-red-500">No profile data found.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Profile</h1>

      {message && (
        <div className={`mb-4 px-4 py-2 rounded text-center font-medium ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['first_name', 'First Name'],
              ['last_name', 'Last Name'],
              ['email', 'Email'],
              ['phone_number', 'Phone Number']
            ].map(([name, label, type = 'text']) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="mb-1 text-sm font-semibold text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><strong>Name:</strong> {profile.first_name} {profile.last_name}</div>
          <div><strong>Email:</strong> {profile.email}</div>
          <div><strong>Phone:</strong> {profile.phone_number || '-'}</div>
          <div><strong>Roll Number:</strong> {profile.roll_number}</div>
          <div><strong>Class:</strong> {profile.class_grade}</div>
          <div><strong>Date of Birth:</strong> {profile.date_of_birth}</div>
          <div><strong>Admission Date:</strong> {profile.admission_date}</div>
          <div><strong>Status:</strong> {profile.status}</div>
        </div>
      )}

      {!isEditing && (
        <div className="flex justify-end mt-6">
          <button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default StudentProfile
