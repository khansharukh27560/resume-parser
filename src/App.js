import { useEffect, useState } from "react";
import { getResume, getResumes, parseResume, deleteResume } from "../src/resume-parser/api";
import UploadForm from "./resume-parser/components/UploadForm";
import ResumeList from "./resume-parser/components/ResumeList";
import ResumeDetails from "./resume-parser/components/ResumeDetails";


export default function App() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [parsingUuid, setParsingUuid] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadResumes = async (query = "") => {
    try {
      setLoadingList(true);
      setError("");
      const result = await getResumes(1, 20, query);
      setResumes(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  const loadResumeDetails = async (uuid) => {
    try {
      setLoadingDetails(true);
      setError("");
      const result = await getResume(uuid);
      setSelectedResume(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUploadSuccess = async (uploaded) => {
    setMessage(`Resume uploaded: ${uploaded.filename}`);
    setError("");
    await loadResumes(search);
  };

  const handleParse = async (uuid) => {
    try {
      setParsingUuid(uuid);
      setMessage("");
      setError("");

      await parseResume(uuid);
      setMessage("Resume parsed successfully");

      await loadResumes(search);
      await loadResumeDetails(uuid);
    } catch (err) {
      setError(err.message);
    } finally {
      setParsingUuid("");
    }
  };

  const handleDelete = async (uuid) => {
    const confirmed = window.confirm("Are you sure you want to delete this resume?");
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await deleteResume(uuid);

      if (selectedResume?.uuid === uuid) {
        setSelectedResume(null);
      }

      setMessage("Resume deleted successfully");
      await loadResumes(search);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadResumes(search);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Resume Parser Dashboard</h1>
          <p>Upload image or document resume, parse it, and review extracted data.</p>
        </div>
      </header>

      <div className="alert-stack">
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
      </div>

      <section className="panel">
        <h2>Upload Resume</h2>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </section>

      <section className="panel">
        <div className="panel-row">
          <h2>All Resumes</h2>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by filename or parsed content"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              className="secondary"
              onClick={async () => {
                setSearch("");
                await loadResumes("");
              }}
            >
              Reset
            </button>
          </form>
        </div>

        <div className="content-grid">
          <div className="left-column">
            <ResumeList
              resumes={resumes}
              loading={loadingList}
              selectedUuid={selectedResume?.uuid}
              onSelect={loadResumeDetails}
              onParse={handleParse}
              onDelete={handleDelete}
              parsingUuid={parsingUuid}
            />
          </div>

          <div className="right-column">
            <ResumeDetails
              resume={selectedResume}
              loading={loadingDetails}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
