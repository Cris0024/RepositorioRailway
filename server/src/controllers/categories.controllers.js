import { pool } from '../db.js'; // Asegúrate de tener la conexión de MySQL aquí.

export const getCategories = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Categorias');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

export const getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Categorias WHERE CategoriaID = ?', [id]);
        if (rows.length <= 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener la categoría' });
    }
};

export const createCategory = async (req, res) => {
    const { Nombre } = req.body; // Nombre viene en el cuerpo de la solicitud
    if (!Nombre) {
        return res.status(400).json({ message: 'El campo Nombre es requerido' });
    }
    
    try {
        const [result] = await pool.query('INSERT INTO Categorias (Nombre) VALUES (?)', [Nombre]);
        res.json({
            id: result.insertId,
            Nombre
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El nombre de la categoría ya existe' });
        }
        return res.status(500).json({ message: 'Error al crear la categoría' });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    try {
        const [result] = await pool.query('UPDATE Categorias SET Nombre = ? WHERE CategoriaID = ?', [Nombre, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Categorias WHERE CategoriaID = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
};
