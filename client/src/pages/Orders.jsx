import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../services/orderService.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>কোনো অর্ডার পাওয়া যায়নি।</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between">
                <span className="font-medium">Order #{order._id.slice(-8)}</span>
                <span className="capitalize text-sm bg-gray-100 px-2 py-1 rounded">{order.orderStatus}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {order.items.length} items · ৳{order.total.toFixed(0)} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
