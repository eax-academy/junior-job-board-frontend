import "./JobCard.css";

export default function JobCard({ job, actions, onClick }) {
    const workType = Array.isArray(job.workType) ? job.workType : [];

    const createdAt = job?.createdAt?.$date
        ? new Date(job.createdAt.$date).toLocaleString()
        : job.createdAt || "";

    return (
        <div
            className="jobcard"
            onClick={onClick ? () => onClick(job) : undefined}
        >
            <div className="jobcard__header">
                <div className="jobcard__header__left">
                    <div className="jobcard__logo">
                        <img
                            src="/assets/images/CompanyLogo.svg"
                            alt="CompanyLogo"
                        />
                    </div>
                    <div className="jobcard__info">
                        <h3 className="jobcard__title">{job.title}</h3>
                        <p className="jobcard__location">{job.location}</p>
                    </div>
                </div>

                <img
                    className="jobcard__more"
                    src="/assets/images/3dots.svg"
                    alt="more"
                />
            </div>

            <div className="jobcard__details">
                <p className="jobcard__grade">{job.grade}</p>
                <p className="jobcard__worktype">{workType.join(", ")}</p>
                <p className="jobcard__salary">
                    {job.salaryRange?.min || ""} – {job.salaryRange?.max || ""}
                </p>
            </div>

            <p className="jobcard__description">{job.description}</p>

            <div className="jobcard__skills">
                {Array.isArray(job.skills) &&
                    job.skills.map((skill, idx) => (
                        <span
                            key={`${job._id || job.id}-skill-${idx}`}
                            className="jobcard__skill-item"
                        >
                            {skill}
                        </span>
                    ))}
            </div>

            <div className="jobcard__footer">
                <p className="jobcard__date">{createdAt}</p>
                {actions ? (
                    <div className="jobcard__actions">{actions}</div>
                ) : (
                    <img
                        className="jobcard__save"
                        src="/assets/images/saveButton.svg"
                        alt="save"
                    />
                )}
            </div>
        </div>
    );
}
