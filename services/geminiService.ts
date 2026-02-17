export async function processImageWithBackend(
  file: File,
  preset: string,
  logoBase64?: string,
  selectedColor?: string
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("preset", preset);

  if (logoBase64) {
    formData.append("logoBase64", logoBase64);
  }

  if (selectedColor) {
    formData.append("selectedColor", selectedColor);
  }

  const res = await fetch("https://la-paris-editor.onrender.com/enhance", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Backend processing failed");
  }

  return await res.json();
}
