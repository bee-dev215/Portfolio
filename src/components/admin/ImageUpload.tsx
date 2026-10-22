import { DragEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { uploadProjectImage } from "@/lib/projectsApi";
import { inputCls } from "./fields";

const MAX_MB = 5; // matches the bucket's limit in supabase/setup.sql

export default function ImageUpload({ id, value, onChange }: { id?: string; value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > MAX_MB * 1024 * 1024) return toast.error(`Images must be under ${MAX_MB} MB`);
    setUploading(true);
    try {
      onChange(await uploadProjectImage(file));
      toast.success("Photo uploaded");
    } catch (e) {
      toast.error("Upload failed", { description: (e as Error).message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${dragOver ? "border-brand bg-brand-soft" : "border-line bg-raised/50"}`}
      >
        {value ? (
          <div className="group relative aspect-[16/10]">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
              <button type="button" onClick={() => fileRef.current?.click()} className="btn bg-white px-4 py-2 text-sm text-[#0f172a]">
                <ImagePlus className="h-4 w-4" /> Replace
              </button>
              <button type="button" onClick={() => onChange("")} className="btn bg-red-600 px-4 py-2 text-sm text-white">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 text-subtle transition-colors hover:text-ink">
            <UploadCloud className="h-8 w-8" />
            <span className="text-sm font-semibold">Click or drag a photo here</span>
            <span className="text-xs">JPG, PNG or WebP · landscape (16:10) works best · up to {MAX_MB} MB</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-canvas/80">
            <Loader2 className="h-6 w-6 animate-spin text-brand-text" />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image link" className={inputCls} />
    </div>
  );
}
