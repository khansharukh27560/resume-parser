import '../css/ResumeDetails.css'
export default function ResumeDetails({ resume, loading }) {
  if (loading) {
    return <div className="empty-state">Loading details...</div>;
  }

  if (!resume) {
    return <div className="empty-state">Select a resume to view parsed details.</div>;
  }

  const parsed = resume.parsed_json || {};
  const personal = parsed.personal || {};
  const skills = parsed.skills || [];
  const experience = parsed.experience || [];
  const education = parsed.education || [];
  const projects = parsed.projects || [];
  const certifications = parsed.certifications || [];
  const languages = parsed.languages || [];
  const achievements = parsed.achievements || [];

  return (
    <div className="details-panel">
      <h2>Resume Details</h2>

      <section className="details-section">
        <h3>Basic Info</h3>
        <div className="details-grid">
          <div><strong>File Name:</strong> {resume.file_name}</div>
          <div><strong>Status:</strong> {resume.status}</div>
          <div><strong>Processing Time:</strong> {resume.processing_time ?? "-"} sec</div>
          <div><strong>Model Version:</strong> {resume.model_version || "-"}</div>
        </div>
      </section>

      <section className="details-section">
        <h3>Personal Information</h3>
        <div className="details-grid">
          <div><strong>Name:</strong> {personal.name || "-"}</div>
          <div><strong>Email:</strong> {personal.email || "-"}</div>
          <div><strong>Phone:</strong> {personal.phone || "-"}</div>
          <div><strong>Location:</strong> {personal.location || "-"}</div>
          <div><strong>LinkedIn:</strong> {personal.linkedin || "-"}</div>
          <div><strong>GitHub:</strong> {personal.github || "-"}</div>
          <div><strong>Portfolio:</strong> {personal.portfolio || "-"}</div>
        </div>
      </section>

      <section className="details-section">
        <h3>Summary</h3>
        <p>{parsed.summary || "No summary available."}</p>
      </section>

      <section className="details-section">
        <h3>Skills</h3>
        {skills.length ? (
          <div className="tag-list">
            {skills.map((skill, index) => (
              <div className="tag-card" key={index}>
                <strong>{skill.name || "-"}</strong>
                <span>{skill.proficiency || "-"}</span>
                <span>{skill.years ?? "-"} years</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No skills found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Experience</h3>
        {experience.length ? (
          <div className="stack-list">
            {experience.map((item, index) => (
              <div className="stack-card" key={index}>
                <h4>{item.designation || "-"} at {item.company || "-"}</h4>
                <p>
                  <strong>Duration:</strong> {item.start_date || "-"} to {item.end_date || "Present"}
                </p>
                <p><strong>Current:</strong> {item.is_current ? "Yes" : "No"}</p>
                <p>{item.description || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No experience found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Education</h3>
        {education.length ? (
          <div className="stack-list">
            {education.map((item, index) => (
              <div className="stack-card" key={index}>
                <h4>{item.degree || "-"}</h4>
                <p><strong>College:</strong> {item.college || "-"}</p>
                <p><strong>Graduation Year:</strong> {item.graduation_year || "-"}</p>
                <p><strong>GPA:</strong> {item.gpa ?? "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No education found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Projects</h3>
        {projects.length ? (
          <div className="stack-list">
            {projects.map((item, index) => (
              <div className="stack-card" key={index}>
                <h4>{item.title || "-"}</h4>
                <p>{item.description || "-"}</p>
                <p>
                  <strong>Technologies:</strong>{" "}
                  {Array.isArray(item.technologies) ? item.technologies.join(", ") : "-"}
                </p>
                <p><strong>URL:</strong> {item.url || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Certifications</h3>
        {certifications.length ? (
          <div className="stack-list">
            {certifications.map((item, index) => (
              <div className="stack-card" key={index}>
                <h4>{item.name || "-"}</h4>
                <p><strong>Issued By:</strong> {item.issued_by || "-"}</p>
                <p><strong>Date:</strong> {item.date || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No certifications found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Languages</h3>
        {languages.length ? (
          <div className="tag-list">
            {languages.map((lang, index) => (
              <div className="tag-card" key={index}>
                <strong>{lang}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>No languages found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Achievements</h3>
        {achievements.length ? (
          <ul className="simple-list">
            {achievements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No achievements found.</p>
        )}
      </section>

      <section className="details-section">
        <h3>Raw Markdown</h3>
        <pre className="markdown-preview">
          {resume.parsed_markdown || "No parsed markdown available."}
        </pre>
      </section>
    </div>
  );
}
