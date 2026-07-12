import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          ShopBD
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist">Wishlist</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            🛒
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm font-medium">
                {userInfo.name}
              </Link>
              {userInfo.role === "admin" && (
                <Link to="/admin" className="text-sm text-primary-600 font-medium">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm text-red-500">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary-600 text-white px-3 py-1.5 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
