import { useEffect, useState, lazy } from "react";
import { Trash, Edit, CircleCheckIcon, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import format from "date-fns/format";
const DataTable = lazy(() => import("../../utils/Datatable"));
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import { useAuth } from "../../context/useContext";


const Products = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const permissions = user?.permissions?.[0]?.permissions;
  const navigate = useNavigate();

  const columnDefs = [
    {
      headerName: "Product Name",
      field: "productname",
    },
    {
      headerName: "SKU",
      field: "sku"
    },
    {
      headerName: "Description",
      field: "description",
    },
    {
      headerName: "Price",
      field: "price",
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      headerName: "Quantity",
      field: "quantity",
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
          {(permissions?.Products?.includes("Update")) && <button
            type="button"
            title="Edit"
            onClick={() => handleEdit(params.data)}
            className="edit-btn"
          >
            <Edit size={16} />
          </button>}

          {(permissions?.Products?.includes("Delete")) && <button
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
  if (!(permissions?.Products?.includes("Write") || permissions?.Products?.includes("Update") || permissions?.Products?.includes("Delete"))) {
    columnDefs.pop();
  }


  useEffect(() => {
    showLoader();
    // Fetch products data
    const fetchData = async () => {
      try {
        const response = await api.get("/products/getProducts");
        console.log("Products data:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products data:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");

      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);
  const handleAdd = () => {
    navigate("/product-form");
  };
  const handleEdit = (data) => {
    navigate(`/product-form/${data._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        showLoader();
        await api.delete(`/products/deleteProduct/${id}`);
        showToast("Product deleted successfully!", "success");
        const updatedProducts = products.filter(product => product._id !== id);
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error deleting product:", error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
        showToast(errorMessage, "error");
      } finally {
        hideLoader();
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Products</h1>
      <DataTable
        rowData={products}
        columnDefs={columnDefs}
        showNew={permissions?.Products?.includes("Write")}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Products;
