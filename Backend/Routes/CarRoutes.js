import express from'express'
import { addCar, deleteCarByRegNo, filter, getAdminByCarRegNo, getAllCars, getCarsByAdmin, getCarsByCompany, getCarsByYearOrHigher, getCarsSortedByRentalRate, getCarsSortedByYear, updateCarByRegNo } from '../controllers/car.controllers.js';
import { protectedAdminRoute } from '../middleware/admin.middleware.js';

const router = express.Router()

router.post('/add-cars',protectedAdminRoute,addCar);
router.get('/get-cars',getAllCars);
router.post("/year", getCarsByYearOrHigher);
router.post("/company", getCarsByCompany);
router.put("/update/:Reg_No", updateCarByRegNo);
router.get("/sorted-by-rental", getCarsSortedByRentalRate);
router.get("/sorted-by-year", getCarsSortedByYear);
router.post("/admin-details",getAdminByCarRegNo)
router.get("/filter",filter)
router.delete("/delete/:Reg_No", protectedAdminRoute,deleteCarByRegNo);
router.get('/my-cars', protectedAdminRoute, getCarsByAdmin);

//router.patch("/availability/:Reg_No", updateCarAvailability);



export default router;
