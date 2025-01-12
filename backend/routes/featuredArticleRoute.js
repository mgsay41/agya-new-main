import express  from "express";
import { add,deleteFeatured,getAll,update} from "../controllers/Featured.js";
const router = express.Router();

// User management routes
router.post('/addFeatured', add);
router.delete("/deleteFeatured", deleteFeatured);
router.get('/all-featured', getAll);
router.put('/update-featured', update);

export default router;
