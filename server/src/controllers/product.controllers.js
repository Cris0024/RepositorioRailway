// Importa tu pool de conexiones
import { pool } from '../db.js';

// Obtener todos los productos con sus especificaciones e inventario
export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.ProductoID, p.Nombre AS Nombre, p.Precio, p.Imagen,
             c.Nombre AS NombreCategoria, pr.Nombre AS NombreProveedor
      FROM Productos p
      LEFT JOIN Categorias c ON p.CategoriaID = c.CategoriaID
      LEFT JOIN Proveedores pr ON p.ProveedorID = pr.ProveedorID
    `);
    
    for (let product of products) {
      // Obtener especificaciones
      const [specs] = await pool.query('SELECT NombreEspecificacion, ValorEspecificacion FROM Especificaciones WHERE ProductoID = ?', [product.ProductoID]);
      product.Especificaciones = specs;

      // Obtener inventario
      const [inventory] = await pool.query('SELECT CantidadComprada, CantidadVendida, CantidadDisponible, FechaUltimaActualizacion FROM Inventario WHERE ProductoID = ?', [product.ProductoID]);
      product.Inventario = inventory.length > 0 ? inventory[0] : null;
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const getProductsActive = async (req, res) => {
//   try {
//     const [products] = await pool.query(`
//      SELECT 
//         p.ProductoID, 
//         p.Nombre AS Nombre, 
//         p.Descripcion, 
//         p.Precio, 
//         p.Imagen,
//         c.Nombre AS NombreCategoria, 
//         pr.Nombre AS NombreProveedor,
//         i.CantidadComprada,
//         i.CantidadVendida,
//         i.CantidadDisponible,
//         i.FechaUltimaActualizacion
//       FROM 
//         Productos p
//       LEFT JOIN 
//         Categorias c ON p.CategoriaID = c.CategoriaID
//       LEFT JOIN 
//         Proveedores pr ON p.ProveedorID = pr.ProveedorID
//       LEFT JOIN 
//         Inventario i ON p.ProductoID = i.ProductoID
//       WHERE 
//         p.estadoEliminacion = 1
//     `);
    
//     for (let product of products) {
//       // Obtener especificaciones
//       const [specs] = await pool.query('SELECT NombreEspecificacion, ValorEspecificacion FROM Especificaciones WHERE ProductoID = ?', [product.ProductoID]);
//       product.Especificaciones = specs;

//       // Obtener inventario
//       const [inventory] = await pool.query('SELECT CantidadComprada, CantidadVendida, CantidadDisponible, FechaUltimaActualizacion FROM Inventario WHERE ProductoID = ?', [product.ProductoID]);
//       product.Inventario = inventory.length > 0 ? inventory[0] : null;
//     }

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Controlador para obtener los detalles completos de un producto

