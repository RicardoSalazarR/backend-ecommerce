const Router = require("express");
const { postProduct, getCart,deleteProduct, updateQty } = require("../controllers/cart.controller");
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();


/**
 * @openapi
 * /api/v1/cart:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all the  products in the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getCart'
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
 *     summary: add a pproduct to the cart
 *     tags: [Cart]
 *     requestBody:
 *       description: required fields to add a new product to the cart
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addCart'
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


router.get("/", getCart); //get cart using a token
router.post("/", postProduct); //add a product into the cart
router.delete('/:id',deleteProduct) //delete a product from the cart
router.put('/:id',updateQty)//update a product quantity

module.exports = router;
