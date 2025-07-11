const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getCategory = catchAsync(async (req, res) => {

    const allCategory = await Category.find({ cat_id: null }).sort({ createdAt: -1 });

    
    return res.status(200).json({
        status: true,
        results: allCategory.length,
        data: allCategory
    })

})