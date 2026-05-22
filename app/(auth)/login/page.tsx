"use client";

import { useState, ChangeEvent, useEffect } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import Image from "next/image";
import { API_ENDPOINTS } from "@/config/endpoint";
import { axiosClient } from "@/config/axiosClient";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import AuthLeft from "@/components/AuthLeft";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useStore";

type ErrorTypes = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
};
/* TODO : 

 2. add country flag along with the country code
  3. add success and error toast 
  4. add password strength meter
   5. add terms and conditions checkbox 
   6. add recaptcha 7.no change in input when submit
 7. limit while adding the country number
 8. Multiple spaces after input should be removed from the frontend input boxes
 */

export default function LoginPage() {
  const { setUser, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState<ErrorTypes>();
  const [loginLoading, setloginLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors: ErrorTypes = {};

    if (!form.email) {
      newErrors.email = "Email is required.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationError = validate();
    if (Object.keys(validationError).length > 0) {
      return;
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setloginLoading(true);

    try {
      const response = await axiosClient.post(API_ENDPOINTS.LOGIN, {
        ...form,
        countryCode,
        origin: "admin",
      });
      console.log(response);
      if (response?.data?.success) {
        console.log(response?.data);
        toast.success(response.data.message || "login successful!");
        setUser(response.data.data);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobile: "",
        });
        router.replace("/dashboard");
      }
      setloginLoading(false);
    } catch (error) {
      console.error("Error occurred while signing up:", error);
      if (error instanceof AxiosError) {
        console.log(
          "==THIS IS THE ERROR RESPONSE FROM AXIOS==",
          error.response,
        );
        toast.error(
          error.response?.data?.message || "An error occurred during login.",
        );
      }
      setloginLoading(false);
    } finally {
      setloginLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT SIDE */}
      <AuthLeft />

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className=" lg:p-10 rounded-2xl  w-[90%] max-w-xl"
        >
          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <Image
              src="https://logobook.com/wp-content/uploads/2016/10/Real_Typographers_logo.svg"
              alt="logo"
              width={30}
              height={30}
              priority
            />
          </div>

          {/* HEADING */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Login to your account
          </h1>
          <p className="text-center text-gray-400 mb-6 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className=" text-teal-700">
              Create
            </Link>
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-gray-500">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                className={`w-full pl-10 p-2 border ${
                  errors?.email ? "border-red-500" : "border-gray-300"
                } text-gray-700 rounded-lg`}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm text-gray-500">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                className={`w-full pl-10 pr-10 p-2 border ${
                  errors?.password ? "border-red-500" : "border-gray-300"
                } text-gray-700 rounded-lg`}
                onChange={handleChange}
                placeholder="************"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            className="w-full bg-teal-800 text-white py-2 flex items-center justify-center rounded-lg hover:bg-green-800 transition"
            type="submit"
          >
            {loginLoading ? (
              <CgSpinner className="animate-spin  size-6" />
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
