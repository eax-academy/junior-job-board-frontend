import React, { useEffect, useState } from "react";
import api from "../../axiosConfig";
import "./MyApplications.css";

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("Data"));

    useEffect(() => {
        async function fetchApps() {
            try {
                const res = await api.get(`/applications/user/${user._id.$oid}`);
                setApplications(res.data);
            } catch (err) {
                setError("Failed to load applications");
            } finally {
                setLoading(false);
            }
        }
        fetchApps();
    }, []);

    if (loading) return <div className="myapps__status">Loading...</div>;
    if (error) return <div className="myapps__status myapps__status--error">{error}</div>;
    if (!applications.length)
        return <div className="myapps__status">You have no applications yet.</div>;

    return (
        <div className="myapps">
            <h2 className="myapps__title">My Applications</h2>
            <div className="myapps__list">
                {applications.map((app) => (
                    <div key={app._id.$oid} className="myapps__item">
                        <h3 className="myapps__job-title">{app.jobTitle}</h3>
                        <p className="myapps__company">{app.companyName}</p>
                        <p className="myapps__status-text">
                            Status: <strong>{app.status}</strong>
                        </p>
                        <p className="myapps__date">
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
