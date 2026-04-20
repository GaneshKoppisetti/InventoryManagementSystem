import { useReducer, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validate from "../../utils/validation/validator";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import MultiSelectField from "../../utils/MultiSelectDropdown";

const initialState = {
    username: "",
    email: "",
    password: "",
    role: [],
    isActive: true,
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };

        case "TOGGLE_STATUS":
            return { ...state, isActive: action.value };

        case "SET_DATA":
            return { ...action.payload, role: action.payload.role?.map(role => role._id)[0] || '' };

        default:
            return state;
    }
}

const UserForm = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);
    // Fetch roles for dropdown
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get("/roles/getRoles");
            setRoles(res.data.filter(role => role.isActive).sort((a, b) => a.rolename.localeCompare(b.rolename))); // Only active roles
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    };

    // Fetch user if update mode
    useEffect(() => {
        if (isEditMode) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            showLoader();
            const res = await api.get(`/users/getUser/${id}`);
            dispatch({ type: "SET_DATA", payload: res.data });
        } catch (err) {
            console.error("Error fetching user data:", err);
            const errorMessage =
                err.response?.data?.error || err.response?.data?.message ||
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
                { name: "User Name", value: state.username, required: true, type: "text", id: "username" },
                { name: "Email", value: state.email, required: true, type: "email", id: "email" },
                { name: "Password", value: state.password, required: true, type: "password", id: "password" },
                { name: "Role", value: state.role, required: true, type: "array", id: "role" },
            ];

            let validResponse = validate(validationData);
            if (!validResponse.isValid) {
                showToast(validResponse.message, "error");
                return;
            }

            if (isEditMode) {
                await api.put(`/users/updateUser/${id}`, state);
                showToast("User updated successfully!", "success");
            } else {
                await api.post("/users/createUser", state);
                showToast("User created successfully!", "success");
            }

            setTimeout(() => navigate("/users"), 1500);
        } catch (err) {
            console.error("Error submitting/Updating user form:", err);
            const errorMessage =
                err.response?.data?.error || err.response?.data?.message ||
                "Something went wrong. Please try again.";
            showToast(errorMessage, "error");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="modern-wrapper">
            <h2 className="modern-title">
                {isEditMode ? "Update User" : "Create User"}
            </h2>

            <div className="modern-form">
                {/* User Name */}
                <div className="floating-group">
                    <input
                        type="text"
                        id="username"
                        placeholder=" "
                        value={state.username}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "username",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        User Name <span className="mandatory-hastric">*</span>
                    </label>
                </div>
                {/* Email */}
                <div className="floating-group">
                    <input
                        type="email"
                        id="email"
                        placeholder=" "
                        value={state.email}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "email",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        Email <span className="mandatory-hastric">*</span>
                    </label>
                </div>
                {/* Password */}
                <div className="floating-group">
                    <input
                        type="password"
                        id="password"
                        placeholder=" "
                        value={state.password}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "password",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        Password <span className="mandatory-hastric">*</span>
                    </label>
                </div>
                {/* Role */}
                <MultiSelectField
                    id="role"
                    label="Role"
                    required
                    multiple={false}
                    options={roles.map((role) => ({
                        label: role.rolename,
                        value: role._id,
                    }))}
                    value={state.role}
                    onChange={(selected) =>
                        dispatch({
                            type: "SET_FIELD",
                            field: "role",
                            value: selected,
                        })
                    }
                />
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
                        {isEditMode ? "Update User" : "Create User"}
                    </button>
                    <button
                        type="button"
                        className="btn-light"
                        onClick={() => navigate("/users")}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
