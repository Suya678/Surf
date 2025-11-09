import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function AddListingModal({ isOpen, onClose, onListingAdded }) {
  const {
    register,
    handleSubmit,
    reset,
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
    },
  });

  const onSubmit = async (data) => {
    // Show loading toast
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

      // Success!
      toast.success("Listing created successfully!", {
        id: loadingToast,
        duration: 4000,
      });

      onListingAdded();
      onClose();
      reset();
    } catch (err) {
      console.error("There was an error:", err);

      // Show error toast
      toast.error("Failed to create listing. Please try again.", {
        id: loadingToast,
        duration: 3000,
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  // --- Helper for standard inputs ---
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

  // --- Helper for textareas for consistency ---
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Add a New Listing
            </h2>
            <p className="text-sm opacity-70 mt-1">
              Share your space with those who need it
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <InputField
                label="Title"
                name="title"
                validation={{
                  required: "Title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters long",
                  },
                }}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <TextareaField
                label="Description"
                name="description"
                rows="4"
                validation={{
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters long",
                  },
                }}
              />
            </div>

            {/* Address */}
            <InputField
              label="Address"
              name="address"
              validation={{ required: "Address is required" }}
            />

            {/* City */}
            <InputField
              label="City"
              name="city"
              validation={{ required: "City is required" }}
            />

            {/* Province */}
            <InputField
              label="Province"
              name="province"
              validation={{ required: "Province is required" }}
            />

            {/* Postal Code */}
            <InputField
              label="Postal Code"
              name="postal_code"
              validation={{
                required: "Postal Code is required",
                pattern: {
                  value: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                  message: "Invalid postal code format (e.g., A1A 1A1)",
                },
              }}
            />

            {/* Guest Limit */}
            <InputField
              label="Guest Limit"
              name="guest_limit"
              type="number"
              validation={{
                required: "Guest limit is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must allow at least 1 guest" },
              }}
            />

            {/* Image URL */}
            <div className="md:col-span-2">
              <InputField
                label="Image URL"
                name="image"
                validation={{
                  required: "Image URL is required",
                  pattern: {
                    value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                    message: "Please enter a valid URL",
                  },
                }}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-ghost">
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
                  Submitting...
                </>
              ) : (
                "Add Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
