import express from "express";
import {
  getCarById,
  addCar,
  getAllCars,
  updateCar,
  deleteCar,
  changeStatus,
} from "../controllers/carController.js";
import protectRoute from "../middleware/protectRoute.js";
// import upload from "../middleware/multer.js";

const carRouter = express.Router();

carRouter.get("/get-cars", getAllCars);
carRouter.get("/get-specific-car/:id", getCarById);

// carRouter.post("/add-car", protectRoute, upload.single("carImage"), addCar);

carRouter.post("/add-car", protectRoute, addCar);

carRouter.put("/update-car/:id", updateCar);

carRouter.delete("/delete-car", deleteCar);
carRouter.post("/change-status", changeStatus);

export default carRouter;
