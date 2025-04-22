import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";            // adjust path as needed
import { registerUser } from "../lib/donation-api"; // adjust path as needed
import { Heart } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    userType: "donor",
    phone: "",
    address: "",
    bio: "",
    organization: {
      orgName: "",
      orgType: "",
      orgDescription: "",
      orgWebsite: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Simple validation
  const validate = () => {
    const errs = {};
    if (form.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters";
    if (form.name.trim().length < 2) errs.name = "Name is required";
    if (!form.email.includes("@")) errs.email = "Invalid email address";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.userType === "organization" && !form.organization.orgName.trim())
      errs.orgName = "Organization name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // nested org fields handled separately
    if (name.startsWith("org.")) {
      const key = name.split(".")[1];
      setForm((f) => ({
        ...f,
        organization: { ...f.organization, [key]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerUser(form); // your API call
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-gray-600 text-sm">
            Join our community to donate or request food
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type */}
          <div>
            <label className="block text-gray-700 mb-1">Account Type</label>
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="donor">Donor</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700 mb-1">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-1">
                {form.userType === "organization"
                  ? "Contact Name"
                  : "Full Name"}
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 mb-1">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 mb-1">
                Address (optional)
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 mb-1">Bio (optional)</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Tell us a bit about yourself"
            />
          </div>

          {/* Organization Details */}
          {form.userType === "organization" && (
            <div className="border p-4 rounded bg-gray-50 space-y-4">
              <h3 className="font-semibold text-lg">Organization Details</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    name="org.orgName"
                    value={form.organization.orgName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter organization name"
                  />
                  {errors.orgName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.orgName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    Organization Type
                  </label>
                  <select
                    name="org.orgType"
                    value={form.organization.orgType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select type</option>
                    <option value="food bank">Food Bank</option>
                    <option value="shelter">Shelter</option>
                    <option value="community center">
                      Community Center
                    </option>
                    <option value="soup kitchen">Soup Kitchen</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    Website (optional)
                  </label>
                  <input
                    name="org.orgWebsite"
                    value={form.organization.orgWebsite}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter website URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Organization Description
                </label>
                <textarea
                  name="org.orgDescription"
                  value={form.organization.orgDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Describe your organization's mission"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
