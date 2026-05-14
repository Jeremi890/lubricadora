// NAVIGATION MODULE
const NAV = {
  titles: {
    dashboard: 'Dashboard',
    productos: 'Catálogo de Productos',
    facturacion: 'Facturación',
    movimientos: 'Movimientos',
    alertas: 'Alertas',
    proveedores: 'Proveedores',
    estadisticas: 'Estadísticas',
    reportes: 'Reportes NIC 2'
  },

  go(view) {
    if (document.querySelector(`[data-view="${view}"]`)?.classList.contains('disabled')) return;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const target = document.getElementById('view-' + view);
    if (target) target.classList.add('active');
    
    const navItem = document.querySelector(`[data-view="${view}"]`);
    if (navItem) navItem.classList.add('active');
    
    document.getElementById('pageTitle').textContent = this.titles[view] || 'Dashboard';
  }
};
