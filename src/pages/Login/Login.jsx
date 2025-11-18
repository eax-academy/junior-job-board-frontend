import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../assets/images/Logo.svg";
import api from "../../axiosConfig";

const initialFormState = {
    email: "",
    password: "",
};

function Login() {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setStatus(null);
    };

    const validate = () => {
        const validationErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!formData.email.trim()) {
            validationErrors.email = "Email is required.";
        } else if (!emailPattern.test(formData.email)) {
            validationErrors.email =
                "Enter a valid email (example: hello@domain.com).";
        }

        if (!formData.password) {
            validationErrors.password = "Password is required.";
        }

        return validationErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            const data = response.data;

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            if (data.role) {
                localStorage.setItem("Role", JSON.stringify(data.role));
            }
            if (data[data.role]) {
                localStorage.setItem("Data", JSON.stringify(data[data.role]));
            }
            setStatus({
                type: "success",
                message: "Logged in! Redirecting...",
            });

            setFormData(initialFormState);
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            const msg =
                error.response?.data?.message || "Wrong email or password.";

            setStatus({
                type: "error",
                message: msg,
            });
        }
    };

    return (
        <section className="login">
            <div className="login__logo">
                <img src={Logo} alt="Logo" onClick={() => navigate("/")} />
            </div>

            <div className="login__content">
                <form
                    className="login__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <h1>Log in</h1>
                    <p className="login__intro">
                        Welcome back! Enter your details to access your
                        dashboard.
                    </p>

                    <label
                        className={`login__field ${
                            errors.email ? "has-error" : ""
                        }`}
                    >
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="login__error">{errors.email}</p>
                        )}
                    </label>

                    <label
                        className={`login__field ${
                            errors.password ? "has-error" : ""
                        }`}
                    >
                        <span>Password</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <p className="login__error">{errors.password}</p>
                        )}
                    </label>

                    <button type="submit" className="login__submit">
                        LOG IN
                    </button>

                    <p className="login__signup">
                        Don’t have an account?{" "}
                        <Link to="/register">Sign up</Link>
                    </p>

                    {status && (
                        <div
                            className={`login__status login__status--${status.type}`}
                        >
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}

export default Login;
