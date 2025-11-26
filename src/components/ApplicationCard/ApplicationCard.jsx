import React from "react";
import "./ApplicationCard.css";

export default function ApplicationCard({ application, actions }) {
    const id =
        application._id?.$oid ||
        application.id?.$oid ||
        application._id ||
        application.id;

    return (
        <div className="appcard">
            <div className="appcard__info">
                <h3 className="appcard__title">{application.jobTitle}</h3>
                <p className="appcard__company">{application.companyName}</p>

                <p className="appcard__status">
                    Status: <strong>{application.status}</strong>
                </p>

                <p className="appcard__date">
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                </p>
            </div>

            {actions && <div className="appcard__actions">{actions}</div>}
        </div>
    );
}
