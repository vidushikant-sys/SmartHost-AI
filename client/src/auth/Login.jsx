import LoginForm from "../components/auth/LoginForm";
import loginBg from "../assets/images/Hostel.jpg";

export default function Login() {
  return (
    <div className="grid min-h-screen bg-[#F8FAFC] lg:grid-cols-2">
      {/* LEFT SECTION */}
      <section className="relative hidden overflow-hidden lg:flex">
        <img
          src={loginBg}
          alt="ViNova Hostel"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09142B]/92 via-[#0D1B3E]/75 to-[#0D1B3E]/20" />

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-14 xl:p-16">
          {/* Brand */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              ViNova
            </h1>
            <p className="mt-1.5 text-sm font-medium text-white/60">
              Hostel Management Platform
            </p>
          </div>

          {/* Hero */}
          <div className="max-w-lg">
            <h2 className="text-[44px] font-black leading-[1.1] text-white xl:text-5xl">
              Where Every Stay
              <br />
              <span className="text-indigo-300">Feels Like Home.</span>
            </h2>

            <div className="mt-6 h-1.5 w-20 rounded-full bg-gradient-to-r from-indigo-400 to-amber-300" />

            <p className="mt-7 text-lg leading-relaxed text-white/75">
              ViNova simplifies hostel operations with an intelligent
              platform for wardens, administrators and students.
            </p>
          </div>

          {/* Bottom card */}
          <div className="max-w-xs rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white">
              Secure. Reliable. Efficient.
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70">
              Real-time monitoring, fee management, complaints, room
              allocation and analytics — all in one platform.
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden bg-[#F5F6FB] px-6 py-12">
        {/* Dot-grid texture ties this panel to the brand without feeling like a bare template */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.6]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(79,70,229,0.16) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Asymmetric brand glow — echoes the left panel's palette */}
        <div className="pointer-events-none absolute -top-16 right-10 h-[26rem] w-[26rem] rounded-full bg-indigo-200/50 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-amber-200/40 blur-[100px]" />

        <div className="relative z-10 w-full max-w-[380px]">
          <LoginForm />
        </div>
      </section>
    </div>
  );
}