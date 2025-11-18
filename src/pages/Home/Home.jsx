import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import JobCard from "../../components/JobCard/JobCard";
import JobDetailModal from "../../components/JobDetailModal/JobDetailModal";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import PostJobForm from "../../components/CreateJobForm/CreateJobForm";
import api from "../../axiosConfig";
import "./Home.css";

export default function Home() {
    const [activeSection, setActiveSection] = useState("home");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobList, setJobList] = useState([]);
    const [userData, setData] = useState(null);
    const [role, setRole] = useState(localStorage.getItem("Role") || null);
    const [showPostJobForm, setShowPostJobForm] = useState(false);

    const [filters, setFilters] = useState({
        category: "",
        language: "",
        seniority: [],
        skills: [],
        salary: [null, null],
    });

    const [appliedFilters, setAppliedFilters] = useState({});

    // ==========================
    // BUILD URL FOR API REQUEST
    // ==========================
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

    // ==========================
    // FETCH JOBS
    // ==========================
    const fetchJobs = async (filterObj = {}, search = "") => {
        try {
            const url = buildJobsUrl(filterObj, search);
            console.log("Fetching jobs with URL:", url);
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
                    job.createdAt = new Date(
                        job.createdAt
                    ).toLocaleDateString();
                    return job;
                });
                setJobList(data);
            }
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        }
    };

    // ==========================
    // INITIAL LOAD
    // ==========================
    useEffect(() => {
        fetchJobs();
        console.log("Job fetch initiated");
        console.log("JOBS COUNT", jobList.length);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("Data");
        if (storedUser) {
            setData(JSON.parse(storedUser));
        }
    }, []);

    // ==========================
    // SEARCH
    // ==========================
    useEffect(() => {
        if (searchTerm.trim() !== "") {
            fetchJobs(appliedFilters, searchTerm);
        }
        console.log("Search initiated with term:", searchTerm);
    }, [searchTerm]);

    // ==========================
    // HANDLER FUNCTIONS
    // ==========================
    const handleSectionChange = (section) => setActiveSection(section);
    const handleSearchChange = (term) => setSearchTerm(term);

    const handleOpenModal = (job) => setSelectedJob(job);
    const handleCloseModal = () => setSelectedJob(null);

    const handleApplyFilters = (appliedFilters) => {
        fetchJobs(appliedFilters, searchTerm);
    };

    // ==========================
    // RENDER
    // ==========================
    return (
        <div className="home">
            <Navbar
                active={activeSection}
                onChangeActive={handleSectionChange}
                userData={userData}
            />

            <div className="home__topbar">
                {role === "company" && (
                    <button
                        className="home__post-job-btn"
                        onClick={() => setShowPostJobForm(true)}
                    >
                        Post Job
                    </button>
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
                    <div className="">
                        <h2>{jobList.length} Jobs Found </h2>
                    </div>
                    <div className="job-listings">
                        {jobList?.length ? (
                            jobList.map((job, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleOpenModal(job)}
                                >
                                    <JobCard job={job} />
                                </div>
                            ))
                        ) : (
                            <div>No jobs found.</div>
                        )}
                    </div>
                </div>
            </div>
            {/* modal window */}
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
                                createdAt: new Date(
                                    newJob.createdAt
                                ).toLocaleDateString(),
                            },
                            ...jobList,
                        ])
                    }
                />
            )}
        </div>
    );
}
