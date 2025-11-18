import React, { useState, useEffect } from "react";
import api from "../../axiosConfig";
import "./CreateJobForm.css";

const skillsMap = {
    JavaScript: {
        Frontend: ["React", "Vue", "HTML", "CSS"],
        Backend: ["Node", "Express"],
        Fullstack: ["React", "Node"],
        DevOps: ["Docker", "AWS"],
    },
    Python: {
        Backend: ["Django", "Flask"],
        Fullstack: ["Django", "React"],
    },
    Java: {
        Backend: ["Spring", "Hibernate"],
    },
    "C++": {
        Backend: ["Qt", "Boost"],
    },
};

export default function PostJobForm({ onClose, onJobPosted }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [requiredLanguage, setRequiredLanguage] = useState("");
    const [grade, setGrade] = useState("");
    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [location, setLocation] = useState("");
    const [workType, setWorkType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const categoriesOptions = ["Frontend", "Backend", "Fullstack", "DevOps"];
    const languagesOptions = ["JavaScript", "Python", "Java", "C++"];
    const gradeOptions = ["Intern", "Junior", "Middle", "Senior"];
    const workTypeOptions = ["remote", "onsite", "hybrid"];

    useEffect(() => {
        if (requiredLanguage && category) {
            const available = skillsMap[requiredLanguage]?.[category] || [];
            setAvailableSkills(available);
            setSkills((prev) => prev.filter((s) => available.includes(s)));
        } else {
            setAvailableSkills([]);
            setSkills([]);
        }
    }, [requiredLanguage, category]);

    const handleCheckboxChange = (value, stateArray, setState) => {
        if (stateArray.includes(value)) {
            setState(stateArray.filter((v) => v !== value));
        } else {
            setState([...stateArray, value]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                title,
                description,
                requiredLanguages: requiredLanguage ? [requiredLanguage] : [],
                grade,
                skills,
                category: category || "",
                salaryRange: {
                    min: salaryMin !== "" ? Number(salaryMin) : null,
                    max: salaryMax !== "" ? Number(salaryMax) : null,
                },
                location,
                workType: workType ? [...workType] : [],
            };

            console.log("Submitting job with payload:", payload);
            const res = await api.post("/jobs", payload);
            if (res.status === 201 || res.status === 200) {
                onJobPosted && onJobPosted(res.data);
                onClose && onClose();
            }
        } catch (err) {
            console.log("Backend error:", err.response?.data);
            console.error(err);
            setError("Failed to post job. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="postjob-form-backdrop">
            <div className="postjob-form-container">
                <h2>Post a Job</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>Category</label>
                    <div className="radio-group">
                        {categoriesOptions.map((c) => (
                            <label key={c}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={c}
                                    checked={category === c}
                                    onChange={() => setCategory(c)}
                                />
                                {c}
                            </label>
                        ))}
                    </div>

                    <label>Required Language</label>
                    <div className="radio-group">
                        {languagesOptions.map((l) => (
                            <label key={l}>
                                <input
                                    type="radio"
                                    name="language"
                                    value={l}
                                    checked={requiredLanguage === l}
                                    onChange={() => setRequiredLanguage(l)}
                                />
                                {l}
                            </label>
                        ))}
                    </div>

                    <label>Grade</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    >
                        <option value="">Select grade</option>
                        {gradeOptions.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>

                    {availableSkills.length > 0 && (
                        <>
                            <label>Skills</label>
                            <div className="checkbox-group">
                                {availableSkills.map((s) => (
                                    <label key={s}>
                                        <input
                                            type="checkbox"
                                            checked={skills.includes(s)}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    s,
                                                    skills,
                                                    setSkills
                                                )
                                            }
                                        />
                                        {s}
                                    </label>
                                ))}
                            </div>
                        </>
                    )}

                    <label>Salary Range</label>
                    <div className="salary-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={salaryMax}
                            onChange={(e) => setSalaryMax(e.target.value)}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <label>Work Type</label>
                    <div className="checkbox-group">
                        {workTypeOptions.map((w) => (
                            <label key={w}>
                                <input
                                    type="checkbox"
                                    checked={workType.includes(w)}
                                    onChange={() =>
                                        handleCheckboxChange(
                                            w,
                                            workType,
                                            setWorkType
                                        )
                                    }
                                />
                                {w}
                            </label>
                        ))}
                    </div>

                    {error && <div className="error">{error}</div>}
                    <div className="form-buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? "Posting..." : "Post Job"}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
