import AuthLayout from "../components/layout/AuthLayout";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

function Login() {
  return (
    <AuthLayout>

      <div className="login-card">

        <h2>Welcome Back</h2>

        <p>
          Sign in to continue managing your hostel efficiently.
        </p>

        <InputField
          label="Username"
          placeholder="Enter your username"
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        <Button text="Sign In" />

      </div>

    </AuthLayout>
  );
}

export default Login;