import { useAuth } from "../context/AuthContext";

export default function DashboardHome() {
  const { auth } = useAuth();
  const role = auth?.user?.role ;
  const user = auth?.user || {};

  const getWelcomeMessage = () => {
    switch (role) {
      case "admin":
        return " Welcome Admin! Manage teachers and students here.";
      case "teacher":
        return " Welcome Teacher! View your students and exams.";
      case "student":
        return " Welcome Student! Check your exams and profile.";
      default:
        return "Welcome!";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 ">Dashboard</h1>
      <p className="text-gray-700 mb-6">{getWelcomeMessage()}</p>

      <div className="max-w-xl bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mr-4">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name || "No Name"}</h2>
            <p className="text-gray-500 uppercase text-sm">{role}</p>
          </div>
        </div>

        <hr className="my-4" />

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">📧 Email</p>
            <p className="text-gray-800">{user.email || "Not available"}</p>
          </div>

          

          {role !== "admin" && (
            <div>
              <p className="text-gray-500 text-sm"> Status</p>
              <p className="text-gray-800">{user.status || "Active"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
