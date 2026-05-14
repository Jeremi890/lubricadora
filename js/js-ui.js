// UI MODULES - MODAL, TOAST

const MODAL = {
  open(id) {
    document.getElementById(id).classList.add('active');
  },
  close(id) {
    document.getElementById(id).classList.remove('active');
  },
  init() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.addEventListener('click', e => {
        if (e.target === m) this.close(m.id);
      });
    });
  }
};

const TOAST = {
  show(icon, msg) {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${icon}</span>${msg}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
};

// Init modals
document.addEventListener('DOMContentLoaded', () => MODAL.init());
