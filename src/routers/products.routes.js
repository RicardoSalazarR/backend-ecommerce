const { Router } = require("express");
const {
  getProducts,
  postProduct,
  getById,
  getByCat,
  filterP,
  updProduct,
  deleteOneProduct,
  addImage
} = require("../controllers/products.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products whose quantity is greater than 0
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getProducts'
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: something went wrong
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: add a new product
 *     tags: [Products]
 *     requestBody:
 *       description: required fields to add a new products
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/postProduct'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product created
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: something went wrong
 */

router.get("/", getProducts); //get all products
//https://e-commerce-api-v2.academlo.tech/api/v1/products?title=samsung
// filter name and category
router.post("/", authMiddleware, postProduct);
router.get("/:id", getById); //get a product by id
router.put("/:id", updProduct);
router.get("/category/:id", getByCat); //get by category
router.get("/filter/:filter", filterP);
router.delete('/:id',deleteOneProduct)
router.post("/image",addImage)

module.exports = router;
