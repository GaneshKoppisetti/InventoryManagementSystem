import { useEffect, useState, lazy } from "react";
import { Trash, Edit, CircleCheckIcon, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import format from "date-fns/format";
const DataTable = lazy(() => import("../../utils/Datatable"));
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import { useAuth } from "../../context/useContext";



const Roles = () => {
  const [roles, setRoles] = useState([]);
  const { user } = useAuth();
  const permissions = user?.permissions?.[0]?.permissions;
  const navigate = useNavigate();

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "rolename",
    },
    {
      headerName: "Description",
      field: "description",
    },
    {
      headerName: "Access Rights",
      field: "permissions",
      autoHeight: true,
      minWidth: 250,
      wrapText: true,
      cellRenderer: (params) => {
        const permissions = params.data.permissions;
        const shortPerm = [{ Read: "R" }, { Write: "W" }, { Update: "U" }, { Delete: "D" }]

        return (
          <div className="permission-wrapper">
            {Object.entries(permissions).map(([screen, actions]) =>
              actions.length > 0 ? (
                <div key={screen} className="permission-group">
                  <span className="screen-name">{screen}</span>
                  {actions.map((action, index) => (
                    <span key={index} className={`permission-tag permission-${action.toLowerCase()}`} title={`${action}`}>
                      {shortPerm.find(p => p[action])?.[action] || action}
                    </span>
                  ))}
                </div>
              ) : null
            )}
          </div>
        );
      },
    },
    {
      headerName: "Created At",
      field: "createdAt",
      valueGetter: (params) => format(new Date(params.data.createdAt), "dd-MM-yyyy hh:mm a"),
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      valueGetter: (params) => format(new Date(params.data.updatedAt), "dd-MM-yyyy hh:mm a"),

    },
    {
      headerName: "Status",
      field: "isActive",
      cellRenderer: (params) => (
        <div style={{ color: params.data.isActive ? "green" : "red", fontWeight: "bold" }}>
          <span>
            {params.data.isActive ? <CircleCheckIcon size={18} /> : <CircleX size={18} />}
          </span>
          <span className="status-icon-text">{params.data.isActive ? "Active" : "Inactive"}
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
          {(permissions?.Roles?.includes("Write") || permissions?.Roles?.includes("Update")) && <button
            type="button"
            title="Edit"
            onClick={() => handleEdit(params.data)}
            className="edit-btn"
          >
            <Edit size={16} />
          </button>}

          {(permissions?.Roles?.includes("Delete")) && <button
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
  if (!(permissions?.Roles?.includes("Write") || permissions?.Roles?.includes("Update") || permissions?.Roles?.includes("Delete"))) {
    columnDefs.pop();
  }

  useEffect(() => {
    showLoader();
    const fetchData = async () => {
      try {
        const response = await api.get("/roles/getRoles");
        console.log("Roles data:", response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles data:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");

      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);
  const handleAdd = () => {
    navigate("/role-form");
  };
  const handleEdit = (data) => {
    navigate(`/role-form/${data._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        showLoader();
        await api.delete(`/roles/deleteRole/${id}`);
        showToast("Role deleted successfully!", "success");
        const updatedRoles = roles.filter(role => role._id !== id);
        setRoles(updatedRoles);
      } catch (error) {
        console.error("Error deleting role:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");
      } finally {
        hideLoader();
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Roles</h1>
      <DataTable
        rowData={roles}
        columnDefs={columnDefs}
        showNew={permissions?.Roles?.includes("Write")}
        onAdd={() => handleAdd()}
      />
    </div>
  );
};

export default Roles;
