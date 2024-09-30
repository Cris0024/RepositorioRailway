import { pool } from '../db.js'; // Asegúrate de importar tu pool de conexiones

export const getDetailsSales = async (req, res) => {
  try {
    const [detallesVentas] = await pool.query('SELECT * FROM DetallesVenta');
    res.json(detallesVentas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetailSale = async (req, res) => {
  const { id } = req.params;
  try {
    const [detalleVenta] = await pool.query('SELECT * FROM DetallesVenta WHERE DetalleVentaID = ?', [id]);
    if (detalleVenta.length === 0) return res.status(404).json({ message: 'Detalle de venta no encontrado' });
    res.json(detalleVenta[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDetailSale = async (req, res) => {
  const { VentaID, ProductoID, Cantidad, Precio } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO DetallesVenta (VentaID, ProductoID, Cantidad, Precio) VALUES (?, ?, ?, ?)', 
      [VentaID, ProductoID, Cantidad, Precio]);
    res.status(201).json({ id: result.insertId, VentaID, ProductoID, Cantidad, Precio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDetailSale = async (req, res) => {
  const { id } = req.params;
  const { VentaID, ProductoID, Cantidad, Precio } = req.body;
  try {
    const [result] = await pool.query('UPDATE DetallesVenta SET VentaID = ?, ProductoID = ?, Cantidad = ?, Precio = ? WHERE DetalleVentaID = ?', 
      [VentaID, ProductoID, Cantidad, Precio, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Detalle de venta no encontrado' });
    res.json({ message: 'Detalle de venta actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDetailSale = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM DetallesVenta WHERE DetalleVentaID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Detalle de venta no encontrado' });
    res.json({ message: 'Detalle de venta eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
