const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};
const validate = (data) => {
    let valid = { isValid: true, message: "" };
    for (let field of data) {
        if (field.value.trim() === "") {
            valid.isValid = false;
            valid.message = `${field.name} cannot be blank`;
            const inputElement = document.getElementById(field.id);
            inputElement.focus();
            inputElement?.focus({ preventScroll: true });
            inputElement?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            const parent = inputElement.closest(".input-group");
            parent?.classList.add("mandatory");
            return valid;
        }
        if (field.type === "email" && !validateEmail(field.value)) {
            valid.isValid = false;
            valid.message = "Invalid email format";
            const inputElement = document.getElementById(field.id);
            inputElement.focus();
            inputElement?.focus({ preventScroll: true });
            inputElement?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            const parent = inputElement.closest(".input-group");
            parent?.classList.add("mandatory");
            return valid;
        }
        if (field.type === "password" && !validatePassword(field.value)) {
            valid.isValid = false;
            valid.message = "Password must be at least 6 characters long";
            const inputElement = document.getElementById(field.id);
            inputElement.focus();
            inputElement?.focus({ preventScroll: true });
            inputElement?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            const parent = inputElement.closest(".input-group");
            parent?.classList.add("mandatory");
            return valid;
        }
    }
    return valid;
};

export default validate;
