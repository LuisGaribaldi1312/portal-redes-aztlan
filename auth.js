/**
 * SISTEMA DE AUTENTICACIÓN Y GESTIÓN DE ROLES
 * UNIVERSIDAD AZTLÁN - REDES DE COMPUTADORAS (CLAVE 634)
 */

const AuthSystem = {
  // Usuarios oficiales preconfigurados
  users: [
    {
      id: 'usr_garibaldi',
      username: 'lgaribaldi',
      password: 'Aztlan2026*Prof',
      name: 'Prof. Luis Alberto Garibaldi',
      role: 'superadmin',
      roleLabel: 'Super Administrador / Docente Titular',
      matricula: 'DOC-AZT-2026',
      email: 'luis.garibaldi@aztlan.edu.mx',
      avatar: '👨‍🏫',
      badgeColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 'usr_mario',
      username: 'mleyva',
      password: 'MarioNet2026#',
      name: 'Mario Leyva Mendez',
      role: 'student',
      roleLabel: 'Estudiante de Ingeniería en Sistemas',
      matricula: 'AZT-2026-63401',
      email: 'mario.leyva@alumnos.aztlan.edu.mx',
      avatar: '👨‍💻',
      badgeColor: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'usr_isaias',
      username: 'ilopez',
      password: 'IsaiasNet2026#',
      name: 'Isaias Lopez Meza',
      role: 'student',
      roleLabel: 'Estudiante de Ingeniería en Sistemas',
      matricula: 'AZT-2026-63402',
      email: 'isaias.lopez@alumnos.aztlan.edu.mx',
      avatar: '👨‍🎓',
      badgeColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)'
    }
  ],

  currentUser: null,

  init() {
    this.loadStoredCredentials();
    this.initAudioContext();
    this.checkSession();
  },

  loadStoredCredentials() {
    const custom = localStorage.getItem('aztlan_custom_passwords');
    if (custom) {
      try {
        const passes = JSON.parse(custom);
        this.users.forEach(u => {
          if (passes[u.username]) {
            u.password = passes[u.username];
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  },

  togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const eyeIcon = document.getElementById('eye-icon');
    if (!passInput) return;
    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (eyeIcon) eyeIcon.innerText = '🙈 Ocultar';
    } else {
      passInput.type = 'password';
      if (eyeIcon) eyeIcon.innerText = '👁️ Mostrar';
    }
  },

  showForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.add('open');
  },

  closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.remove('open');
  },

  // Generador de Efectos de Sonido Futuristas con Web Audio API (Offline)
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio no soportado en este entorno', e);
    }
  },

  playSound(type) {
    if (!this.audioCtx) {
      this.initAudioContext();
    }
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const now = this.audioCtx.currentTime;

    if (type === 'subdrop') {
      // Sub-bass cinemático 2026
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.8);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } else if (type === 'handshake') {
      // Paquete FM digital de alta frecuencia
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'warp') {
      // Efecto aceleración Hyperdrive 2026
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1850, now + 0.6);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === 'success') {
      // Acorde triunfal armónico 2026 (E Mayor: E4, G#4, B4, E5) con coro dual
      const notes = [329.63, 415.30, 493.88, 659.25];
      notes.forEach((f, i) => {
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.value = f;
        osc2.frequency.value = f * 1.002; // Leve desafinación estéreo para calidez sonora
        
        const noteStart = now + i * 0.07;
        gain.gain.setValueAtTime(0.08, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.7);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteStart + 0.75);
        osc2.stop(noteStart + 0.75);
      });
    } else if (type === 'error') {
      // Disonancia de error de autenticación
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  },

  checkSession() {
    // Verificar si hay una sesión activa en la pestaña actual
    const activeUsername = sessionStorage.getItem('aztlan_active_session_user');
    if (activeUsername) {
      const exists = this.users.find(u => u.username === activeUsername);
      if (exists) {
        this.currentUser = exists;
        this.hideLoginScreen();
        this.onLoginSuccess(false);
        return;
      }
    }

    // Si no hay sesión activa en esta sesión de navegador, mostrar siempre el Login
    this.showLoginScreen();
  },

  showLoginScreen() {
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) {
      loginOverlay.classList.remove('hidden');
      loginOverlay.style.display = 'flex';
      loginOverlay.style.opacity = '1';
      loginOverlay.style.visibility = 'visible';
    }
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    if (userInp) userInp.value = '';
    if (passInp) passInp.value = '';
    const errBox = document.getElementById('login-error-msg');
    if (errBox) errBox.style.display = 'none';

    this.startBackgroundNodes();
  },

  hideLoginScreen() {
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) {
      loginOverlay.classList.add('hidden');
      setTimeout(() => {
        loginOverlay.style.display = 'none';
      }, 400);
    }
  },

  renderQuickAccessButtons() {
    const container = document.getElementById('quick-access-accounts');
    if (!container) return;

    container.innerHTML = this.users.map(u => `
      <div class="quick-user-card" onclick="AuthSystem.quickLogin('${u.username}')">
        <div class="user-avatar-badge">${u.avatar}</div>
        <div class="user-details">
          <div class="user-name">${u.name}</div>
          <div class="user-role-label" style="color: ${u.badgeColor};">${u.roleLabel}</div>
          <div class="user-sub">Usuario: <code>${u.username}</code></div>
        </div>
        <div class="login-arrow">➔</div>
      </div>
    `).join('');
  },

  quickLogin(username) {
    const usr = this.users.find(u => u.username === username);
    if (!usr) return;

    document.getElementById('login-username').value = usr.username;
    document.getElementById('login-password').value = usr.password;

    this.submitLogin();
  },

  submitLogin() {
    const userInp = document.getElementById('login-username').value.trim();
    const passInp = document.getElementById('login-password').value.trim();
    const errorBox = document.getElementById('login-error-msg');

    if (!userInp || !passInp) {
      this.showError('Por favor ingresa usuario y contraseña.');
      this.playSound('error');
      return;
    }

    const matched = this.users.find(u => 
      u.username.toLowerCase() === userInp.toLowerCase() && u.password === passInp
    );

    if (!matched) {
      this.showError('Credenciales incorrectas. Verifica usuario y contraseña.');
      this.playSound('error');
      return;
    }

    errorBox.style.display = 'none';
    this.currentUser = matched;
    sessionStorage.setItem('aztlan_active_session_user', matched.username);
    localStorage.setItem('aztlan_current_user', JSON.stringify(matched));

    // Ejecutar experiencia de inicio de sesión
    this.triggerCinematicLoginSequence();
  },

  showError(msg) {
    const errorBox = document.getElementById('login-error-msg');
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.innerHTML = `⚠️ ${msg}`;
    }
  },

  // EXPERIENCIA VISUAL Y SONORA FUTURISTA 2026 DE CONEXIÓN A LA RED
  triggerCinematicLoginSequence() {
    const stage = document.getElementById('login-experience-stage');
    const formBox = document.getElementById('login-form-box');
    const overlay = document.getElementById('login-overlay');
    
    if (!stage || !formBox) {
      this.onLoginSuccess(true);
      return;
    }

    formBox.style.display = 'none';
    stage.style.display = 'block';

    // Sub-bass drop al iniciar la secuencia
    this.playSound('subdrop');

    const progressBar = document.getElementById('hud-progress-bar');
    const percentMetric = document.getElementById('hud-percentage-metric');
    const phaseMetric = document.getElementById('hud-status-phase');
    const bwMetric = document.getElementById('hud-bandwidth-metric');
    const logsContainer = document.getElementById('login-terminal-logs');

    if (logsContainer) logsContainer.innerHTML = '';

    const steps = [
      { 
        percent: 22,
        phase: 'CANAL TLS 1.3 CIFRADO',
        bw: '40 Gbps • 0.3ms',
        tag: 'TLS-SEC',
        tagColor: '#38bdf8',
        text: 'Estableciendo túnel cuántico TLS 1.3 con Nodo Maestro Aztlán (192.168.63.4:8443)...',
        delay: 350, 
        sound: 'handshake' 
      },
      { 
        percent: 48,
        phase: 'CERTIFICADOS & HASH SHA-512',
        bw: '65 Gbps • 0.2ms',
        tag: 'SHA-512',
        tagColor: '#10b981',
        text: 'Validación de integridad completada. Certificado CA Universidad Aztlán verificado.',
        delay: 950, 
        sound: 'handshake' 
      },
      { 
        percent: 74,
        phase: 'AUTENTICACIÓN RADIUS / LDAP',
        bw: '85 Gbps • 0.2ms',
        tag: 'RADIUS',
        tagColor: '#818cf8',
        text: `Autenticado con éxito: ${this.currentUser.name} (ID: ${this.currentUser.matricula}).`,
        delay: 1650, 
        sound: 'handshake' 
      },
      { 
        percent: 92,
        phase: 'APLICANDO PRIVILEGIOS DE ROL',
        bw: '100 Gbps • 0.1ms',
        tag: 'POLICIES',
        tagColor: '#f59e0b',
        text: `Privilegios inyectados: [${this.currentUser.role.toUpperCase()}] • Simuladores y Laboratorio sincronizados.`,
        delay: 2400, 
        sound: 'handshake' 
      },
      { 
        percent: 100,
        phase: '¡ACCESO CONCEDIDO! BIENVENIDO',
        bw: '100 Gbps • 0.1ms',
        tag: 'GRANTED',
        tagColor: '#10b981',
        text: `¡AUTORIZACIÓN TOTAL! Accediendo a la Plataforma Educativa Aztlán 2026...`,
        delay: 3100, 
        sound: 'success' 
      }
    ];

    steps.forEach((st, idx) => {
      setTimeout(() => {
        if (st.sound === 'success') {
          this.playSound('success');
          this.playSound('warp');
          // Disparar efecto warp speed en el canvas
          this.isWarpSpeed = true;
          if (overlay) overlay.classList.add('warp-out');
        } else {
          this.playSound(st.sound);
        }

        // Actualizar métricas HUD
        if (progressBar) progressBar.style.width = st.percent + '%';
        if (percentMetric) percentMetric.innerText = st.percent + '%';
        if (phaseMetric) phaseMetric.innerText = st.phase;
        if (bwMetric) bwMetric.innerText = st.bw;

        // Agregar línea al monitor de telemetría con timestamp
        if (logsContainer) {
          const now = new Date();
          const timeStr = String(now.getHours()).padStart(2,'0') + ':' + 
                          String(now.getMinutes()).padStart(2,'0') + ':' + 
                          String(now.getSeconds()).padStart(2,'0') + '.' + 
                          String(now.getMilliseconds()).padStart(3,'0').substring(0,2);
          
          const line = document.createElement('div');
          line.className = 'cinematic-log-line';
          line.innerHTML = `<span style="color: #64748b; font-size: 0.72rem;">[${timeStr}]</span> <span style="background: rgba(255,255,255,0.08); color: ${st.tagColor}; padding: 1px 5px; border-radius: 4px; font-weight: bold; font-size: 0.72rem; margin: 0 4px;">${st.tag}</span> <span style="color: #f8fafc;">${st.text}</span>`;
          logsContainer.appendChild(line);
          logsContainer.scrollTop = logsContainer.scrollHeight;
        }

        // Fin de la secuencia: Transición e Iris Out al portal
        if (idx === steps.length - 1) {
          setTimeout(() => {
            this.hideLoginScreen();
            this.onLoginSuccess(false); // ya sonó el acorde
            this.isWarpSpeed = false;
            if (overlay) overlay.classList.remove('warp-out');

            // Restaurar estado del formulario para futuros logins o cierres de sesión
            setTimeout(() => {
              formBox.style.display = 'block';
              stage.style.display = 'none';
              if (progressBar) progressBar.style.width = '0%';
            }, 600);
          }, 850);
        }
      }, st.delay);
    });
  },

  onLoginSuccess(withSound = true) {
    if (withSound) {
      this.playSound('success');
    }

    this.updateUserHeaderUI();
    this.applyRoleRestrictions();
    this.loadStudentProfileData();

    // Registrar acceso en el Sistema Integral de Seguimiento
    if (window.StudentTracker && this.currentUser) {
      window.StudentTracker.recordAccess(this.currentUser.username);
    }

    // Actualizar bloqueos y progresión secuencial según el rol
    if (window.AcademicProgression) {
      window.AcademicProgression.updateUIProgression();
    }

    // Sincronizar y recargar el catálogo del Taller de Ejercicios Visuales
    if (window.VisualExercises) {
      window.VisualExercises.loadProgress();
      window.VisualExercises.renderExerciseList();
      window.VisualExercises.loadFirstAccessibleExercise();
    }

    // Notificación en pantalla
    const welcomeToast = document.createElement('div');
    welcomeToast.className = 'welcome-toast';
    welcomeToast.innerHTML = `
      <div style="font-size: 1.6rem;">${this.currentUser.avatar}</div>
      <div>
        <div style="font-weight: bold; color: #f8fafc; font-size: 0.95rem;">¡Sesión Iniciada!</div>
        <div style="font-size: 0.8rem; color: #cbd5e1;">${this.currentUser.name} • <span style="color: ${this.currentUser.badgeColor};">${this.currentUser.roleLabel}</span></div>
      </div>
    `;
    document.body.appendChild(welcomeToast);
    setTimeout(() => welcomeToast.classList.add('visible'), 50);
    setTimeout(() => {
      welcomeToast.classList.remove('visible');
      setTimeout(() => welcomeToast.remove(), 400);
    }, 4000);
  },

  updateUserHeaderUI() {
    const userContainer = document.getElementById('header-user-profile');
    if (!userContainer) return;

    userContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div class="user-profile-header-pill" onclick="AuthSystem.toggleUserDropdown()">
          <span class="user-avatar-mini">${this.currentUser.avatar}</span>
          <div class="user-header-text">
            <div class="user-header-name">${this.currentUser.name}</div>
            <div class="user-header-role" style="color: ${this.currentUser.badgeColor};">
              ${this.currentUser.role === 'superadmin' ? '👑 SUPER ADMIN' : '👨‍💻 ESTUDIANTE'}
            </div>
          </div>
          <span style="font-size: 0.7rem; color: #94a3b8; margin-left: 0.2rem;">▼</span>
        </div>
        <button class="btn btn-sm" onclick="AuthSystem.showLoginScreen()" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" title="Cambiar a otra cuenta o ver accesos">
          <span>🔄</span> Cambiar
        </button>
      </div>

      <!-- Menú Desplegable de Usuario -->
      <div class="user-dropdown-menu" id="user-dropdown-menu">
        <div class="dropdown-header">
          <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">${this.currentUser.avatar}</div>
          <strong style="color: #f8fafc; font-size: 0.9rem;">${this.currentUser.name}</strong>
          <div style="font-size: 0.75rem; color: var(--text-dim); font-family: monospace;">${this.currentUser.matricula}</div>
          <div style="font-size: 0.72rem; color: ${this.currentUser.badgeColor}; margin-top: 0.2rem; font-weight: bold;">
            ${this.currentUser.roleLabel}
          </div>
        </div>
        
        <div class="dropdown-actions">
          ${this.currentUser.role === 'superadmin' ? `
            <button class="dropdown-item" onclick="AuthSystem.openTeacherAdminPanel()">
              <span>👑</span> Panel de Control Docente
            </button>
          ` : `
            <button class="dropdown-item" onclick="AuthSystem.openStudentProgressModal()">
              <span>📊</span> Mi Expediente & Notas
            </button>
          `}
          <button class="dropdown-item" onclick="AuthSystem.showCredentialsModal()">
            <span>🔑</span> Ver Mis Credenciales
          </button>
          <button class="dropdown-item logout" onclick="AuthSystem.logout()">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </div>
    `;

    // Si es Super Administrador, activar el botón de acceso directo al Panel Docente
    const teacherAdminTab = document.getElementById('nav-tab-admin');
    if (teacherAdminTab) {
      teacherAdminTab.style.display = this.currentUser.role === 'superadmin' ? 'flex' : 'none';
    }
  },

  toggleUserDropdown() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) {
      menu.classList.toggle('open');
    }
  },

  applyRoleRestrictions() {
    // Si el usuario es estudiante, bloquear edición de ponderaciones
    const rubricControls = document.querySelectorAll('.admin-only-control');
    rubricControls.forEach(el => {
      el.style.display = this.currentUser.role === 'superadmin' ? 'block' : 'none';
    });
  },

  loadStudentProfileData() {
    // Cargar estado de interfaz y notas independiente para cada usuario
    const studentKey = `aztlan_student_state_${this.currentUser.username}`;
    const saved = localStorage.getItem(studentKey);
    if (saved && window.App) {
      try {
        const data = JSON.parse(saved);
        window.App.state = Object.assign(window.App.state, data);
        window.App.updateStatsUI();
      } catch (e) {
        console.error(e);
      }
    }
  },

  saveCurrentStudentData() {
    if (!this.currentUser) return;
    const studentKey = `aztlan_student_state_${this.currentUser.username}`;
    if (window.App && window.App.state) {
      localStorage.setItem(studentKey, JSON.stringify(window.App.state));
    }
  },

  logout() {
    sessionStorage.removeItem('aztlan_active_session_user');
    localStorage.removeItem('aztlan_current_user');
    this.currentUser = null;
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.remove('open');
    this.showLoginScreen();
    if (window.AcademicProgression) {
      window.AcademicProgression.updateUIProgression();
    }
    if (window.VisualExercises) {
      window.VisualExercises.loadProgress();
      window.VisualExercises.renderExerciseList();
      window.VisualExercises.loadFirstAccessibleExercise();
    }
  },

  // PANEL DOCENTE EXCLUSIVO PARA EL PROF. LUIS ALBERTO GARIBALDI
  openTeacherAdminPanel() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.remove('open');

    this.refreshTeacherStudentAuditTable();
    this.renderAdminPasswordManager();

    // Navegar a la pestaña del panel docente
    if (window.App) {
      window.App.navigateTo('admin');
    }
  },

  renderAdminPasswordManager() {
    const container = document.getElementById('admin-password-cards-grid');
    if (!container) return;

    const studentUsers = this.users.filter(u => u.role === 'student');

    container.innerHTML = studentUsers.map(st => `
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
          <div>
            <div style="font-size: 1.05rem; font-weight: bold; color: #f8fafc;">${st.name}</div>
            <div style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">Matrícula: ${st.matricula} • Usuario: <strong style="color: #38bdf8;">${st.username}</strong></div>
          </div>
          <span style="font-size: 1.5rem;">${st.avatar}</span>
        </div>

        <div style="background: #030712; border: 1px solid #243552; border-radius: 6px; padding: 0.6rem 0.8rem; margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; color: #94a3b8;">Contraseña Actual:</span>
          <code style="color: #34d399; font-size: 0.9rem; font-weight: bold;" id="curr-pass-${st.username}">${st.password}</code>
        </div>

        <div class="form-group" style="margin-bottom: 0.6rem;">
          <label style="font-size: 0.75rem; color: #cbd5e1;">Asignar Nueva Contraseña:</label>
          <div style="display: flex; gap: 0.4rem;">
            <input type="text" class="form-control" id="new-pass-${st.username}" placeholder="Escribe nueva clave" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">
            <button class="btn btn-sm" onclick="AuthSystem.generateRandomPassword('${st.username}')" title="Generar clave aleatoria segura">🎲</button>
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn btn-sm btn-primary" onclick="AuthSystem.saveNewPasswordFromInput('${st.username}')">
            <span>💾</span> Actualizar Contraseña
          </button>
        </div>
      </div>
    `).join('');
  },

  saveNewPasswordFromInput(username) {
    const input = document.getElementById(`new-pass-${username}`);
    if (!input || !input.value.trim()) {
      alert('Por favor escribe o genera una nueva contraseña antes de guardar.');
      return;
    }
    this.updateStudentPassword(username, input.value.trim());
    input.value = '';
  },

  updateStudentPassword(username, newPass) {
    if (!newPass || newPass.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    const usr = this.users.find(u => u.username === username);
    if (!usr) return;

    usr.password = newPass.trim();

    // Guardar en localStorage de contraseñas personalizadas
    const custom = JSON.parse(localStorage.getItem('aztlan_custom_passwords') || '{}');
    custom[username] = usr.password;
    localStorage.setItem('aztlan_custom_passwords', JSON.stringify(custom));

    alert(`✓ Contraseña actualizada exitosamente para ${usr.name}.\n\nNueva contraseña: ${usr.password}\n\nCompártela con el estudiante para que pueda acceder manualmente.`);

    this.renderAdminPasswordManager();
    this.refreshTeacherStudentAuditTable();
  },

  generateRandomPassword(username) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!#';
    let pass = '';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const finalPass = `${username.charAt(0).toUpperCase() + username.slice(1)}Net${pass}`;
    const input = document.getElementById(`new-pass-${username}`);
    if (input) input.value = finalPass;
  },

  refreshTeacherStudentAuditTable() {
    const tbody = document.getElementById('teacher-students-tbody');
    if (!tbody || !window.AcademicProgression) return;

    const students = [
      { id: 'usr_mario', username: 'mleyva', name: 'Mario Leyva Mendez', matricula: 'AZT-2026-63401' },
      { id: 'usr_isaias', username: 'ilopez', name: 'Isaias Lopez Meza', matricula: 'AZT-2026-63402' }
    ];

    tbody.innerHTML = students.map(st => {
      const prog = AcademicProgression.getStudentProgress(st.username);
      const exDone = prog.completedExercises ? prog.completedExercises.length : 0;
      const exPct = Math.round((exDone / 21) * 100);

      const quizScores = Object.values(prog.passedQuizzes || {});
      const avgQuiz = quizScores.length > 0 ? Math.round(quizScores.reduce((a,b)=>a+b, 0) / quizScores.length) : 0;

      const examScore = prog.finalExamScore !== undefined ? prog.finalExamScore : (prog.finalExamUnlocked ? 'Desbloqueado' : 'Bloqueado');
      const examNumeric = typeof examScore === 'number' ? examScore : 0;

      // Ponderación oficial 20/30/20/30
      const finalGrade = Math.round(((20 * 0.95) + (30 * (exPct / 100)) + (20 * (avgQuiz / 100)) + (30 * (examNumeric / 100))) * 10) / 10;
      const isAprobado = finalGrade >= 70;

      return `
        <tr>
          <td><code>${st.matricula}</code></td>
          <td><strong>${st.name}</strong></td>
          <td><span>${exDone} / 21 (${exPct}%)</span></td>
          <td><span>95%</span></td>
          <td><span>${avgQuiz}%</span></td>
          <td><span>${typeof examScore === 'number' ? examScore + '%' : examScore}</span></td>
          <td><strong style="color: ${isAprobado ? '#10b981' : '#f59e0b'};">${finalGrade} / 100</strong></td>
          <td><span class="status-badge ${isAprobado ? 'completed' : 'pending'}">${isAprobado ? 'ACREDITADO' : 'EN PROCESO'}</span></td>
          <td>
            <div style="display: flex; gap: 0.3rem;">
              <button class="btn btn-sm btn-primary" onclick="AuthSystem.adminUnlockAllForStudent('${st.username}')" title="Desbloquear todas las unidades a este estudiante">
                🔓 Desbloquear Todo
              </button>
              <button class="btn btn-sm btn-danger" onclick="AuthSystem.adminResetStudentProgress('${st.username}')" title="Resetear avance para que empiece de nuevo en Unidad 1">
                🔄 Reiniciar
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  adminUnlockAllForStudent(username) {
    if (!window.AcademicProgression) return;
    const prog = AcademicProgression.getStudentProgress(username);
    prog.adminOverride = true;
    AcademicProgression.saveStudentProgress(username, prog);
    alert(`✓ Se ha habilitado el acceso completo a todas las unidades y el examen final para el estudiante [${username}].`);
    this.refreshTeacherStudentAuditTable();
  },

  adminResetStudentProgress(username) {
    if (!confirm(`¿Estás seguro de reiniciar el avance del estudiante ${username}? Volverá a iniciar estrictamente en la Unidad 1.`)) return;
    if (!window.AcademicProgression) return;
    const defaultData = {
      completedExercises: [],
      passedQuizzes: {},
      adminOverride: false
    };
    AcademicProgression.saveStudentProgress(username, defaultData);
    localStorage.removeItem(`aztlan_student_state_${username}`);
    alert(`✓ Se ha reiniciado el expediente del estudiante [${username}]. Solo tiene acceso a la Unidad 1.`);
    this.refreshTeacherStudentAuditTable();
  },

  // Modal de credenciales para compartir
  showCredentialsModal() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.remove('open');

    const modal = document.getElementById('credentials-modal');
    if (modal) {
      modal.classList.add('open');
    }
  },

  closeCredentialsModal() {
    const modal = document.getElementById('credentials-modal');
    if (modal) {
      modal.classList.remove('open');
    }
  },

  // ANIMACIÓN DE FONDO CUÁNTICO 2026 CON FÍSICA DE GRAVEDAD Y SALTO HIPERESPACIAL
  isWarpSpeed: false,

  startBackgroundNodes() {
    const canvas = document.getElementById('login-network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Sistema de atracción por ratón / cursor
    const mouse = { x: -9999, y: -9999, active: false };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const nodes = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        baseRadius: Math.random() * 2 + 1.5,
        radius: Math.random() * 2 + 1.5,
        pulseOffset: Math.random() * Math.PI * 2,
        color: i % 4 === 0 ? '#818cf8' : (i % 3 === 0 ? '#10b981' : '#38bdf8')
      });
    }

    let frame = 0;

    const animate = () => {
      frame++;

      if (this.isWarpSpeed) {
        // En modo Hyperdrive Warp: fondo semi-transparente para estelas de luz cibernéticas
        ctx.fillStyle = 'rgba(3, 7, 18, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < count; i++) {
        const n1 = nodes[i];

        if (this.isWarpSpeed) {
          // Aceleración radial extrema hacia afuera (efecto túnel espacial)
          const angle = Math.atan2(n1.y - centerY, n1.x - centerX);
          const speed = 18;
          const oldX = n1.x;
          const oldY = n1.y;
          n1.x += Math.cos(angle) * speed;
          n1.y += Math.sin(angle) * speed;

          // Dibujar estela láser hiperespacial
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(n1.x, n1.y);
          ctx.strokeStyle = n1.color;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Reubicar cerca del centro si salen
          if (n1.x < 0 || n1.x > canvas.width || n1.y < 0 || n1.y > canvas.height) {
            n1.x = centerX + (Math.random() - 0.5) * 100;
            n1.y = centerY + (Math.random() - 0.5) * 100;
          }
          continue;
        }

        // FÍSICA NORMAL CON GRAVEDAD DE RATÓN
        if (mouse.active) {
          const dxMouse = mouse.x - n1.x;
          const dyMouse = mouse.y - n1.y;
          const distMouse = Math.hypot(dxMouse, dyMouse);
          if (distMouse < 200 && distMouse > 10) {
            const pull = (1 - distMouse / 200) * 0.09;
            n1.vx += (dxMouse / distMouse) * pull;
            n1.vy += (dyMouse / distMouse) * pull;
          }
        }

        // Amortiguación suave de velocidad para estabilidad
        n1.vx *= 0.99;
        n1.vy *= 0.99;
        if (Math.abs(n1.vx) < 0.2) n1.vx += (Math.random() - 0.5) * 0.3;
        if (Math.abs(n1.vy) < 0.2) n1.vy += (Math.random() - 0.5) * 0.3;

        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0) { n1.x = 0; n1.vx *= -1; }
        if (n1.x > canvas.width) { n1.x = canvas.width; n1.vx *= -1; }
        if (n1.y < 0) { n1.y = 0; n1.vy *= -1; }
        if (n1.y > canvas.height) { n1.y = canvas.height; n1.vy *= -1; }

        // Pulsación suave del tamaño
        n1.radius = n1.baseRadius + Math.sin(frame * 0.05 + n1.pulseOffset) * 0.8;

        // Dibujar nodo
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, Math.max(1, n1.radius), 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.shadowColor = n1.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Enlaces con otros nodos
        for (let j = i + 1; j < count; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.65;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Rayo de atracción si está cerca del cursor
        if (mouse.active) {
          const distM = Math.hypot(mouse.x - n1.x, mouse.y - n1.y);
          if (distM < 160) {
            const alphaM = (1 - distM / 160) * 0.8;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alphaM})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Dibujar halo del cursor cuántico
      if (mouse.active && !this.isWarpSpeed) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
};

// Exportar explícitamente a window para compatibilidad global y llamadas onclick
if (typeof window !== 'undefined') {
  window.AuthSystem = AuthSystem;
}
