const productsService = require("../services/products.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const getProducts = async (req, res,next) => {
  try {
    result = await productsService.get();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res,next) => {
  try {
    const { id } = req.params;
    result = await productsService.getOne(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const postProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      available_qty,
      brand,
      category_id,
      image,
    } = req.body;

    const product = {
      title,
      description,
      price,
      available_qty,
      brand,
      category_id,
      image,
    };
    const result = await productsService.create(product);
    if (result) {
      const imagen = await productsService.addImage(result.id, image);
      if (imagen) {
        res.status(201).json("Product created");
      } else {
        await productsService.destroyProduct(result.id);
        next({ message: "Algo salio mal" });
      }
    } else {
      next({message:"error"});
    }
  } catch (error) {
    next(error);
  }
};

const getByCat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productsService.getByCat(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const filterP = async (req, res, next) => {
  try {
    const { filter } = req.params;
    const result = await productsService.filter(filter);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      quantity: available_qty,
      image,
    } = req.body;
    const data = { title, description, price, available_qty, image };

    const updated = await productsService.updProduct(id, data);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteOneProduct=async(req,res,next)=>{
  try {
    const {id} = req.params
    const result = await productsService.deleteProduct(id)
    if(result){
      res.json({message:'todo bien'})
    }else{
      res.json({message:'no se pudo campeon'})
    }
  } catch (error) {
    next(error)
  }
}

const addImage = async(req,res,next)=>{
  try {
    const {productId,images} = req.body
    let added
    images.map(async image=>{
       await productsService.addImage(productId, image)
    })
    res.status(200).json('Imagenes agregadas correctamente')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  postProduct,
  getById,
  getByCat,
  filterP,
  updProduct,
  deleteOneProduct,
  addImage
};
