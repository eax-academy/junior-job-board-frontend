import React, { useState, useEffect } from "react";
import api from "../../axiosConfig";
import "./JobDetailModal.css";

export default function JobDetailModal({ job, onClose }) {
    const workType = Array.isArray(job.workType) ? job.workType : [];
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const salaryMin = job.salaryRange?.min ?? "";
    const salaryMax = job.salaryRange?.max ?? "";

    const [role, setRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        resume: null,
        message: "",
    });
    const [applicants, setApplicants] = useState([]);
    const [showApplicants, setShowApplicants] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem("Role");
        setRole(storedRole);

        const storedData = localStorage.getItem("Data");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserData(parsedData);

            if (storedRole !== "company") {
                setForm({
                    firstName: parsedData.firstName || "",
                    lastName: parsedData.lastName || "",
                    email: parsedData.email || "",
                    phone: parsedData.phone || "",
                    resume: null,
                    message: "",
                });
            }
        }
    }, []);

    const isCompanyOwner =
        role === "company" && userData?._id?.$oid === job.companyId;

    const toggleApplicants = async () => {
        if (!showApplicants) {
            try {
                const res = await api.get(`/applications/job/${job._id}`);
                if (res.status === 200) setApplicants(res.data);
            } catch (err) {
                console.error("Failed to fetch applicants:", err);
                setApplicants([]);
            }
        }
        setShowApplicants((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "resume") {
            setForm({ ...form, resume: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.resume) {
            alert("Please attach your resume!");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", job._id || job.id);
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("message", form.message);
        formData.append("resume", form.resume);

        try {
            const res = await api.post("/applications", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.status === 200) {
                alert("Application submitted!");
                onClose();
            } else {
                alert("Failed to submit application");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting application");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <h2 className="modal-title">{job.title}</h2>
                <p className="modal-location">{job.location}</p>

                <p>
                    <strong>Grade:</strong> {job.grade}
                </p>
                <p>
                    <strong>Type:</strong> {workType.join(", ")}
                </p>
                <p>
                    <strong>Salary:</strong> {salaryMin} – {salaryMax}
                </p>

                <p className="modal-description">{job.description}</p>

                <div className="modal-skills">
                    {skills.map((skill, idx) => (
                        <span
                            key={`${job._id}-skill-${idx}`}
                            className="modal-skill"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {isCompanyOwner ? (
                    <>
                        <button
                            className="show-applicants-btn"
                            onClick={toggleApplicants}
                        >
                            {showApplicants ? "Hide Applicants" : "Show Applicants"}
                        </button>

                        {showApplicants && (
                            <div className="applicants-list">
                                {applicants.length ? (
                                    applicants.map((a) => (
                                        <div key={a._id} className="applicant-item">
                                            <p>
                                                {a.firstName} {a.lastName}
                                            </p>
                                            <p>{a.email}</p>
                                            <p>{a.phone}</p>
                                            {a.resumeUrl && (
                                                <a
                                                    href={a.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Resume
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No applicants yet</p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <form className="modal-apply-form" onSubmit={handleSubmit}>
                        <h3>Apply to this job</h3>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Message (optional)"
                            value={form.message}
                            onChange={handleChange}
                        />
                        <button type="submit" className="apply-button">
                            Apply
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
