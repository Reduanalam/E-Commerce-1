import { useEffect, useState } from "react";
import { fetchProducts, fetchCategories } from "../../services/productService.js";
import { adminCreateProduct, adminDeleteProduct, uploadProductImage } from "../../services/adminService.js";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    category: "",
  });
  const [uploading, setUploading] = useState(false);

  const load = () => fetchProducts({ limit: 50 }).then((res) => setProducts(res.data));

  useEffect(() => {
    load();
    fetchCategories().then((res) => setCategories(res.data));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadProductImage(file);
      setForm((f) => ({ ...f, image: res.data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Please add a product image (upload or URL)");
      return;
    }
    try {
      await adminCreateProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category || undefined,
      });
      toast.success("Product created");
      setForm({ title: "", price: "", stock: "", description: "", image: "", category: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await adminDeleteProduct(id);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Manage Products</h1>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded-xl shadow-sm mb-6 grid grid-cols-2 gap-3">
        <input required placeholder="Title" className="border rounded-lg px-3 py-2"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select
          className="border rounded-lg px-3 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <input required type="number" placeholder="Price" className="border rounded-lg px-3 py-2"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input required type="number" placeholder="Stock" className="border rounded-lg px-3 py-2"
          value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Product Image</label>
          <div className="grid grid-cols-2 gap-3 items-start">
            <div>
              <p className="text-xs text-gray-500 mb-1">Option A — Upload from device</p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileChange}
                disabled={uploading}
                className="border rounded-lg px-3 py-2 w-full text-sm"
              />
              {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Option B — Paste an image URL</p>
              <input
                placeholder="https://..."
                className="border rounded-lg px-3 py-2 w-full text-sm"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
          </div>

          {form.image && (
            <div className="mt-3 flex items-center gap-3">
              <img src={form.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
              <button
                type="button"
                onClick={() => setForm({ ...form, image: "" })}
                className="text-xs text-red-500"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <textarea required placeholder="Description" className="border rounded-lg px-3 py-2 col-span-2"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button
          disabled={uploading}
          className="bg-primary-600 text-white py-2 rounded-lg font-semibold col-span-2 disabled:opacity-50"
        >
          Add Product
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {products.map((p) => (
          <div key={p._id} className="p-4 flex items-center gap-3">
            <img
              src={p.image}
              alt={p.title}
              className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-500">
                ৳{p.price} · Stock: {p.stock}
                {p.category?.name ? ` · ${p.category.name}` : ""}
              </p>
            </div>
            <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
