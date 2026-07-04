// 👉 DUMMY — apna backend base URL yahan daalo
export const API_BASE_URL = "https://resumeera.xyz/backend/api";
export const baseUploadUrl = "https://resumeera.xyz/backend/api";

export async function handleResponse(response) {
  console.log("🌐 [handleResponse] Response status:", response.status);
  console.log("🌐 [handleResponse] Response headers:", [...response.headers]);

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error("❌ [handleResponse] Failed to parse JSON:", parseError);
    throw new Error("Invalid JSON response from server");
  }

  console.log("🌐 [handleResponse] Parsed data:", data);

  if (!response.ok || data.success === false) {
    const errorMsg = data.message || data.error || "Something went wrong while calling API";
    console.error("❌ [handleResponse] API error:", errorMsg);
    throw new Error(errorMsg);
  }

  console.log("✅ [handleResponse] Request succeeded");
  return data;
}

export async function uploadResume(file) {
  console.log("📤 [uploadResume] Called with file:", file.name, "size:", file.size, "type:", file.type);

  const formData = new FormData();
  formData.append("resume", file);

  const url = `${baseUploadUrl}/upload.php`;
  console.log("📤 [uploadResume] POST to:", url);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  console.log("📤 [uploadResume] Received response status:", response.status);
  return handleResponse(response);
}

export async function parseResume(uuid) {
  console.log("🔍 [parseResume] Called with uuid:", uuid);

  const url = `${API_BASE_URL}/parse.php`;
  const payload = { uuid };
  console.log("🔍 [parseResume] POST to:", url, "payload:", payload);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("🔍 [parseResume] Received response status:", response.status);
  return handleResponse(response);
}

export async function getResume(uuid) {
  console.log("📄 [getResume] Called with uuid:", uuid);

  const url = `${API_BASE_URL}/resume.php?id=${encodeURIComponent(uuid)}`;
  console.log("📄 [getResume] GET to:", url);

  const response = await fetch(url, {
    method: "GET",
  });

  console.log("📄 [getResume] Received response status:", response.status);
  return handleResponse(response);
}

export async function getResumes(page = 1, perPage = 20, query = "") {
  console.log("📋 [getResumes] Called with page:", page, "perPage:", perPage, "query:", query);

  const url = new URL(`${API_BASE_URL}/resume.php`);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", perPage);

  if (query.trim()) {
    url.searchParams.append("q", query.trim());
  }

  console.log("📋 [getResumes] POST to:", url.toString());
  console.log("📋 [getResumes] Query params:", Object.fromEntries(url.searchParams));

  const response = await fetch(url.toString(), {
    method: "POST",
  });


  return handleResponse(response);
}

export async function deleteResume(uuid) {
  console.log("🗑️ [deleteResume] Called with uuid:", uuid);

  const url = `${API_BASE_URL}/resume.php?id=${encodeURIComponent(uuid)}`;
  console.log("🗑️ [deleteResume] DELETE to:", url);

  const response = await fetch(url, {
    method: "DELETE",
  });

  console.log("🗑️ [deleteResume] Received response status:", response.status);
  return handleResponse(response);
}