// AUTHENTICATION MODULE
const AUTH = {
  USERS: {
    admin: { pass: 'admin123', role: 'admin', name: 'Jeremi Vera', initials: 'JV', label: 'Administrador' },
    empleado: { pass: 'emp123', role: 'empleado', name: 'Diana Castillo', initials: 'DC', label: 'Empleado' }
  },
  currentRole: 'admin',
  selectedRole: 'admin',

  selectRole(el) {
    document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedRole = el.dataset.role;
  },

  handleLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');
    
    if (this.USERS[user] && this.USERS[user].pass === pass && this.USERS[user].role === this.selectedRole) {
      err.classList.remove('show');
      this.currentRole = this.USERS[user].role;
      document.getElementById('uName').textContent = this.USERS[user].name;
      document.getElementById('uAvatar').textContent = this.USERS[user].initials;
      document.getElementById('uRole').textContent = this.USERS[user].label;
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('app').classList.add('active');
      this.applyRoleRestrictions();
      TOAST.show('👋', 'Bienvenido/a, ' + this.USERS[user].name);
    } else {
      err.classList.add('show');
    }
  },

  handleLogout() {
    document.getElementById('app').classList.remove('active');
    document.getElementById('loginScreen').style.display = '';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginError').classList.remove('show');
    NAV.go('dashboard');
  },

  applyRoleRestrictions() {
    document.querySelectorAll('[data-admin]').forEach(el => {
      if (this.currentRole !== 'admin') {
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
    document.getElementById('btnNew').style.display = this.currentRole === 'admin' ? '' : 'none';
  }
};

// Init event listeners
document.getElementById('loginPass')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') AUTH.handleLogin.call(AUTH);
});
