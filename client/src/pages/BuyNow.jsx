import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchProductById } from "../services/productService.js";
import { placeDirectOrderApi } from "../services/orderService.js";
import PaymentMethodSelector from "../components/PaymentMethodSelector.jsx";

export default function BuyNow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [manualPayment, setManualPayment] = useState({ senderNumber: "", transactionId: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductById(id).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="max-w-3xl mx-auto px-4 py-8">Loading...</p>;

  const finalPrice = product.price - (product.price * product.discount) / 100;
  const subtotal = finalPrice * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await placeDirectOrderApi({
        productId: product._id,
        quantity,
        shippingAddress: form,
        paymentMethod,
        manualPayment: paymentMethod !== "cod" ? manualPayment : undefined,
      });
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Buy Now</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <p className="font-medium">{product.title}</p>
          <p className="text-primary-600 font-bold">৳{finalPrice.toFixed(0)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 border rounded-lg"
          >
            −
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="w-8 h-8 border rounded-lg"
          >
            +
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            placeholder="Full Name"
            className="border rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            placeholder="Phone"
            className="border rounded-lg px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <input
          required
          placeholder="Street Address"
          className="border rounded-lg px-3 py-2 w-full"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            required
            placeholder="City"
            className="border rounded-lg px-3 py-2"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            placeholder="District"
            className="border rounded-lg px-3 py-2"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
          <input
            placeholder="Postal Code"
            className="border rounded-lg px-3 py-2"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
        </div>

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          manualPayment={manualPayment}
          setManualPayment={setManualPayment}
        />

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="font-bold text-lg">Total: ৳{(subtotal + 60).toFixed(0)}</span>
          <button
            type="submit"
            disabled={loading || product.stock === 0}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Confirm Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
