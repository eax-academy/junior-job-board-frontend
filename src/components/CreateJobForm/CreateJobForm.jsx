import { useEffect, useState } from "react";
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

const coerceSalaryValue = (value) => {
    if (value === undefined || value === null) return "";
    if (typeof value === "object") {
        if (typeof value.$numberDecimal === "string") {
            const parsed = Number(value.$numberDecimal);
            return Number.isNaN(parsed) ? value.$numberDecimal : parsed;
        }
        if (typeof value.$numberDouble === "string") {
            const parsed = Number(value.$numberDouble);
            return Number.isNaN(parsed) ? value.$numberDouble : parsed;
        }
        if (typeof value.$numberInt === "string") {
            const parsed = Number(value.$numberInt);
            return Number.isNaN(parsed) ? value.$numberInt : parsed;
        }
        if (Array.isArray(value) && value.length) {
            return coerceSalaryValue(value[0]);
        }
        return "";
    }
    return value;
};

const deriveInitialSalary = (job = {}) => {
    const range = job.salaryRange;
    const salary = job.salary;

    const pickValue = (...candidates) => {
        for (const candidate of candidates) {
            const parsed = coerceSalaryValue(candidate);
            if (parsed !== "" && parsed !== undefined) {
                return parsed;
            }
        }
        return "";
    };

    return {
        min: pickValue(
            range?.min,
            range?.from,
            Array.isArray(range) ? range[0] : undefined,
            salary?.min,
            Array.isArray(salary) ? salary[0] : undefined,
            job.salaryMin
        ),
        max: pickValue(
            range?.max,
            range?.to,
            Array.isArray(range) ? range[1] : undefined,
            salary?.max,
            Array.isArray(salary) ? salary[1] : undefined,
            job.salaryMax
        ),
    };
};

export default function PostJobForm({
    onClose,
    onJobPosted,
    onJobUpdated,
    initialJob = null,
}) {
    const resolvedJobId =
        initialJob?._id?.$oid ||
        initialJob?._id ||
        initialJob?.id?.$oid ||
        initialJob?.id ||
        null;
    const isEditMode = Boolean(resolvedJobId);

    const [title, setTitle] = useState(initialJob?.title || "");
    const [description, setDescription] = useState(
        initialJob?.description || ""
    );
    const [category, setCategory] = useState(initialJob?.category || "");
    const [requiredLanguage, setRequiredLanguage] = useState(
        Array.isArray(initialJob?.requiredLanguages)
            ? initialJob.requiredLanguages[0] || ""
            : ""
    );
    const [grade, setGrade] = useState(initialJob?.grade || "");
    const [skills, setSkills] = useState(
        Array.isArray(initialJob?.skills) ? [...initialJob.skills] : []
    );
    const [availableSkills, setAvailableSkills] = useState([]);
    const initialSalaryRange = deriveInitialSalary(initialJob || {});
    const [salaryMin, setSalaryMin] = useState(
        initialSalaryRange.min !== "" ? String(initialSalaryRange.min) : ""
    );
    const [salaryMax, setSalaryMax] = useState(
        initialSalaryRange.max !== "" ? String(initialSalaryRange.max) : ""
    );
    const [location, setLocation] = useState(initialJob?.location || "");
    const [workType, setWorkType] = useState(
        Array.isArray(initialJob?.workType) ? [...initialJob.workType] : []
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const categoriesOptions = ["Frontend", "Backend", "Fullstack", "DevOps"];
    const languagesOptions = ["JavaScript", "Python", "Java", "C++"];
    const gradeOptions = ["Intern", "Junior", "Middle", "Senior"];
    const workTypeOptions = ["remote", "onsite", "hybrid"];

    useEffect(() => {
        if (initialJob) {
            setTitle(initialJob.title || "");
            setDescription(initialJob.description || "");
            setCategory(initialJob.category || "");
            setRequiredLanguage(
                Array.isArray(initialJob.requiredLanguages)
                    ? initialJob.requiredLanguages[0] || ""
                    : ""
            );
            setGrade(initialJob.grade || "");
            setSkills(
                Array.isArray(initialJob.skills) ? [...initialJob.skills] : []
            );
            setLocation(initialJob.location || "");
            setWorkType(
                Array.isArray(initialJob.workType)
                    ? [...initialJob.workType]
                    : []
            );
            const salaryRange = deriveInitialSalary(initialJob);
            setSalaryMin(
                salaryRange.min !== "" ? String(salaryRange.min) : ""
            );
            setSalaryMax(
                salaryRange.max !== "" ? String(salaryRange.max) : ""
            );
        }
    }, [initialJob]);

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
            const salaryRangePayload = isEditMode
                ? {
                      min: salaryMin !== "" ? salaryMin : "",
                      max: salaryMax !== "" ? salaryMax : "",
                  }
                : {
                      min: salaryMin !== "" ? Number(salaryMin) : null,
                      max: salaryMax !== "" ? Number(salaryMax) : null,
                  };

            const payload = {
                title,
                description,
                requiredLanguages: requiredLanguage ? [requiredLanguage] : [],
                grade,
                skills,
                category: category || "",
                salaryRange: salaryRangePayload,
                location,
                workType: workType ? [...workType] : [],
            };

            let res;
            if (isEditMode && resolvedJobId) {
                res = await api.put(`/jobs/${resolvedJobId}`, payload);
                if (res?.data && onJobUpdated) {
                    onJobUpdated(res.data);
                }
                onClose && onClose();
                if (typeof window !== "undefined") {
                    window.location.reload();
                }
            } else {
                res = await api.post("/jobs", payload);
                if (res.status === 201 || res.status === 200) {
                    onJobPosted && onJobPosted(res.data);
                    onClose && onClose();
                }
            }
        } catch (err) {
            console.error(err);
            setError(
                isEditMode
                    ? "Failed to update job. Try again."
                    : "Failed to post job. Try again."
            );
        } finally {
            setLoading(false);
            if (!isEditMode) {
                window.location.reload();
            }
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
                            <label key={c} className="input-label">
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
                            <label key={l} className="input-label">
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
                                    <label key={s} className="input-label">
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
                            <label key={w} className="input-label">
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
                            {loading
                                ? isEditMode
                                    ? "Saving..."
                                    : "Posting..."
                                : isEditMode
                                ? "Save Changes"
                                : "Post Job"}
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
