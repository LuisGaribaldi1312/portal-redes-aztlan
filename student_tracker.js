/**
 * SISTEMA INTEGRAL DE SEGUIMIENTO, AUDITORÍA Y EXPEDIENTE DE ALUMNOS
 * UNIVERSIDAD AZTLÁN - REDES DE COMPUTADORAS (CLAVE 634)
 * Docente Titular: Prof. Luis Alberto Garibaldi
 */

const StudentTracker = {
  STORAGE_KEY: 'aztlan_student_registry_v2026',

  // Configuración base de estudiantes oficiales asignados
  defaultStudents: [
    {
      username: 'mleyva',
      matricula: 'AZT-2026-63401',
      name: 'Mario Leyva Mendez',
      email: 'mario.leyva@alumnos.aztlan.edu.mx',
      avatar: '👨‍💻',
      badgeColor: '#38bdf8',
      lastAccess: 'Pendiente',
      completedExercises: [],
      passedQuizzes: {}, // { u1: 85, u2: 90, ... }
      passedLabs: {},    // { u1: true, ... }
      finalExam: null,   // { score: 95, date: '...' }
      readingProgress: 0,
      activityLog: []
    },
    {
      username: 'ilopez',
      matricula: 'AZT-2026-63402',
      name: 'Isaias Lopez Meza',
      email: 'isaias.lopez@alumnos.aztlan.edu.mx',
      avatar: '👨‍🎓',
      badgeColor: '#10b981',
      lastAccess: 'Pendiente',
      completedExercises: [],
      passedQuizzes: {},
      passedLabs: {},
      finalExam: null,
      readingProgress: 0,
      activityLog: []
    },
    {
      username: 'jgonzalez',
      matricula: 'AZT-2026-63403',
      name: 'J. González',
      email: 'jgonzalez@aztlan.edu.mx',
      avatar: '👨‍🎓',
      badgeColor: '#a855f7',
      lastAccess: 'Pendiente',
      completedExercises: [],
      passedQuizzes: {},
      passedLabs: {},
      finalExam: null,
      readingProgress: 0,
      activityLog: []
    },
    {
      username: 'djimenez',
      matricula: 'AZT-2026-63404',
      name: 'D. Jiménez',
      email: 'djimenez@aztlan.edu.mx',
      avatar: '👨‍💻',
      badgeColor: '#ec4899',
      lastAccess: 'Pendiente',
      completedExercises: [],
      passedQuizzes: {},
      passedLabs: {},
      finalExam: null,
      readingProgress: 0,
      activityLog: []
    },
    {
      username: 'dmorales',
      matricula: 'AZT-2026-63405',
      name: 'D. Morales',
      email: 'dmorales@aztlan.edu.mx',
      avatar: '👨‍🎓',
      badgeColor: '#f97316',
      lastAccess: 'Pendiente',
      completedExercises: [],
      passedQuizzes: {},
      passedLabs: {},
      finalExam: null,
      readingProgress: 0,
      activityLog: []
    }
  ],

  broadcastChannel: (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('aztlan_student_sync_channel') : null,
  activeDossierUser: null,
  syncInterval: null,

  init() {
    this.ensureInitialized();
    this.setupSyncListeners();
    this.renderAdminView();
    this.startLivePolling();
  },

  ensureInitialized() {
    let current = [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        current = JSON.parse(data) || [];
      } catch (e) {
        current = [];
      }
    }
    let updated = false;
    this.defaultStudents.forEach(def => {
      const exists = current.find(s => s.username === def.username);
      if (!exists) {
        current.push(JSON.parse(JSON.stringify(def)));
        updated = true;
      }
    });
    if (updated || !data) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
    }
  },

  setupSyncListeners() {
    // 1. Sincronización en tiempo real entre pestañas y ventanas
    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'UPDATE_STUDENTS') {
          this.renderAdminView();
          if (this.activeDossierUser) {
            this.showStudentDossier(this.activeDossierUser);
          }
        }
      };
    }

    // 2. Evento nativo storage (cross-tab)
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY) {
        this.renderAdminView();
        if (this.activeDossierUser) {
          this.showStudentDossier(this.activeDossierUser);
        }
      }
    });

    // 3. Sincronización al enfocar la pestaña
    window.addEventListener('focus', () => {
      this.fetchCloudSync();
    });
  },

  startLivePolling() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    // Polling ligero cada 3.5 segundos en la nube
    this.syncInterval = setInterval(() => {
      const adminView = document.getElementById('view-admin');
      if (adminView && adminView.classList.contains('active')) {
        this.fetchCloudSync();
      }
    }, 3500);
  },

  // Sincronizar hacia el servidor (en segundo plano)
  async syncWithCloud(students) {
    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(students)
        }).catch(() => {});
      }
    } catch (e) {}
  },

  // Traer actualizaciones del servidor
  async fetchCloudSync() {
    try {
      if (typeof fetch === 'undefined') return;
      const res = await fetch('/api/sync');
      if (!res.ok) return;
      const json = await res.json();
      if (json && Array.isArray(json.students) && json.students.length > 0) {
        this.mergeCloudStudents(json.students);
      }
    } catch (e) {}
  },

  mergeCloudStudents(cloudList) {
    const local = this.getStudents();
    let changed = false;

    cloudList.forEach(cl => {
      const loc = local.find(s => s.username === cl.username);
      if (loc) {
        // Unir ejercicios resueltos
        const prevExLen = (loc.completedExercises || []).length;
        const setEx = new Set([...(loc.completedExercises || []), ...(cl.completedExercises || [])]);
        loc.completedExercises = Array.from(setEx);
        if (loc.completedExercises.length !== prevExLen) changed = true;

        // Unir cuestionarios (puntaje más alto)
        loc.passedQuizzes = loc.passedQuizzes || {};
        if (cl.passedQuizzes) {
          Object.keys(cl.passedQuizzes).forEach(k => {
            if ((cl.passedQuizzes[k] || 0) > (loc.passedQuizzes[k] || 0)) {
              loc.passedQuizzes[k] = cl.passedQuizzes[k];
              changed = true;
            }
          });
        }

        // Unir laboratorios
        if (cl.passedLabs) {
          loc.passedLabs = { ...(loc.passedLabs || {}), ...cl.passedLabs };
        }

        // Examen final
        if (cl.finalExam && (!loc.finalExam || cl.finalExam.score > loc.finalExam.score)) {
          loc.finalExam = cl.finalExam;
          changed = true;
        }

        // Último acceso
        if (cl.lastAccess && cl.lastAccess !== 'Pendiente' && cl.lastAccess !== loc.lastAccess) {
          loc.lastAccess = cl.lastAccess;
          changed = true;
        }

        // Bitácora
        if (cl.activityLog && cl.activityLog.length > (loc.activityLog || []).length) {
          loc.activityLog = cl.activityLog;
          changed = true;
        }
      } else {
        local.push(cl);
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(local));
      this.renderAdminView();
      if (this.activeDossierUser) {
        this.showStudentDossier(this.activeDossierUser);
      }
    }
  },

  saveStudents(students) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
    // Sincronizar en tiempo real con pestañas y vista docente
    this.renderAdminView();
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'UPDATE_STUDENTS', timestamp: Date.now() });
    }
    // Sincronizar con el servidor en la nube
    this.syncWithCloud(students);
  },

  getStudent(username) {
    const students = this.getStudents();
    return students.find(s => s.username === username) || null;
  },

  // Registrar último acceso de estudiante
  recordAccess(username) {
    if (!username || username === 'lgaribaldi') return;
    const students = this.getStudents();
    const st = students.find(s => s.username === username);
    if (st) {
      const now = new Date();
      st.lastAccess = now.toLocaleString('es-MX', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });
      this.logActivity(st, 'Inicio de sesión en la plataforma');
      this.saveStudents(students);
    }
  },

  // Registrar práctica del taller completada
  recordExercise(username, exId, title = '') {
    if (!username || username === 'lgaribaldi') return;
    const students = this.getStudents();
    const st = students.find(s => s.username === username);
    if (st) {
      if (!st.completedExercises) st.completedExercises = [];
      if (!st.completedExercises.includes(exId)) {
        st.completedExercises.push(exId);
        const unitNum = exId.startsWith('ex_1') ? '1' :
                        exId.startsWith('ex_2') ? '2' :
                        exId.startsWith('ex_3') ? '3' :
                        exId.startsWith('ex_4') ? '4' : '5';
        this.logActivity(st, `Completó práctica [U${unitNum}] ${title || exId}`);
        this.saveStudents(students);
      }
    }
  },

  // Registrar cuestionario de unidad presentado
  recordQuiz(username, unitKey, score) {
    if (!username || username === 'lgaribaldi') return;
    const students = this.getStudents();
    const st = students.find(s => s.username === username);
    if (st) {
      if (!st.passedQuizzes) st.passedQuizzes = {};
      st.passedQuizzes[unitKey] = score;
      const unitNum = unitKey.replace('u', '');
      this.logActivity(st, `Presentó Cuestionario Unidad ${unitNum} con calificación: ${score}%`);
      this.saveStudents(students);
    }
  },

  // Registrar práctica de laboratorio en vivo completada
  recordLab(username, labKey, labName = '') {
    if (!username || username === 'lgaribaldi') return;
    const students = this.getStudents();
    const st = students.find(s => s.username === username);
    if (st) {
      if (!st.passedLabs) st.passedLabs = {};
      st.passedLabs[labKey] = true;
      this.logActivity(st, `Validó escenario de laboratorio: ${labName || labKey}`);
      this.saveStudents(students);
    }
  },

  // Registrar examen final
  recordFinalExam(username, score) {
    if (!username || username === 'lgaribaldi') return;
    const students = this.getStudents();
    const st = students.find(s => s.username === username);
    if (st) {
      const now = new Date();
      st.finalExam = {
        score: score,
        date: now.toLocaleString('es-MX', { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        })
      };
      this.logActivity(st, `Presentó Examen Final Integrador: ${score}% (${score >= 70 ? 'APROBADO' : 'NO ACREDITADO'})`);
      this.saveStudents(students);
    }
  },

  logActivity(student, action) {
    if (!student.activityLog) student.activityLog = [];
    const now = new Date();
    const timestamp = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' }) + ' ' +
                      now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    student.activityLog.unshift({ timestamp, action });
    if (student.activityLog.length > 25) student.activityLog.pop();
  },

  // Cálculo ponderado según la Rúbrica Oficial Aztlán
  calculateGrades(student) {
    const totalExercises = 100;
    const doneExCount = (student.completedExercises || []).length;
    const pracsScore = Math.round((doneExCount / totalExercises) * 100);
    const pracsWeighted = Math.round((pracsScore * 0.3) * 10) / 10; // 30%

    // Lecturas / Contenido (20%)
    const readingScore = student.readingProgress || Math.min(100, Math.round(doneExCount * 1.2));
    const readingWeighted = Math.round((readingScore * 0.2) * 10) / 10; // 20%

    // Quizzes U1-U5 (20%)
    const quizKeys = ['u1', 'u2', 'u3', 'u4', 'u5'];
    let quizSum = 0;
    let quizCount = 0;
    quizKeys.forEach(k => {
      if (student.passedQuizzes && student.passedQuizzes[k] !== undefined) {
        quizSum += student.passedQuizzes[k];
        quizCount++;
      }
    });
    const quizAvg = quizCount > 0 ? Math.round(quizSum / 5) : 0;
    const quizWeighted = Math.round((quizAvg * 0.2) * 10) / 10; // 20%

    // Examen Final (30%)
    const examScore = student.finalExam ? student.finalExam.score : 0;
    const examWeighted = Math.round((examScore * 0.3) * 10) / 10; // 30%

    // Promedio Final Ponderado
    const finalTotal = Math.round((pracsWeighted + readingWeighted + quizWeighted + examWeighted) * 10) / 10;

    // Determinación de Etapa / Unidad
    let currentUnit = 'Unidad 1';
    let statusText = 'Cursando Unidad 1';
    let statusClass = 'pending';

    const u1Done = ((student.completedExercises || []).filter(id => id.startsWith('ex_1')).length >= 20) && (student.passedQuizzes && student.passedQuizzes['u1'] >= 70);
    const u2Done = ((student.completedExercises || []).filter(id => id.startsWith('ex_2')).length >= 20) && (student.passedQuizzes && student.passedQuizzes['u2'] >= 70);
    const u3Done = ((student.completedExercises || []).filter(id => id.startsWith('ex_3')).length >= 20) && (student.passedQuizzes && student.passedQuizzes['u3'] >= 70);
    const u4Done = ((student.completedExercises || []).filter(id => id.startsWith('ex_4')).length >= 20) && (student.passedQuizzes && student.passedQuizzes['u4'] >= 70);
    const u5Done = ((student.completedExercises || []).filter(id => id.startsWith('ex_5')).length >= 20) && (student.passedQuizzes && student.passedQuizzes['u5'] >= 70);

    if (student.finalExam && student.finalExam.score >= 70) {
      statusText = 'Acreditado 🏆';
      statusClass = 'completed';
      currentUnit = 'Completado';
    } else if (u1Done && u2Done && u3Done && u4Done && u5Done) {
      statusText = 'Listo para Examen 📝';
      statusClass = 'pending';
      currentUnit = 'Examen Final';
    } else if (u1Done && u2Done && u3Done && u4Done) {
      statusText = 'Cursando Unidad 5';
      currentUnit = 'Unidad 5';
    } else if (u1Done && u2Done && u3Done) {
      statusText = 'Cursando Unidad 4';
      currentUnit = 'Unidad 4';
    } else if (u1Done && u2Done) {
      statusText = 'Cursando Unidad 3';
      currentUnit = 'Unidad 3';
    } else if (u1Done) {
      statusText = 'Cursando Unidad 2';
      currentUnit = 'Unidad 2';
    }

    return {
      pracsScore,
      pracsWeighted,
      doneExCount,
      readingScore,
      readingWeighted,
      quizAvg,
      quizWeighted,
      examScore,
      examWeighted,
      finalTotal,
      currentUnit,
      statusText,
      statusClass,
      hasTakenExam: !!student.finalExam
    };
  },

  // Renderizar la tabla de alumnos y métricas en view-admin
  renderAdminView() {
    const tbody = document.getElementById('teacher-students-tbody');
    if (!tbody) return;

    const students = this.getStudents();
    let totalGroupEx = 0;
    let totalGroupQuizzes = 0;
    let groupScoreSum = 0;

    tbody.innerHTML = students.map(st => {
      const g = this.calculateGrades(st);
      totalGroupEx += g.doneExCount;
      totalGroupQuizzes += Object.keys(st.passedQuizzes || {}).length;
      groupScoreSum += g.finalTotal;

      const quizzesBadges = ['u1', 'u2', 'u3', 'u4', 'u5'].map(u => {
        const sc = st.passedQuizzes ? st.passedQuizzes[u] : undefined;
        if (sc === undefined) return `<span style="font-size: 0.68rem; color: #64748b; background: rgba(255,255,255,0.06); padding: 2px 5px; border-radius: 4px;">${u.toUpperCase()}: --</span>`;
        const col = sc >= 70 ? '#10b981' : '#ef4444';
        return `<span style="font-size: 0.68rem; color: ${col}; font-weight: bold; background: rgba(255,255,255,0.06); padding: 2px 5px; border-radius: 4px;">${u.toUpperCase()}: ${sc}%</span>`;
      }).join(' ');

      return `
        <tr>
          <td><code style="color: #38bdf8;">${st.matricula}</code></td>
          <td>
            <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">${st.name}</div>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 0.15rem;">${st.email} • Último acceso: <span style="color: #94a3b8;">${st.lastAccess}</span></div>
          </td>
          <td>
            <div style="font-weight: bold; color: ${g.doneExCount > 0 ? '#38bdf8' : '#64748b'};">${g.doneExCount} / 100 (${g.pracsScore}%)</div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 4px; overflow: hidden;">
              <div style="width: ${g.pracsScore}%; height: 100%; background: linear-gradient(90deg, #0284c7, #38bdf8);"></div>
            </div>
          </td>
          <td><strong style="color: var(--text-main);">${g.readingScore}%</strong></td>
          <td>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 180px;">
              ${quizzesBadges}
            </div>
          </td>
          <td>
            ${st.finalExam 
              ? `<strong style="font-size: 0.95rem; color: ${st.finalExam.score >= 70 ? '#10b981' : '#ef4444'};">${st.finalExam.score}%</strong>`
              : `<span style="color: #64748b; font-size: 0.82rem;">Pendiente</span>`}
          </td>
          <td>
            <strong style="font-size: 1.15rem; color: ${g.finalTotal >= 70 ? '#10b981' : (g.finalTotal > 0 ? '#38bdf8' : '#64748b')};">
              ${g.finalTotal > 0 ? g.finalTotal + ' pts' : 'En Curso'}
            </strong>
          </td>
          <td>
            <span class="status-badge ${g.statusClass}">
              ${g.statusText}
            </span>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button class="btn btn-sm btn-primary" onclick="StudentTracker.showStudentDossier('${st.username}')" title="Ver desglose detallado de temas y respuestas">
                🔍 Auditar
              </button>
              <button class="btn btn-sm" onclick="StudentTracker.printStudentReport('${st.username}')" style="background: rgba(255,255,255,0.08); border: 1px solid var(--border);" title="Imprimir boleta oficial de calificaciones">
                🖨️ Boleta
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Actualizar Tarjetas de Resumen General del Grupo
    const avgScore = students.length > 0 ? Math.round(groupScoreSum / students.length) : 0;
    const avgExPct = students.length > 0 ? Math.round((totalGroupEx / (students.length * 100)) * 100) : 0;

    const cardsContainer = document.getElementById('admin-group-summary-cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = `
        <div class="calc-item" style="border-left: 4px solid #38bdf8;">
          <div class="title">Estudiantes Asignados:</div>
          <div class="val" style="color: #38bdf8;">${students.length} Alumnos</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem;">Mario Leyva Mendez & Isaias Lopez Meza</div>
        </div>
        <div class="calc-item" style="border-left: 4px solid #10b981;">
          <div class="title">Avance Promedio Grupal:</div>
          <div class="val" style="color: #10b981;">${avgExPct}% Completado</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem;">${totalGroupEx} de ${students.length * 100} prácticas resueltas</div>
        </div>
        <div class="calc-item" style="border-left: 4px solid #818cf8;">
          <div class="title">Evaluaciones Acreditadas:</div>
          <div class="val" style="color: #818cf8;">${totalGroupQuizzes} Quizzes</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem;">Promedio Global: ${avgScore} pts</div>
        </div>
        <div class="calc-item" style="border-left: 4px solid #f59e0b;">
          <div class="title">Estatus de Ciclo Escolar:</div>
          <div class="val" style="color: #f59e0b;">En Curso</div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem;">Sábados Nov-Dic 2026 • Clave 634</div>
        </div>
      `;
    }
  },

  // Modal con expediente completo y desglose
  showStudentDossier(username) {
    this.activeDossierUser = username;
    const currentUser = window.AuthSystem ? window.AuthSystem.currentUser : null;
    if (currentUser && currentUser.role !== 'superadmin' && currentUser.username !== username) {
      alert('Solo puedes consultar tu propio expediente académico.');
      return;
    }
    const st = this.getStudent(username);
    if (!st) return;
    const g = this.calculateGrades(st);

    const modal = document.getElementById('student-dossier-modal');
    if (!modal) return;

    // Desglose por unidad
    const unitsSummary = [1, 2, 3, 4, 5].map(uNum => {
      const uKey = `u${uNum}`;
      const exInU = (st.completedExercises || []).filter(id => id.startsWith(`ex_${uNum}_`)).length;
      const qScore = st.passedQuizzes ? st.passedQuizzes[uKey] : undefined;
      const labDone = st.passedLabs ? st.passedLabs[uKey] : false;
      const isApproved = exInU >= 20 && qScore >= 70;

      return `
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; padding: 0.9rem; margin-bottom: 0.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.4rem;">
            <div style="font-weight: bold; color: var(--text-main); font-size: 0.9rem;">
              <span class="sub-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; margin-right: 0.4rem;">Unidad ${uNum}</span>
              ${this.getUnitName(uNum)}
            </div>
            <span class="status-badge ${isApproved ? 'completed' : 'pending'}" style="font-size: 0.72rem;">
              ${isApproved ? '✓ 100% Completada' : `En Progreso (${exInU}/20)`}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.6rem; font-size: 0.8rem; margin-top: 0.5rem; background: rgba(0,0,0,0.25); padding: 0.6rem; border-radius: 6px;">
            <div>Prácticas: <strong style="color: #38bdf8;">${exInU} de 20</strong></div>
            <div>Cuestionario: <strong style="color: ${qScore >= 70 ? '#10b981' : (qScore !== undefined ? '#ef4444' : '#64748b')};">${qScore !== undefined ? qScore + '%' : 'Sin presentar'}</strong></div>
            <div>Laboratorio: <strong style="color: ${labDone ? '#10b981' : '#64748b'};">${labDone ? 'Acreditado ✓' : 'Pendiente'}</strong></div>
          </div>
        </div>
      `;
    }).join('');

    // Historial de bitácora
    const historyHtml = (st.activityLog && st.activityLog.length > 0)
      ? st.activityLog.slice(0, 10).map(act => `
          <div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.78rem; display: flex; gap: 0.6rem;">
            <span style="color: #64748b; font-family: monospace;">[${act.timestamp}]</span>
            <span style="color: var(--text-main);">${act.action}</span>
          </div>
        `).join('')
      : `<div style="font-size: 0.8rem; color: #64748b; font-style: italic;">Sin actividad reciente registrada.</div>`;

    const avatarElem = document.getElementById('dossier-student-avatar');
    if (avatarElem) avatarElem.innerText = st.avatar;

    const nameElem = document.getElementById('dossier-student-name');
    if (nameElem) nameElem.innerText = st.name;

    const matElem = document.getElementById('dossier-student-matricula');
    if (matElem) matElem.innerText = `${st.matricula} • ${st.email}`;

    const statusElem = document.getElementById('dossier-current-status');
    if (statusElem) statusElem.innerText = g.statusText;

    const avgElem = document.getElementById('dossier-final-average');
    if (avgElem) avgElem.innerText = g.finalTotal > 0 ? `${g.finalTotal} / 100` : 'En Curso';

    const unitsElem = document.getElementById('dossier-units-breakdown');
    if (unitsElem) unitsElem.innerHTML = unitsSummary;

    const histElem = document.getElementById('dossier-activity-history');
    if (histElem) histElem.innerHTML = historyHtml;

    // Configurar botón de impresión de boleta
    const printBtn = document.getElementById('dossier-print-btn');
    if (printBtn) {
      printBtn.onclick = () => this.printStudentReport(st.username);
    }

    modal.classList.add('open');
  },

  closeStudentDossier() {
    this.activeDossierUser = null;
    const modal = document.getElementById('student-dossier-modal');
    if (modal) modal.classList.remove('open');
  },

  getUnitName(num) {
    switch (Number(num)) {
      case 1: return 'Introducción a las Redes de Computadoras';
      case 2: return 'Medios de Transmisión y Multiplexación';
      case 3: return 'Enlace de Datos, Conmutación y Redes Locales (LAN)';
      case 4: return 'Cableado Estructurado y Normas Internacionales';
      case 5: return 'Proyecto Integrador y Evaluación Final';
      default: return `Unidad ${num}`;
    }
  },

  // Generación e impresión de la Boleta Oficial Individual
  printStudentReport(username) {
    const currentUser = window.AuthSystem ? window.AuthSystem.currentUser : null;
    if (currentUser && currentUser.role !== 'superadmin' && currentUser.username !== username) {
      alert('Solo puedes imprimir tu propia boleta oficial.');
      return;
    }
    const st = this.getStudent(username);
    if (!st) return;
    const g = this.calculateGrades(st);

    const printContainer = document.getElementById('printable-student-report-container');
    if (!printContainer) return;

    const today = new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    printContainer.innerHTML = `
      <div class="official-aztlan-report">
        <!-- Membrete Institucional -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #0284c7; letter-spacing: 0.05em;">UNIVERSIDAD AZTLÁN</div>
            <div style="font-size: 0.9rem; font-weight: 600; color: #334155;">FACULTAD DE INGENIERÍA EN SISTEMAS COMPUTACIONALES</div>
            <div style="font-size: 0.8rem; color: #64748b;">CLAVE DE MATERIA: 634 • CICLO ACADÉMICO 2026</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.1rem; font-weight: bold; color: #0f172a;">BOLETA OFICIAL DE EVALUACIÓN</div>
            <div style="font-size: 0.8rem; color: #64748b;">ASIGNATURA: REDES DE COMPUTADORAS</div>
            <div style="font-size: 0.78rem; color: #64748b;">FECHA DE EMISIÓN: ${today}</div>
          </div>
        </div>

        <!-- Ficha del Alumno -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Estudiante:</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #0f172a;">${st.name}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Matrícula:</div>
            <div style="font-size: 1.05rem; font-weight: bold; color: #0284c7; font-family: monospace;">${st.matricula}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Estatus Académico:</div>
            <div style="font-size: 0.95rem; font-weight: bold; color: ${g.finalTotal >= 70 ? '#059669' : '#d97706'};">${g.statusText}</div>
          </div>
        </div>

        <!-- Tabla de Desglose por Criterio Oficial Aztlán -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.88rem;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #0284c7; text-align: left;">
              <th style="padding: 0.7rem; color: #0f172a;">Criterio de Evaluación (Rúbrica)</th>
              <th style="padding: 0.7rem; color: #0f172a; text-align: center;">Ponderación</th>
              <th style="padding: 0.7rem; color: #0f172a; text-align: center;">Resultado Bruto</th>
              <th style="padding: 0.7rem; color: #0f172a; text-align: right;">Puntos Obtenidos</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 0.7rem;">
                <strong>Taller de 100 Ejercicios Visuales e Interactivos</strong>
                <div style="font-size: 0.75rem; color: #64748b;">20 prácticas por unidad temática (Unidades 1 a 5)</div>
              </td>
              <td style="padding: 0.7rem; text-align: center;">30%</td>
              <td style="padding: 0.7rem; text-align: center;">${g.doneExCount} / 100 resueltos</td>
              <td style="padding: 0.7rem; text-align: right; font-weight: bold; color: #0284c7;">${g.pracsWeighted} pts</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 0.7rem;">
                <strong>Lecturas, Temas Teóricos y Simulaciones de Red</strong>
                <div style="font-size: 0.75rem; color: #64748b;">Inspección activa de protocolos, topologías y estándares</div>
              </td>
              <td style="padding: 0.7rem; text-align: center;">20%</td>
              <td style="padding: 0.7rem; text-align: center;">${g.readingScore}% completado</td>
              <td style="padding: 0.7rem; text-align: right; font-weight: bold; color: #0284c7;">${g.readingWeighted} pts</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 0.7rem;">
                <strong>Cuestionarios de Validación por Unidad (U1 - U5)</strong>
                <div style="font-size: 0.75rem; color: #64748b;">Mínimo 70% requerido por unidad para liberación secuencial</div>
              </td>
              <td style="padding: 0.7rem; text-align: center;">20%</td>
              <td style="padding: 0.7rem; text-align: center;">Promedio: ${g.quizAvg}%</td>
              <td style="padding: 0.7rem; text-align: right; font-weight: bold; color: #0284c7;">${g.quizWeighted} pts</td>
            </tr>
            <tr style="border-bottom: 2px solid #0284c7;">
              <td style="padding: 0.7rem;">
                <strong>Examen Final Integrador de Redes</strong>
                <div style="font-size: 0.75rem; color: #64748b;">Evaluación comprensiva de 20 reactivos oficiales</div>
              </td>
              <td style="padding: 0.7rem; text-align: center;">30%</td>
              <td style="padding: 0.7rem; text-align: center;">${st.finalExam ? st.finalExam.score + '%' : 'Pendiente'}</td>
              <td style="padding: 0.7rem; text-align: right; font-weight: bold; color: #0284c7;">${g.examWeighted} pts</td>
            </tr>
            <tr style="background: #f8fafc; font-size: 1rem;">
              <td colspan="3" style="padding: 0.9rem; font-weight: bold; text-align: right; color: #0f172a;">
                CALIFICACIÓN FINAL PONDERADA:
              </td>
              <td style="padding: 0.9rem; text-align: right; font-weight: 800; font-size: 1.25rem; color: ${g.finalTotal >= 70 ? '#059669' : '#0284c7'};">
                ${g.finalTotal} / 100
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Firmas Institucionales -->
        <div style="margin-top: 3.5rem; display: flex; justify-content: space-around; text-align: center;">
          <div style="width: 250px; border-top: 1px solid #0f172a; padding-top: 0.5rem; font-size: 0.85rem;">
            <strong>Prof. Luis Alberto Garibaldi</strong>
            <div style="font-size: 0.75rem; color: #64748b;">Docente Titular / Super Administrador</div>
            <div style="font-size: 0.72rem; color: #64748b;">Universidad Aztlán</div>
          </div>
          <div style="width: 250px; border-top: 1px solid #0f172a; padding-top: 0.5rem; font-size: 0.85rem;">
            <strong>${st.name}</strong>
            <div style="font-size: 0.75rem; color: #64748b;">Firma del Estudiante</div>
            <div style="font-size: 0.72rem; color: #64748b;">Matrícula: ${st.matricula}</div>
          </div>
        </div>
      </div>
    `;

    window.print();
  },

  // Exportar expediente completo de alumnos a archivo JSON
  exportData() {
    const students = this.getStudents();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `expediente_alumnos_aztlan_${new Date().toISOString().substring(0,10)}.json`);
    dlAnchor.click();
  },

  // Cargar datos de demostración para pruebas inmediatas del profesor
  loadDemoData() {
    const students = this.getStudents();
    // Mario: Ha completado Unidad 1 (20 ejercicios) y tiene 90% en Quiz U1
    const mario = students.find(s => s.username === 'mleyva');
    if (mario) {
      mario.completedExercises = Array.from({ length: 20 }, (_, i) => `ex_1_${i + 1}`);
      mario.passedQuizzes = { u1: 90 };
      mario.passedLabs = { u1: true };
      mario.lastAccess = 'Hoy, 01:14 a. m.';
      mario.activityLog = [
        { timestamp: 'Hoy 01:14', action: 'Aprobó Cuestionario Unidad 1 con 90%' },
        { timestamp: 'Hoy 01:10', action: 'Completó las 20 prácticas de Unidad 1' },
        { timestamp: 'Hoy 00:50', action: 'Validó Laboratorio de Topología en Estrella' },
        { timestamp: 'Hoy 00:45', action: 'Inicio de sesión institucional' }
      ];
    }

    // Isaías: Va a la mitad de Unidad 1 (10 ejercicios) y tiene 75% en Quiz U1
    const isaias = students.find(s => s.username === 'ilopez');
    if (isaias) {
      isaias.completedExercises = Array.from({ length: 10 }, (_, i) => `ex_1_${i + 1}`);
      isaias.passedQuizzes = { u1: 75 };
      isaias.passedLabs = { u1: true };
      isaias.lastAccess = 'Ayer, 08:30 p. m.';
      isaias.activityLog = [
        { timestamp: 'Ayer 20:30', action: 'Aprobó Cuestionario Unidad 1 con 75%' },
        { timestamp: 'Ayer 20:15', action: 'Completó ejercicio [U1.10] Modelo Cliente-Servidor' },
        { timestamp: 'Ayer 19:40', action: 'Inicio de sesión institucional' }
      ];
    }

    // J. González: 15 prácticas de U1 y 85% en Quiz U1
    const jgonzalez = students.find(s => s.username === 'jgonzalez');
    if (jgonzalez) {
      jgonzalez.completedExercises = Array.from({ length: 15 }, (_, i) => `ex_1_${i + 1}`);
      jgonzalez.passedQuizzes = { u1: 85 };
      jgonzalez.passedLabs = { u1: true };
      jgonzalez.lastAccess = 'Hoy, 09:15 p. m.';
      jgonzalez.activityLog = [
        { timestamp: 'Hoy 21:15', action: 'Aprobó Cuestionario Unidad 1 con 85%' },
        { timestamp: 'Hoy 20:55', action: 'Completó práctica [U1.15] Modelo OSI vs TCP/IP' },
        { timestamp: 'Hoy 20:10', action: 'Inicio de sesión institucional' }
      ];
    }

    // D. Jiménez: 6 prácticas de U1
    const djimenez = students.find(s => s.username === 'djimenez');
    if (djimenez) {
      djimenez.completedExercises = Array.from({ length: 6 }, (_, i) => `ex_1_${i + 1}`);
      djimenez.lastAccess = 'Hoy, 07:45 p. m.';
      djimenez.activityLog = [
        { timestamp: 'Hoy 19:45', action: 'Completó práctica [U1.6] Topologías Físicas' },
        { timestamp: 'Hoy 19:20', action: 'Inicio de sesión institucional' }
      ];
    }

    // D. Morales: 8 prácticas de U1
    const dmorales = students.find(s => s.username === 'dmorales');
    if (dmorales) {
      dmorales.completedExercises = Array.from({ length: 8 }, (_, i) => `ex_1_${i + 1}`);
      dmorales.lastAccess = 'Hoy, 08:00 p. m.';
      dmorales.activityLog = [
        { timestamp: 'Hoy 20:00', action: 'Completó práctica [U1.8] Redes MAN y WAN' },
        { timestamp: 'Hoy 19:35', action: 'Inicio de sesión institucional' }
      ];
    }

    this.saveStudents(students);
    alert('✅ Datos de avance de demostración cargados exitosamente. Ahora puedes auditar sus expedientes completos.');
  },

  // Reiniciar a estado inicial
  resetAll() {
    if (confirm('¿Estás seguro de reiniciar todos los avances de los estudiantes a cero?')) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultStudents));
      this.renderAdminView();
      alert('✓ Registros de alumnos reiniciados.');
    }
  }
};

if (typeof window !== 'undefined') {
  window.StudentTracker = StudentTracker;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StudentTracker.init());
  } else {
    StudentTracker.init();
  }
}
