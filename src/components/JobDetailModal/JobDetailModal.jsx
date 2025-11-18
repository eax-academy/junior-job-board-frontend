import React from "react";
import "./JobDetailModal.css";

export default function JobDetailModal({ job, onClose }) {
    const workType = Array.isArray(job.workType) ? job.workType : [];
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const salaryMin = job.salaryRange?.min ?? "";
    const salaryMax = job.salaryRange?.max ?? "";

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
                        <span key={`${job.id}-skill-${idx}`} className="modal-skill">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
