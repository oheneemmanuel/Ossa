"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
  currentImageUrl?: string | null;
  fallbackInitials? : string;
  onUploaded?: (url: string) => void | Promise<void>;
};

export default function ProfileImageUpload({
  currentImageUrl,
  onUploaded,
}: Props) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);

    // instant local preview while the real upload happens
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // No auth header needed — the route reads the NextAuth session
      // cookie automatically via auth().
      const res = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreview(data.url);
      onUploaded?.(data.url);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
      setPreview(currentImageUrl ?? null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border border-neutral-300 bg-neutral-100 transition hover:opacity-90"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile"
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
            Add photo
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onInputChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
        disabled={isUploading}
      >
        {isUploading ? "Uploading…" : "Change photo"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}