import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import JobCard from "../../components/JobCard/JobCard";
import JobDetailModal from "../../components/JobDetailModal/JobDetailModal";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import PostJobForm from "../../components/CreateJobForm/CreateJobForm";
import MyJobs from "../../components/myJobs/myJobs";
import api from "../../axiosConfig";
import "./Home.css";

export default function Home() {
    const [activeSection, setActiveSection] = useState("home");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobList, setJobList] = useState([]);
    const [userData, setData] = useState(null);
    const [role, setRole] = useState(null);
    const [showPostJobForm, setShowPostJobForm] = useState(false);
    const [showMyJobs, setShowMyJobs] = useState(false);

    const [filters, setFilters] = useState({
        category: "",
        language: "",
        seniority: [],
        skills: [],
        salary: [null, null],
    });

    const [appliedFilters, setAppliedFilters] = useState({});

    const buildJobsUrl = (filterObj = {}, search = "") => {
        const {
            language = "",
            seniority = [],
            category = "",
            skills = [],
            salary = [null, null],
        } = filterObj;

        let params = [];
        if (language) params.push(`language=${language}`);
        if (seniority.length) params.push(`grade=${seniority.join(",")}`);
        if (category) params.push(`category=${category}`);
        if (skills.length) params.push(`skills=${skills.join(",")}`);
        if (salary[0] !== null || salary[1] !== null) {
            const min = salary[0] !== null ? salary[0] : "";
            const max = salary[1] !== null ? salary[1] : "";
            params.push(`salary=[${min},${max}]`);
        }
        if (search) params.push(`search=${search}`);
        params.push("page=1");

        return `/jobs?${params.join("&")}`;
    };

    const fetchJobs = async (filterObj = {}, search = "") => {
        try {
            const url = buildJobsUrl(filterObj, search);
            const response = await api.get(url);
            if (response.status === 200) {
                let data = Object.values(response.data).map((job) => {
                    job.workType = Array.isArray(job.workType)
                        ? job.workType
                        : [];
                    job.skills = Array.isArray(job.skills) ? job.skills : [];
                    job.requiredLanguages = Array.isArray(job.requiredLanguages)
                        ? job.requiredLanguages
                        : [];
                    job.createdAt = job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "";
                    return job;
                });
                setJobList(data);
            }
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        }
    };

    useEffect(() => {
        fetchJobs();
        const storedRole = localStorage.getItem("Role");
        setRole(storedRole);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("Data");
        if (storedUser) {
            setData(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (searchTerm.trim() !== "") {
            fetchJobs(appliedFilters, searchTerm);
        }
    }, [searchTerm]);

    const handleSectionChange = (section) => setActiveSection(section);
    const handleSearchChange = (term) => setSearchTerm(term);

    const handleOpenModal = (job) => setSelectedJob(job);
    const handleCloseModal = () => setSelectedJob(null);

    const handleApplyFilters = (appliedFilters) => {
        fetchJobs(appliedFilters, searchTerm);
    };

    const handleLogout = () => {
        localStorage.clear();
        setData(null);
        setRole(null);
        window.location.reload();
    };

    return (
        <div className="home">
            <Navbar
                active={activeSection}
                onChangeActive={handleSectionChange}
                userData={userData}
                handleLogout={handleLogout}
            />

            <div className="home__topbar">
                {role === "company" && (
                    <>
                        <button
                            className="home__post-job-btn"
                            onClick={() => setShowPostJobForm(true)}
                        >
                            Post Job
                        </button>

                        <button
                            className={`home__post-job-btn ${
                                showMyJobs ? "is-active" : ""
                            }`}
                            onClick={() => setShowMyJobs((prev) => !prev)}
                        >
                            {showMyJobs ? "All Jobs" : "My Jobs"}
                        </button>
                    </>
                )}

                {role === "admin" && (
                    <>
                        <button
                            className="home__post-job-btn home__admin-btn"
                            onClick={() => (window.location.href = "/admin")}
                        >
                            Admin Panel
                        </button>

                        <button
                            className="home__post-job-btn"
                            onClick={() => setShowPostJobForm(true)}
                        >
                            Post Job
                        </button>
                    </>
                )}

                <SearchBar value={searchTerm} onChange={handleSearchChange} />
            </div>

            <div className="home__content">
                <div className="home__filters">
                    <FilterPanel
                        filters={filters}
                        jobList={jobList}
                        onApply={handleApplyFilters}
                    />
                </div>

                <div className="home__jobs">
                    {showMyJobs ? (
                        <MyJobs />
                    ) : (
                        <>
                            <div className="">
                                <h2>{jobList.length} Jobs Found </h2>
                            </div>
                            <div className="job-listings">
                                {jobList?.length ? (
                                    jobList.map((job, i) => (
                                        <JobCard
                                            key={job._id || i}
                                            job={job}
                                            onClick={handleOpenModal}
                                        />
                                    ))
                                ) : (
                                    <div>No jobs found.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selectedJob && (
                <JobDetailModal job={selectedJob} onClose={handleCloseModal} />
            )}

            {showPostJobForm && (
                <PostJobForm
                    onClose={() => setShowPostJobForm(false)}
                    onJobPosted={(newJob) =>
                        setJobList([
                            {
                                ...newJob,
                                workType: Array.isArray(newJob.workType)
                                    ? newJob.workType
                                    : [],
                                skills: Array.isArray(newJob.skills)
                                    ? newJob.skills
                                    : [],
                                requiredLanguages: Array.isArray(
                                    newJob.requiredLanguages
                                )
                                    ? newJob.requiredLanguages
                                    : [],
                                createdAt: newJob.createdAt
                                    ? new Date(
                                          newJob.createdAt
                                      ).toLocaleDateString()
                                    : "",
                            },
                            ...jobList,
                        ])
                    }
                />
            )}
        </div>
    );
}
