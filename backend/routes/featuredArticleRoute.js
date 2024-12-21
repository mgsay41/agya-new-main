import express  from "express";
import { add,deleteFeatured,getAll} from "../controllers/Featured.js";
const router = express.Router();

// User management routes
router.post('/addFeatured', add);
router.delete("/deleteFeatured", deleteFeatured);
router.get('/all', getAll);

export default router;