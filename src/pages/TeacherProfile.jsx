import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import axiosPrivate from "../utils/AxiosPrivate";

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosPrivate
      .get("/teacher/profile")
      .then((res) => {
        setTeacher(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    setSaving(true);
    setError("");
    axiosPrivate
      .patch("/teacher/profile", formData)
      .then((res) => {
        setTeacher(res.data);
        setEditing(false);
      })
      .catch(() => {
        setError("Failed to update profile.");
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <CircularProgress />;
  if (!teacher) return <Typography>No profile found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Teacher Profile
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error">{error}</Alert>}

        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              InputProps={{
  readOnly: !editing,
}}

            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
               InputProps={{
  readOnly: !editing,
}}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
               InputProps={{
  readOnly: !editing,
}}
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              fullWidth
               InputProps={{
  readOnly: !editing,
}}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Subject Specialization"
              name="subject_specialization"
              value={formData.subject_specialization}
              onChange={handleChange}
              fullWidth
               InputProps={{
  readOnly: !editing,
}}
            />
            <TextField
              label="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              fullWidth
               InputProps={{
  readOnly: !editing,
}}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Date of Joining"
              name="date_of_joining"
              type="date"
              value={formData.date_of_joining}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
  readOnly: !editing,
}}
            />
            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
               InputProps={{
  readOnly: !editing,
}}
            />
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {editing ? (
              <>
                <Button onClick={() => setEditing(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
