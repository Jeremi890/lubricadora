const FACTURACION = {
  cart: [],
  total: 0,

  newSale() {
    document.getElementById('panelVenta').style.display = 'block';
    this.cart = [];
    this.updateCartUI();
    
    // Cargar productos en el select
    const select = document.getElementById('facSelectProducto');
    select.innerHTML = '<option value="">Buscar aceite/filtro...</option>' + 
      PRODUCTOS.list.map(p => `<option value="${p.id}">${p.nombre} ($${p.precio_venta})</option>`).join('');
  },

  addToCart() {
    const id = parseInt(document.getElementById('facSelectProducto').value);
    if (!id) return;

    const prod = PRODUCTOS.list.find(p => p.id === id);
    const exist = this.cart.find(item => item.id === id);

    if (exist) {
      exist.cantidad++;
    } else {
      this.cart.push({ ...prod, cantidad: 1 });
    }
    this.updateCartUI();
  },

  updateCartUI() {
    const tbody = document.querySelector('#cartTable tbody');
    this.total = 0;
    tbody.innerHTML = this.cart.map((item, index) => {
      const sub = item.cantidad * item.precio_venta;
      this.total += sub;
      return `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>$${sub.toFixed(2)}</td>
          <td><button onclick="FACTURACION.removeItem(${index})">✕</button></td>
        </tr>
      `;
    }).join('');
    document.getElementById('facTotal').textContent = `$${this.total.toFixed(2)}`;
  },

  removeItem(i) {
    this.cart.splice(i, 1);
    this.updateCartUI();
  },

  async process() {
    if (this.cart.length === 0) return TOAST.show('⚠️', 'El carrito está vacío');

    const data = {
      cliente_nombre: document.getElementById('facCliente').value || 'Consumidor Final',
      total: this.total,
      responsable: document.getElementById('uName').textContent,
      productos: this.cart
    };

    try {
      const res = await fetch(`${API_URL}/facturas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // ¡NUEVO!: Si el servidor rechaza la petición, atrapamos el error y lo lanzamos
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error de conexión con el servidor' }));
        throw new Error(errorData.error || `Error ${res.status}`);
      }

      // Si todo sale bien:
      TOAST.show('💰', 'Venta realizada con éxito');
      document.getElementById('panelVenta').style.display = 'none';
      await PRODUCTOS.loadProductos(); 
      if (typeof MOVIMIENTOS !== 'undefined') await MOVIMIENTOS.loadMovimientos();
      this.loadFacturas();
      
    } catch (e) {
      console.error('Error procesando factura:', e);
      // Ahora SÍ aparecerá el cartelito rojo en tu pantalla
      TOAST.show('❌', e.message); 
    }
  },

  async loadFacturas() {
    const res = await fetch(`${API_URL}/facturas`);
    const list = await res.json();
    const tbody = document.querySelector('#facturasTable tbody');
    if (!tbody) return;
    tbody.innerHTML = list.map(f => `
      <tr>
        <td>${f.numero_factura}</td>
        <td>${new Date(f.fecha).toLocaleDateString()}</td>
        <td>${f.cliente_nombre}</td>
        <td><b>$${f.total.toFixed(2)}</b></td>
        <td><span class="stock-badge ok">${f.estado}</span></td>
      </tr>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => FACTURACION.loadFacturas());