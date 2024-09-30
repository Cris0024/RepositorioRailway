import { pool } from '../db.js'; 

export const getSales = async (req, res) => {
  try {
    const [ventas] = await pool.query('SELECT * FROM Ventas');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSale = async (req, res) => {
  const { id } = req.params;
  try {
    const [venta] = await pool.query('SELECT * FROM Ventas WHERE VentaID = ?', [id]);
    if (venta.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(venta[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSale = async (req, res) => {
  const { ClienteID, Total } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Ventas (ClienteID, Total) VALUES (?, ?)', [ClienteID, Total]);
    res.status(201).json({ id: result.insertId, ClienteID, Fecha: new Date(), Total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSale = async (req, res) => {
  const { id } = req.params;
  const { ClienteID, Total } = req.body;
  try {
    const [result] = await pool.query('UPDATE Ventas SET ClienteID = ?, Total = ? WHERE VentaID = ?', 
      [ClienteID, Total, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json({ message: 'Venta actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSale = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Ventas WHERE VentaID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json({ message: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
