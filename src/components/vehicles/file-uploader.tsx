"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type VehicleFileDto = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  createdAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploader({ vehicleId }: { vehicleId: string }) {
  const [files, setFiles] = useState<VehicleFileDto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    const res = await fetch(`/api/vehicles/${vehicleId}/files`);
    const data = await res.json();
    setFiles(data.files ?? []);
  }, [vehicleId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const presignRes = await fetch(`/api/vehicles/${vehicleId}/files/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size })
      });
      if (!presignRes.ok) throw new Error("This file type or size isn't allowed");
      const { uploadUrl, key } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      const recordRes = await fetch(`/api/vehicles/${vehicleId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size, key })
      });
      if (!recordRes.ok) throw new Error("Could not save file record");

      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(fileId: string) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/vehicles/${vehicleId}/files/${fileId}`, { method: "DELETE" });
    await loadFiles();
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Files</h2>
        <label>
          <span className="sr-only">Upload file</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            id="file-upload-input"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById("file-upload-input")?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload file"}
          </Button>
        </label>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No photos or documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {files.map((file) => (
              <li key={file.id} className="flex items-center justify-between py-2 text-sm">
                <a
                  href={file.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand-600 hover:underline"
                >
                  {file.fileName}
                </a>
                <div className="flex items-center gap-3 text-gray-500">
                  <span>{formatSize(file.fileSize)}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
