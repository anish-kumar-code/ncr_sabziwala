const newOrder = require("../../../models/newOrder");
const catchAsync = require("../../../utils/catchAsync");

exports.changeOrderStatus = catchAsync(async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status, preparationTime } = req.body;

        const allowedStatuses = ["accepted", "preparing", "delay", "ready", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid order status" });
        }

        if (status == "preparing" && (!preparationTime || preparationTime <= 0)) {
            return res.status(400).json({ success: false, message: "Enter correct time" });
        }

        const order = await newOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (status == "delay") {
            order.preparationTime += preparationTime;
            await order.save();
            return res.status(200).json({ success: true, message: "Preparation time extended", order });
        }

        if (status == "cancelled" && order.orderStatus !== "pending") {
            return res.status(404).json({ success: false, message: "You can't cancle this order" });
        }

        if (status == "cancelled" && order.orderStatus == "pending") {
            order.orderStatus = "cancelled";
            await order.save()
            return res.status(200).json({ success: true, message: "Order cancelled" });
        }

        // Guard: If already marked ready, do not allow further changes
        if (order.orderStatus == "ready" ||
            order.orderStatus == "shipped" ||
            order.orderStatus == "running" ||
            order.orderStatus == "out of delivery" ||
            order.orderStatus == "delivered" ||
            order.orderStatus == "cancelled"
        ) {
            return res.status(400).json({ success: false, message: "You cannot be update status." });
        }

        // Handle logic based on status
        switch (status) {
            case "accepted":
                order.orderStatus = "accepted";
                // if (preparationTime) {
                //     order.preparationTime = preparationTime;
                //     order.preparationStartedAt = new Date();
                // }
                break;

            case "preparing":
                order.preparationStartedAt = new Date();
                order.preparationTime = preparationTime;
                order.orderStatus = "preparing";
                break;

            case "ready":
                if (order.orderStatus !== "preparing") {
                    return res.status(400).json({
                        success: false,
                        message: "Order must be in accepted."
                    });
                }
                order.orderStatus = "ready";
                order.readyAt = new Date();
                break;

            case "cancelled":
            case "shipped":
            case "out of delivery":
            case "delivered":
                order.orderStatus = status;
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid status update request." });
        }

        await order.save();
        return res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});
