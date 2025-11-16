import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import JobCard from "../../components/JobCard/JobCard";
import JobDetailModal from "../../components/JobDetailModal/JobDetailModal";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import api from "../../axiosConfig";

import "./Home.css";

export default function Home() {
    const [activeSection, setActiveSection] = useState("home");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobList, setJobList] = useState([]);

    const [filters, setFilters] = useState({
        category: "",
        language: [],
        seniority: "",
        skills: [],
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    // ==========================
    // BUILD URL FOR API REQUEST
    // ==========================
    const buildJobsUrl = (filterObj) => {
        let url = "/jobs?";
        if (filterObj.language.length)
            url += `languages=${filterObj.language.join(",")}&`;
        if (filterObj.seniority) url += `seniority=${filterObj.seniority}&`;
        if (filterObj.category) url += `category=${filterObj.category}&`;
        if (searchTerm) url += `search=${searchTerm}&`;
        url += "page=1";
        return url;
    };

    // ==========================
    // FETCH JOBS
    // ==========================
    useEffect(() => {
        const url = buildJobsUrl(appliedFilters);
        api.get(url).then((response) => {
            if (response.status === 200) {
                setJobList(response.data);
            }
        });
    }, [appliedFilters, searchTerm]);

    // ==========================
    // HANDLER FUNCTIONS
    // ==========================
    const handleSectionChange = (section) => setActiveSection(section);
    const handleSearchChange = (term) => setSearchTerm(term);
    const handleOpenModal = (job) => setSelectedJob(job);
    const handleCloseModal = () => setSelectedJob(null);

    const handleFilterChange = (type, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (type === "language") {
                if (prev.language.includes(value)) {
                    newFilters.language = prev.language.filter(
                        (l) => l !== value
                    );
                } else {
                    newFilters.language.push(value);
                }
            } else {
                newFilters[type] = value;
            }
            return newFilters;
        });
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters); // применяем выбранные фильтры
    };

    // ==========================
    // RENDER
    // ==========================
    return (
        <div className="home">
            <Navbar
                active={activeSection}
                onChangeActive={handleSectionChange}
            />
            <div className="home__topbar">
                <button className="home__post-job-btn">Post job</button>
                <SearchBar value={searchTerm} onChange={handleSearchChange} />
            </div>

            <div className="home__content">
                <div className="home__filters">
                    <FilterPanel
                        filters={filters}
                        jobList={jobList} 
                        onChangeFilter={handleFilterChange}
                    />
                    <button
                        className="filter-apply-btn"
                        onClick={handleApplyFilters}
                    >
                        Apply
                    </button>
                </div>

                <div className="home__jobs">
                    <div className="job-listings">
                        {jobList.length ? (
                            jobList.map((job, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleOpenModal(job)}
                                >
                                    <JobCard job={job} />
                                </div>
                            ))
                        ) : (
                            <div>Loading jobs...</div>
                        )}
                    </div>
                </div>
            </div>

            {selectedJob && (
                <JobDetailModal job={selectedJob} onClose={handleCloseModal} />
            )}
        </div>
    );
}
