function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between flex-wrap gap-3">
      <p className="text-gray-400 text-sm">
        © 2026 FinanceTracker. All rights reserved.
      </p>
      <p className="text-gray-400 text-sm">
        Made with ❤️ by Shoyunus
      </p>
      <div className="flex gap-4 text-sm">
        <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Privacy</a>
        <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Terms</a>
      </div>
    </footer>
  )
}

export default Footer