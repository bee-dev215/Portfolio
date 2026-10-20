import { DragEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { uploadProjectImage } from "@/lib/portfolioApi";
import { inputCls } from "./fields";

const MAX_MB = 5;

export default function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > MAX_MB * 1024 * 1024) return toast.error(`Image must be under ${MAX_MB} MB`);
    setUploading(true);
    try {
      const url = await uploadProjectImage(file);
      onChange(url);
      toast.success("Image uploaded");
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
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition ${
          dragOver ? "border-emerald-400 bg-emerald-400/5" : "border-white/10 bg-zinc-900/60"
        }`}
      >
        {value ? (
          <div className="group relative aspect-[16/9]">
            <img src={value} alt="Project cover" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-zinc-950">
                <ImagePlus className="h-4 w-4" /> Replace
              </button>
              <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300"
          >
            <UploadCloud className="h-8 w-8" />
            <span className="text-sm">Click or drag an image here</span>
            <span className="text-xs text-zinc-600">PNG, JPG, WebP · max {MAX_MB} MB</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" className={inputCls} />
    </div>
  );
}
