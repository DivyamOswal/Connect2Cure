import { User as UserIcon } from "lucide-react";

export default function Avatar({ src, className }) {
  return src ? (
    <img
      src={src}
      alt="avatar"
      className={`rounded-full object-cover ${className}`}
    />
  ) : (
    <div className={`rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
      <UserIcon className="w-1/2 h-1/2 text-gray-500" />
    </div>
  );
}
