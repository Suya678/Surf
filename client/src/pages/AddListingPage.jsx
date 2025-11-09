import React from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import NavBarHost from "../components/Nav/NavBarHost";
import { ArrowLeft, Calendar, MapPin, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function AddListingPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      guest_limit: 1,
      image: "",
      available_from: "",
      available_to: "",
    },
  });

  const availableFrom = watch("available_from");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating your listing...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/listing/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create listing");
      }

      toast.success("Listing created successfully!", {
        id: loadingToast,
        duration: 4000,
      });

      navigate("/hostDashboard");
    } catch (err) {
      console.error("There was an error:", err);
      toast.error(
        err.message || "Failed to create listing. Please try again.",
        {
          id: loadingToast,
          duration: 3000,
        }
      );
    }
  };

  const InputField = ({ label, name, validation, type = "text", ...props }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1 text-base-content"
      >
        {label} {validation?.required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        id={name}
        {...props}
        {...register(name, validation)}
        className={`input input-bordered w-full ${
          errors[name] ? "input-error" : ""
        }`}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-error">{errors[name].message}</p>
      )}
    </div>
  );

  const TextareaField = ({ label, name, validation, ...props }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1 text-base-content"
      >
        {label} {validation?.required && <span className="text-error">*</span>}
      </label>
      <textarea
        id={name}
        {...props}
        {...register(name, validation)}
        className={`textarea textarea-bordered w-full ${
          errors[name] ? "textarea-error" : ""
        }`}
      ></textarea>
      {errors[name] && (
        <p className="mt-1 text-xs text-error">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200" data-theme="autumn">
      <NavBarHost />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/hostDashboard")}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black">
              Add a New Listing
            </h1>
            <p className="text-base md:text-lg opacity-70 mt-1">
              Share your space with those who need it
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputField
                      label="Title"
                      name="title"
                      placeholder="e.g., Cozy Downtown Apartment"
                      validation={{
                        required: "Title is required",
                        minLength: {
                          value: 5,
                          message: "Title must be at least 5 characters long",
                        },
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextareaField
                      label="Description"
                      name="description"
                      rows="4"
                      placeholder="Describe your space, amenities, and what makes it special..."
                      validation={{
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message:
                            "Description must be at least 10 characters long",
                        },
                      }}
                    />
                  </div>

                  <InputField
                    label="Guest Limit"
                    name="guest_limit"
                    type="number"
                    placeholder="1"
                    validation={{
                      required: "Guest limit is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must allow at least 1 guest" },
                    }}
                  />
                </div>
              </div>

              <div className="divider"></div>

              {/* Location */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputField
                      label="Street Address"
                      name="address"
                      placeholder="123 Main Street"
                      validation={{ required: "Address is required" }}
                    />
                  </div>

                  <InputField
                    label="City"
                    name="city"
                    placeholder="Toronto"
                    validation={{ required: "City is required" }}
                  />

                  <InputField
                    label="Province"
                    name="province"
                    placeholder="ON"
                    validation={{ required: "Province is required" }}
                  />

                  <InputField
                    label="Postal Code"
                    name="postal_code"
                    placeholder="A1A 1A1"
                    validation={{
                      required: "Postal Code is required",
                      pattern: {
                        value: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                        message: "Invalid postal code format (e.g., A1A 1A1)",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="divider"></div>

              {/* Image */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Photo
                </h2>
                <InputField
                  label="Image URL"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  validation={{
                    required: "Image URL is required",
                    pattern: {
                      value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                      message: "Please enter a valid URL",
                    },
                  }}
                />
                <p className="text-xs opacity-60 mt-2">
                  Tip: Use a high-quality image that showcases your space
                </p>
              </div>

              <div className="divider"></div>

              {/* Availability */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Availability (Optional)
                </h2>
                <p className="text-sm opacity-70 mb-4">
                  Specify when your listing is available for bookings. Leave
                  blank if it's always available.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Available From"
                    name="available_from"
                    type="date"
                    min={getTodayDate()}
                  />

                  <InputField
                    label="Available To"
                    name="available_to"
                    type="date"
                    min={availableFrom || getTodayDate()}
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => navigate("/hostDashboard")}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
