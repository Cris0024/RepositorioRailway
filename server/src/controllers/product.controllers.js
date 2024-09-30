import { pool } from '../db.js'; // Asegúrate de importar tu pool de conexiones

export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM Productos');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await pool.query('SELECT * FROM Productos WHERE ProductoID = ?', [id]);
    if (product.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProducts = async (req, res) => {
  const { Nombre, Descripcion, Precio, CategoriaID, ProveedorID } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Productos (Nombre, Descripcion, Precio, CategoriaID, ProveedorID) VALUES (?, ?, ?, ?, ?)', 
      [Nombre, Descripcion, Precio, CategoriaID, ProveedorID]);
    res.status(201).json({ id: result.insertId, Nombre, Descripcion, Precio, CategoriaID, ProveedorID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProducts = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, Precio, CategoriaID, ProveedorID } = req.body;
  try {
    const [result] = await pool.query('UPDATE Productos SET Nombre = ?, Descripcion = ?, Precio = ?, CategoriaID = ?, ProveedorID = ? WHERE ProductoID = ?', 
      [Nombre, Descripcion, Precio, CategoriaID, ProveedorID, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Productos WHERE ProductoID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
