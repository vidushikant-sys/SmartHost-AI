import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

import logo from "../../assets/logo.png";
import hostel from "../../assets/login-hostel.jpg";

import { login } from "../../services/authService";

import "./Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    email: "",

    password: ""

  });

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Handle Submit Called");

  try {

      setLoading(true);

      const res = await login(form);
      console.log("Login Response:", res);

console.log("Token:", res.token);

console.log("Stored Token:", localStorage.getItem("token"));

      localStorage.setItem(
        "token",
        res.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(res.admin)
      );

      navigate("/dashboard");

    }

    catch (err) {

      alert(

        err?.response?.data?.message ||

        "Login Failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

<div className="login-page">

{/* Left Section */}

<div className="left-panel">

<div className="overlay">

<div className="brand">

<img

src={logo}

alt="logo"

/>

<div>

<h1>ViNova</h1>

<p>

Hostel Management Platform

</p>

</div>

</div>

<div className="hero">

<h2>

Where Every Stay

<br/>

<span>

Feels Like Home.

</span>

</h2>

<div className="line"></div>

<p>

ViNova simplifies hostel operations

so administrators can focus on

creating better student experiences.

</p>

</div>

<div className="bottom-card">

<div className="shield">

🛡

</div>

<div>

<h4>

Secure. Reliable. Efficient.

</h4>

<p>

Built for modern hostel management.

</p>

</div>

</div>

</div>

<img

src={hostel}

className="background"

alt="hostel"

/>

</div>

{/* Right Section */}

<div className="right-panel">

<div className="login-card">

<div className="top-logo">

<img

src={logo}

alt="logo"

/>

<div>

<h2>

ViNova

</h2>

<p>

Hostel Management Platform

</p>

</div>

</div>

<h1>

Welcome Back!

<span>

👋

</span>

</h1>

<p className="subtitle">

Sign in to access your account

</p>

<form onSubmit={handleSubmit}>

<label>

Username or Email

</label>

<div className="input-box">

<FiUser/>

<input

type="email"

name="email"

placeholder="Enter your username or email"

value={form.email}

onChange={handleChange}

required

/>

</div>

<label>

Password

</label>

<div className="input-box">

<FiLock/>

<input

type={

showPassword

?

"text"

:

"password"

}

name="password"

placeholder="Enter your password"

value={form.password}

onChange={handleChange}

required

/>

<button

type="button"

className="eye"

onClick={()=>

setShowPassword(

!showPassword

)

}

>

{

showPassword

?

<FiEyeOff/>

:

<FiEye/>

}

</button>

</div>

<div className="options">

<label>

<input

type="checkbox"

/>

Remember me

</label>

<a href="#">

Forgot password?

</a>

</div>

<button

className="login-btn"

disabled={loading}

>

{

loading

?

"Signing In..."

:

<>

Sign In

<FiArrowRight/>

</>

}

</button>

<div className="divider">

<span>

or

</span>

</div>

<button

type="button"

className="social"

>

<FcGoogle/>

Continue with Google

</button>

<button

type="button"

className="social"

>

<FaMicrosoft color="#0078D4"/>

Continue with Microsoft

</button>

<div className="secure">

🛡 Your data is encrypted and secure

</div>

</form>

</div>

</div>

</div>

  );

}