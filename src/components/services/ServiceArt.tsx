import { Service } from "@/data/company";
import { serviceIcons } from "@/components/site/icons";
import { usePhotos } from "@/hooks/use-photos";

/** Hero artwork for a service: its photo, or — without one — a large icon composition on the brand mesh. */
export default function ServiceArt({ service }: { service: Service }) {
  const photos = usePhotos();
  const Icon = serviceIcons[service.key];

  if (service.image) {
    return (
      <div className="relative">
        <div className="shadow-soft overflow-hidden rounded-[2rem] border border-line bg-raised">
          <img src={photos.src(service.image)} alt="" width={740} height={555} className="aspect-[4/3] w-full object-cover" />
        </div>
        <span className="icon-tile absolute -bottom-6 -left-4 h-16 w-16 rounded-2xl sm:-left-6 sm:h-20 sm:w-20">
          <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
        </span>
      </div>
    );
  }

  return (
    <div className="shadow-soft relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] border border-line bg-brand-soft" aria-hidden="true">
      <div className="mesh absolute inset-0" />
      <div className="dot-grid absolute inset-0 opacity-70" />
      {/* Concentric rings around the icon */}
      {[70, 52, 34].map((size) => (
        <span key={size} className="absolute rounded-full border border-brand/20" style={{ width: `${size}%`, aspectRatio: "1" }} />
      ))}
      <span className="icon-tile relative h-28 w-28 rounded-[1.75rem]">
        <Icon className="h-14 w-14" />
      </span>
    </div>
  );
}