export const getProductsActive = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.ProductoID, 
        p.Nombre, 
        p.Descripcion, 
        p.Precio, 
        p.Imagen,
        p.CategoriaID,
        p.ProveedorID
      FROM 
        Productos p
      WHERE 
        p.estadoEliminacion = 1
    `);
    
    for (let product of products) {
      // Obtener especificaciones
      const [specs] = await pool.query('SELECT NombreEspecificacion, ValorEspecificacion FROM Especificaciones WHERE ProductoID = ?', [product.ProductoID]);
      product.Especificaciones = specs;

      // Obtener categoría
      const [category] = await pool.query('SELECT Nombre, Imagen FROM Categorias WHERE CategoriaID = ?', [product.CategoriaID]);
      product.Categoria = category[0] || null; // Asegúrate de manejar el caso en que no exista

      // Obtener proveedor
      const [supplier] = await pool.query('SELECT Nombre, Contacto, Teléfono, Dirección FROM Proveedores WHERE ProveedorID = ?', [product.ProveedorID]);
      product.Proveedor = supplier[0] || null; // Asegúrate de manejar el caso en que no exista
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsInaActive = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.ProductoID, 
        p.Nombre, 
        p.Descripcion, 
        p.Precio, 
        p.Imagen,
        p.CategoriaID,
        p.ProveedorID
      FROM 
        Productos p
      WHERE 
        p.estadoEliminacion = 0
    `);
    
    for (let product of products) {
      // Obtener especificaciones
      const [specs] = await pool.query('SELECT NombreEspecificacion, ValorEspecificacion FROM Especificaciones WHERE ProductoID = ?', [product.ProductoID]);
      product.Especificaciones = specs;

      // Obtener categoría
      const [category] = await pool.query('SELECT Nombre, Imagen FROM Categorias WHERE CategoriaID = ?', [product.CategoriaID]);
      product.Categoria = category[0] || null; // Asegúrate de manejar el caso en que no exista

      // Obtener proveedor
      const [supplier] = await pool.query('SELECT Nombre, Contacto, Teléfono, Dirección FROM Proveedores WHERE ProveedorID = ?', [product.ProveedorID]);
      product.Proveedor = supplier[0] || null; // Asegúrate de manejar el caso en que no exista
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => { 
  const { id } = req.params;
  
  try {
    // Consulta principal para obtener el producto, la categoría, el proveedor y el inventario
    const [productResult] = await pool.query(`
      SELECT 
        p.ProductoID, 
        p.Nombre AS Nombre, 
        p.Descripcion, 
        p.Precio, 
        p.Imagen,
        c.CategoriaID,
        c.Nombre AS NombreCategoria, 
        c.Imagen AS ImagenCategoria,
        pr.ProveedorID,
        pr.Nombre AS NombreProveedor,
        pr.Contacto,
        pr.Teléfono,
        pr.Dirección,
        i.CantidadComprada,
        i.CantidadVendida,
        i.CantidadDisponible,
        i.FechaUltimaActualizacion
      FROM 
        Productos p
      LEFT JOIN 
        Categorias c ON p.CategoriaID = c.CategoriaID
      LEFT JOIN 
        Proveedores pr ON p.ProveedorID = pr.ProveedorID
      LEFT JOIN 
        Inventario i ON p.ProductoID = i.ProductoID
      WHERE 
        p.ProductoID = ? AND p.estadoEliminacion = 1
    `, [id]);
    
    // Verificar si el producto existe
    if (productResult.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const product = productResult[0];

    // Obtener las especificaciones del producto
    const [specs] = await pool.query(`
      SELECT NombreEspecificacion, ValorEspecificacion 
      FROM Especificaciones 
      WHERE ProductoID = ?
    `, [id]);
    
    product.Especificaciones = specs;

    // Enviar la respuesta con todos los datos del producto
    res.json(product);

  } catch (error) {
    // Manejar errores inesperados
    res.status(500).json({ error: error.message });
  }
};


// Obtener productos por categoría con especificaciones e inventario
export const getProductCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await pool.query(`
      SELECT p.ProductoID, p.Nombre AS NombreProducto, p.Descripcion, p.Precio, 
             p.Imagen, c.Nombre AS NombreCategoria, pr.Nombre AS NombreProveedor
      FROM Productos p
      JOIN Categorias c ON p.CategoriaID = c.CategoriaID
      JOIN Proveedores pr ON p.ProveedorID = pr.ProveedorID
      WHERE p.CategoriaID = ?`, [id]);
      
    if (products.length === 0) return res.status(404).json({ message: 'No se encontraron productos para esta categoría' });

    for (let product of products) {
      // Obtener especificaciones
      const [specs] = await pool.query('SELECT NombreEspecificacion, ValorEspecificacion FROM Especificaciones WHERE ProductoID = ?', [product.ProductoID]);
      product.Especificaciones = specs;

      // Obtener inventario
      const [inventory] = await pool.query('SELECT CantidadComprada, CantidadVendida, CantidadDisponible, FechaUltimaActualizacion FROM Inventario WHERE ProductoID = ?', [product.ProductoID]);
      product.Inventario = inventory.length > 0 ? inventory[0] : null;
    }

    const categoryName = products[0].NombreCategoria;

    res.json({ categoryName, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un producto con especificaciones e inventario
export const createProducts = async (req, res) => {
  const { 
    Nombre, 
    Descripcion, 
    Precio, 
    CategoriaID, 
    ProveedorID, 
    Especificaciones, 
    CantidadComprada, 
    Imagen  // Añadir el campo de imagen
  } = req.body;

  try {
    // Insertar el producto en la tabla Productos
    const [result] = await pool.query(
      'INSERT INTO Productos (Nombre, Descripcion, Precio, CategoriaID, ProveedorID, Imagen) VALUES (?, ?, ?, ?, ?, ?)', 
      [Nombre, Descripcion, Precio, CategoriaID, ProveedorID, Imagen]  // Añadir la imagen aquí
    );

    const productoID = result.insertId; // Obtener el ID del producto insertado

    // Insertar especificaciones, si existen
    if (Especificaciones && Especificaciones.length > 0) {
      for (let spec of Especificaciones) {
        await pool.query(
          'INSERT INTO Especificaciones (ProductoID, NombreEspecificacion, ValorEspecificacion) VALUES (?, ?, ?)', 
          [productoID, spec.nombre, spec.valor]
        );
      }
    }

    // Insertar la cantidad inicial en el inventario
    await pool.query(
      'INSERT INTO Inventario (ProductoID, CantidadComprada) VALUES (?, ?)', 
      [productoID, CantidadComprada]
    );

    // Respuesta con los datos insertados
    res.status(201).json({
      id: productoID,
      Nombre,
      Descripcion,
      Precio,
      CategoriaID,
      ProveedorID,
      Imagen,  // Devolver también el enlace de la imagen
      Especificaciones,
      CantidadComprada
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Actualizar un producto y su inventario
export const updateProducts = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, Precio, CategoriaID, ProveedorID, Especificaciones } = req.body;
  
  try {
    // Primero, obtener los datos actuales del producto para compararlos
    const [currentProduct] = await pool.query('SELECT * FROM Productos WHERE ProductoID = ?', [id]);
    if (currentProduct.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    
    const existingProduct = currentProduct[0];
    
    // Generar el query dinámico solo con los campos modificados
    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (Nombre && Nombre !== existingProduct.Nombre) {
      fieldsToUpdate.push('Nombre = ?');
      valuesToUpdate.push(Nombre);
    }

    if (Descripcion && Descripcion !== existingProduct.Descripcion) {
      fieldsToUpdate.push('Descripcion = ?');
      valuesToUpdate.push(Descripcion);
    }

    if (Precio && Precio !== existingProduct.Precio) {
      fieldsToUpdate.push('Precio = ?');
      valuesToUpdate.push(Precio);
    }

    if (CategoriaID && CategoriaID !== existingProduct.CategoriaID) {
      fieldsToUpdate.push('CategoriaID = ?');
      valuesToUpdate.push(CategoriaID);
    }

    if (ProveedorID && ProveedorID !== existingProduct.ProveedorID) {
      fieldsToUpdate.push('ProveedorID = ?');
      valuesToUpdate.push(ProveedorID);
    }

    if (fieldsToUpdate.length > 0) {
      const updateQuery = `UPDATE Productos SET ${fieldsToUpdate.join(', ')} WHERE ProductoID = ?`;
      valuesToUpdate.push(id);
      await pool.query(updateQuery, valuesToUpdate);
    }

    // Actualizar las especificaciones si han cambiado
    if (Especificaciones && Especificaciones.length > 0) {
      await pool.query('DELETE FROM Especificaciones WHERE ProductoID = ?', [id]);
      for (let spec of Especificaciones) {
        await pool.query('INSERT INTO Especificaciones (ProductoID, NombreEspecificacion, ValorEspecificacion) VALUES (?, ?, ?)', 
          [id, spec.NombreEspecificacion, spec.ValorEspecificacion]);
      }
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un producto, sus especificaciones y su inventario
// export const deleteProducts = async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Eliminar las especificaciones del producto
//     await pool.query('DELETE FROM Especificaciones WHERE ProductoID = ?', [id]);

//     // Eliminar el inventario del producto
//     await pool.query('DELETE FROM Inventario WHERE ProductoID = ?', [id]);

//     // Eliminar el producto
//     const [result] = await pool.query('DELETE FROM Productos WHERE ProductoID = ?', [id]);
//     if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });

//     res.json({ message: 'Producto, especificaciones e inventario eliminados' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    // Actualizar el estado de eliminación del producto a 0
    const [result] = await pool.query('UPDATE Productos SET estadoEliminacion = 0 WHERE ProductoID = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });

    // Opcional: Puedes eliminar las especificaciones y el inventario si deseas
    // await pool.query('DELETE FROM Especificaciones WHERE ProductoID = ?', [id]);
    // await pool.query('DELETE FROM Inventario WHERE ProductoID = ?', [id]);

    res.json({ message: 'Producto marcado como eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const restoreProducts = async (req, res) => {
  const { id } = req.params;
  try {
    // Actualizar el estado de eliminación del producto a 0
    const [result] = await pool.query('UPDATE Productos SET estadoEliminacion = 1 WHERE ProductoID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto marcado como eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};