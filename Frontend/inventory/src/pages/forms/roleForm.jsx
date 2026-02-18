import { useReducer, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validate from "../../utils/validation/validator";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";

const screens = ["Roles", "Users", "Products"];
const actions = ["Read", "Write", "Update", "Delete"];

const DefaultPermissions = {
  Roles: [],
  Users: [],
  Products: ["Read"],
};

const initialState = {
  rolename: "",
  description: "",
  permissions: DefaultPermissions,
  isActive: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "TOGGLE_STATUS":
      return { ...state, isActive: action.value };

    case "TOGGLE_PERMISSION":
      const { screen, permission } = action;
      const current = state.permissions[screen];

      const updated = current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission];

      return {
        ...state,
        permissions: {
          ...state.permissions,
          [screen]: updated,
        },
      };

    case "SET_DATA":
      return { ...action.payload };

    default:
      return state;
  }
}

const RoleForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // Fetch role if update mode
  useEffect(() => {
    if (isEditMode) {
      fetchRole();
    }
  }, [id]);

  const fetchRole = async () => {
    try {
      showLoader();
      const res = await api.get(`/roles/getRole/${id}`);
      dispatch({ type: "SET_DATA", payload: res.data });
    } catch (err) {
      console.error("Error fetching role data:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Something went wrong. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      hideLoader();
    }
  };

  const handleSubmit = async () => {
    try {
      showLoader();
      let validationData = [
        { name: "Role Name", value: state.rolename, required: true, type: "text", id: "rolename" },
      ];

      let validResponse = validate(validationData);
      if (!validResponse.isValid) {
        showToast(validResponse.message, "error");
        return;
      }

      if (isEditMode) {
        await api.put(`/roles/updateRole/${id}`, state);
        showToast("Role updated successfully!", "success");
      } else {
        await api.post("/roles/createRole", state);
        showToast("Role created successfully!", "success");
      }

      setTimeout(() => navigate("/roles"), 1500);
    } catch (err) {
      console.error("Error submitting/Updating role form:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Something went wrong. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="modern-wrapper">
      <h2 className="modern-title">
        {isEditMode ? "Update Role" : "Create Role"}
      </h2>

      <div className="modern-form">
        {/* Role Name */}
        <div className="floating-group">
          <input
            type="text"
            id="rolename"
            placeholder=" "
            value={state.rolename}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "rolename",
                value: e.target.value,
              })
            }
          />
          <label>
            Role Name <span className="mandatory-hastric">*</span>
          </label>
        </div>

        {/* Description */}
        <div className="floating-group">
          <textarea
            id="description"
            placeholder=" "
            value={state.description}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: e.target.value,
              })
            }
          />
          <label>Description</label>
        </div>

        {/* Permission Matrix */}
        <div className="permission-section">
          <h4>Access Control</h4>

          <div className="permission-grid">
            <div className="grid-header">Screen</div>
            {actions.map((action) => (
              <div key={action} className="grid-header">
                {action}
              </div>
            ))}

            {screens.map((screen) => (
              <div key={screen} style={{ display: "contents" }}>
                <div className="grid-screen">{screen}</div>

                {actions.map((action) => (
                  <div key={action} className="grid-cell">
                    <input
                      type="checkbox"
                      checked={state.permissions[screen]?.includes(action)}
                      onChange={() =>
                        dispatch({
                          type: "TOGGLE_PERMISSION",
                          screen,
                          permission: action,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="status-row">
          <span>Status</span>
          <label className="modern-switch">
            <input
              type="checkbox"
              checked={state.isActive}
              onChange={(e) =>
                dispatch({
                  type: "TOGGLE_STATUS",
                  value: e.target.checked,
                })
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Buttons */}
        <div className="modern-actions">
          <button className="btn-gradient" onClick={handleSubmit}>
            {isEditMode ? "Update Role" : "Create Role"}
          </button>
          <button
            type="button"
            className="btn-light"
            onClick={() => navigate("/roles")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
