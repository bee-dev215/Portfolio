import { DragEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { PhotoShape } from "@/data/site-photos";
import { uploadImage } from "@/lib/adminApi";
import { inputCls } from "./fields";

const MAX_MB = 5; // matches the bucket's limit in supabase/setup.sql

// How the drop zone previews each shape; tall shapes are narrowed so they don't fill the drawer
const SHAPES: Record<PhotoShape, { box: string; frame: string; words: string }> = {
  "16:10": { box: "aspect-[16/10]", frame: "", words: "landscape (16:10)" },
  "16:9": { box: "aspect-video", frame: "", words: "wide (16:9)" },
  "4:3": { box: "aspect-[4/3]", frame: "", words: "landscape (4:3)" },
  "1:1": { box: "aspect-square", frame: "max-w-sm", words: "square" },
  "4:5": { box: "aspect-[4/5]", frame: "max-w-xs", words: "portrait (4:5)" },
};

export default function ImageUpload({
  id,
  value,
  onChange,
  folder = "projects",
  shape = "16:10",
  removable = true,
}: {
  id?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string; // where uploads go in the storage bucket
  shape?: PhotoShape; // the proportions the site shows it at
  removable?: boolean; // false where a photo is required, so only Replace is offered
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { box, frame, words } = SHAPES[shape];

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > MAX_MB * 1024 * 1024) return toast.error(`Images must be under ${MAX_MB} MB`);
    setUploading(true);
    try {
      onChange(await uploadImage(file, folder));
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
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${frame} ${dragOver ? "border-brand bg-brand-soft" : "border-line bg-raised/50"}`}
      >
        {value ? (
          <div className={`group relative ${box}`}>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
              <button type="button" onClick={() => fileRef.current?.click()} className="btn bg-white px-4 py-2 text-sm text-[#0f172a]">
                <ImagePlus className="h-4 w-4" /> Replace
              </button>
              {removable && (
                <button type="button" onClick={() => onChange("")} className="btn bg-red-600 px-4 py-2 text-sm text-white">
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className={`flex ${box} w-full flex-col items-center justify-center gap-2 px-4 text-center text-subtle transition-colors hover:text-ink`}>
            <UploadCloud className="h-8 w-8" />
            <span className="text-sm font-semibold">Click or drag a photo here</span>
            <span className="text-xs">
              JPG, PNG or WebP · {words} works best · up to {MAX_MB} MB
            </span>
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
