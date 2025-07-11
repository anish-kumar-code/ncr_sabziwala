const banner = require("../../../models/banner");
const Category = require("../../../models/category");
const Driver = require("../../../models/driver");
const newOrder = require("../../../models/newOrder");
const Product = require("../../../models/product");
const Service = require("../../../models/service");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllData = catchAsync(async (req, res, next) => {
    try {

        const categories = await Category.find({ cat_id: null }).populate({ path: "serviceId", select: "name" });


        const subCategories = await Category.find({ cat_id: { $ne: null } });


        const services = await Service.find();
        const productCount = [];
        for (let service of services) {
            const count = await Product.countDocuments({ serviceId: service._id })
            productCount.push({ name: service.name, productCount: count })
        }

        const bannerCount = await banner.countDocuments();
        const driverCount = await Driver.countDocuments();
        const userCount = await User.countDocuments();
        const orderCount = await newOrder.countDocuments();

        let countData = {
            banner: bannerCount || 10,
            category: categories.length,
            subCategory: subCategories.length,
            food: productCount[0].productCount,
            grocery: productCount[1].productCount,
            vendor: 10,
            driver: driverCount || 10,
            user: userCount || 10,
            order: orderCount || 10
        }

        return res.status(200).json({ success: true, message: "Data found", data: { countData } })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})