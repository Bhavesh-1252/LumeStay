import { useState } from "react";
import ListingFormField from "./ListingFormField";

const ListingForm = ({ heading, subHeading, label, initialData, onSubmitData }) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState(initialData);
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  const clearErrors = (field) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
  }

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = "Title is required";
    else if (formData.title.trim().length < 5) e.title = "Title must be atleast 5 characters";
    else if (formData.title.trim().length > 80) e.title = "Title must be atmost 80 characters";

    if (!formData.description.trim()) e.description = "Description is required";
    else if (formData.description.trim().length < 5) e.description = "Description must be atleast 5 characters";
    else if (formData.description.trim().length > 600) e.description = "Description must be atmost 600 characters";

    if (!formData.price) e.price = "Price is required";
    else if (formData.price < 1) e.price = "Price must be atleast &#8377;1";

    if (!formData.location.trim()) e.location = "Location is required";
    else if (formData.location.trim().length < 3) e.location = "Location must be atleast 3 characters";
    else if (formData.location.trim().length > 50) e.location = "Location must be atmost 50 characters";

    if (!formData.country.trim()) e.country = "Country is required";
    else if (formData.country.trim().length < 3) e.country = "Country must be atleast 3 characters";
    else if (formData.country.trim().length > 50) e.country = "Country must be atmost 50 characters";

    if (image) {
      if (!allowedImageTypes.includes(image.type)) e.image = "Only JPEG, PNG and WEBP images are allowed";
    }

    return e;
  }

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      // Optional: Create a temporary URL to preview the image
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length) {
      setFieldErrors(found);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const finalData = new FormData();

      for (let key in formData) {
        if (key === "image") continue;
        finalData.append(key, formData[key]);
      }
      if (image) finalData.append("image", image);

      console.log();

      const response = await onSubmitData(finalData);

      if (!response.success) {
        setError(response.message);
        return;
      }

    } catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{heading || "Give stay to your guests"}</h1>
      <p className="mt-1 text-gray-600">{subHeading || "Add the details guests will see."}</p>

      <fieldset disabled={loading}>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error box (render only when there is an error) */}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>}

          {/* Title */}
          <ListingFormField
            id="title"
            label="Title"
            error={fieldErrors.title}
            type="text"
            placeholder="Cozy Beachfront Villa"
            value={formData.title}
            onChange={(e) => {
              clearErrors("title");
              handleChange(e);
            }} />

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-900">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe your listing..."
              className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              value={formData.description}
              onChange={(e) => {
                clearErrors("description");
                handleChange(e);
              }}
            />
            {fieldErrors.description &&
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.description}
              </p>}
          </div>

          {/* Price, country, location */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* price */}
            <ListingFormField
              id="price"
              label="Price"
              error={fieldErrors.price}
              type="number"
              min="1"
              placeholder="e.g. &#8377;1000"
              value={formData.price}
              onChange={(e) => {
                clearErrors("price");
                handleChange(e);
              }} />

            {/* location */}
            <ListingFormField
              id="location"
              label="Location"
              error={fieldErrors.location}
              type="text"
              placeholder="e.g. Jaipur, Mumbai"
              value={formData.location}
              onChange={(e) => {
                clearErrors("location");
                handleChange(e);
              }} />

            {/* country */}
            <ListingFormField
              id="country"
              label="Country"
              error={fieldErrors.country}
              type="text"
              placeholder="e.g. India"
              value={formData.country}
              onChange={(e) => {
                clearErrors("country");
                handleChange(e);
              }} />
          </div>

          {/* Image upload + preview */}
          <div>
            <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-gray-900">Photo</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="block w-full cursor-pointer rounded-xl border border-gray-300 text-sm text-gray-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-100 file:px-4 file:py-3 file:font-medium file:text-gray-900 hover:file:bg-gray-200"
              // value={image}
              onChange={handleFileChange}
            />
            {fieldErrors.image &&
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.image}
              </p>}
            <div className="flex justify-center items-center bg-cover mt-3 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
              {previewImage || initialData?.image ? <img src={previewImage || initialData?.image} alt="no image" className="h-full w-full object-cover" /> : "No image"}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-rose-500 py-3 font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : label}
          </button>
        </form>
      </fieldset>
    </div>
  );
}

export default ListingForm;