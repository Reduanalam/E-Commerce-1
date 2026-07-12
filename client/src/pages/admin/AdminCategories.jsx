import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const load = () => api.get("/categories").then((res) => setCategories(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/categories", { name });
      toast.success("Category added");
      setName("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/categories/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Manage Categories</h1>
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          required
          placeholder="Category name"
          className="border rounded-lg px-3 py-2 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-primary-600 text-white px-4 rounded-lg font-semibold">Add</button>
      </form>
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {categories.map((c) => (
          <div key={c._id} className="p-4 flex justify-between">
            <span>{c.name}</span>
            <button onClick={() => handleDelete(c._id)} className="text-red-500 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
