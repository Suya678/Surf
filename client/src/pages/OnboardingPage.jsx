import { useState } from "react";

const OnboardingPage = () => {
  const [role, setRole] = useState("guest");
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    race: "",
    bio: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, role });
    // Handle form submission
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      data-theme="autumn"
    >
      <div className="card bg-base-100 w-full max-w-3xl shadow-2xl border-4 border-neutral">
        <div className="card-body p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              Complete your Profile
            </h1>
          </div>

          <div className="space-y-6 ">
            <div className="form-control space-x-2">
              <label className="label">
                <span className="label-text font-bold text-base">
                  Account Type:
                </span>
              </label>
              <div className="join">
                <input
                  type="radio"
                  name="accountType"
                  value="host"
                  className="join-item btn"
                  aria-label="Host"
                />
                <input
                  type="radio"
                  name="accountType"
                  value="guest"
                  className="join-item btn"
                  aria-label="Guest"
                />
              </div>
            </div>

            <div className="divider"></div>

            {/* AGE & GENDER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base">Age *</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input input-bordered input-lg w-full border-2 focus:border-primary"
                  placeholder="18+"
                  min="18"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base">Gender</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select select-bordered select-lg w-full border-2 focus:border-primary"
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* RACE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">
                  Race / Ethnicity
                </span>
                <span className="label-text-alt">Optional</span>
              </label>
              <select
                name="race"
                value={formData.race}
                onChange={handleChange}
                className="select select-bordered select-lg w-full border-2 focus:border-primary"
              >
                <option value="">Select race/ethnicity</option>
                <option>Asian</option>
                <option>Black or African descent</option>
                <option>Hispanic or Latino</option>
                <option>White</option>
                <option>Middle Eastern or North African</option>
                <option>Indigenous</option>
                <option>Pacific Islander</option>
                <option>Mixed/Multiracial</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            {/* BIO */}
            <div className="form-control">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered textarea-lg h-32 border-2 focus:border-primary"
                placeholder="Tell us about yourself"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-primary btn-lg w-full text-xl font-bold border-4 border-neutral shadow-lg hover:scale-105 transition-transform"
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
