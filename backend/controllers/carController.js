import Car from "../models/Car.js";
import User from "../models/User.js";

export const addCar = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      brand,
      model,
      year,
      pricePerDay,
      fuelType,
      seats,
      description,
      carImageUrl,
    } = req.body;

    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add cars" });
    }

    if (!carImageUrl) {
      return res.status(400).json({ message: "Car image URL is required" });
    }

    const car = await Car.create({
      brand,
      model,
      year,
      pricePerDay,
      fuelType,
      seats,
      description,
      carImage: carImageUrl, // Save Uploadcare URL directly
    });

    res
      .status(201)
      .json({ success: true, message: "Car added successfully", car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in adding car", error });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id).populate("bookingId").lean();

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const carData = {
      ...car,
      carImage: car.carImage || null, // Now carImage is a URL string
    };

    res.status(200).json({ success: true, car: carData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in getting car by ID", error });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({}).lean();

    const carsWithImages = cars
      .map((car) => ({
        ...car,
        carImage: car.carImage || null, // URL directly, no processing needed
      }))
      .reverse();

    res.status(200).json({ success: true, cars: carsWithImages });
  } catch (error) {
    console.error("Error getting all cars:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({ message: "Car id is required" });
    }

    await Car.findByIdAndDelete(carId);
    res
      .status(200)
      .json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in deleting car", error });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePerDay } = req.body;

    // Updating the car with the new pricePerDay
    const car = await Car.findByIdAndUpdate(id, { pricePerDay }, { new: true });

    // Sending a success response with the updated car info
    res
      .status(200)
      .json({ success: true, message: "Price updated successfully", car });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in updating car", error });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({ message: "Car id is required" });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    car.available = !car.available;
    await car.save();

    res.status(200).json({ success: true, message: "Car status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in updating car", error });
  }
};
