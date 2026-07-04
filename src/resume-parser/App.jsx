import { useEffect, useState } from "react";
import { getResume, getResumes, parseResume, deleteResume } from "./api";
import UploadForm from "./components/UploadForm";

import ResumeDetails from "./components/ResumeDetails";
import ResumeList from "./components/ResumeList";
import '../styles.css'

export default function App() {
  // ---------- State ----------
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [parsingUuid, setParsingUuid] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Log whenever selectedResume changes
  useEffect(() => {
    console.log("🧩 [App] selectedResume updated:", selectedResume);
  }, [selectedResume]);

  // ---------- Load resumes (list) ----------
  const loadResumes = async (query = "") => {
    console.log("📋 [loadResumes] Called with query:", query);
    try {
      setLoadingList(true);
      setError("");
      console.log("📋 [loadResumes] Fetching resumes...");
      const result = await getResumes(1, 20, query);
      console.log("📋 [loadResumes] Raw API result:", result);

      // Extract list – handle nested data structure
const resumeList = result.data?.data || [];
      console.log("📋 [loadResumes] Extracted resume list:", resumeList);//data nahi aa rha h
      console.log("📋 [loadResumes] Number of resumes:", resumeList.length);//data nahi aa rha h

      setResumes(resumeList);
    } catch (err) {
      console.error("❌ [loadResumes] Error:", err.message);
      setError(err.message);
    } finally {
      setLoadingList(false);
      console.log("📋 [loadResumes] Finished (loadingList = false)");
    }
  };

  // ---------- Load single resume details ----------
  const loadResumeDetails = async (uuid) => {
    console.log("🔍 [loadResumeDetails] Called with uuid:", uuid);
    try {
      setLoadingDetails(true);
      setError("");
      console.log("🔍 [loadResumeDetails] Fetching details...");
      const result = await getResume(uuid);
      console.log("🔍 [loadResumeDetails] Raw details result:", result);
      const details = result.data;
      console.log("🔍 [loadResumeDetails] Extracted details:", details);
      setSelectedResume(details);
    } catch (err) {
      console.error("❌ [loadResumeDetails] Error:", err.message);
      setError(err.message);
    } finally {
      setLoadingDetails(false);
      console.log("🔍 [loadResumeDetails] Finished (loadingDetails = false)");
    }
  };

  // ---------- Upload success ----------
  const handleUploadSuccess = async (uploaded) => {
    console.log("📤 [handleUploadSuccess] Uploaded object:", uploaded);
    setMessage(`Resume uploaded: ${uploaded.filename}`);
    setError("");
    await loadResumes(search);
    console.log("📤 [handleUploadSuccess] Reloaded list after upload");
  };

  // ---------- Parse resume ----------
  const handleParse = async (uuid) => {
    console.log("⚙️ [handleParse] Called with uuid:", uuid);
    try {
      setParsingUuid(uuid);
      setMessage("");
      setError("");

      console.log("⚙️ [handleParse] Calling parseResume...");
      const parseResult = await parseResume(uuid);
      console.log("⚙️ [handleParse] Parse result in app:", parseResult);

      setMessage("Resume parsed successfully");
      console.log("⚙️ [handleParse] Parse successful, reloading list and details...");

      // Reload list and details
      await loadResumes(search);
      await loadResumeDetails(uuid);
      console.log("⚙️ [handleParse] Reload complete");
    } catch (err) {
      console.error("❌ [handleParse] Error:", err.message);
      setError(err.message);
    } finally {
      setParsingUuid("");
      console.log("⚙️ [handleParse] Finished (parsingUuid reset)");
    }
  };

  // ---------- Delete resume ----------
  const handleDelete = async (uuid) => {
    console.log("🗑️ [handleDelete] Called with uuid:", uuid);
    const confirmed = window.confirm("Are you sure you want to delete this resume?");
    if (!confirmed) {
      console.log("🗑️ [handleDelete] Deletion cancelled by user");
      return;
    }

    try {
      setError("");
      setMessage("");
      console.log("🗑️ [handleDelete] Calling deleteResume...");
      await deleteResume(uuid);
      console.log("🗑️ [handleDelete] Deletion successful");

      if (selectedResume?.uuid === uuid) {
        console.log("🗑️ [handleDelete] Clearing selected resume (same as deleted)");
        setSelectedResume(null);
      }

      setMessage("Resume deleted successfully");
      await loadResumes(search);
      console.log("🗑️ [handleDelete] Reloaded list after deletion");
    } catch (err) {
      console.error("❌ [handleDelete] Error:", err.message);
      setError(err.message);
    }
  };

  // ---------- Search ----------
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("🔎 [handleSearch] Search submitted with query:", search);
    await loadResumes(search);
    console.log("🔎 [handleSearch] Search complete");
  };

  // ---------- Initial load ----------
  useEffect(() => {
    console.log("🚀 [App] Initial mount – loading resumes");
    loadResumes();
  }, []);

  // ---------- Render ----------
  console.log("🎨 [App] Rendering with state:", {
    resumesCount: resumes.length,
    selectedResume,
    loadingList,
    loadingDetails,
    parsingUuid,
    search,
    message,
    error,
  });
console.log("📋 [App] resumes state:", resumes);
console.log("📋 [App] resumes is array?", Array.isArray(resumes));
console.log("📋 [App] resumes length:", resumes.length);
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
              onChange={(e) => {
                console.log("🔎 [App] Search input changed to:", e.target.value);
                setSearch(e.target.value);
              }}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              className="secondary"
              onClick={async () => {
                console.log("🔎 [App] Reset search button clicked");
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
              onSelect={(uuid) => {
                console.log("📄 [App] Resume selected from list:", uuid);
                loadResumeDetails(uuid);
              }}
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