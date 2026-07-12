import express from "express";
import { protect, authorize } from "../middleware/auth.js";

import { createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { createCategory, updateCategory, deleteCategory, createBrand } from "../controllers/categoryController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controllers/couponController.js";
import { getUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);

router.post("/upload", upload.single("image"), uploadImage);

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.post("/brands", createBrand);

router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
