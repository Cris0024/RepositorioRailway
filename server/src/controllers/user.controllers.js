import bcrypt from 'bcryptjs';
import {pool} from '../db.js';

export const registerUser = async (req, res) => {
    const { Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario, UsuarioIDGoogle } = req.body;
  
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
  
      // Si la contraseña es null o vacía (para usuarios de Google), no encriptar
      const hashedPassword = Contraseña ? await bcrypt.hash(Contraseña, 10) : null;
  
      // Insertar nuevo usuario en la base de datos
      await pool.query(
        'INSERT INTO Usuarios (Nombre, CorreoElectronico, usuario, Contraseña, NivelUsuario, UsuarioIDGoogle) VALUES (?, ?, ?, ?, ?, ?)', 
        [Nombre, CorreoElectronico, usuario, hashedPassword, NivelUsuario, UsuarioIDGoogle]
      );
  
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
      console.error('Error en el registro:', error); // Añadir un log detallado del error en la consola del servidor
      res.status(500).json({ message: 'Error al registrar el usuario', error: error.message }); // Enviar el mensaje exacto del error al frontend
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
    const { Nombre, CorreoElectronico, usuario} = req.body;

    try {
        // Verificar si el usuario existe
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE UsuarioID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si se proporciona una nueva contraseña, encriptarla
        //let hashedPassword = rows[0].Contraseña;
        //if (Contraseña) {
        //    hashedPassword = await bcrypt.hash(Contraseña, 10);
        //}

        // Actualizar el usuario
        await pool.query('UPDATE Usuarios SET Nombre = ?, CorreoElectronico = ?, usuario = ? WHERE UsuarioID = ?', 
            [Nombre, CorreoElectronico, usuario, id]);

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

// Obtener un usuario por nombre de usuario
export const getUserByUsername = async (req, res) => {
    const { usuario } = req.params; // Capturar el nombre de usuario de los parámetros

    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE usuario = ?', [usuario]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]); // Devolver solo el primer usuario encontrado
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario por nombre', error });
    }
};

// Controlador para cambiar la contraseña
export const changeUserPassword = async (req, res) => {
    const { id } = req.params;
    const { contrasenaActual, nuevaContrasena, repetirContrasena } = req.body;

    try {
        // Verificar si el usuario existe
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE UsuarioID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

        // Verificar si la contraseña actual coincide
        const isMatch = await bcrypt.compare(contrasenaActual, user.Contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Verificar si la nueva contraseña y repetir contraseña coinciden
        if (nuevaContrasena !== repetirContrasena) {
            return res.status(400).json({ message: 'Las nuevas contraseñas no coinciden' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        // Actualizar la contraseña en la base de datos
        await pool.query('UPDATE Usuarios SET Contraseña = ? WHERE UsuarioID = ?', [hashedPassword, id]);

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña', error });
    }
};