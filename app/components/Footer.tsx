export default function Footer(){
  return (
    <footer className="border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Gift Huddle</span>
        <nav className="flex gap-4">
          <a href="https://www.facebook.com/profile.php?id=61581098625976" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.linkedin.com/company/gift-huddle" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </div>
    </footer>
  )
}
