// src/admin/pages/AdminDashboard.jsx
import "../../css/AdminDashboard.css";
import AdminLogin from "./AdminLogin";

const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin"; // reload to show login
  };

  if (!token) return <AdminLogin />;

  const adminActions = [
    { name: "Add Product", link: "/admin/add-product" },
    { name: "View Products", link: "/admin/products" },
    { name: "Manage Orders", link: "/admin/orders" },
    { name: "Cancelled Orders", link: "/admin/cancelled" },
    { name: "Delivered Orders", link: "/admin/delivered" },
    { name: "User Summary", link: "/admin/user-summary" },

  ];

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-cards">
        {adminActions.map((action, idx) => (
          <a key={idx} href={action.link} className="dashboard-card">
            {action.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
