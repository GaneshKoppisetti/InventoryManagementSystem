import { useEffect, useState, lazy } from "react";
import { Trash, Edit, CircleCheckIcon, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import format from "date-fns/format";
const DataTable = lazy(() => import("../../utils/Datatable"));
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import { useAuth } from "../../context/useContext";



const Users = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const permissions = user?.permissions?.[0]?.permissions;
  const navigate = useNavigate();

  const columnDefs = [
    {
      headerName: "User Name",
      field: "username",
    },
    {
      headerName: "Email",
      field: "email",
    },
    {
      headerName: "Role",
      field: "role",
      valueGetter: (params) =>
        params.data.role?.map((r) => r.rolename).join(", ") || "",
    },
    {
      headerName: "Created At",
      field: "createdAt",
      valueGetter: (params) => params.data.createdAt?format(new Date(params.data.createdAt), "dd-MM-yyyy hh:mm a"):'',
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      valueGetter: (params) => params.data.updatedAt?format(new Date(params.data.updatedAt), "dd-MM-yyyy hh:mm a"):'',
    },
    {
      headerName: "Status",
      field: "isActive",
      cellRenderer: (params) => (
        <div style={{ color: params.data.isActive ? "green" : "#f53a3a", fontWeight: "bold" }}>
          <span>
            {params.data.isActive ? <CircleCheckIcon size={18} /> : <CircleX size={18} />}
          </span>
          <span className="status-icon-text">{params.data.isActive ? "Active" : "In-Active"}
          </span>
        </div>
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
      filter: false,              // ❌ No filter
      floatingFilter: false,      // ❌ No search
      sortable: false,
      suppressMenu: true,
      width: 140,
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {(permissions?.Users?.includes("Write") || permissions?.Users?.includes("Update")) && <button
            type="button"
            title="Edit"
            onClick={() => handleEdit(params.data)}
            className="edit-btn"
          >
            <Edit size={16} />
          </button>}

          {(permissions?.Users?.includes("Delete")) && <button
            type="button"
            title="Delete"
            onClick={() => handleDelete(params.data._id)}
            className="delete-btn"
          >
            <Trash size={16} />
          </button>}
        </div>
      ),
    },
  ];

  // RBAC based on permissions
  if (!(permissions?.Users?.includes("Write") || permissions?.Users?.includes("Update") || permissions?.Users?.includes("Delete"))) {
    columnDefs.pop();
  }



  useEffect(() => {
    showLoader();
    // Fetch users data
    const fetchData = async () => {
      try {
        const response = await api.get("/users/getUsers");
        console.log("Users data:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");

      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);
  const handleAdd = () => {
    navigate("/user-form");
  };
  const handleEdit = (data) => {
    navigate(`/user-form/${data._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        showLoader();
        await api.delete(`/users/deleteUser/${id}`);
        showToast("User deleted successfully!", "success");
        const updatedUsers = users.filter(user => user._id !== id);
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");
      } finally {
        hideLoader();
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <DataTable
        rowData={users}
        columnDefs={columnDefs}
        showNew={permissions?.Users?.includes("Write")}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Users;
