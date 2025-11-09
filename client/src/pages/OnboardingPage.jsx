import { useForm } from "react-hook-form";
import { authClient } from "../lib/auth"; // if you're using Better Auth
import { useNavigate } from "react-router";
const OnboardingPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountType: "guest",
      age: "",
      gender: "",
      race: "",
      bio: "",
    },
  });

  const accountType = watch("accountType");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting:", data);
    const { accountType, age, gender, bio, race } = data;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/user/update-onboarding`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      const result = await res.json();
      console.log("Success:", result);
      // This is a quick fix, need to make a better one later
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      data-theme="autumn"
    >
      <div className="card bg-base-100 w-full max-w-3xl shadow-2xl border-4 border-neutral">
        <div className="card-body p-8 sm:p-12">
          <h1 className="text-4xl font-black text-center mb-8">
            Complete your Profile
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ACCOUNT TYPE */}
            <div className="form-control space-x-2">
              <label className="label">
                <span className="label-text font-bold text-base">
                  Account Type:
                </span>
              </label>
              <div className="join">
                <input
                  type="radio"
                  value="host"
                  {...register("accountType")}
                  className={`join-item btn ${
                    accountType === "host" ? "btn-primary" : ""
                  }`}
                  aria-label="Host"
                />
                <input
                  type="radio"
                  value="guest"
                  {...register("accountType")}
                  className={`join-item btn ${
                    accountType === "guest" ? "btn-primary" : ""
                  }`}
                  aria-label="Guest"
                />
              </div>
            </div>

            <div className="divider"></div>

            {/* AGE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">Age *</span>
              </label>
              <input
                type="number"
                min="18"
                className="input input-bordered input-lg w-full border-2 focus:border-primary"
                placeholder="18+"
                {...register("age", { required: "Age is required", min: 18 })}
              />
              {errors.age && (
                <p className="text-error text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* GENDER */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">Gender</span>
              </label>
              <select
                {...register("gender", { required: "gender is required" })}
                className="select select-bordered select-lg w-full border-2 focus:border-primary"
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
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
                {...register("race", { required: "race is required" })}
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
                {...register("bio", { required: "Bio is required" })}
                className="textarea textarea-bordered textarea-lg h-32 border-2 focus:border-primary"
                placeholder="Tell us about yourself"
                required
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full text-xl font-bold border-4 border-neutral shadow-lg hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
