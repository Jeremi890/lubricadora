// PRODUCTOS MODULE - CRUD Operations
const API_URL = 'http://localhost:3000/api';

const PRODUCTOS = {
  list: [],

  async loadProductos() {
    try {
      const res = await fetch(`${API_URL}/productos`);
      this.list = await res.json();
      this.render();
    } catch (e) {
      console.error('Error cargando productos:', e);
      TOAST.show('❌', 'Error cargando productos');
    }
  },

  render() {
    const tbody = document.querySelector('#productosTable tbody');
    if (!tbody) return;

    tbody.innerHTML = this.list.map(p => `
      <tr>
        <td>
          <div class="product-cell">
            <div class="product-thumb">🛢️</div>
            <div>
              <div class="product-name">${p.nombre}</div>
              <div class="product-sku">${p.codigo}</div>
            </div>
          </div>
        </td>
        <td>${p.categoria}</td>
        <td><b>${p.stock}</b></td>
        <td><span class="stock-badge ${this.getStockStatus(p.stock)}">${this.getStockLabel(p.stock)}</span></td>
        <td>$${p.precio_venta.toFixed(2)}</td>
        <td>
          <button class="btn-secondary btn-sm" onclick="PRODUCTOS.editModal(${p.id})">Editar</button>
          <button class="btn-danger btn-sm" onclick="PRODUCTOS.delete(${p.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  },

  getStockStatus(stock) {
    if (stock >= 20) return 'ok';
    if (stock >= 10) return 'low';
    return 'critical';
  },

  getStockLabel(stock) {
    if (stock >= 20) return 'Óptimo';
    if (stock >= 10) return 'Stock bajo';
    return 'Crítico';
  },

  showModal() {
    document.getElementById('productForm').reset();
    document.getElementById('modalTitle').textContent = 'Registrar Nuevo Producto';
    document.getElementById('productId').value = '';
    MODAL.open('productModal');
  },

  editModal(id) {
    const producto = this.list.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('modalTitle').textContent = 'Editar Producto';
    document.getElementById('productId').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('codigo').value = producto.codigo;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('precio_compra').value = producto.precio_compra;
    document.getElementById('precio_venta').value = producto.precio_venta;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('stock_minimo').value = producto.stock_minimo;
    document.getElementById('proveedor').value = producto.proveedor;

    MODAL.open('productModal');
  },

  async save() {
    const id = document.getElementById('productId').value;
    const data = {
      nombre: document.getElementById('nombre').value,
      codigo: document.getElementById('codigo').value,
      categoria: document.getElementById('categoria').value,
      precio_compra: parseFloat(document.getElementById('precio_compra').value),
      precio_venta: parseFloat(document.getElementById('precio_venta').value),
      stock: parseInt(document.getElementById('stock').value),
      stock_minimo: parseInt(document.getElementById('stock_minimo').value),
      proveedor: document.getElementById('proveedor').value
    };

    try {
      const url = id ? `${API_URL}/productos/${id}` : `${API_URL}/productos`;
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Error al guardar');
      
      MODAL.close('productModal');
      TOAST.show('✅', id ? 'Producto actualizado' : 'Producto creado');
      await this.loadProductos();
    } catch (e) {
      console.error('Error:', e);
      TOAST.show('❌', 'Error al guardar producto');
    }
  },

  async delete(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      
      TOAST.show('🗑️', 'Producto eliminado');
      await this.loadProductos();
    } catch (e) {
      console.error('Error:', e);
      TOAST.show('❌', 'Error al eliminar producto');
    }
  }
};

// Load productos on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productosTable')) {
    PRODUCTOS.loadProductos();
  }
});
