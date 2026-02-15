import toast from "react-hot-toast";

export const showToast = (message, type = "success") => {
    toast(message, {
        duration: 4000,
        position: "top-right",
        style: {
            background: type === "success" ? "#4caf50" : "#f44336",
            color: "#fff",
        },
        icon: type === "success" ? "✅" :type === "warning"?"ℹ️" :type === "error"?"❌":"",
    });
};
