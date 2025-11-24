import React, { useEffect, useState } from "react";
import JobCard from "../JobCard/JobCard";
import PostJobForm from "../CreateJobForm/CreateJobForm";
import api from "../../axiosConfig";
import "./myJobs.css";

const resolveCompanyId = () => {
    const storedUser = localStorage.getItem("Data");
    if (!storedUser) return null;

    try {
        const parsed = JSON.parse(storedUser);
        if (parsed?._id) {
            return parsed._id.$oid || parsed._id;
        }
    } catch (err) {
        console.error("Failed to parse company data from localStorage", err);
    }

    return null;
};

const formatDate = (value) => {
    if (!value) return "";
    try {
        if (typeof value === "object" && value.$date) {
            return new Date(value.$date).toLocaleDateString();
        }
        return new Date(value).toLocaleDateString();
    } catch {
        return "";
    }
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

const deriveSalaryRange = (job = {}, fallback = {}) => {
    const range = job.salaryRange;
    const salary = job.salary;
    const fallbackRange = fallback.salaryRange;

    const pickValue = (...candidates) => {
        for (const candidate of candidates) {
            const parsed = coerceSalaryValue(candidate);
            if (parsed !== "" && parsed !== undefined) {
                return parsed;
            }
        }
        return "";
    };

    const min = pickValue(
        range?.min,
        range?.from,
        Array.isArray(range) ? range[0] : undefined,
        salary?.min,
        Array.isArray(salary) ? salary[0] : undefined,
        job.salaryMin,
        fallbackRange?.min
    );

    const max = pickValue(
        range?.max,
        range?.to,
        Array.isArray(range) ? range[1] : undefined,
        salary?.max,
        Array.isArray(salary) ? salary[1] : undefined,
        job.salaryMax,
        fallbackRange?.max
    );

    return { min, max };
};

const normalizeJob = (job, fallback = {}) => {
    if (!job) return null;

    const jobId =
        job._id?.$oid ||
        job._id ||
        job.id?.$oid ||
        job.id ||
        job._id?._id ||
        "";

    if (!jobId) {
        return null;
    }

    return {
        ...job,
        _id: jobId,
        workType: Array.isArray(job.workType) ? job.workType : [],
        skills: Array.isArray(job.skills) ? job.skills : [],
        requiredLanguages: Array.isArray(job.requiredLanguages)
            ? job.requiredLanguages
            : [],
        createdAt: formatDate(job.createdAt),
        salaryRange: deriveSalaryRange(job, fallback),
    };
};

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [companyId] = useState(() => resolveCompanyId());
    const [editingJob, setEditingJob] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingJobId, setDeletingJobId] = useState("");

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            if (!companyId) {
                setError("Company ID not found.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/companies/${companyId}/jobs`);
                const rawData = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.jobs)
                      ? response.data.jobs
                      : [];
                const data = rawData.filter(Boolean);
                const normalizedJobs = data
                    .map((job) => normalizeJob(job))
                    .filter(Boolean);
                setJobs(normalizedJobs);
            } catch (err) {
                console.error(err);
                setError("Unable to load jobs right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyJobs();
    }, [companyId]);

    const closeEditor = () => {
        setShowEditForm(false);
        setEditingJob(null);
    };

    const handleEdit = (job) => {
        if (!job) return;
        setActionError("");
        setEditingJob(job);
        setShowEditForm(true);
    };

    const handleJobUpdated = (updatedJob) => {
        const normalized = normalizeJob(updatedJob, editingJob || {});
        if (!normalized) {
            closeEditor();
            return;
        }

        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job._id === normalized._id ? normalized : job
            )
        );
        setActionError("");
        closeEditor();
    };

    const handleDelete = async (jobId) => {
        if (!jobId) return;

        const shouldDelete =
            typeof window !== "undefined"
                ? window.confirm("Delete this job permanently?")
                : true;

        if (!shouldDelete) return;

        setActionError("");
        setDeletingJobId(jobId);

        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs((prevJobs) =>
                prevJobs.filter((job) => job._id !== jobId)
            );
        } catch (err) {
            console.error(err);
            setActionError("Unable to delete this job. Please try again.");
        } finally {
            setDeletingJobId("");
        }
    };

    if (loading) {
        return <div className="myjobs__status">Loading your jobs...</div>;
    }

    if (error) {
        return (
            <div className="myjobs__status myjobs__status--error">{error}</div>
        );
    }

    if (!jobs.length) {
        return (
            <div className="myjobs__status">
                You have not posted any jobs yet.
            </div>
        );
    }

    return (
        <>
            <div className="myjobs">
                {actionError && (
                    <div className="myjobs__status myjobs__status--error">
                        {actionError}
                    </div>
                )}
                {jobs.map((job) => {
                    const status = (job.status || "").toString().toLowerCase();
                    const isRejected = status === "rejected";
                    return (
                        <div className="myjobs__card" key={job._id}>
                            <JobCard
                                job={job}
                                actions={
                                    <>
                                        {!isRejected && (
                                            <button
                                                type="button"
                                                className="myjobs__button"
                                                onClick={() => handleEdit(job)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="myjobs__button myjobs__button--danger"
                                            onClick={() => handleDelete(job._id)}
                                            disabled={
                                                deletingJobId === job._id
                                            }
                                        >
                                            {deletingJobId === job._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </>
                                }
                            />
                        </div>
                    );
                })}
            </div>
            {showEditForm && editingJob && (
                <PostJobForm
                    onClose={closeEditor}
                    initialJob={editingJob}
                    onJobUpdated={handleJobUpdated}
                />
            )}
        </>
    );
}
