import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSubmit }) {
    return (
        <div className="searchbar">
            <div className="searchbar_container">
                <input
                    type="text"
                    className="searchbar__input"
                    placeholder="Search for jobs or profiles..."
                    value={value}
                    onChange={onChange}
                />
                <button className="searchbar__button" onClick={onSubmit}>
                    Search
                </button>
            </div>
        </div>
    );
}
