import { Link } from "react-router-dom"

export default function AuthPageLayout({ children, heading, subtitle }) {
  return (
    <main className="min-h-screen w-full bg-gray-100 flex justify-center items-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <section className="md:w-1/2 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 p-10 sm:p-12 flex flex-col justify-between relative text-white overflow-hidden shadow-inner">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6ee7b7_1px,transparent_1px)] [background-size:20px_20px]" />
          <Link
            to="/"
            className="relative z-10 text-2xl font-black tracking-tight text-white flex items-center gap-2"
          >
            FreeLancer<span className="text-green-500">Graphic</span>
          </Link>
          <div className="relative z-10 my-auto py-10">
            <div className="inline-block px-3 py-1 bg-emerald-800/50 backdrop-blur-md rounded-full text-emerald-300 text-xs font-semibold mb-6 border border-emerald-700/50 shadow-sm">
              Demo marketplace experience
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4 tracking-tight">
              {heading}
            </h1>
            <p className="text-emerald-100/80 text-sm leading-relaxed max-w-sm">
              {subtitle}
            </p>
          </div>
          <p className="relative z-10 text-xs text-emerald-300/70 font-medium">
            Frontend-only demo authentication. Do not use a real password.
          </p>
        </section>
        <section className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {children}
        </section>
      </div>
    </main>
  )
}
