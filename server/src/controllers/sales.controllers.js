import { pool } from '../db.js';
// Crear una nueva venta
export const createVenta = async (req, res) => {
    const {
        usuarioId, departamento, municipio, descuento, costoEnvio, subtotal, total, tiempoDiasEntrega,
        quienRecibe, direccionEnvio, cartItems
    } = req.body;

    try {
        // Insertar la venta
        const [result] = await pool.query(
            `INSERT INTO Ventas (UsuarioID, Departamento, Municipio, Descuento, CostoEnvio, Subtotal, Total, TiempoDiasEntrega, QuienRecibe, DireccionEnvio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuarioId, departamento, municipio, descuento, costoEnvio, subtotal, total, tiempoDiasEntrega, quienRecibe, direccionEnvio]
        );

        const ventaId = result.insertId;

        // Insertar productos de la venta
        for (const item of cartItems) {
            await pool.query(
                `INSERT INTO VentasProductos (VentaID, ProductoID, Cantidad, PrecioProducto) VALUES (?, ?, ?, ?)`,
                [ventaId, item.ProductoID, item.quantity, item.Precio]
            );
        }

        res.json({ message: 'Venta creada exitosamente', ventaId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la venta' });
    }
};

// Obtener todas las ventas
export const getVentas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Ventas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
};

// Obtener una venta por ID
export const getVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const [venta] = await pool.query('SELECT * FROM Ventas WHERE VentaID = ?', [id]);
        if (venta.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });

        const [productos] = await pool.query('SELECT * FROM VentasProductos WHERE VentaID = ?', [id]);

        res.json({ venta: venta[0], productos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la venta' });
    }
};

// Actualizar el estado del envío de una venta
export const updateEstadoEnvio = async (req, res) => {
    const { id } = req.params;
    const { estadoEnvio } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE Ventas SET EstadoEnvio = ? WHERE VentaID = ?',
            [estadoEnvio, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Venta no encontrada' });

        res.json({ message: 'Estado de envío actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado de envío' });
    }
};
