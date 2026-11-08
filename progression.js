/**
 * SISTEMA DE DESBLOQUEO SECUENCIAL Y PROGRESIÓN ACADÉMICA
 * UNIVERSIDAD AZTLÁN - REDES DE COMPUTADORAS (CLAVE 634)
 */

const AcademicProgression = {
  // Definición de requisitos para cada unidad (20 ejercicios por unidad = 100 en total)
  unitsConfig: {
    u1: {
      name: 'Unidad 1: Aspectos básicos de Redes',
      badge: 'U1',
      exercises: Array.from({ length: 20 }, (_, i) => `ex_1_${i + 1}`),
      quiz: 'u1',
      prevUnit: null,
      nextUnit: 'u2'
    },
    u2: {
      name: 'Unidad 2: Normas y estándares',
      badge: 'U2',
      exercises: Array.from({ length: 20 }, (_, i) => `ex_2_${i + 1}`),
      quiz: 'u2',
      prevUnit: 'u1',
      nextUnit: 'u3'
    },
    u3: {
      name: 'Unidad 3: Dispositivos de red',
      badge: 'U3',
      exercises: Array.from({ length: 20 }, (_, i) => `ex_3_${i + 1}`),
      quiz: 'u3',
      prevUnit: 'u2',
      nextUnit: 'u4'
    },
    u4: {
      name: 'Unidad 4: Cableado Estructurado',
      badge: 'U4',
      exercises: Array.from({ length: 20 }, (_, i) => `ex_4_${i + 1}`),
      quiz: 'u4',
      prevUnit: 'u3',
      nextUnit: 'u5'
    },
    u5: {
      name: 'Unidad 5: Planificación y diseño',
      badge: 'U5',
      exercises: Array.from({ length: 20 }, (_, i) => `ex_5_${i + 1}`),
      quiz: 'u5',
      prevUnit: 'u4',
      nextUnit: 'exam'
    }
  },

  init() {
    this.updateUIProgression();
  },

  // Clave de almacenamiento exclusiva para progresión de cada estudiante
  getStorageKey(username) {
    return `aztlan_academic_prog_${username}`;
  },

  // Obtiene el estado del estudiante actual
  getStudentProgress(username) {
    if (!username) return null;
    const key = this.getStorageKey(username);
    const defaultData = {
      completedExercises: [],
      passedQuizzes: {}, // u1: 100, u2: 80, etc.
      adminOverride: false
    };

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Object.assign(defaultData, parsed);
      } catch (e) {
        console.error('Error al cargar progreso del estudiante:', e);
      }
    }
    return defaultData;
  },

  saveStudentProgress(username, data) {
    if (!username) return;
    const key = this.getStorageKey(username);
    localStorage.setItem(key, JSON.stringify(data));
    this.updateUIProgression();
  },

  // Verifica si una unidad está completada al 100% (todos sus ejercicios + quiz >= 70%)
  isUnitCompleted(unitKey, progress) {
    const config = this.unitsConfig[unitKey];
    if (!config || !progress) return false;

    // Verificar si todos sus ejercicios del catálogo están completados
    const doneEx = progress.completedExercises || [];
    const allExDone = config.exercises.every(exId => doneEx.includes(exId));

    // Verificar si aprobó el quiz de la unidad (mínimo 70%)
    const quizScore = progress.passedQuizzes ? (progress.passedQuizzes[config.quiz] || 0) : 0;
    const quizDone = quizScore >= 70;

    return allExDone && quizDone;
  },

  // Porcentaje completado de una unidad individual
  getUnitCompletionPercentage(unitKey, progress) {
    const config = this.unitsConfig[unitKey];
    if (!config || !progress) return 0;

    const doneEx = progress.completedExercises || [];
    const exCount = config.exercises.filter(exId => doneEx.includes(exId)).length;
    const quizScore = progress.passedQuizzes ? (progress.passedQuizzes[config.quiz] || 0) : 0;
    const quizWeight = quizScore >= 70 ? 1 : (quizScore / 100);

    const totalWeight = config.exercises.length + 1;
    const earnedWeight = exCount + quizWeight;

    return Math.round((earnedWeight / totalWeight) * 100);
  },

  // Calcula el porcentaje acumulado total de todo el temario (las 5 unidades)
  getTotalTopicsPercentage(progress) {
    if (!progress) return 0;
    let total = 0;
    ['u1', 'u2', 'u3', 'u4', 'u5'].forEach(u => {
      total += this.getUnitCompletionPercentage(u, progress);
    });
    return Math.round(total / 5);
  },

  // Determina si una unidad está desbloqueada para un usuario
  isUnitUnlocked(unitKey, user, progress) {
    // Vistas públicas accesibles siempre
    if (['dashboard', 'workshop', 'labs', 'u1'].includes(unitKey)) {
      return true;
    }

    // Sin usuario activo, el resto de las unidades están bloqueadas
    if (!user) {
      return false;
    }

    // El Super Administrador (Prof. Garibaldi) tiene acceso total incondicional
    if (user.role === 'superadmin') {
      return true;
    }

    // Panel Docente exclusivo de superadmin
    if (unitKey === 'admin') {
      return false;
    }

    if (!progress) {
      progress = this.getStudentProgress(user.username);
    }
    if (!progress) return false;

    // Desbloqueo manual otorgado por el docente
    if (progress.adminOverride) {
      return true;
    }

    // Reglas estrictas de progresión secuencial (U1 -> U2 -> U3 -> U4 -> U5 -> Examen):
    if (unitKey === 'u2') {
      return this.isUnitCompleted('u1', progress);
    }
    if (unitKey === 'u3') {
      return this.isUnitCompleted('u1', progress) && this.isUnitCompleted('u2', progress);
    }
    if (unitKey === 'u4') {
      return this.isUnitCompleted('u1', progress) && 
             this.isUnitCompleted('u2', progress) && 
             this.isUnitCompleted('u3', progress);
    }
    if (unitKey === 'u5') {
      return this.isUnitCompleted('u1', progress) && 
             this.isUnitCompleted('u2', progress) && 
             this.isUnitCompleted('u3', progress) && 
             this.isUnitCompleted('u4', progress);
    }
    if (unitKey === 'exam') {
      return ['u1', 'u2', 'u3', 'u4', 'u5'].every(u => this.isUnitCompleted(u, progress));
    }

    return false;
  },

  // Validador de acceso con avisos explicativos
  canAccessUnit(unitKey, showAlert = true) {
    // Vistas públicas
    if (['dashboard', 'workshop', 'u1'].includes(unitKey)) {
      return true;
    }

    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    if (!user) {
      if (showAlert) {
        alert('🔒 INICIO DE SESIÓN REQUERIDO\n\nPor favor inicia sesión con tu usuario y contraseña de estudiante para ingresar a este contenido.');
      }
      return false;
    }

    if (user.role === 'superadmin') {
      return true;
    }

    if (unitKey === 'admin') {
      if (showAlert) {
        alert('🔒 ACCESO RESTRINGIDO\n\nEl Panel Docente es exclusivo para el Titular de la Asignatura (Prof. Luis Alberto Garibaldi).');
      }
      return false;
    }

    const progress = this.getStudentProgress(user.username);
    if (!progress) return false;

    if (progress.adminOverride) {
      return true;
    }

    // Validación secuencial Unidad por Unidad
    if (unitKey === 'u2') {
      if (!this.isUnitCompleted('u1', progress)) {
        if (showAlert) {
          const pct = this.getUnitCompletionPercentage('u1', progress);
          const doneEx = (progress.completedExercises || []).filter(id => id.startsWith('ex_1_')).length;
          const qScore = progress.passedQuizzes ? (progress.passedQuizzes['u1'] || 0) : 0;
          alert(`🔒 UNIDAD 2 BLOQUEADA\n\nTu avance actual en la Unidad 1 es del ${pct}%:\n• Prácticas de Unidad 1 completadas: ${doneEx} de ${this.unitsConfig.u1.exercises.length}\n• Cuestionario Unidad 1: ${qScore}% (mínimo 70% requerido)\n\nDebes completar al 100% las 20 prácticas y el cuestionario de la Unidad 1 para desbloquear la Unidad 2.`);
        }
        return false;
      }
      return true;
    }

    if (unitKey === 'u3') {
      if (!this.isUnitCompleted('u2', progress)) {
        if (showAlert) {
          const pct = this.getUnitCompletionPercentage('u2', progress);
          const doneEx = (progress.completedExercises || []).filter(id => id.startsWith('ex_2_')).length;
          alert(`🔒 UNIDAD 3 BLOQUEADA\n\nTu avance en la Unidad 2 es del ${pct}% (${doneEx} de ${this.unitsConfig.u2.exercises.length} prácticas).\n\nDebes completar al 100% las 20 prácticas y el cuestionario de la Unidad 2 para acceder a Dispositivos de Red (Unidad 3).`);
        }
        return false;
      }
      return true;
    }

    if (unitKey === 'u4') {
      if (!this.isUnitCompleted('u3', progress)) {
        if (showAlert) {
          const pct = this.getUnitCompletionPercentage('u3', progress);
          const doneEx = (progress.completedExercises || []).filter(id => id.startsWith('ex_3_')).length;
          alert(`🔒 UNIDAD 4 BLOQUEADA\n\nTu avance en la Unidad 3 es del ${pct}% (${doneEx} de ${this.unitsConfig.u3.exercises.length} prácticas).\n\nDebes completar al 100% las 20 prácticas y el cuestionario de la Unidad 3 para acceder a Cableado Estructurado (Unidad 4).`);
        }
        return false;
      }
      return true;
    }

    if (unitKey === 'u5') {
      if (!this.isUnitCompleted('u4', progress)) {
        if (showAlert) {
          const pct = this.getUnitCompletionPercentage('u4', progress);
          const doneEx = (progress.completedExercises || []).filter(id => id.startsWith('ex_4_')).length;
          alert(`🔒 UNIDAD 5 BLOQUEADA (PROYECTO INTEGRADOR)\n\nTu avance en la Unidad 4 es del ${pct}% (${doneEx} de ${this.unitsConfig.u4.exercises.length} prácticas).\n\nDebes completar al 100% las 20 prácticas de Cableado Estructurado (Unidad 4) para habilitar la Planificación y Diseño (Unidad 5).`);
        }
        return false;
      }
      return true;
    }

    if (unitKey === 'exam') {
      const units = ['u1', 'u2', 'u3', 'u4', 'u5'];
      const allDone = units.every(u => this.isUnitCompleted(u, progress));
      if (!allDone) {
        if (showAlert) {
          const totalPct = this.getTotalTopicsPercentage(progress);
          alert(`🔒 EXAMEN FINAL INTEGRADOR BLOQUEADO\n\nTu progreso acumulado es del ${totalPct}% / 100% del temario.\n\nBajo la rúbrica oficial de la Universidad Aztlán (Clave 634), el examen final solo se habilita al haber completado el 100% de los temas, prácticas de taller y cuestionarios de las 5 Unidades.`);
        }
        return false;
      }
      return true;
    }

    return false;
  },

  // Registra que un ejercicio práctico fue completado
  recordExerciseDone(exId) {
    this.recordExerciseCompleted(exId);
  },

  recordExerciseCompleted(exId) {
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    if (!user) return;

    if (user.role === 'superadmin') {
      // El superadmin puede marcar sin restricción
      return;
    }

    const progress = this.getStudentProgress(user.username);
    if (!progress.completedExercises.includes(exId)) {
      progress.completedExercises.push(exId);
    }

    this.saveStudentProgress(user.username, progress);
    this.checkForNewUnlocks(user.username, progress);
  },

  // Registra la calificación de un cuestionario de unidad
  recordQuizCompleted(unitKey, score) {
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    if (!user) return;

    if (user.role === 'superadmin') return;

    const progress = this.getStudentProgress(user.username);
    progress.passedQuizzes[unitKey] = score;

    this.saveStudentProgress(user.username, progress);
    this.checkForNewUnlocks(user.username, progress);
  },

  // Verifica si las condiciones alcanzaron para desbloquear la siguiente etapa
  checkForNewUnlocks(username, progress) {
    const units = ['u1', 'u2', 'u3', 'u4', 'u5'];
    
    // Si completó U1 y no tiene U2 notificado
    if (this.isUnitCompleted('u1', progress) && !progress._notifiedU2) {
      progress._notifiedU2 = true;
      this.saveStudentProgress(username, progress);
      this.showUnlockCelebration(this.unitsConfig['u2'].name);
      return;
    }

    if (this.isUnitCompleted('u2', progress) && !progress._notifiedU3) {
      progress._notifiedU3 = true;
      this.saveStudentProgress(username, progress);
      this.showUnlockCelebration(this.unitsConfig['u3'].name);
      return;
    }

    if (this.isUnitCompleted('u3', progress) && !progress._notifiedU4) {
      progress._notifiedU4 = true;
      this.saveStudentProgress(username, progress);
      this.showUnlockCelebration(this.unitsConfig['u4'].name);
      return;
    }

    if (this.isUnitCompleted('u4', progress) && !progress._notifiedU5) {
      progress._notifiedU5 = true;
      this.saveStudentProgress(username, progress);
      this.showUnlockCelebration(this.unitsConfig['u5'].name);
      return;
    }

    const allCompleted = units.every(u => this.isUnitCompleted(u, progress));
    if (allCompleted && !progress._notifiedExam) {
      progress._notifiedExam = true;
      this.saveStudentProgress(username, progress);
      this.showUnlockCelebration('¡EXAMEN FINAL INTEGRADOR HABILITADO!');
      return;
    }
  },

  showUnlockCelebration(title) {
    if (window.AuthSystem && window.AuthSystem.playSound) {
      window.AuthSystem.playSound('success');
    }

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.style.zIndex = '99999';
    modal.innerHTML = `
      <div class="modal-content" style="text-align: center; max-width: 500px; border-color: #10b981; animation: modalScale 0.3s ease;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem; animation: pulseLogo 2s infinite;">🎉🔓</div>
        <h2 style="color: #6ee7b7; font-size: 1.4rem; margin-bottom: 0.5rem;">¡NUEVA ETAPA DESBLOQUEADA!</h2>
        <p style="font-size: 1.05rem; color: #f8fafc; font-weight: bold; margin-bottom: 1rem;">
          ${title}
        </p>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.5rem;">
          Has superado con éxito todos los temas y ejercicios prácticos de la etapa anterior. Continúa avanzando en tu formación académica de Redes de Computadoras.
        </p>
        <button class="btn btn-primary" style="padding: 0.7rem 2rem; font-size: 0.95rem;" onclick="this.closest('.modal-backdrop').remove()">
          Continuar al Siguiente Tema →
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // Actualiza la interfaz visual: botones, candados y tarjetas del dashboard
  updateUIProgression() {
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    const isSuperAdmin = user && user.role === 'superadmin';

    let progress = null;
    if (user && user.role === 'student') {
      progress = this.getStudentProgress(user.username);
    }

    // 1. Actualizar pestañas de navegación (U1 - U5)
    ['u1', 'u2', 'u3', 'u4', 'u5'].forEach(u => {
      const btn = document.querySelector(`.nav-tab-btn[data-view="${u}"]`);
      if (!btn) return;

      if (isSuperAdmin) {
        btn.classList.remove('nav-locked');
        btn.title = 'Acceso total Super Administrador';
        const lockIcon = btn.querySelector('.tab-lock-icon');
        if (lockIcon) lockIcon.remove();
        return;
      }

      const unlocked = this.isUnitUnlocked(u, user, progress);
      const done = progress ? this.isUnitCompleted(u, progress) : false;
      const pct = progress ? this.getUnitCompletionPercentage(u, progress) : 0;

      let lockIcon = btn.querySelector('.tab-lock-icon');
      if (!lockIcon) {
        lockIcon = document.createElement('span');
        lockIcon.className = 'tab-lock-icon';
        lockIcon.style.marginLeft = '4px';
        btn.appendChild(lockIcon);
      }

      if (!unlocked) {
        btn.classList.add('nav-locked');
        btn.title = 'Bloqueado. Debes completar al 100% la etapa anterior para acceder.';
        lockIcon.innerText = '🔒';
        lockIcon.style.color = '#ef4444';
      } else {
        btn.classList.remove('nav-locked');
        btn.title = done ? 'Unidad 100% Completada' : `En Progreso (${pct}%)`;
        lockIcon.innerText = done ? '✓' : '';
        lockIcon.style.color = '#10b981';
      }
    });

    // 2. Actualizar Pestaña y Botón de Examen Final
    const examBtn = document.querySelector('.nav-tab-btn[data-view="exam"]');
    if (examBtn) {
      if (isSuperAdmin) {
        examBtn.classList.remove('nav-locked');
        examBtn.style.display = 'inline-flex';
        const lock = examBtn.querySelector('.tab-lock-icon');
        if (lock) lock.remove();
      } else {
        const examUnlocked = this.isUnitUnlocked('exam', user, progress);
        const totalPct = progress ? this.getTotalTopicsPercentage(progress) : 0;

        let lockIcon = examBtn.querySelector('.tab-lock-icon');
        if (!lockIcon) {
          lockIcon = document.createElement('span');
          lockIcon.className = 'tab-lock-icon';
          lockIcon.style.marginLeft = '6px';
          examBtn.appendChild(lockIcon);
        }

        if (!examUnlocked) {
          examBtn.classList.add('nav-locked');
          examBtn.title = `Bloqueado (Progreso: ${totalPct}% / 100%). Completa las 5 unidades para realizar el examen.`;
          lockIcon.innerText = `🔒 (${totalPct}%)`;
          lockIcon.style.color = '#ef4444';
        } else {
          examBtn.classList.remove('nav-locked');
          examBtn.title = 'Examen Final Desbloqueado';
          lockIcon.innerText = '🔓 Listo';
          lockIcon.style.color = '#10b981';
        }
      }
    }

    // 3. Actualizar catálogo de ejercicios en el Taller
    this.updateWorkshopProgression(isSuperAdmin, user, progress);

    // 4. Actualizar tarjetas de unidades en el Dashboard
    this.updateDashboardCards(isSuperAdmin, user, progress);
  },

  updateWorkshopProgression(isSuperAdmin, user, progress) {
    const navItems = document.querySelectorAll('.exercise-item-nav');
    navItems.forEach(item => {
      const code = item.querySelector('.ex-code-badge')?.innerText || '';
      const unitKey = code.startsWith('U1') ? 'u1' :
                      code.startsWith('U2') ? 'u2' :
                      code.startsWith('U3') ? 'u3' :
                      code.startsWith('U4') ? 'u4' : 'u5';

      if (isSuperAdmin) {
        item.classList.remove('ex-locked');
        item.title = 'Acceso docente';
        return;
      }

      const isUnlocked = this.isUnitUnlocked(unitKey, user, progress);
      if (!isUnlocked) {
        item.classList.add('ex-locked');
        item.title = `Bloqueado. Debes completar al 100% la unidad previa para realizar esta práctica.`;
      } else {
        item.classList.remove('ex-locked');
        item.title = '';
      }
    });
  },

  updateDashboardCards(isSuperAdmin, user, progress) {
    ['u1', 'u2', 'u3', 'u4', 'u5'].forEach((u, idx) => {
      const card = document.querySelectorAll('.unit-card')[idx];
      if (!card) return;

      if (isSuperAdmin) {
        card.classList.remove('unit-locked');
        const badge = card.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge completed';
          badge.innerText = 'Acceso Total Docente';
        }
        return;
      }

      const isUnlocked = this.isUnitUnlocked(u, user, progress);
      const isDone = progress && this.isUnitCompleted(u, progress);
      const pct = progress ? this.getUnitCompletionPercentage(u, progress) : 0;

      if (!isUnlocked) {
        card.classList.add('unit-locked');
        const badge = card.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge pending';
          badge.style.background = 'rgba(239, 68, 68, 0.15)';
          badge.style.color = '#fca5a5';
          badge.style.border = '1px dashed #ef4444';
          badge.innerText = '🔒 Bloqueada (0%)';
        }
      } else {
        card.classList.remove('unit-locked');
        const badge = card.querySelector('.status-badge');
        if (badge) {
          badge.style.background = '';
          badge.style.border = '';
          badge.className = isDone ? 'status-badge completed' : 'status-badge pending';
          badge.innerText = isDone ? '✓ 100% Completada' : `🔓 En Progreso (${pct}%)`;
        }
      }
    });
  }
};

// Exportar explícitamente a window para compatibilidad global y llamadas onclick
if (typeof window !== 'undefined') {
  window.AcademicProgression = AcademicProgression;
}
