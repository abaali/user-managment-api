import { Router } from "express";
import { isAuthenticated, HasRole } from "../utils/auth";
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router
  .route("/user/:id")
  .get(getUser)
  .put(isAuthenticated, updateUser)
  .delete(isAuthenticated, HasRole("admin", false), deleteUser);

router.route("/users").get(getAllUsers);
export default router;
