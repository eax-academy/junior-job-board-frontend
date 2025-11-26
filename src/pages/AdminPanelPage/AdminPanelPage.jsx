import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import JobCard from "../../components/JobCard/JobCard";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import "./AdminPanelPage.css";

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/admin/jobs/pending");
            setJobs(res.data || []);
        } catch (e) {
            console.error("Error fetching jobs:", e);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get("/admin/applications/pending");
            setApplications(res.data || []);
        } catch (e) {
            console.error("Error fetching applications:", e);
        }
    };

    const approveJob = async (id) => {
        try {
            await api.patch(`/admin/jobs/${id}/approve`);
        } catch (e) {
            console.error("Error approving job:", e);
        }
        fetchJobs();
    };

    const rejectJob = async (id) => {
        try {
            await api.patch(`/admin/jobs/${id}/reject`);
        } catch (e) {
            console.error("Error rejecting job:", e);
        }
        fetchJobs();
    };

    const approveApp = async (id) => {
        try {
            await api.patch(`/admin/applications/${id}/approve`);
        } catch (e) {
            console.error("Error approving application:", e);
        }
        fetchApplications();
    };

    const rejectApp = async (id) => {
        try {
            await api.patch(`/admin/applications/${id}/reject`);
        } catch (e) {
            console.error("Error rejecting application:", e);
        }
        fetchApplications();
    };

    useEffect(() => {
        if (mode === "jobs") fetchJobs();
        if (mode === "applications") fetchApplications();
    }, [mode]);

    return (
        <div className="admin">
            <div className="admin__top">
                <button className="admin__back-btn" onClick={() => navigate("/")}>
                    Back
                </button>
                <h1 className="admin__heading">
                    Admin — {mode === "jobs" ? "Pending Jobs" : "Pending Applications"}
                </h1>

                <div className="admin__tabs">
                    <button
                        className={`admin__tab ${mode === "jobs" ? "active" : ""}`}
                        onClick={() => setMode("jobs")}
                    >
                        Jobs
                    </button>

                    <button
                        className={`admin__tab ${mode === "applications" ? "active" : ""}`}
                        onClick={() => setMode("applications")}
                    >
                        Applications
                    </button>
                </div>
            </div>

            <div className="admin__grid">
                {mode === "jobs" &&
                    jobs.map((job, index) => {
                        const id = job._id?.$oid || job.id?.$oid || job._id;
                        return (
                            <JobCard
                                key={`${id}-${index}`}
                                job={job}
                                actions={
                                    <div className="admin__actions">
                                        <button
                                            className="admin__approve"
                                            onClick={() => approveJob(id)}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="admin__reject"
                                            onClick={() => rejectJob(id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                }
                            />
                        );
                    })}

                {mode === "applications" &&
                    applications.map((app, index) => {
                        const id =
                            app._id?.$oid ||
                            app.id?.$oid ||
                            app._id;

                        return (
                            <ApplicationCard
                                key={`${id}-${index}`}
                                application={app}
                                actions={
                                    <div className="admin__actions">
                                        <button
                                            className="admin__approve"
                                            onClick={() => approveApp(id)}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="admin__reject"
                                            onClick={() => rejectApp(id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                }
                            />
                        );
                    })}

                {mode === "jobs" && jobs.length === 0 && (
                    <div className="admin__empty">No pending jobs</div>
                )}

                {mode === "applications" && applications.length === 0 && (
                    <div className="admin__empty">No pending applications</div>
                )}
            </div>
        </div>
    );
}
