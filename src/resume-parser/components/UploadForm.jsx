import { useState } from "react";
import { uploadResume } from "../api";
import '../css/upload_form.css'

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  'image/jpg',

];

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setLocalError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setLocalError("Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setLocalError("File size must be less than 50MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setLocalError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setLocalError("");

      const result = await uploadResume(file);
      onUploadSuccess?.(result.data);

      setFile(null);
      e.target.reset();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <input
        type="file"
        name="resume"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />

      {file && (
        <div className="file-meta">
          <strong>Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      {localError && <div className="inline-error">{localError}</div>}

      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </form>
  );
}
