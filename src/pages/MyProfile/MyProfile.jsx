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
        photoBase64: "",
        resumeBase64: "",
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

    const [photoFile, setPhotoFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [photoStatus, setPhotoStatus] = useState("");
    const [resumeStatus, setResumeStatus] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("Data");
        const storedRole = localStorage.getItem("Role");
        setRole(storedRole);
        if (storedUser) {
            const data = JSON.parse(storedUser);

            if (storedRole === "company") {
                setCompanyData({
                    name: data.name || "",
                    email: data.email || "",
                    website: data.website || [],
                    photoBase64: data.photoBase64 || "",
                    description: data.description || "",
                    location: data.location || "",
                });
            } else {
                setUserData((prev) => ({
                    ...prev,
                    name: data.name || "",
                    lastname: data.lastname || "",
                    email: data.email || "",
                    location: data.location || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                    programmingLanguages: data.programmingLanguages || [],
                    skills: data.skills || [],
                    category: data.category || [],
                    photoBase64: data.photoBase64 || "",
                    resumeBase64: data.resumeBase64 || "",
                }));
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

    const handlePhotoUpload = () => {
        if (!photoFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(photoFile);
        reader.onloadend = async () => {
            const photoBase64 = reader.result;
            setPhotoStatus("Uploading...");

            try {
                const storedUser = localStorage.getItem("Data");
                const userId = JSON.parse(storedUser)._id.$oid;

                let res;
                if (role === "company") {
                    res = await api.put(`/companies/${userId}`, {
                        photoBase64,
                    });

                    if (res.status === 200) {
                        setCompanyData((prev) => ({ ...prev, photoBase64 }));

                        const updated = {
                            ...JSON.parse(storedUser),
                            photoBase64,
                        };
                        localStorage.setItem("Data", JSON.stringify(updated));

                        setPhotoStatus("Photo uploaded successfully!");
                    } else setPhotoStatus("Upload failed");
                } else {
                    res = await api.put(`/users/${userId}`, { photoBase64 });

                    if (res.status === 200) {
                        setUserData((prev) => ({ ...prev, photoBase64 }));

                        const updated = {
                            ...JSON.parse(storedUser),
                            photoBase64,
                        };
                        localStorage.setItem("Data", JSON.stringify(updated));

                        setPhotoStatus("Photo uploaded successfully!");
                    } else setPhotoStatus("Upload failed");
                }

                setPhotoFile(null);
            } catch (err) {
                console.error(err);
                setPhotoStatus("Upload failed");
            }
        };
    };

    const handlePhotoUpload = () => {
        if (!photoFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(photoFile);
        reader.onloadend = async () => {
            const photoBase64 = reader.result;
            setPhotoStatus("Uploading...");
            try {
                const storedUser = localStorage.getItem("Data");
                const userId = JSON.parse(storedUser)._id.$oid;

                let res;
                if (role === "company") {
                    res = await api.put(`/companies/${userId}`, {
                        photoBase64,
                    });
                    if (res.status === 200) {
                        setCompanyData((prev) => ({ ...prev, photoBase64 }));
                        setPhotoStatus("Photo uploaded successfully!");
                        setPhotoFile(null);
                    } else {
                        setPhotoStatus("Upload failed");
                    }
                } else {
                    res = await api.put(`/users/${userId}`, { photoBase64 });
                    if (res.status === 200) {
                        setUserData((prev) => ({ ...prev, photoBase64 }));
                        setPhotoStatus("Photo uploaded successfully!");
                        setPhotoFile(null);
                    } else {
                        setPhotoStatus("Upload failed");
                    }
                }
            } catch (err) {
                console.error(err);
                setPhotoStatus("Upload failed");
            }
        };
    };

    const handleResumeUpload = () => {
        if (!resumeFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(resumeFile);
        reader.onloadend = async () => {
            const resumeBase64 = reader.result;
            setResumeStatus("Uploading...");
            try {
                const storedUser = localStorage.getItem("Data");
                const userId = JSON.parse(storedUser)._id.$oid;

                const res = await api.put(`/users/${userId}`, { resumeBase64 });

                if (res.status === 200) {
                    setUserData((prev) => ({ ...prev, resumeBase64 }));

                    const updated = { ...JSON.parse(storedUser), resumeBase64 };
                    localStorage.setItem("Data", JSON.stringify(updated));

                    setResumeStatus("Resume uploaded successfully!");
                    setResumeFile(null);
                } else {
                    setResumeStatus("Upload failed");
                }
            } catch (err) {
                console.error(err);
                setResumeStatus("Upload failed");
            }
        };
    };

    return (
        <>
            <button onClick={() => navigate("/")}>Back to Home</button>
            <div className="profile-container">
                <form onSubmit={handleSubmit} className="profile-form">
                    <h2>
                        {role === "company"
                            ? "Company Profile"
                            : "User Profile"}
                    </h2>

                    {role === "company" ? (
                        <>
                            <label>Profile Photo</label>
                            <div className="upload-section">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setPhotoFile(e.target.files[0])
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={handlePhotoUpload}
                                >
                                    Upload Photo
                                </button>
                                {photoStatus && <p>{photoStatus}</p>}
                            </div>

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
                                        placeholder="Add website"
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
                                        Remove
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
                            <label>Profile Photo</label>
                            <div className="upload-section">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setPhotoFile(e.target.files[0])
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={handlePhotoUpload}
                                >
                                    Upload Photo
                                </button>
                                {photoStatus && <p>{photoStatus}</p>}
                            </div>

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
                                        Remove
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
                                            placeholder="Add language"
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
                                            Remove
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
                            <label>Resume</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) =>
                                    setResumeFile(e.target.files[0])
                                }
                            />
                            <button type="button" onClick={handleResumeUpload}>
                                Upload Resume
                            </button>
                            {resumeStatus && <p>{resumeStatus}</p>}
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
