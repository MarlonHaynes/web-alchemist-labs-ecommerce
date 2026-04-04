import { useState } from "react";

const initialFormState = {
  id: "",
  title: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
};

export default function AdminProductForm({
  initialValues = initialFormState,
  onSubmit,
  submitLabel,
  isEditMode = false,
}) {
  const [formData, setFormData] = useState({
    id: initialValues.id || "",
    title: initialValues.title || "",
    description: initialValues.description || "",
    price: initialValues.price?.toString() || "",
    image: initialValues.image || "",
    category: initialValues.category || "",
    stock: initialValues.stock?.toString() || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const requiredFields = [
      "id",
      "title",
      "description",
      "price",
      "image",
      "category",
      "stock",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !String(formData[field]).trim()
    );

    if (hasEmptyField) {
      setErrorMessage("Please complete all product fields.");
      return;
    }

    const parsedPrice = Number(formData.price);
    const parsedStock = Number(formData.stock);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Price must be a valid positive number.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setErrorMessage("Stock must be a valid whole number.");
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        id: formData.id.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parsedPrice,
        image: formData.image.trim(),
        category: formData.category.trim().toLowerCase(),
        stock: parsedStock,
      });
    } catch (error) {
      setErrorMessage("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-product-form">
      <div className="form-group">
        <label htmlFor="id">Product ID</label>
        <input
          id="id"
          name="id"
          type="text"
          value={formData.id}
          onChange={handleChange}
          disabled={isEditMode}
        />
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="admin-form-grid-two">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          name="image"
          type="text"
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}