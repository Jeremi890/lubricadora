// MODULO DE MOVIMIENTOS
const MOVIMIENTOS = {
  list: [],

  async loadMovimientos() {
    try {
      const res = await fetch(`${API_URL}/movimientos`);
      this.list = await res.json();
      this.render();
    } catch (e) {
      console.error('Error cargando movimientos:', e);
    }
  },

  render() {
    const tbody = document.querySelector('#movimientosTable tbody');
    if (!tbody) return;

    tbody.innerHTML = this.list.map(m => `
      <tr>
        <td>${new Date(m.fecha).toLocaleString()}</td>
        <td><span class="stock-badge ${m.tipo === 'Entrada' ? 'ok' : 'critical'}">${m.tipo}</span></td>
        <td><b>${m.producto_nombre}</b> <br> <small>${m.producto_codigo}</small></td>
        <td style="color: ${m.tipo === 'Entrada' ? 'green' : 'red'}; font-weight: bold;">
          ${m.tipo === 'Entrada' ? '+' : '-'}${m.cantidad}
        </td>
        <td>${m.referencia || 'N/A'}</td>
        <td>${m.responsable}</td>
      </tr>
    `).join('');
  },

  showModal(tipo) {
    document.getElementById('movimientoForm').reset();
    document.getElementById('movTipo').value = tipo;
    document.getElementById('movModalTitle').textContent = `Registrar ${tipo}`;
    document.getElementById('btnSaveMov').textContent = `Guardar ${tipo}`;
        document.getElementById('btnSaveMov').className = tipo === 'Entrada' ? 'btn-primary' : 'btn-danger';

    // Cargar los productos en el select (usamos la lista del módulo de productos)
    const select = document.getElementById('movProductoId');
    select.innerHTML = '<option value="">Seleccione un producto...</option>' + 
      PRODUCTOS.list.map(p => `<option value="${p.id}">${p.nombre} (Stock actual: ${p.stock})</option>`).join('');

    MODAL.open('movimientoModal');
  },

  async save() {
    // El usuario que está logueado en el sistema
    const responsableActual = document.getElementById('uName').textContent;

    const data = {
      producto_id: parseInt(document.getElementById('movProductoId').value),
      tipo: document.getElementById('movTipo').value,
      cantidad: parseInt(document.getElementById('movCantidad').value),
      referencia: document.getElementById('movReferencia').value,
      responsable: responsableActual
    };

    try {
      const res = await fetch(`${API_URL}/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Error al registrar movimiento');
      
      MODAL.close('movimientoModal');
      TOAST.show('✅', `Movimiento registrado con éxito`);
      
      // Recargar ambas tablas porque el stock cambió
      await this.loadMovimientos();
      await PRODUCTOS.loadProductos(); 
      
    } catch (e) {
      console.error('Error:', e);
      TOAST.show('❌', 'Error al registrar movimiento');
    }
  }
};

// Cargar cuando inicie la página
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('movimientosTable')) {
    MOVIMIENTOS.loadMovimientos();
  }
});