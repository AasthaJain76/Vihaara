import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useForm } from "react-hook-form";
import { login as loginService } from "../services/authService";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const handleLogin = async (data) => {
  setError("");
  try {
    const res = await loginService(data); // { user, token }

    // ✅ Store token with consistent key
    localStorage.setItem("token", res.token);

    // ✅ Update Redux with user + token
    dispatch(authLogin({ userData: res.user, token: res.token }));

    toast.success("🎉 Login successful!");
    navigate("/dashboard"); // ✅ Redirect to dashboard
  } catch (err) {
    const message = err?.response?.data?.message || "❌ Login failed";
    toast.error(message);
    setError(message);
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transition-transform hover:scale-[1.02]">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm font-medium">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="mt-6 space-y-5">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                message: "Invalid email address",
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
