import "../../styles/login.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">

      <div className="auth-left">

        <div className="brand">

          <h1>ViNova</h1>

          <h3>Hostel Management Platform</h3>

          <p>Where Every Stay Feels Like Home.</p>

        </div>

      </div>

      <div className="auth-right">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;