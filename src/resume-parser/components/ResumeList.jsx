import StatusBadge from "./StatusBadge";
import '../css/ResumeList.css'
export default function ResumeList({
  resumes,
  loading,
  selectedUuid,
  onSelect,
  onParse,
  onDelete,
  parsingUuid,
}) {
  console.log("📄 [ResumeList] raw resumes prop:", resumes);

  // Safely extract the actual list array
  const list = Array.isArray(resumes)
    ? resumes
    : (resumes?.data || []);

  console.log("📄 [ResumeList] extracted list:", list);

  if (loading) {
    return <div className="empty-state">Loading resumes...</div>;
  }

  if (!list.length) {
    return <div className="empty-state">No resumes found.</div>;
  }

  return (
    <div className="resume-list">
      {list.map((resume) => (
        <div
          key={resume.uuid}
          className={`resume-card ${selectedUuid === resume.uuid ? "active" : ""}`}
        >
          <div className="resume-card-top">
            <div>
              <h3>{resume.file_name}</h3>
              <p className="muted">UUID: {resume.uuid}</p>
            </div>
            <StatusBadge status={resume.status} />
          </div>

          <div className="resume-card-meta">
            <p><strong>Created:</strong> {resume.created_at}</p>
            <p><strong>Updated:</strong> {resume.updated_at}</p>
          </div>

          <div className="resume-card-actions">
            <button onClick={() => onSelect(resume.uuid)}>View</button>
            <button
              className="secondary"
              onClick={() => onParse(resume.uuid)}
              disabled={parsingUuid === resume.uuid || resume.status === "processing"}
            >
              {parsingUuid === resume.uuid ? "Parsing..." : "Parse"}
            </button>
            <button className="danger" onClick={() => onDelete(resume.uuid)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}