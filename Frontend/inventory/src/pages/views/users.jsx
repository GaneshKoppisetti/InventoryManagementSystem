import { useEffect, useState } from "react";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import api from "../../services/api";
import { showToast } from "../../utils/toaster/Toaster";
import DataTable from "../../utils/Datatable";
import { Trash,Edit} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const columnDefs = [
    { headerName: "User Name", field: "username" },
    { headerName: "Email", field: "email" },
    {
      headerName: "Role", field: "role", valueGetter: (params) => {
        const roles = params.data.role;
        return roles.map(r => r.name).join(", ");
      }
    }, // if populated
    { headerName: "Created At", field: "createdAt" },
    { headerName: "Updated At", field: "updatedAt" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleEdit(params.data)}
            className="edit-btn"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => handleDelete(params.data._id)}
            className="delete-btn"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      width: 150
    }
  ];

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
        showToast("Error fetching users data", "error");

      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <DataTable
        rowData={users}
        columnDefs={columnDefs}
      />
    </div>
  );
};

export default Users;
