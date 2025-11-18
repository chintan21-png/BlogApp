const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");
const {getDashBoardSummary} = require("../controllers/dashboardController");

const adminOnly = (req,res,next) => {
    if(req.user && req.user.role == 'admin') {
        next();
    }
    else {
        res.status(403).json({message:"Admin access Only"});
    }
};

router.get("/",protect, adminOnly, getDashBoardSummary);
module.exports = router;