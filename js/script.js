const USERS = {
  admin: { pass: 'admin123', role: 'admin', name: 'Jeremi Vera', initials: 'JV', label: 'Administrador' },
  empleado: { pass: 'emp123', role: 'empleado', name: 'Diana Castillo', initials: 'DC', label: 'Empleado' }
};

let currentRole = 'admin';
let selectedRole = 'admin';

function selectRole(el) {
  document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedRole = el.dataset.role;
}

function handleLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  if (USERS[user] && USERS[user].pass === pass && USERS[user].role === selectedRole) {
    err.classList.remove('show');
    currentRole = USERS[user].role;
    document.getElementById('uName').textContent = USERS[user].name;
    document.getElementById('uAvatar').textContent = USERS[user].initials;
    document.getElementById('uRole').textContent = USERS[user].label;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').classList.add('active');
    applyRoleRestrictions();
    showToast('👋', 'Bienvenido/a, ' + USERS[user].name);
  } else {
    err.classList.add('show');
  }
}

document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function handleLogout() {
  document.getElementById('app').classList.remove('active');
  document.getElementById('loginScreen').style.display = '';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.remove('show');
  nav('dashboard');
}

function applyRoleRestrictions() {
  document.querySelectorAll('[data-admin]').forEach(el => {
    if (currentRole !== 'admin') {
      el.classList.add('disabled');
      if (!el.querySelector('.nav-restricted')) {
        const badge = document.createElement('span');
        badge.className = 'nav-restricted';
        badge.textContent = 'Admin';
        el.appendChild(badge);
      }
    } else {
      el.classList.remove('disabled');
      const badge = el.querySelector('.nav-restricted');
      if (badge) badge.remove();
    }
  });
  document.getElementById('btnNew').style.display = currentRole === 'admin' ? '' : 'none';
}

const titles = {
  dashboard: 'Dashboard',
  productos: 'Catálogo de Productos',
  facturacion: 'Facturación',
  movimientos: 'Movimientos',
  alertas: 'Alertas',
  proveedores: 'Proveedores',
  estadisticas: 'Estadísticas',
  reportes: 'Reportes NIC 2'
};

function nav(view) {
  if (document.querySelector(`[data-view="${view}"]`)?.classList.contains('disabled')) return;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('view-' + view);
  if (target) target.classList.add('active');
  const navItem = document.querySelector(`[data-view="${view}"]`);
  if (navItem) navItem.classList.add('active');
  document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';
}

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) closeModal(m.id);
  });
});

function showToast(icon, msg) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icon}</span>${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

document.querySelectorAll('.tabs').forEach(g => {
  g.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      g.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });
});
