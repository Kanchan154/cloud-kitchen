import express from 'express'
import { isAuth, isSeller } from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';
import { addMenuItem, deleteMenuItem, getAllMenuItems, toggleMenuItemAvailability } from '../controllers/menuItem.controller.js';
const router = express.Router();

router.post("/add-new", isAuth, isSeller, uploadFile, addMenuItem);
router.get('/get-all/:id', isAuth, getAllMenuItems);
router.delete('/delete/:id', isAuth, isSeller, deleteMenuItem);
router.get('/toggle-availability/:id', isAuth, isSeller, toggleMenuItemAvailability);
export default router