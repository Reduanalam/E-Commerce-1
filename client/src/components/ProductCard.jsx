import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCartThunk } from "../redux/slices/cartSlice.js";

const DEFAULT_IMAGE = "https://www.herlan.com/wp-content/uploads/2023/12/1-768x768.webp";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const finalPrice = product.price - (product.price * product.discount) / 100;
  const link = `/products/${product.slug || product._id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCartThunk({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch(() => toast.error("Please login first"));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/buy-now/${product._id}`);
  };

  return (
    <Link
      to={link}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col"
    >
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
        <img
          src={product.image || DEFAULT_IMAGE}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
      <div className="mt-1 flex items-center gap-2 mb-3">
        <span className="font-bold text-primary-600">৳{finalPrice.toFixed(0)}</span>
        {product.discount > 0 && (
          <span className="text-xs text-gray-400 line-through">৳{product.price}</span>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="text-xs font-medium border border-primary-600 text-primary-600 rounded-lg py-1.5 disabled:opacity-40"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="text-xs font-medium bg-primary-600 text-white rounded-lg py-1.5 disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>
    </Link>
  );
}
