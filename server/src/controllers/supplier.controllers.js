import { pool } from '../db.js';

// Obtener todos los proveedores
export const getSuppliers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Proveedores');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores', error });
    }
};

// Obtener un proveedor por ID
export const getSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Proveedores WHERE ProveedorID = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedor', error });
    }
};

// Crear un nuevo proveedor
export const createSuppliers = async (req, res) => {
    try {
        const { Nombre, Contacto, Teléfono, Dirección } = req.body;
        const [result] = await pool.query('INSERT INTO Proveedores (Nombre, Contacto, Teléfono, Dirección) VALUES (?, ?, ?, ?)', 
            [Nombre, Contacto, Teléfono, Dirección]
        );

        res.json({ message: 'Proveedor creado', ProveedorID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear proveedor', error });
    }
};

// Actualizar un proveedor existente
export const updateSuppliers = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, Contacto, Teléfono, Dirección } = req.body;

        const [result] = await pool.query(
            'UPDATE Proveedores SET Nombre = ?, Contacto = ?, Teléfono = ?, Dirección = ? WHERE ProveedorID = ?', 
            [Nombre, Contacto, Teléfono, Dirección, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        res.json({ message: 'Proveedor actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar proveedor', error });
    }
};

// Eliminar un proveedor
export const deleteSuppliers = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM Proveedores WHERE ProveedorID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar proveedor', error });
    }
};
