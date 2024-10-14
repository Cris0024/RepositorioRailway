import { pool } from '../db.js';
// Crear una nueva venta
export const createVenta = async (req, res) => {
    const {
      usuarioId, departamento, municipio, descuento, costoEnvio, subtotal, total, tiempoDiasEntrega,
      quienRecibe, direccionEnvio, cartItems
    } = req.body;
  
    try {
      // Iniciar transacción
      await pool.query('START TRANSACTION');
  
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
  
        // Actualizar la cantidad vendida en inventario dentro del mismo proceso
        const [updateResult] = await pool.query(
          'UPDATE Inventario SET CantidadVendida = CantidadVendida + ? WHERE ProductoID = ?',
          [item.quantity, item.ProductoID]
        );
  
        if (updateResult.affectedRows === 0) {
          throw new Error('Error al actualizar la cantidad vendida');
        }
      }
  
      // Si todas las operaciones fueron exitosas, confirmar la transacción
      await pool.query('COMMIT');
  
      res.json({ message: 'Venta creada exitosamente', ventaId });
    } catch (error) {
      // Revertir la transacción si hay un error
      await pool.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Error al crear la venta', error: error.message });
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

// Obtener ventas por nombre de usuario
export const getVentasByUsuario = async (req, res) => {
    const { usuario } = req.params;

    try {
        // Obtener el UsuarioID a partir del nombre de usuario
        const [usuarioResult] = await pool.query('SELECT UsuarioID FROM Usuarios WHERE usuario = ?', [usuario]);

        if (usuarioResult.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        const usuarioId = usuarioResult[0].UsuarioID;

        // Obtener las ventas del usuario
        const [ventas] = await pool.query('SELECT * FROM Ventas WHERE UsuarioID = ?', [usuarioId]);

        if (ventas.length === 0) return res.status(404).json({ message: 'No se encontraron ventas para este usuario' });

        // Obtener los productos asociados a cada venta, incluyendo la información de cada producto
        for (let venta of ventas) {
            const [productos] = await pool.query(`
                SELECT vp.Cantidad, vp.PrecioProducto, p.Nombre, p.Descripcion, p.Imagen
                FROM VentasProductos vp
                JOIN Productos p ON vp.ProductoID = p.ProductoID
                WHERE vp.VentaID = ?
            `, [venta.VentaID]);

            venta.productos = productos; // Añadir los productos a la venta
        }

        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las ventas del usuario' });
    }
};


// Obtener una venta por ID
export const getVenta = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener la venta y sus productos
        const query = `
            SELECT 
                v.VentaID,
                v.UsuarioID,
                v.Departamento,
                v.Municipio,
                v.Descuento,
                v.CostoEnvio,
                v.Subtotal,
                v.Total,
                v.TiempoDiasEntrega,
                v.QuienRecibe,
                v.DireccionEnvio,
                v.FechaVenta,
                v.FechaEnvio,
                v.EstadoEnvio,
                vp.Cantidad, 
                vp.PrecioProducto, 
                p.ProductoID,
                p.Nombre AS ProductoNombre, 
                p.Descripcion AS ProductoDescripcion,
                p.Precio AS PrecioBase,
                p.Imagen AS ProductoImagen  -- Incluyendo la imagen del producto
            FROM 
                Ventas v
            LEFT JOIN 
                VentasProductos vp ON v.VentaID = vp.VentaID
            LEFT JOIN 
                Productos p ON vp.ProductoID = p.ProductoID
            WHERE 
                v.VentaID = ?
        `;
        const [result] = await pool.query(query, [id]);

        if (result.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });

        // Agrupar los productos de la venta
        const venta = {
            VentaID: result[0].VentaID,
            UsuarioID: result[0].UsuarioID,
            Departamento: result[0].Departamento,
            Municipio: result[0].Municipio,
            Descuento: result[0].Descuento,
            CostoEnvio: result[0].CostoEnvio,
            Subtotal: result[0].Subtotal,
            Total: result[0].Total,
            TiempoDiasEntrega: result[0].TiempoDiasEntrega,
            QuienRecibe: result[0].QuienRecibe,
            DireccionEnvio: result[0].DireccionEnvio,
            FechaVenta: result[0].FechaVenta,
            FechaEnvio:result[0].FechaEnvio,
            EstadoEnvio: result[0].EstadoEnvio,
            productos: result.map(row => ({
                ProductoID: row.ProductoID,
                Cantidad: row.Cantidad,
                PrecioProducto: row.PrecioProducto,
                ProductoNombre: row.ProductoNombre,
                ProductoDescripcion: row.ProductoDescripcion,
                PrecioBase: row.PrecioBase,
                ProductoImagen: row.ProductoImagen,  // Incluyendo la imagen
            }))
        };

        res.json({ venta });
    } catch (error) {
        console.error(error); // Agregar log de error para diagnóstico
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
