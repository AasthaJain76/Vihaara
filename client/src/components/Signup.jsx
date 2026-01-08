import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Select, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { register as registerService } from "../services/authService";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const handleSignup = async (data) => {
  setError("");
  try {
    const res = await registerService(data); // { user, token }

    // Store JWT in localStorage with consistent key
    localStorage.setItem("token", res.token);

    // Update Redux with user + token
    dispatch(authLogin({ userData: res.user, token: res.token }));

    toast.success("🎉 Account created successfully!");
    navigate("/dashboard");
  } catch (err) {
    const message = err.response?.data?.message || "❌ Signup failed";
    toast.error(message);
    setError(message);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transition-transform hover:scale-[1.02]">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
          Join Vihaara
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account to start exploring and sharing knowledge
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            {...register("name", { required: true })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: true })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          <Input
            label="Age"
            type="number"
            placeholder="Your age (optional)"
            {...register("age")}
          />
          <Select
            label="Gender"
            options={["male", "female", "non-binary", "prefer not to say"]}
            {...register("gender")}
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
