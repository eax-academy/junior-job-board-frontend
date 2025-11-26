import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import JobCard from "../../components/JobCard/JobCard";
import UserCard from "../../components/UserCard/UserCard";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import JobDetailModal from "../../components/JobDetailModal/JobDetailModal";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import PostJobForm from "../../components/CreateJobForm/CreateJobForm";
import MyApplications from "../../components/MyApplications/MyApplications";
import MyJobs from "../../components/myJobs/myJobs";
import api from "../../axiosConfig";

import "./Home.css";

export default function Home() {
    const [activeSection, setActiveSection] = useState("home");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [jobList, setJobList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [userData, setData] = useState(null);
    const [role, setRole] = useState(null);
    const [showPostJobForm, setShowPostJobForm] = useState(false);
    const [showMyJobs, setShowMyJobs] = useState(false);
    const [showMyApplications, setShowMyApplications] = useState(false);

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

    const buildUsersUrl = (filterObj = {}, search = "") => {
        const { language = "", seniority = [], skills = [] } = filterObj;
        let params = [];
        if (language) params.push(`languages=${language}`);
        if (seniority.length) params.push(`seniority=${seniority.join(",")}`);
        if (skills.length) params.push(`skills=${skills.join(",")}`);
        if (search) params.push(`search=${search}`);
        params.push("page=1");
        return `/users?${params.join("&")}`;
    };

    const fetchJobs = async (filterObj = {}, search = "") => {
        try {
            const url = buildJobsUrl(filterObj, search);
            const res = await api.get(url);
            if (res.status === 200 && res.data) {
                const data = Object.values(res.data).map((job) => ({
                    ...job,
                    workType: Array.isArray(job.workType) ? job.workType : [],
                    skills: Array.isArray(job.skills) ? job.skills : [],
                    requiredLanguages: Array.isArray(job.requiredLanguages)
                        ? job.requiredLanguages
                        : [],
                    createdAt: job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "",
                }));
                setJobList(data);
            }
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        }
    };

    const fetchUsers = async (filterObj = {}, search = "") => {
        try {
            const url = buildUsersUrl(filterObj, search);
            const res = await api.get(url);
            if (res.status === 200 && res.data) {
                const data = Object.values(res.data).map((user) => ({
                    ...user,
                    programmingLanguages: Array.isArray(user.programmingLanguages)
                        ? user.programmingLanguages
                        : [],
                    skills: Array.isArray(user.skills) ? user.skills : [],
                    category: Array.isArray(user.category) ? user.category : [],
                    createdAt: user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "",
                }));
                setUserList(data);
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    const fetchCompanies = async () => {
        try {
            const res = await api.get("/companies?page=1");
            if (res.status === 200 && res.data) {
                const data = Object.values(res.data).map((company) => ({
                    ...company,
                    createdAt: company.createdAt
                        ? new Date(company.createdAt).toLocaleDateString()
                        : "",
                }));
                setCompanyList(data);
            }
        } catch (err) {
            console.error("Failed to fetch companies:", err);
        }
    };

    useEffect(() => {
        if (activeSection === "home") fetchJobs();
        if (activeSection === "resumes") fetchUsers();
        if (activeSection === "company") fetchCompanies();
    }, [activeSection]);

    useEffect(() => {
        const storedRole = localStorage.getItem("Role");
        setRole(storedRole);
        const storedUser = localStorage.getItem("Data");
        if (storedUser) setData(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        if (searchTerm.trim() !== "") {
            if (activeSection === "home") fetchJobs(appliedFilters, searchTerm);
            if (activeSection === "resumes")
                fetchUsers(appliedFilters, searchTerm);
        }
    }, [searchTerm, activeSection]);

    const handleSectionChange = (section) => setActiveSection(section);
    const handleSearchChange = (term) => setSearchTerm(term);
    const handleOpenModal = (item) => setSelectedItem(item);
    const handleCloseModal = () => setSelectedItem(null);
    const handleApplyFilters = (appliedFilters) => {
        if (activeSection === "home") fetchJobs(appliedFilters, searchTerm);
        if (activeSection === "resumes") fetchUsers(appliedFilters, searchTerm);
        setAppliedFilters(appliedFilters);
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
                            onClick={() => {
                                setShowMyJobs((prev) => !prev);
                                setShowMyApplications(false);
                            }}
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
                {role === "user" && (
                    <button
                        className={`home__post-job-btn ${
                            showMyApplications ? "is-active" : ""
                        }`}
                        onClick={() => {
                            setShowMyApplications((prev) => !prev);
                            setShowMyJobs(false);
                        }}
                    >
                        {showMyApplications ? "All Jobs" : "My Applications"}
                    </button>
                )}

                <SearchBar value={searchTerm} onChange={handleSearchChange} />
            </div>

            <div className="home__content">
                {activeSection === "home" || activeSection === "resumes" ? (
                    <div className="home__filters">
                        <FilterPanel
                            filters={filters}
                            jobList={jobList}
                            onApply={handleApplyFilters}
                        />
                    </div>
                ) : null}

                <div className="home__jobs">
                    {showMyApplications ? (
                        <MyApplications
                            userId={userData?._id.$oid}
                            onJobClick={handleOpenModal}
                        />
                    ) : showMyJobs && activeSection === "home" ? (
                        <MyJobs />
                    ) : (
                        <>
                            <div>
                                <h2>
                                    {activeSection === "home"
                                        ? `${jobList.length} Jobs Found`
                                        : activeSection === "resumes"
                                        ? `${userList.length} Users Found`
                                        : `${companyList.length} Companies Found`}
                                </h2>
                            </div>
                            <div className="job-listings">
                                {activeSection === "home" &&
                                    (jobList.length ? (
                                        jobList.map((job, i) => (
                                            <JobCard
                                                key={`${job._id}-${job.title}-${i}`}
                                                job={job}
                                                onClick={handleOpenModal}
                                            />
                                        ))
                                    ) : (
                                        <div>No jobs found.</div>
                                    ))}
                                {activeSection === "resumes" &&
                                    (userList.length ? (
                                        userList.map((user, i) => (
                                            <UserCard
                                                key={`${user._id || "no-id"}-${
                                                    user.email || i
                                                }`}
                                                user={user}
                                                onClick={handleOpenModal}
                                            />
                                        ))
                                    ) : (
                                        <div>No users found.</div>
                                    ))}
                                {activeSection === "company" &&
                                    (companyList.length ? (
                                        companyList.map((comp, i) => (
                                            <CompanyCard
                                                key={`${comp._id || "no-id"}-${
                                                    comp.name || i
                                                }`}
                                                company={comp}
                                                onClick={handleOpenModal}
                                            />
                                        ))
                                    ) : (
                                        <div>No companies found.</div>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selectedItem && (
                <JobDetailModal job={selectedItem} onClose={handleCloseModal} />
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
                                    ? new Date(newJob.createdAt).toLocaleDateString()
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
