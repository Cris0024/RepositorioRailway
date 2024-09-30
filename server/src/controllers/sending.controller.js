import { pool } from '../db.js'; // Asegúrate de importar tu pool de conexiones

export const getSendings = async (req, res) => {
  try {
    const [envios] = await pool.query('SELECT * FROM Envíos');
    res.json(envios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSending = async (req, res) => {
  const { id } = req.params;
  try {
    const [envio] = await pool.query('SELECT * FROM Envíos WHERE EnvíoID = ?', [id]);
    if (envio.length === 0) return res.status(404).json({ message: 'Envío no encontrado' });
    res.json(envio[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSending = async (req, res) => {
  const { VentaID, Dirección, Estado } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Envíos (VentaID, Dirección, Estado) VALUES (?, ?, ?)', 
      [VentaID, Dirección, Estado]);
    res.status(201).json({ id: result.insertId, VentaID, Dirección, FechaEnvio: new Date(), Estado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSending = async (req, res) => {
  const { id } = req.params;
  const { VentaID, Dirección, Estado } = req.body;
  try {
    const [result] = await pool.query('UPDATE Envíos SET VentaID = ?, Dirección = ?, Estado = ? WHERE EnvíoID = ?', 
      [VentaID, Dirección, Estado, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Envío no encontrado' });
    res.json({ message: 'Envío actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSending = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Envíos WHERE EnvíoID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Envío no encontrado' });
    res.json({ message: 'Envío eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
