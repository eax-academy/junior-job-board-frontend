import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import "./MyProfile.css";

export default function MyProfile() {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: "",
        lastname: "",
        email: "",
        location: "",
        phone: "",
        bio: "",
        programmingLanguages: [],
        skills: [],
        category: [],
    });

    const [companyData, setCompanyData] = useState({
        name: "",
        email: "",
        website: [], 
        description: "",
        location: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("Data");
        const storedRole = localStorage.getItem("Role");
        setRole(storedRole);
        if (storedUser) {
            const data = JSON.parse(storedUser);

            if (role === "company") {
                setCompanyData({
                    name: data.name || "",
                    email: data.email || "",
                    website: data.website || [],
                    description: data.description || "",
                    location: data.location || "",
                });
            } else {
                setUserData({
                    name: data.name || "",
                    lastname: data.lastname || "",
                    email: data.email || "",
                    location: data.location || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                    programmingLanguages: data.programmingLanguages || [],
                    skills: data.skills || [],
                    category: data.category || [],
                });
            }
        }
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const storedUser = localStorage.getItem("Data");
        if (!storedUser) {
            setError("No user data found");
            setLoading(false);
            return;
        }

        const data = JSON.parse(storedUser);
        const userId = data._id.$oid;

        try {
            let res;
            if (role === "company") {
                res = await api.put(`/companies/${userId}`, companyData);
            } else {
                res = await api.put(`/users/${userId}`, userData);
            }

            if (res.status === 200) {
                setSuccess("Profile updated!");
            }
        } catch (err) {
            console.error(err);
            setError("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => navigate("/")}>back to home</button>
            <div className="profile-container">
                <form onSubmit={handleSubmit} className="profile-form">
                    <h2>
                        {role === "company"
                            ? "Company Profile"
                            : "User Profile"}
                    </h2>

                    {role === "company" ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Company Name"
                                value={companyData.name}
                                onChange={handleCompanyChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={companyData.email}
                                onChange={handleCompanyChange}
                            />

                            <label>Websites</label>
                            {companyData.website.map((url, index) => (
                                <div key={index} className="array-input">
                                    <input
                                        type="text"
                                        value={url}
                                        placeholder="add website"
                                        onChange={(e) => {
                                            const newWebsites = [
                                                ...companyData.website,
                                            ];
                                            newWebsites[index] = e.target.value;
                                            setCompanyData((prev) => ({
                                                ...prev,
                                                website: newWebsites,
                                            }));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newWebsites =
                                                companyData.website.filter(
                                                    (_, i) => i !== index
                                                );
                                            setCompanyData((prev) => ({
                                                ...prev,
                                                website: newWebsites,
                                            }));
                                        }}
                                    >
                                        remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    setCompanyData((prev) => ({
                                        ...prev,
                                        website: [...prev.website, ""],
                                    }))
                                }
                            >
                                + Add Website
                            </button>

                            <textarea
                                name="description"
                                placeholder="Company Description"
                                value={companyData.description}
                                onChange={handleCompanyChange}
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={companyData.location}
                                onChange={handleCompanyChange}
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={userData.name}
                                onChange={handleUserChange}
                            />
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Lastname"
                                value={userData.lastname}
                                onChange={handleUserChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={userData.email}
                                onChange={handleUserChange}
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={userData.phone}
                                onChange={handleUserChange}
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={userData.location}
                                onChange={handleUserChange}
                            />

                            <label>Skills</label>
                            {userData.skills.map((skill, index) => (
                                <div key={index} className="array-input">
                                    <input
                                        type="text"
                                        value={skill}
                                        onChange={(e) => {
                                            const newSkills = [
                                                ...userData.skills,
                                            ];
                                            newSkills[index] = e.target.value;
                                            setUserData((prev) => ({
                                                ...prev,
                                                skills: newSkills,
                                            }));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSkills =
                                                userData.skills.filter(
                                                    (_, i) => i !== index
                                                );
                                            setUserData((prev) => ({
                                                ...prev,
                                                skills: newSkills,
                                            }));
                                        }}
                                    >
                                        remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        skills: [...prev.skills, ""],
                                    }))
                                }
                            >
                                + Add Skill
                            </button>
                            <label>Programming Languages</label>
                            {userData.programmingLanguages.map(
                                (lang, index) => (
                                    <div key={index} className="array-input">
                                        <input
                                            type="text"
                                            value={lang}
                                            placeholder="add language"
                                            onChange={(e) => {
                                                const newLangs = [
                                                    ...userData.programmingLanguages,
                                                ];
                                                newLangs[index] =
                                                    e.target.value;
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    programmingLanguages:
                                                        newLangs,
                                                }));
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newLangs =
                                                    userData.programmingLanguages.filter(
                                                        (_, i) => i !== index
                                                    );
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    programmingLanguages:
                                                        newLangs,
                                                }));
                                            }}
                                        >
                                            remove
                                        </button>
                                    </div>
                                )
                            )}
                            <button
                                type="button"
                                onClick={() =>
                                    setUserData((prev) => ({
                                        ...prev,
                                        programmingLanguages: [
                                            ...prev.programmingLanguages,
                                            "",
                                        ],
                                    }))
                                }
                            >
                                + Add Language
                            </button>
                            <textarea
                                name="bio"
                                placeholder="Bio"
                                value={userData.bio}
                                onChange={handleUserChange}
                            />
                        </>
                    )}
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </>
    );
}
