import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchProductById } from "../services/productService.js";
import { addToCartThunk } from "../redux/slices/cartSlice.js";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetchProductById(id).then((res) => {
      setProduct(res.data);
      setActiveImage(res.data.image);
    });
  }, [id]);

  if (!product) return <p className="max-w-7xl mx-auto px-4 py-8">Loading...</p>;

  const finalPrice = product.price - (product.price * product.discount) / 100;
  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);

  const handleAddToCart = () => {
    dispatch(addToCartThunk({ productId: product._id, quantity: qty }))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch(() => toast.error("Please login first"));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {activeImage ? (
            <img src={activeImage} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                  activeImage === img ? "border-primary-600" : "border-transparent"
                }`}
              >
                <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-primary-600">৳{finalPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="text-gray-400 line-through">৳{product.price}</span>
          )}
        </div>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <p className="text-sm mb-4">Stock: {product.stock > 0 ? product.stock : "Out of stock"}</p>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="border rounded-lg w-20 px-3 py-2"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="border border-primary-600 text-primary-600 px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(`/buy-now/${product._id}`)}
            disabled={product.stock === 0}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
