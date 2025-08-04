import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { auth, logout } = useAuth();
  const role = auth?.user?.role;

  const menuItems = {
    admin: [
      { path: "/dashboard", label: "Home" },
      { path: "/teachersPage", label: "Manage Teachers" },
      { path: "/studentsPage", label: "Manage Students" },
    ],
    teacher: [
      { path: "/dashboard", label: "Home" },
      { path: "/my-students", label: "My Students" },
      { path: "/profile", label: "My Profile" },
    ],
    student: [
      { path: "/dashboard", label: "Home" },
      { path: "/studentme", label: "My Profile" },
    ],
  };

  return (
    <div className="flex h-full overflow-y-hidden">
      <aside className="w-60 bg-gray-900 text-white flex flex-col h-screen">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">School App</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems[role]?.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 bg-gray-50">
        <header className="bg-white shadow flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-semibold">
            Welcome {auth?.user?.name || "User"}
          </h2>
          <span className="text-gray-600 capitalize">{role}</span>
        </header>

        <main className="p-0 h-full place-items-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
