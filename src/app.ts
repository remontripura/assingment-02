import express, { Request, Response } from "express";
import initDB from "./config/db";
import { SignupRoute } from "./modules/auth/auth.route";
import { bookingsRoute } from "./modules/bookings/bookings.routes";
import { userRoutes } from "./modules/users/users.route";
import { vehiclesRoute } from "./modules/vehicles/vehicles.routes";
const app = express();

app.use(express.json());

initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", SignupRoute);
app.use("/api/v1/vehicles", vehiclesRoute);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingsRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});
export default app;
