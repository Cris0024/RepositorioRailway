import bcrypt from 'bcryptjs';
import {pool} from '../db.js';

// Registrar un usuario
export const registerUser = async (req, res) => {
    const { Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario } = req.body;

    try {
        // Verificar si el correo ya existe
        const [emailRows] = await pool.query('SELECT * FROM Usuarios WHERE CorreoElectronico = ?', [CorreoElectronico]);
        if (emailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Verificar si el nombre de usuario ya existe
        const [userRows] = await pool.query('SELECT * FROM Usuarios WHERE usuario = ?', [usuario]);
        if (userRows.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(Contraseña, 10);

        // Insertar nuevo usuario en la base de datos
        await pool.query('INSERT INTO Usuarios (Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario) VALUES (?, ?, ?, ?, ?)', 
            [Nombre, CorreoElectronico, usuario, hashedPassword, NivelUsuario]);

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};

// Iniciar sesión con correo electrónico o usuario
export const loginUser = async (req, res) => {
    const { CorreoElectronico, usuario, Contraseña } = req.body;

    try {
        let query;
        let param;

        // Determinar si el login es con correo o con usuario
        if (CorreoElectronico) {
            query = 'SELECT * FROM Usuarios WHERE CorreoElectronico = ?';
            param = CorreoElectronico;
        } else if (usuario) {
            query = 'SELECT * FROM Usuarios WHERE usuario = ?';
            param = usuario;
        } else {
            return res.status(400).json({ message: 'Se requiere correo electrónico o nombre de usuario' });
        }

        // Buscar al usuario por correo o por nombre de usuario
        const [rows] = await pool.query(query, [param]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Correo o Usuario incorrectos' });
        }

        const user = rows[0];

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(Contraseña, user.Contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Enviar el mensaje de éxito junto con el NivelUsuario
        res.json({ 
            message: 'Inicio de sesión exitoso',
            NivelUsuario: user.NivelUsuario // Incluyendo el nivel de usuario
        });
    } catch (error) {
        console.error(error); // Para depuración
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};
    

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE UsuarioID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario } = req.body;

    try {
        // Verificar si el usuario existe
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE UsuarioID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si se proporciona una nueva contraseña, encriptarla
        let hashedPassword = rows[0].Contraseña;
        if (Contraseña) {
            hashedPassword = await bcrypt.hash(Contraseña, 10);
        }

        // Actualizar el usuario
        await pool.query('UPDATE Usuarios SET Nombre = ?, CorreoElectronico = ?, usuario = ?, Contraseña = ?, NivelUsuario = ? WHERE UsuarioID = ?', 
            [Nombre, CorreoElectronico, usuario, hashedPassword, NivelUsuario, id]);

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el usuario existe
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE UsuarioID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Eliminar el usuario
        await pool.query('DELETE FROM Usuarios WHERE UsuarioID = ?', [id]);

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};
