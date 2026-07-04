export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  return (
    <span className={`status-badge ${normalized}`}>
      {normalized || "unknown"}
    </span>
  );
}
