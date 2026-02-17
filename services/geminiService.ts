export async function processImageWithBackend(file: File, preset: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("preset", preset);

  const res = await fetch("https://la-paris-editor.onrender.com/enhance", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Backend processing failed");
  }

  return await res.json();
}
