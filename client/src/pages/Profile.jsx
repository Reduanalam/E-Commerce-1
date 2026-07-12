import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-6">My Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-2">
        <p><span className="font-medium">Name:</span> {userInfo?.name}</p>
        <p><span className="font-medium">Email:</span> {userInfo?.email}</p>
        <p><span className="font-medium">Role:</span> {userInfo?.role}</p>
      </div>
      <Link to="/orders" className="inline-block mt-6 text-primary-600 font-medium">
        View My Orders →
      </Link>
    </div>
  );
}
