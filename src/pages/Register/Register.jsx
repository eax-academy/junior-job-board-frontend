import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const accountTypes = [
    { key: "company", label: "Company", description: "Post jobs and track applicants." },
    { key: "user", label: "User", description: "To find a job fast." },
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://172.20.10.2:8080").replace(
    /\/$/,
    "",
);

const initialFormState = {
    email: "",
    password: "",
    confirmPassword: "",
};

function Register() {
    const [activeTab, setActiveTab] = useState(accountTypes[0].key);
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData(initialFormState);
        setErrors({});
        setStatus(null);
    };
    // handleTabChange: switches the active account type and resets the UI state.

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setStatus(null);
    };
    // handleChange: updates a specific form field and clears its error.

    const validate = () => {
        const validationErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const hasUppercase = /[A-Z]/.test(formData.password);
        const hasDigit = /\d/.test(formData.password);
        const hasSpecial = /[!@#$%^&*.]/.test(formData.password);

        if (!formData.email.trim()) {
            validationErrors.email = "Email is required.";
        } else if (!emailPattern.test(formData.email)) {
            validationErrors.email = "Enter a valid email (example: hello@domain.com).";
        }

        if (!formData.password) {
            validationErrors.password = "Password is required.";
        } else if (!(hasUppercase && hasDigit && hasSpecial)) {
            validationErrors.password =
                "Include an uppercase letter, a number, and a special character.";
        }

        if (!formData.confirmPassword) {
            validationErrors.confirmPassword = "Confirm your password.";
        } else if (formData.confirmPassword !== formData.password) {
            validationErrors.confirmPassword = "Passwords do not match.";
        }

        return validationErrors;
    };
    // validate: ensures email, password, and confirmation meet requirements.

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const endpoint = `${API_BASE_URL}/auth/register/${
            activeTab === "company" ? "company" : "user"
        }`;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                setStatus({
                    type: "success",
                    message: "Registration successful!",
                });
                setFormData(initialFormState);
                setTimeout(() => navigate("/login"), 1000);
            } else {
                setStatus({
                    type: "error",
                    message: "Account already exists",
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "Network error. Please try again.",
            });
        }
    };
    // handleSubmit: prevents default submit, validates, and displays feedback.

    return (
        <section className="register">
            <div className="register__content">
                <div className="register__tabs" role="tablist" aria-label="Account type">
                    {accountTypes.map((type) => (
                        <button
                            key={type.key}
                            role="tab"
                            type="button"
                            aria-selected={activeTab === type.key}
                            className={`register__tab ${activeTab === type.key ? "is-active" : ""}`}
                            onClick={() => handleTabChange(type.key)}
                        >
                            <span>{type.label}</span>
                            <small>{type.description}</small>
                        </button>
                    ))}
                </div>

                <form className="register__form" onSubmit={handleSubmit} noValidate>
                    <h1>Create account</h1>
                    <p className="register__intro">
                        {activeTab === "company"
                            ? "Post roles in minutes and invite collaborators."
                            : "Showcase your projects and get noticed faster."}
                    </p>

                    <label className={`register__field ${errors.email ? "has-error" : ""}`}>
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && <p className="register__error">{errors.email}</p>}
                    </label>

                    <label className={`register__field ${errors.password ? "has-error" : ""}`}>
                        <span>Password</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        <p className="register__hint">
                            Password must include an uppercase letter, a number, and a special character.
                        </p>
                        {errors.password && <p className="register__error">{errors.password}</p>}
                    </label>

                    <label className={`register__field ${errors.confirmPassword ? "has-error" : ""}`}>
                        <span>Confirm Password</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Repeat password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <p className="register__error">{errors.confirmPassword}</p>
                        )}
                    </label>

                    <button type="submit" className="register__submit">
                        SIGN UP
                    </button>

                    <p className="register__login">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>

                    {status && (
                        <div className={`register__status register__status--${status.type}`}>
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
// Register: main component that renders the registration form and manages its state.
export default Register;
