import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { NewsController } from "./news.controller.js";

const router = Router();

// Admin management (must come before the public /:slug route).
router.get("/admin/all", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsController.getAllNews);
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsController.createNews);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsController.updateNews);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsController.deleteNews);

// Public reads.
router.get("/", NewsController.getPublishedNews);
router.get("/:slug", NewsController.getNewsBySlug);

export const NewsRoutes = router;
