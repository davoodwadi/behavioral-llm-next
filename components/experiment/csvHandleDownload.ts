"use client";

export const csvHandleDownload = (csvString: string, filename = "data.csv") => {
  // Create a blob with CSV MIME type
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create a temporary link element
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);

  // Append link to DOM, click it, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL to free memory
  URL.revokeObjectURL(url);
};
