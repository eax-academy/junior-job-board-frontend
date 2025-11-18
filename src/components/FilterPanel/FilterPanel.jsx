import React, { useState, useEffect } from "react";
import {
    categories,
    languages,
    seniorityLevels,
    skillsMap,
} from "../../data/filterData";
import "./FilterPanel.css";
export default function FilterPanel({ filters, onApply, jobList }) {
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || ""
    );
    const [selectedLanguage, setSelectedLanguage] = useState(
        filters.language || ""
    );
    const [selectedSeniority, setSelectedSeniority] = useState(
        filters.seniority || []
    );
    const [selectedSkills, setSelectedSkills] = useState(filters.skills || []);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [salaryMin, setSalaryMin] = useState(filters.salary?.[0] ?? "");
    const [salaryMax, setSalaryMax] = useState(filters.salary?.[1] ?? "");

    useEffect(() => {
        if (selectedCategory && selectedLanguage) {
            const skills =
                skillsMap[selectedLanguage]?.[selectedCategory] || [];
            setAvailableSkills(skills);
            setSelectedSkills((prev) => prev.filter((s) => skills.includes(s)));
        } else {
            setAvailableSkills([]);
            setSelectedSkills([]);
        }
    }, [selectedCategory, selectedLanguage]);

    const toggleSelection = (value, stateArray, setState) => {
        if (stateArray.includes(value))
            setState(stateArray.filter((v) => v !== value));
        else setState([...stateArray, value]);
    };

    const handleApply = () => {
        const updatedFilters = {
            category: selectedCategory || "",
            language: selectedLanguage || "",
            seniority: selectedSeniority,
            skills: selectedSkills,
            salary: [
                salaryMin !== "" ? Number(salaryMin) : null,
                salaryMax !== "" ? Number(salaryMax) : null,
            ],
        };
        onApply(updatedFilters);
    };

    return (
        <div className="filter-panel-vertical">
            <div className="filter-field">
                <p className="filter-title">Category</p>
                {categories.map((cat) => (
                    <label key={cat} className="filter-checkbox">
                        <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                        />
                        <span className="checkbox-square"></span>
                        <span className="checkbox-label">{cat}</span>
                        {selectedCategory === cat && (
                            <span className="selected-bird"></span>
                        )}
                    </label>
                ))}
            </div>

            <div className="filter-field">
                <p className="filter-title">Language</p>
                {languages.map((lang) => (
                    <label key={lang} className="filter-checkbox">
                        <input
                            type="radio"
                            name="language"
                            checked={selectedLanguage === lang}
                            onChange={() => setSelectedLanguage(lang)}
                        />
                        <span className="checkbox-square"></span>
                        <span className="checkbox-label">{lang}</span>
                        {selectedLanguage === lang && (
                            <span className="selected-bird"></span>
                        )}
                    </label>
                ))}
            </div>

            <div className="filter-field">
                <p className="filter-title">Seniority</p>
                {seniorityLevels.map((level) => (
                    <label key={level} className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedSeniority.includes(level)}
                            onChange={() =>
                                toggleSelection(
                                    level,
                                    selectedSeniority,
                                    setSelectedSeniority
                                )
                            }
                        />
                        <span className="checkbox-square"></span>
                        <span className="checkbox-label">{level}</span>
                        {selectedSeniority.includes(level) && (
                            <span className="selected-bird"></span>
                        )}
                    </label>
                ))}
            </div>

            {availableSkills.length > 0 && (
                <div className="filter-field">
                    <p className="filter-title">Skills</p>
                    {availableSkills.map((skill) => (
                        <label key={skill} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedSkills.includes(skill)}
                                onChange={() =>
                                    toggleSelection(
                                        skill,
                                        selectedSkills,
                                        setSelectedSkills
                                    )
                                }
                            />
                            <span className="checkbox-square"></span>
                            <span className="checkbox-label">{skill}</span>
                            {selectedSkills.includes(skill) && (
                                <span className="selected-bird"></span>
                            )}
                        </label>
                    ))}
                </div>
            )}

            <div className="filter-field">
                <p className="filter-title">Salary Range</p>
                <div className="salary-inputs">
                    <input
                        type="number"
                        placeholder="Min"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                    />
                </div>
            </div>

            <button className="apply-btn" onClick={handleApply}>
                Apply
            </button>
        </div>
    );
}
