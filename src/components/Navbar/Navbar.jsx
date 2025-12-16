import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/images/Logo.svg";

export default function Navbar({
    active,
    onChangeActive,
    userData,
    handleLogout,
}) {
    const navigate = useNavigate();

    const menuItems = [
        { key: "home", label: "Find Jobs" },
        { key: "company", label: "Company" },
        { key: "resumes", label: "Find Resumes" },
    ];

    return (
        <div className="navbar">
            <div className="navbar__logo">
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigate("/");
                        onChangeActive("home");
                    }}
                />
            </div>

            <div className="navbar__menu">
                {menuItems.map((item) => (
                    <p
                        key={item.key}
                        className={`navbar__menu-item ${
                            active === item.key ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => onChangeActive(item.key)}
                    >
                        {item.label}
                    </p>
                ))}
            </div>

            {userData ? (
                <div className="navbar__profile">
                    {userData.avatarBase64 ? (
                        <img
                            src={
                                userData.avatarBase64 ||
                                userData.photoBase64 ||
                                "/assets/images/CompanyLogo.svg"
                            }
                            alt="avatar"
                            className="profile-avatar"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/myprofile")}
                        />
                    ) : (
                        <div
                            className="profile-placeholder"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/myprofile")}
                        >
                            {userData.name || userData.email}
                        </div>
                    )}
                    <button className="home__logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <div className="navbar__profile">
                    <div
                        className="profile-placeholder"
                        style={{ cursor: "pointer" }}
                    >
                        <button onClick={() => navigate("/login")}>
                            Login
                        </button>
                        <button onClick={() => navigate("/register")}>
                            Register
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
