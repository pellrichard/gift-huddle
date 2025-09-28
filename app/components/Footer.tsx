// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/gift-huddle-icon.svg" alt="Gift Huddle" className="h-6 w-6" />
          <span className="text-sm text-gray-600">© {new Date().getFullYear()} Gift Huddle</span>
        </div>
        <div className="text-xs text-gray-500">Made with ❤️</div>
      </div>
    </footer>
  );
}
