const Router = require("express");
const { getCategories } = require("../controllers/categories.controller");


const router = Router();

router.get("/",getCategories); //get all categories


module.exports = router;