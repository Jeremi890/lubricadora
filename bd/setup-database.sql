-- SCRIPT SQL PARA CREAR LA BASE DE DATOS
-- Ejecutar en SQL Server Management Studio

-- Crear base de datos
CREATE DATABASE LubricadorasDiana;
GO

USE LubricadorasDiana;
GO

-- TABLA DE PRODUCTOS
CREATE TABLE Productos (
  id INT PRIMARY KEY IDENTITY(1,1),
  nombre NVARCHAR(255) NOT NULL,
  codigo NVARCHAR(50) UNIQUE NOT NULL,
  categoria NVARCHAR(100),
  precio_compra DECIMAL(10,2),
  precio_venta DECIMAL(10,2),
  stock INT DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  proveedor NVARCHAR(255),
  fecha_creacion DATETIME DEFAULT GETDATE(),
  fecha_actualizacion DATETIME DEFAULT GETDATE()
);

-- TABLA DE MOVIMIENTOS (Entradas/Salidas)
CREATE TABLE Movimientos (
  id INT PRIMARY KEY IDENTITY(1,1),
  producto_id INT NOT NULL,
  tipo NVARCHAR(20), -- 'entrada' o 'salida'
  cantidad INT,
  referencia NVARCHAR(100),
  usuario NVARCHAR(100),
  fecha DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (producto_id) REFERENCES Productos(id)
);

-- TABLA DE USUARIOS
CREATE TABLE Usuarios (
  id INT PRIMARY KEY IDENTITY(1,1),
  usuario NVARCHAR(50) UNIQUE NOT NULL,
  nombre NVARCHAR(255),
  rol NVARCHAR(50), -- 'admin' o 'empleado'
  activo BIT DEFAULT 1,
  fecha_creacion DATETIME DEFAULT GETDATE()
);

-- ÍNDICES
CREATE INDEX idx_producto_codigo ON Productos(codigo);
CREATE INDEX idx_producto_categoria ON Productos(categoria);
CREATE INDEX idx_movimiento_producto ON Movimientos(producto_id);
CREATE INDEX idx_movimiento_fecha ON Movimientos(fecha);

-- INSERTS DE EJEMPLO
INSERT INTO Productos (nombre, codigo, categoria, precio_compra, precio_venta, stock, stock_minimo, proveedor)
VALUES 
  ('Castrol GTX 20W-50', 'SKU-001', 'Aceites', 10.00, 14.99, 48, 10, 'Castrol Ecuador'),
  ('Havoline 10W-40', 'SKU-002', 'Aceites', 7.50, 10.99, 7, 10, 'Texaco / Havoline'),
  ('Filtro aceite Toyota', 'SKU-015', 'Filtros', 5.00, 9.99, 22, 5, 'Shell Ecuador'),
  ('Valvoline MaxLife 5W-30', 'SKU-008', 'Aceites', 12.00, 17.99, 3, 10, 'Valvoline'),
  ('Liqui Moly Ceratec', 'SKU-022', 'Aditivos', 15.00, 21.99, 15, 5, 'Castrol Ecuador');

INSERT INTO Usuarios (usuario, nombre, rol)
VALUES 
  ('admin', 'Jeremi Vera', 'admin'),
  ('empleado', 'Diana Castillo', 'empleado');

GO

-- VISTAS ÚTILES
CREATE VIEW vw_productos_bajo_stock AS
SELECT * FROM Productos 
WHERE stock <= stock_minimo
ORDER BY stock ASC;

GO

CREATE VIEW vw_producto_valoracion AS
SELECT 
  id, nombre, codigo, stock, precio_venta,
  (stock * precio_venta) AS valoracion_total
FROM Productos
ORDER BY valoracion_total DESC;

GO
