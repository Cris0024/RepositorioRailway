import { Router } from "express";
import { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser,getUserByUsername, changeUserPassword } from "../controllers/user.controllers.js";

const router = Router();

// Ruta para el registro de usuarios
router.post("/register", registerUser);

// Ruta para el inicio de sesión
router.post("/login", loginUser);

// Ruta para obtener todos los usuarios
router.get("/users", getUsers);

// Ruta para obtener un usuario específico por ID
router.get("/users/:id", getUserById);

// Ruta para actualizar un usuario por ID
router.put("/users/:id", updateUser);

// Ruta para eliminar un usuario por ID
router.delete("/users/:id", deleteUser);

// Ruta para cambiar la contraseña
router.put("/users/change-password/:id", changeUserPassword);

router.get("/users/username/:usuario", getUserByUsername);
export default router;

