import LogoIcon from "@/public/gift-huddle-icon.svg";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center gap-2">
        <LogoIcon className="h-6 w-6" aria-label="Gift Huddle" />
        <span className="text-sm text-gray-600">© {new Date().getFullYear()} Gift Huddle</span>
      </div>
      {/* social icons… */}
    </footer>
  );
}
