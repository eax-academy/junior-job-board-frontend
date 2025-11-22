import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import JobCard from "../../components/JobCard/JobCard";
import "./AdminPanelPage.css";
import importJobs from "../../data/jobsMock.js";

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/pending-jobs");
            if (res && res.data && res.data.length) {
                setJobs(res.data);
                return;
            }
        } catch (e) {
            console.error("Error fetching jobs:", e);
        }
        if (Array.isArray(importJobs)) {
            setJobs(importJobs); // Fallback to mock data if API call fails
        }
    };

    const approveJob = async (id) => {
        try {
            await api.post(`/approve-job/${id}`);
        } catch (e) {
            console.error("Error approving job:", e);
        }
        fetchJobs();
    };

    const rejectJob = async (id) => {
        try {
            await api.post(`/reject-job/${id}`);
        } catch (e) {
            console.error("Error rejecting job:", e);
        }
        fetchJobs();
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="admin">
            <div className="admin__top">
                <button
                    className="admin__back-btn"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>
                <h1 className="admin__heading">Admin — Pending Jobs</h1>
            </div>

            <div className="admin__grid">
                {jobs.map((job,index) => (
                    <JobCard
                        key={`${job._id || job.id}-${index}`}
                        job={job}
                        actions={
                            <div className="admin__actions">
                                <button
                                    className="admin__approve"
                                    onClick={() =>
                                        approveJob(job._id || job.id)
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    className="admin__reject"
                                    onClick={() => rejectJob(job._id || job.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        }
                    />
                ))}
                {jobs.length === 0 && (
                    <div className="admin__empty">No pending jobs</div>
                )}
            </div>
        </div>
    );
}
