import React from "react";
import "./JobDetailModal.css";

export default function JobDetailModal({ job, onClose }) {
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
                    <strong>Type:</strong> {job.workType.join(", ")}
                </p>
                <p>
                    <strong>Salary:</strong> {job.salaryRange.min} –{" "}
                    {job.salaryRange.max}
                </p>

                <p className="modal-description">{job.description}</p>

                <div className="modal-skills">
                    {job.skills.map((skill) => (
                        <span key={skill} className="modal-skill">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
