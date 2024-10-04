import { Router } from "express"
import {getCategories,getCategoriesRestore,getCategory,createCategory,updateCategory,deleteCategory,restoreCategory} from '../controllers/categories.controllers.js'

const router = Router()

router.get('/categories',getCategories)

router.get('/categories/restore',getCategoriesRestore)

router.get('/category/:id',getCategory)

router.post('/category',createCategory)

router.put('/category/:id',updateCategory)

router.delete('/category/:id',deleteCategory)

router.delete('/category/restore/:id',restoreCategory)


export default router