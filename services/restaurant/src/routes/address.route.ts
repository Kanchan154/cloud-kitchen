import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { addAddress, deleteAddress, getAllAddresses } from "../controllers/address.controller.js";
const router = express.Router();

router.post("/add-address", isAuth, addAddress);
router.get('/get-all', isAuth, getAllAddresses);
router.delete('/delete-address/:id', isAuth, deleteAddress);

export default router;