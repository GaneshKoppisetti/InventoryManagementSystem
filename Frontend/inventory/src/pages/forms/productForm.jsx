import { useReducer, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validate from "../../utils/validation/validator";
import { showLoader, hideLoader } from "../../utils/loader/Loader";
import { showToast } from "../../utils/toaster/Toaster";
import api from "../../services/api";
import MultiSelectField from "../../utils/MultiSelectDropdown";

const initialState = {
    productname: "",
    sku:"",
    description: "",
    price: "",
    quantity: "",
    isActive: true,
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };

        case "TOGGLE_STATUS":
            return { ...state, isActive: action.value };
        case "SET_DATA":
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

const ProductForm = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    // Fetch product if update mode
    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            showLoader();
            const res = await api.get(`/products/getProduct/${id}`);
            dispatch({ type: "SET_DATA", payload: res.data });
        } catch (err) {
            console.error("Error fetching product data:", err);
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
                { name: "Product Name", value: state.productname, required: true, type: "text", id: "productname" },
                {name:"SKU",value:state.sku,required:true,type:"text",id:"sku"},
                { name: "Price", value: state.price, required: true, type: "number", id: "price" },
                { name: "Quantity", value: state.quantity, required: true, type: "number", id: "quantity" },
            ];

            let validResponse = validate(validationData);
            if (!validResponse.isValid) {
                showToast(validResponse.message, "error");
                return;
            }

            if (isEditMode) {
                await api.put(`/products/updateProduct/${id}`, state);
                showToast("Product updated successfully!", "success");
            } else {
                await api.post("/products/createProduct", state);
                showToast("Product created successfully!", "success");
            }

            setTimeout(() => navigate("/products"), 1500);
        } catch (err) {
            console.error("Error submitting/Updating product form:", err);
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
                {isEditMode ? "Update Product" : "Create Product"}
            </h2>

            <div className="modern-form">
                {/* Product Name */}
                <div className="floating-group">
                    <input
                        type="text"
                        id="productname"
                        placeholder=" "
                        value={state.productname}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "productname",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        Product Name <span className="mandatory-hastric">*</span>
                    </label>
                </div>
                {/* SKU */}
                  <div className="floating-group">
                    <input
                        type="text"
                        id="sku"
                        placeholder=" "
                        value={state.sku}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "sku",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        SKU <span className="mandatory-hastric">*</span>
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
                {/* Price */}
                <div className="floating-group">     
                    <input
                        type="number"
                        id="price" 
                        placeholder=" "
                        value={state.price}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "price",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        Price <span className="mandatory-hastric">*</span>
                    </label>
                </div>
                {/* Quantity */}
                <div className="floating-group">     
                    <input
                        type="number"
                        id="quantity"
                        placeholder=" "
                        value={state.quantity}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD",
                                field: "quantity",
                                value: e.target.value,
                            })
                        }
                    />
                    <label>
                        Quantity <span className="mandatory-hastric">*</span>
                    </label>
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
                        {isEditMode ? "Update Product" : "Create Product"}
                    </button>
                    <button
                        type="button"
                        className="btn-light"
                        onClick={() => navigate("/products")}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
