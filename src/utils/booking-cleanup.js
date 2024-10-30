import cron from "node-cron";
import { Op } from "sequelize";
import BookingCar from "../modules/user/models/booking-cars-model.js";

// Run every minute to update expired pending bookings as failed
export function startCleanupCron() {
  cron.schedule("* * * * *", async () => {
    try {
      const expiredTime = new Date(new Date() - 5 * 60000);

      await BookingCar.update(
        { status: "failed" }, // Update status to "failed"
        {
          where: {
            status: "pending",
            createdAt: { [Op.lte]: expiredTime },
          },
        }
      );
    } catch (error) {
      console.error("Error in cleanup cron job:", error);
    }
  });
}
