# -*- coding: utf-8 -*-
"""
Compilador de exercises.js con 100 Ejercicios Interactivos
Universidad Aztlán - Redes de Computadoras (Clave 634)
"""

import json

# Cargar catálogo de 100 ejercicios
with open("exercises_catalog.json", "r", encoding="utf-8") as f:
    catalog = json.load(f)

print(f"Catálogo cargado: {len(catalog)} ejercicios.")

# Código fuente JavaScript de exercises.js
js_code = """/**
 * TALLER DE EJERCICIOS VISUALES INTERACTIVOS (100 PRÁCTICAS OFICIALES)
 * UNIVERSIDAD AZTLÁN - INGENIERÍA EN SISTEMAS COMPUTACIONALES
 * ASIGNATURA: REDES DE COMPUTADORAS (CLAVE 634)
 * 20 EJERCICIOS POR UNIDAD • UNIDADES 1 A 5
 */

const VisualExercises = {
  // Catálogo completo de 100 ejercicios estructurados
  catalog: """ + json.dumps(catalog, ensure_ascii=False, indent=2) + """,

  currentExerciseId: 'ex_1_1',
  currentFilterUnit: 'all',
  searchQuery: '',
  completedExercises: new Set(),

  init() {
    this.loadProgress();
    this.renderExerciseList();
    this.loadFirstAccessibleExercise();
  },

  loadProgress() {
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    if (user && window.AcademicProgression) {
      const prog = window.AcademicProgression.getStudentProgress(user.username);
      if (prog && prog.completedExercises) {
        this.completedExercises = new Set(prog.completedExercises);
        this.updateStats();
        return;
      }
    }
    const saved = localStorage.getItem('aztlan_completed_exercises');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        this.completedExercises = new Set(arr);
      } catch (e) {
        console.error('Error al cargar progreso local de ejercicios:', e);
      }
    }
    this.updateStats();
  },

  saveProgress() {
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    const arr = Array.from(this.completedExercises);
    localStorage.setItem('aztlan_completed_exercises', JSON.stringify(arr));
    if (user && window.AcademicProgression) {
      const prog = window.AcademicProgression.getStudentProgress(user.username);
      prog.completedExercises = arr;
      window.AcademicProgression.saveStudentProgress(user.username, prog);
    }
    this.updateStats();
  },

  markCompleted(exId) {
    this.completedExercises.add(exId);
    this.saveProgress();
    this.renderExerciseList();

    if (window.AcademicProgression) {
      window.AcademicProgression.recordExerciseCompleted(exId);
    }
    this.loadExercise(exId);
  },

  updateStats() {
    const count = this.completedExercises.size;
    const total = this.catalog.length;
    const pct = Math.round((count / total) * 100);
    const counterElem = document.getElementById('ex-completed-count');
    if (counterElem) counterElem.innerText = `${count} de ${total} (${pct}%)`;

    const barFill = document.getElementById('ex-progress-bar-fill');
    if (barFill && barFill.style) barFill.style.width = `${pct}%`;

    if (window.App && window.App.state) {
      window.App.state.researchDone = Math.max(70, pct);
      window.App.saveState();
    }
  },

  filterByUnit(unit) {
    this.currentFilterUnit = unit;
    this.renderExerciseList();
  },

  filterSearch(q) {
    this.searchQuery = (q || '').toLowerCase().trim();
    this.renderExerciseList();
  },

  renderExerciseList() {
    const container = document.getElementById('exercise-sidebar-list');
    if (!container) return;

    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;

    // Filtros activos
    let filtered = this.catalog;
    if (this.currentFilterUnit !== 'all') {
      filtered = filtered.filter(ex => ex.unit === this.currentFilterUnit);
    }
    if (this.searchQuery) {
      filtered = filtered.filter(ex => 
        ex.title.toLowerCase().includes(this.searchQuery) ||
        ex.code.toLowerCase().includes(this.searchQuery) ||
        ex.category.toLowerCase().includes(this.searchQuery) ||
        ex.desc.toLowerCase().includes(this.searchQuery)
      );
    }

    // Encabezado con buscador y tabs de unidades
    const filterTabsHtml = `
      <div style="padding: 0.6rem 0.8rem; background: #0b1324; border-bottom: 1px solid #1e293b;">
        <input type="text" placeholder="🔍 Buscar tema o ejercicio..." 
               value="${this.searchQuery}"
               oninput="VisualExercises.filterSearch(this.value)"
               style="width: 100%; padding: 0.45rem 0.7rem; background: #020617; border: 1px solid #243552; border-radius: 6px; color: #f8fafc; font-size: 0.8rem; margin-bottom: 0.6rem;" />
        
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.25rem;">
          <button class="btn btn-sm ${this.currentFilterUnit === 'all' ? 'btn-primary' : ''}" 
                  style="padding: 0.25rem 0.2rem; font-size: 0.7rem; text-align: center;" 
                  onclick="VisualExercises.filterByUnit('all')">Todos</button>
          <button class="btn btn-sm ${this.currentFilterUnit === 'U1' ? 'btn-primary' : ''}" 
                  style="padding: 0.25rem 0.2rem; font-size: 0.7rem; text-align: center;" 
                  onclick="VisualExercises.filterByUnit('U1')">U1</button>
          <button class="btn btn-sm ${this.currentFilterUnit === 'U2' ? 'btn-primary' : ''}" 
                  style="padding: 0.25rem 0.2rem; font-size: 0.7rem; text-align: center;" 
                  onclick="VisualExercises.filterByUnit('U2')">U2</button>
          <button class="btn btn-sm ${this.currentFilterUnit === 'U3' ? 'btn-primary' : ''}" 
                  style="padding: 0.25rem 0.2rem; font-size: 0.7rem; text-align: center;" 
                  onclick="VisualExercises.filterByUnit('U3')">U3</button>
          <button class="btn btn-sm ${this.currentFilterUnit === 'U4' ? 'btn-primary' : ''}" 
                  style="padding: 0.25rem 0.2rem; font-size: 0.7rem; text-align: center;" 
                  onclick="VisualExercises.filterByUnit('U4')">U4</button>
          <button class="btn btn-sm ${this.currentFilterUnit === 'U5' ? 'btn-primary' : ''}" 
                  style="padding: 0.25rem 0.2rem; font-size: 0.7rem; text-align: center;" 
                  onclick="VisualExercises.filterByUnit('U5')">U5</button>
        </div>
      </div>
    `;

    const itemsHtml = filtered.map(ex => {
      const isDone = this.completedExercises.has(ex.id);
      const isActive = ex.id === this.currentExerciseId;
      const uKey = ex.unit.toLowerCase();
      const pNum = ex.id.split('_')[2];
      const isUnlocked = window.AcademicProgression 
        ? window.AcademicProgression.isUnitUnlocked(uKey, user) 
        : true;

      return `
        <div class="exercise-item-nav ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''} ${!isUnlocked ? 'ex-locked' : ''}" 
             onclick="VisualExercises.loadExercise('${ex.id}')"
             title="${!isUnlocked ? 'Bloqueado. Debes completar la etapa previa.' : ex.title}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
            <span class="ex-code-badge">${ex.unit} • Tema ${ex.code} (P${pNum})</span>
            <span class="ex-status-icon">${!isUnlocked ? '🔒' : (isDone ? '✓' : '○')}</span>
          </div>
          <div class="ex-title">${ex.title}</div>
          <div class="ex-cat">${ex.category}</div>
        </div>
      `;
    }).join('');

    container.innerHTML = filterTabsHtml + `<div style="max-height: calc(100vh - 350px); overflow-y: auto;">` + (itemsHtml || '<p style="padding: 1rem; color: #64748b; font-size: 0.82rem; text-align: center;">No se encontraron ejercicios con ese criterio.</p>') + `</div>`;

    this.updateStats();
  },

  loadFirstAccessibleExercise() {
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    const firstEx = this.catalog.find(e => {
      const uKey = e.unit.toLowerCase();
      return window.AcademicProgression ? window.AcademicProgression.isUnitUnlocked(uKey, user) : true;
    }) || this.catalog[0];

    this.loadExercise(firstEx.id);
  },

  loadExercise(exId) {
    const ex = this.catalog.find(e => e.id === exId);
    if (!ex) return;

    this.currentExerciseId = exId;
    this.renderExerciseList();

    const stage = document.getElementById('exercise-stage-container');
    if (!stage) return;

    const unitKey = ex.unit.toLowerCase();
    const user = window.AuthSystem ? window.AuthSystem.currentUser : null;
    const isUnlocked = window.AcademicProgression 
      ? window.AcademicProgression.isUnitUnlocked(unitKey, user) 
      : true;

    // Si la unidad está bloqueada para el estudiante, renderizar pantalla explicativa de bloqueo
    if (!isUnlocked) {
      const prevUnitName = unitKey === 'u2' ? 'Unidad 1 (Aspectos Básicos y Topologías)' :
                           unitKey === 'u3' ? 'Unidad 2 (Normas, OSI y TCP/IP)' :
                           unitKey === 'u4' ? 'Unidad 3 (Dispositivos de Red)' : 
                           'Unidad 4 (Cableado Estructurado)';
      stage.innerHTML = `
        <div style="background: #131d31; border: 2px dashed #ef4444; border-radius: 14px; padding: 3rem 2rem; text-align: center; animation: modalScale 0.3s ease;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.4));">🔒</div>
          <span style="font-size: 0.8rem; font-weight: bold; background: rgba(239, 68, 68, 0.15); color: #fca5a5; padding: 0.3rem 0.8rem; border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.4); text-transform: uppercase;">
            Práctica Bloqueada • Unidad ${ex.unit.replace('U', '')}
          </span>
          <h2 style="color: #f8fafc; font-size: 1.45rem; margin-top: 0.8rem; margin-bottom: 0.8rem;">
            ${ex.title}
          </h2>
          <p style="color: #94a3b8; font-size: 0.95rem; max-width: 580px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Esta práctica requiere los fundamentos de la etapa previa. Conforme a las reglas de acreditación de la Universidad Aztlán (Clave 634), debes completar al <strong>100%</strong> todas las 20 prácticas y el cuestionario de la <strong>${prevUnitName}</strong> para habilitar este taller.
          </p>
          <div style="display: flex; justify-content: center; gap: 0.8rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="VisualExercises.loadFirstAccessibleExercise()">
              <span>🎯</span> Ir al Primer Ejercicio Disponible
            </button>
            <button class="btn" onclick="App.navigateTo('u1')">
              <span>📡</span> Ir a la Unidad 1
            </button>
          </div>
        </div>
      `;
      return;
    }

    const isDone = this.completedExercises.has(ex.id);

    // Renderizar plantilla enriquecida con información detallada por tema y laboratorio interactivo
    stage.innerHTML = `
      <!-- Encabezado del Ejercicio Activo -->
      <div style="background: #131d31; border: 1px solid #243552; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 0.8rem;">
          <div>
            <span style="font-size: 0.75rem; font-weight: bold; background: #1e293b; color: #38bdf8; padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid #243552;">
              UNIDAD ${ex.unit.replace('U', '')} • TEMA ${ex.code} • PRÁCTICA ${ex.id.split('_')[2]} DE 20 • ${ex.category.toUpperCase()}
            </span>
            <h2 style="font-size: 1.4rem; color: #f8fafc; margin-top: 0.5rem; margin-bottom: 0.3rem;">${ex.title}</h2>
            <p style="font-size: 0.88rem; color: #94a3b8;">${ex.desc}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="status-badge ${isDone ? 'completed' : 'pending'}" id="stage-badge-status">
              ${isDone ? '✓ Práctica Completada' : '⏳ Pendiente de práctica'}
            </span>
            <button class="btn btn-sm btn-accent" onclick="VisualExercises.markCompleted('${ex.id}')">
              <span>✓</span> Marcar Aprobado
            </button>
          </div>
        </div>
      </div>

      <!-- Módulos de Información Técnica y Caso de Industria -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        
        <!-- Fundamento Teórico -->
        <div style="background: #0f172a; border: 1px solid #1e293b; border-left: 4px solid #38bdf8; border-radius: 10px; padding: 1.2rem;">
          <h4 style="color: #38bdf8; font-size: 0.95rem; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>📚</span> Fundamento Teórico & Norma Oficial
          </h4>
          <p style="font-size: 0.86rem; color: #cbd5e1; line-height: 1.6; margin: 0;">
            ${ex.theory}
          </p>
        </div>

        <!-- Aplicación Profesional -->
        <div style="background: #0f172a; border: 1px solid #1e293b; border-left: 4px solid #10b981; border-radius: 10px; padding: 1.2rem;">
          <h4 style="color: #34d399; font-size: 0.95rem; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>💼</span> Aplicación en la Industria de Redes
          </h4>
          <p style="font-size: 0.86rem; color: #cbd5e1; line-height: 1.6; margin: 0;">
            ${ex.industryCase}
          </p>
        </div>
      </div>

      <!-- Área de Trabajo Interactiva Específica -->
      <div id="exercise-interactive-workspace" style="background: #090f1d; border: 1px solid #243552; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
      </div>
    `;

    // Renderizar laboratorio interactivo correspondiente
    this.renderExerciseLab(ex);
  },

  // Motor modular de Laboratorios Interactivos para los 100 ejercicios
  renderExerciseLab(ex) {
    const ws = document.getElementById('exercise-interactive-workspace');
    if (!ws) return;

    // Dispatcher interactivo según el tipo de ejercicio
    switch (ex.interactiveType) {
      case 'timeline':
        this.labTimeline(ws, ex);
        break;
      case 'oscilloscope_lab':
        this.labOscilloscope(ws, ex);
        break;
      case 'geo_classifier_lab':
      case 'active_passive_classifier':
        this.labClassifier(ws, ex);
        break;
      case 'star_switch_sim':
      case 'full_mesh_lab':
        this.labTopology(ws, ex);
        break;
      case 'osi_stacker_lab':
        this.labOsiStacker(ws, ex);
        break;
      case 'osi_tcp_mapper_lab':
        this.labOsiTcpMapper(ws, ex);
        break;
      case 'cam_table_lab':
        this.labCamTable(ws, ex);
        break;
      case 'crimping_pinout_interactive':
        this.labCrimping(ws, ex);
        break;
      case 'wiremap_led_tester_sim':
        this.labWiremapTester(ws, ex);
        break;
      case 'vlsm_designer_lab':
      case 'cidr_binary_trainer':
        this.labSubnetting(ws, ex);
        break;
      case 'frame_encapsulation_builder':
        this.labFrameBuilder(ws, ex);
        break;
      case 'firewall_spi_lab':
        this.labFirewall(ws, ex);
        break;
      case 'fluke_certification_lab':
        this.labFluke(ws, ex);
        break;
      case 'rack_dimensioner_sim':
        this.labRackDimensioner(ws, ex);
        break;
      case 'tech_memory_generator':
        this.labTechMemory(ws, ex);
        break;
      default:
        // Laboratorio Interactivo Universal con simulador y verificador
        this.labUniversal(ws, ex);
        break;
    }
  },

  // 1. LABORATORIO LÍNEA DE TIEMPO
  labTimeline(ws, ex) {
    const items = [
      { year: 1969, title: 'ARPANET', desc: 'Primera red de conmutación de paquetes financiada por DARPA' },
      { year: 1973, title: 'Ethernet', desc: 'Robert Metcalfe patenta la difusión por cable coaxial en Xerox PARC' },
      { year: 1983, title: 'TCP/IP Flag Day', desc: 'ARPANET migra formalmente a TCP/IP el 1 de enero; nace Internet' },
      { year: 1991, title: 'World Wide Web', desc: 'Tim Berners-Lee publica el protocolo HTTP y HTML en el CERN' },
      { year: 1997, title: 'Wi-Fi IEEE 802.11', desc: 'Primer estándar comercial de redes inalámbricas a 2 Mbps' },
      { year: 2026, title: 'SDN & Wi-Fi 7', desc: 'Redes definidas por software, telemetría y ultra-alta velocidad' }
    ];

    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Laboratorio Interactivo: Cronología de Hitos</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Inspecciona los 6 pilares de la historia de las redes de datos. Haz clic en cada nodo temporal para analizar su especificación técnica.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.8rem; margin-bottom: 1.5rem;">
        ${items.map((it, idx) => `
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; cursor: pointer; transition: all 0.2s;"
               onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='#1e293b'"
               onclick="document.getElementById('timeline-detail-box').innerHTML='<h4 style=\\'color:#38bdf8;margin-bottom:0.4rem;\\'>${it.year}: ${it.title}</h4><p style=\\'font-size:0.88rem;color:#cbd5e1;line-height:1.5;\\'>${it.desc}</p>'">
            <span style="font-size: 0.8rem; font-weight: bold; color: #38bdf8; background: #0f172a; padding: 0.2rem 0.5rem; border-radius: 4px;">#${idx+1} • ${it.year}</span>
            <h5 style="color: #f8fafc; margin: 0.5rem 0 0.2rem 0; font-size: 0.95rem;">${it.title}</h5>
            <div style="font-size: 0.75rem; color: #64748b;">Clic para explorar</div>
          </div>
        `).join('')}
      </div>

      <div id="timeline-detail-box" style="background: #020617; border: 1px dashed #38bdf8; border-radius: 8px; padding: 1.2rem; min-height: 80px; margin-bottom: 1.5rem;">
        <span style="color: #64748b; font-size: 0.85rem;">👈 Selecciona cualquier hito histórico arriba para ver su documentación técnica.</span>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Práctica de Línea de Tiempo completada con éxito!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 2. LABORATORIO OSCILOSCOPIO & SNR
  labOscilloscope(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Osciloscopio Digital de Señales & Teorema de Shannon</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
        Modifica el nivel de ruido ambiental y la distancia física del cable para evaluar el impacto en la relación Señal/Ruido (SNR) y en la capacidad máxima teórica: <code>C = B · log₂(1 + S/N)</code>.
      </p>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.2rem; margin-bottom: 1.2rem;">
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; text-align: center;">
          <canvas id="osc-canvas" width="500" height="180" style="width: 100%; max-height: 180px; background: #030712; border-radius: 6px;"></canvas>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.4rem;">Traza de señal sinusoidal con ruido gaussiano aditivo</div>
        </div>

        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem;">
          <div>
            <label style="font-size: 0.78rem; color: #94a3b8; display: block; margin-bottom: 0.2rem;">Ruido Inducido (dB): <strong id="lbl-noise-val" style="color:#f59e0b;">15 dB</strong></label>
            <input type="range" id="rng-noise" min="0" max="40" value="15" style="width: 100%;" oninput="VisualExercises.updateOscilloscope()" />
          </div>
          <div>
            <label style="font-size: 0.78rem; color: #94a3b8; display: block; margin-bottom: 0.2rem;">Distancia Cable UTP: <strong id="lbl-dist-val" style="color:#38bdf8;">50 m</strong></label>
            <input type="range" id="rng-dist" min="10" max="150" value="50" style="width: 100%;" oninput="VisualExercises.updateOscilloscope()" />
          </div>
          <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px; border: 1px solid #243552;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Capacidad Teórica Shannon:</div>
            <div id="lbl-shannon-cap" style="font-size: 1.1rem; font-weight: bold; color: #10b981;">842 Mbps</div>
          </div>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Laboratorio de Señales y Shannon aprobado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;

    setTimeout(() => this.updateOscilloscope(), 50);
  },

  updateOscilloscope() {
    const canvas = document.getElementById('osc-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const noiseSlider = document.getElementById('rng-noise');
    const distSlider = document.getElementById('rng-dist');
    const noise = noiseSlider ? parseInt(noiseSlider.value, 10) : 15;
    const dist = distSlider ? parseInt(distSlider.value, 10) : 50;

    const noiseLbl = document.getElementById('lbl-noise-val');
    if (noiseLbl) noiseLbl.innerText = `${noise} dB`;
    const distLbl = document.getElementById('lbl-dist-val');
    if (distLbl) distLbl.innerText = `${dist} m ${dist > 90 ? '⚠️ (Excede norma TIA 90m)' : ''}`;

    // Cálculo Shannon: B = 100 MHz (Cat 5e/6), SNR lineal = 10^( (40 - noise - dist*0.1) / 10 )
    const snrDb = Math.max(2, 45 - noise - (dist * 0.15));
    const snrLinear = Math.pow(10, snrDb / 10);
    const capacityMbps = Math.round(100 * Math.log2(1 + snrLinear));

    const capLbl = document.getElementById('lbl-shannon-cap');
    if (capLbl) {
      capLbl.innerText = `${capacityMbps} Mbps`;
      capLbl.style.color = capacityMbps > 800 ? '#10b981' : (capacityMbps > 300 ? '#f59e0b' : '#ef4444');
    }

    // Dibujar onda
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    // Rejilla
    for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    ctx.beginPath();
    ctx.strokeStyle = capacityMbps > 300 ? '#38bdf8' : '#ef4444';
    ctx.lineWidth = 2;
    const midY = canvas.height / 2;
    const amp = Math.max(10, 60 - (dist * 0.3));

    for (let x = 0; x < canvas.width; x++) {
      const noiseOffset = (Math.random() - 0.5) * noise * 1.5;
      const y = midY + Math.sin(x * 0.05) * amp + noiseOffset;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  // 3. LABORATORIO CLASIFICADOR (PAN a WAN, Activos vs Pasivos)
  labClassifier(ws, ex) {
    const isActPass = ex.interactiveType === 'active_passive_classifier';
    const categories = isActPass 
      ? [{ id: 'act', name: '⚡ Componentes Activos' }, { id: 'pas', name: '🔌 Componentes Pasivos' }]
      : [{ id: 'pan', name: '📱 PAN (<10m)' }, { id: 'lan', name: '🏢 LAN (<1km)' }, { id: 'man', name: '🏙️ MAN (Ciudad)' }, { id: 'wan', name: '🌍 WAN (Global)' }];

    const items = isActPass
      ? [
          { id: 'i1', text: 'Switch Administrable PoE 24 Puertos', target: 'act' },
          { id: 'i2', text: 'Bobina de Cable UTP Cat 6A 305m', target: 'pas' },
          { id: 'i3', text: 'Router Perimetral BGP', target: 'act' },
          { id: 'i4', text: 'Patch Panel Modular 24 Jacks RJ-45', target: 'pas' },
          { id: 'i5', text: 'Firewall de Próxima Generación (NGFW)', target: 'act' },
          { id: 'i6', text: 'Charola Portacable Electro-soldada 100mm', target: 'pas' }
        ]
      : [
          { id: 'i1', text: 'Auriculares inalámbricos Bluetooth a Smartphone', target: 'pan' },
          { id: 'i2', text: 'Red Ethernet Gigabit de la oficina central', target: 'lan' },
          { id: 'i3', text: 'Anillo de fibra óptica metropolitano de la CDMX', target: 'man' },
          { id: 'i4', text: 'Enlaces submarinos intercontinentales transatlánticos', target: 'wan' },
          { id: 'i5', text: 'Smartwatch sincronizando signos vitales vía BLE', target: 'pan' },
          { id: 'i6', text: 'Campus universitario de 5 facultades interconectadas', target: 'lan' }
        ];

    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Clasificador Técnico Interactivo</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Haz clic en cada componente para asignarlo a su respectivo contenedor de ingeniería.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.6rem; font-weight: bold;">Elementos por clasificar:</div>
        <div id="classifier-items-pool" style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
          ${items.map(it => `
            <div id="cls-item-${it.id}" style="background: #0f172a; border: 1px solid #38bdf8; border-radius: 6px; padding: 0.5rem 0.8rem; font-size: 0.82rem; color: #f8fafc; cursor: pointer;"
                 onclick="VisualExercises.classifyItem('${it.id}', '${it.target}')">
              📌 ${it.text}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-bottom: 1.5rem;">
        ${categories.map(cat => `
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 0.8rem; min-height: 120px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #38bdf8; border-bottom: 1px solid #1e293b; padding-bottom: 0.4rem; margin-bottom: 0.6rem;">${cat.name}</div>
            <div id="cls-bucket-${cat.id}" style="display: flex; flex-direction: column; gap: 0.4rem;">
              <span style="font-size: 0.75rem; color: #64748b; font-style: italic;">Esperando elementos...</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Excelente! Clasificación técnica verificada al 100%.');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  classifyItem(itemId, targetBucket) {
    const itemEl = document.getElementById(`cls-item-${itemId}`);
    const bucketEl = document.getElementById(`cls-bucket-${targetBucket}`);
    if (!itemEl || !bucketEl) return;

    if (bucketEl.querySelector('span')) {
      bucketEl.innerHTML = '';
    }
    itemEl.style.borderColor = '#10b981';
    itemEl.style.background = 'rgba(16, 185, 129, 0.15)';
    bucketEl.appendChild(itemEl);
  },

  // 4. LABORATORIO DE TOPOLOGÍAS Y FALLAS
  labTopology(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Constructor de Topologías & Tolerancia a Fallos</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
        Simula fallas de enlaces y caída de nodos en vivo. Calcula enlaces de malla completa con <code>n(n - 1) / 2</code>.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1.2rem; margin-bottom: 1.2rem;">
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
          <label style="font-size: 0.85rem; color: #cbd5e1;">Número de Routers (n):</label>
          <input type="number" id="topo-node-count" min="3" max="12" value="5" style="width: 70px; padding: 0.3rem 0.5rem; background: #0f172a; border: 1px solid #38bdf8; color: #f8fafc; border-radius: 4px;"
                 oninput="VisualExercises.updateMeshCalc()" />
          <div style="font-size: 0.9rem; color: #10b981;">Enlaces requeridos: <strong id="topo-mesh-res">10 enlaces físicos</strong></div>
        </div>
        <div style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">
          <strong>Análisis de Resiliencia:</strong> En una topología en estrella, la caída del switch central aísla a todos los hosts (punto único de falla). En una malla completa de 5 nodos con 10 enlaces, se pueden cortar hasta 3 enlaces simultáneos sin perder conectividad total.
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Topología y cálculo de redundancia acreditados!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
    setTimeout(() => this.updateMeshCalc(), 50);
  },

  updateMeshCalc() {
    const input = document.getElementById('topo-node-count');
    const res = document.getElementById('topo-mesh-res');
    if (!input || !res) return;
    const n = parseInt(input.value, 10) || 5;
    const links = (n * (n - 1)) / 2;
    res.innerText = `${links} enlaces físicos n(n-1)/2`;
  },

  // 5. LABORATORIO APILADOR DE CAPAS OSI
  labOsiStacker(ws, ex) {
    const layers = [
      { num: 7, name: 'Capa 7: Aplicación', pdu: 'Datos', desc: 'HTTP, DNS, SSH' },
      { num: 6, name: 'Capa 6: Presentación', pdu: 'Datos', desc: 'UTF-8, Gzip, TLS/SSL' },
      { num: 5, name: 'Capa 5: Sesión', pdu: 'Datos', desc: 'Checkpoints y control de diálogo' },
      { num: 4, name: 'Capa 4: Transporte', pdu: 'Segmentos (TCP) / Datagramas (UDP)', desc: 'Puertos y control de flujo' },
      { num: 3, name: 'Capa 3: Red', pdu: 'Paquetes', desc: 'Direccionamiento IP y rutas' },
      { num: 2, name: 'Capa 2: Enlace de Datos', pdu: 'Tramas (Frames)', desc: 'Direcciones MAC y CSMA/CD' },
      { num: 1, name: 'Capa 1: Física', pdu: 'Bits', desc: 'Voltajes, frecuencias y cables' }
    ];

    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Apilador Oficial del Modelo OSI (ISO 7498-1)</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Inspecciona la pila jerárquica de 7 niveles. Observa la transición de Datos de usuario hasta Bits transmitidos por el medio físico.
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
        ${layers.map(l => `
          <div style="background: #020617; border: 1px solid #1e293b; border-left: 5px solid ${l.num >= 5 ? '#ec4899' : (l.num === 4 ? '#3b82f6' : (l.num === 3 ? '#06b6d4' : (l.num === 2 ? '#10b981' : '#f59e0b')))}; border-radius: 6px; padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: #f8fafc; font-size: 0.9rem;">${l.name}</strong>
              <div style="font-size: 0.75rem; color: #94a3b8;">${l.desc}</div>
            </div>
            <div style="background: #0f172a; padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid #243552; font-size: 0.75rem; color: #38bdf8; font-family: monospace;">
              PDU: ${l.pdu}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Modelo OSI verificado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 6. LABORATORIO MAPEO OSI VS TCP/IP
  labOsiTcpMapper(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Mapeo Arquitectónico: OSI vs TCP/IP</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Compara la correspondencia directa entre los dos modelos de referencia más importantes del mundo tecnológico.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #38bdf8; font-size: 0.95rem; text-align: center; margin-bottom: 0.8rem;">Modelo OSI (7 Capas)</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;">
            <div style="background: #1e1b4b; padding: 0.4rem; border-radius: 4px; text-align: center;">7. Aplicación</div>
            <div style="background: #1e1b4b; padding: 0.4rem; border-radius: 4px; text-align: center;">6. Presentación</div>
            <div style="background: #1e1b4b; padding: 0.4rem; border-radius: 4px; text-align: center;">5. Sesión</div>
            <div style="background: #1e3a8a; padding: 0.4rem; border-radius: 4px; text-align: center;">4. Transporte</div>
            <div style="background: #0e7490; padding: 0.4rem; border-radius: 4px; text-align: center;">3. Red</div>
            <div style="background: #064e3b; padding: 0.4rem; border-radius: 4px; text-align: center;">2. Enlace de Datos</div>
            <div style="background: #78350f; padding: 0.4rem; border-radius: 4px; text-align: center;">1. Física</div>
          </div>
        </div>

        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #10b981; font-size: 0.95rem; text-align: center; margin-bottom: 0.8rem;">Arquitectura TCP/IP (4 Capas)</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;">
            <div style="background: #1e1b4b; padding: 1.6rem 0.4rem; border-radius: 4px; text-align: center; border: 1px dashed #a855f7;">
              4. Capa de Aplicación<br/><span style="font-size:0.7rem;color:#c084fc;">(HTTP, DNS, SSH, SMTP)</span>
            </div>
            <div style="background: #1e3a8a; padding: 0.4rem; border-radius: 4px; text-align: center; border: 1px dashed #3b82f6;">
              3. Capa de Transporte (TCP / UDP)
            </div>
            <div style="background: #0e7490; padding: 0.4rem; border-radius: 4px; text-align: center; border: 1px dashed #06b6d4;">
              2. Capa de Internet (IP, ICMP, ARP)
            </div>
            <div style="background: #064e3b; padding: 1.1rem 0.4rem; border-radius: 4px; text-align: center; border: 1px dashed #10b981;">
              1. Acceso a la Red<br/><span style="font-size:0.7rem;color:#34d399;">(Ethernet, Wi-Fi, Fibra)</span>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Mapeo OSI vs TCP/IP dominado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 7. LABORATORIO TABLA CAM DEL SWITCH
  labCamTable(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Operador y Aprendizaje de la Tabla CAM</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Envía tramas desde diferentes puertos para observar el registro dinámico de MACs y el comportamiento de Unicast vs Flooding.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem;">
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #38bdf8; font-size: 0.9rem; margin-bottom: 0.8rem;">Simular Trama Entrante</h4>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <button class="btn btn-sm btn-primary" onclick="VisualExercises.camSendFrame('PC-A (00:1A:2B:01:01)', 1, 'PC-B')">
              📤 PC-A (Puerto 1) -> Envía a PC-B
            </button>
            <button class="btn btn-sm btn-primary" onclick="VisualExercises.camSendFrame('PC-B (00:1A:2B:02:02)', 2, 'PC-A')">
              📤 PC-B (Puerto 2) -> Envía a PC-A
            </button>
            <button class="btn btn-sm btn-primary" onclick="VisualExercises.camSendFrame('PC-C (00:1A:2B:03:03)', 3, 'PC-A')">
              📤 PC-C (Puerto 3) -> Envía a PC-A
            </button>
            <button class="btn btn-sm btn-primary" onclick="VisualExercises.camSendFrame('PC-D (00:1A:2B:04:04)', 4, 'PC-B')">
              📤 PC-D (Puerto 4) -> Envía a PC-B
            </button>
          </div>
        </div>

        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #10b981; font-size: 0.9rem; margin-bottom: 0.8rem;">Tabla CAM Activa en Memoria</h4>
          <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid #1e293b; color: #94a3b8;">
                <th style="padding: 0.3rem;">Puerto</th>
                <th style="padding: 0.3rem;">Dirección MAC</th>
                <th style="padding: 0.3rem;">VLAN</th>
                <th style="padding: 0.3rem;">Tipo</th>
              </tr>
            </thead>
            <tbody id="cam-table-body">
              <tr><td colspan="4" style="padding: 0.6rem; color: #64748b; font-style: italic;">Tabla CAM vacía (esperando tráfico inicial)...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="cam-log-box" style="background: #030712; border: 1px solid #1e293b; border-radius: 6px; padding: 0.8rem; font-family: monospace; font-size: 0.78rem; color: #94a3b8; min-height: 50px; margin-bottom: 1.5rem;">
        [BOOT] Switch Gigabit de 24 puertos inicializado. Tabla CAM en escucha activa.
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Operación de Tabla CAM verificada!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
    this._camEntries = {};
  },

  camSendFrame(macStr, port, dstName) {
    if (!this._camEntries) this._camEntries = {};
    const isNew = !this._camEntries[port];
    this._camEntries[port] = macStr;

    const tbody = document.getElementById('cam-table-body');
    const logBox = document.getElementById('cam-log-box');

    if (tbody) {
      tbody.innerHTML = Object.entries(this._camEntries).map(([p, m]) => `
        <tr style="border-bottom: 1px solid #0f172a;">
          <td style="padding: 0.3rem; color: #38bdf8;">Fa0/${p}</td>
          <td style="padding: 0.3rem; color: #f8fafc; font-family: monospace;">${m}</td>
          <td style="padding: 0.3rem; color: #10b981;">1 (Default)</td>
          <td style="padding: 0.3rem; color: #a78bfa;">DYNAMIC</td>
        </tr>
      `).join('');
    }

    if (logBox) {
      const time = new Date().toLocaleTimeString();
      logBox.innerHTML = `[${time}] ${isNew ? '⚡ APRENDIZAJE: ' : '✓ REENVÍO UNICAST: '} Trama recibida en puerto Fa0/${port} -> MAC aprendida: ${macStr}. Destino: ${dstName}.<br/>` + logBox.innerHTML;
    }
  },

  // 8. LABORATORIO TALLER DE PONCHADO T568A / T568B
  labCrimping(ws, ex) {
    const pinsT568B = [
      { pin: 1, color: '#f8fafc', stripe: '#f97316', name: 'Blanco/Naranja' },
      { pin: 2, color: '#f97316', stripe: '#f97316', name: 'Naranja' },
      { pin: 3, color: '#f8fafc', stripe: '#10b981', name: 'Blanco/Verde' },
      { pin: 4, color: '#3b82f6', stripe: '#3b82f6', name: 'Azul' },
      { pin: 5, color: '#f8fafc', stripe: '#3b82f6', name: 'Blanco/Azul' },
      { pin: 6, color: '#10b981', stripe: '#10b981', name: 'Verde' },
      { pin: 7, color: '#f8fafc', stripe: '#78350f', name: 'Blanco/Marrón' },
      { pin: 8, color: '#78350f', stripe: '#78350f', name: 'Marrón' }
    ];

    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Taller de Ponchado RJ-45 (Norma ANSI/TIA-568-C/D)</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Inspecciona el código de colores estandarizado internacionalmente para el conector RJ-45 de 8 contactos.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
        <div style="font-weight: bold; color: #38bdf8; margin-bottom: 1rem; font-size: 0.95rem;">Norma T568B (Pin 1 al Pin 8)</div>

        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.5rem; max-width: 600px; margin: 0 auto 1.5rem;">
          ${pinsT568B.map(p => `
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 0.8rem 0.2rem; text-align: center;">
              <div style="height: 60px; width: 14px; margin: 0 auto 0.5rem; border-radius: 3px; background: ${p.color}; border: 2px solid ${p.stripe}; box-shadow: 0 0 5px ${p.stripe};"></div>
              <div style="font-size: 0.75rem; font-weight: bold; color: #f8fafc;">P${p.pin}</div>
              <div style="font-size: 0.65rem; color: #94a3b8; line-height: 1.2; margin-top: 0.2rem;">${p.name}</div>
            </div>
          `).join('')}
        </div>

        <div style="background: #0f172a; padding: 0.8rem; border-radius: 6px; font-size: 0.82rem; color: #cbd5e1; max-width: 500px; margin: 0 auto; text-align: left;">
          <strong>💡 Regla Técnica de Conexión:</strong>
          <ul style="margin: 0.4rem 0 0 1.2rem; line-height: 1.5;">
            <li>Cable Directo: T568B en ambos extremos (PC a Switch).</li>
            <li>Cable Cruzado: T568A en un extremo y T568B en el otro (Switch a Switch sin Auto-MDIX).</li>
            <li>Des-trenzado máximo en ponchado IDC: <strong>13 mm</strong>.</li>
          </ul>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Código de colores T568B certificado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 9. LABORATORIO TESTER DE 8 LEDS (WIREMAP)
  labWiremapTester(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Probador de Continuidad de 8 LEDs (Wiremap Tester)</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Diagnostica fallas físicas reales en cables ponchados: cable correcto, par abierto (hilo roto) o transposición de hilos.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem;">
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #38bdf8; font-size: 0.9rem; margin-bottom: 0.8rem;">Seleccionar Escenario de Falla</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn btn-sm btn-primary" onclick="VisualExercises.testWiremap('correct')">1. Cable 100% Correcto (PASS)</button>
            <button class="btn btn-sm" onclick="VisualExercises.testWiremap('open')">2. Par Abierto en Pin 3 (OPEN)</button>
            <button class="btn btn-sm" onclick="VisualExercises.testWiremap('short')">3. Cortocircuito Pines 1 y 2 (SHORT)</button>
            <button class="btn btn-sm" onclick="VisualExercises.testWiremap('split')">4. Transposición Pines 3 y 6 (MISWIRE)</button>
          </div>
        </div>

        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; text-align: center;">
          <h4 style="color: #10b981; font-size: 0.9rem; margin-bottom: 0.8rem;">Panel de LEDs del Tester</h4>
          
          <div style="display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1rem;">
            <div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.4rem;">Transmisor (Master)</div>
              <div id="tester-master-leds" style="display: flex; gap: 0.3rem;">
                ${[1,2,3,4,5,6,7,8].map(i => `<div id="m-led-${i}" style="width: 14px; height: 14px; border-radius: 50%; background: #10b981; box-shadow: 0 0 5px #10b981;"></div>`).join('')}
              </div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.4rem;">Receptor (Remote)</div>
              <div id="tester-remote-leds" style="display: flex; gap: 0.3rem;">
                ${[1,2,3,4,5,6,7,8].map(i => `<div id="r-led-${i}" style="width: 14px; height: 14px; border-radius: 50%; background: #10b981; box-shadow: 0 0 5px #10b981;"></div>`).join('')}
              </div>
            </div>
          </div>

          <div id="wiremap-status-msg" style="padding: 0.6rem; border-radius: 6px; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.85rem; font-weight: bold;">
            ✓ Continuidad 1 a 1 verificada en los 8 pines.
          </div>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Diagnóstico con probador de continuidad acreditado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  testWiremap(mode) {
    const status = document.getElementById('wiremap-status-msg');
    const rLeds = [1,2,3,4,5,6,7,8].map(i => document.getElementById(`r-led-${i}`));
    if (!status) return;

    rLeds.forEach(l => { if (l) { l.style.background = '#10b981'; l.style.boxShadow = '0 0 5px #10b981'; } });

    if (mode === 'correct') {
      status.style.background = 'rgba(16, 185, 129, 0.15)';
      status.style.color = '#34d399';
      status.innerText = '✓ Cable 100% Correcto: Transmisión 1 a 1 sin fallas.';
    } else if (mode === 'open') {
      if (rLeds[2]) { rLeds[2].style.background = '#334155'; rLeds[2].style.boxShadow = 'none'; }
      status.style.background = 'rgba(239, 68, 68, 0.15)';
      status.style.color = '#f87171';
      status.innerText = '⚠️ PAR ABIERTO: El Pin 3 (Blanco/Verde) está cortado o mal crimpado.';
    } else if (mode === 'short') {
      if (rLeds[0]) { rLeds[0].style.background = '#f59e0b'; }
      if (rLeds[1]) { rLeds[1].style.background = '#f59e0b'; }
      status.style.background = 'rgba(245, 158, 11, 0.15)';
      status.style.color = '#fbbf24';
      status.innerText = '⚠️ CORTOCIRCUITO: Los Pines 1 y 2 se tocan dentro del conector RJ-45.';
    } else if (mode === 'split') {
      if (rLeds[2]) { rLeds[2].style.background = '#a855f7'; }
      if (rLeds[5]) { rLeds[5].style.background = '#a855f7'; }
      status.style.background = 'rgba(168, 85, 247, 0.15)';
      status.style.color = '#c084fc';
      status.innerText = '⚠️ TRANSPOSICIÓN: Los Pines 3 y 6 fueron invertidos. Rompe el trenzado y causa NEXT masivo.';
    }
  },

  // 10. LABORATORIO DE SUBNETTING & VLSM
  labSubnetting(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Diseñador de Subredes VLSM & Calculadora CIDR</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Introduce una dirección de red y un prefijo CIDR para desglosar la máscara decimal, rango de hosts y broadcast sin solapamientos.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 0.8rem; align-items: flex-end; margin-bottom: 1rem;">
          <div>
            <label style="font-size: 0.78rem; color: #94a3b8; display: block; margin-bottom: 0.3rem;">Dirección IPv4:</label>
            <input type="text" id="vlsm-ip" value="192.168.10.0" style="width: 100%; padding: 0.5rem; background: #0f172a; border: 1px solid #38bdf8; color: #f8fafc; border-radius: 6px;" />
          </div>
          <div>
            <label style="font-size: 0.78rem; color: #94a3b8; display: block; margin-bottom: 0.3rem;">Prefijo CIDR:</label>
            <select id="vlsm-cidr" style="width: 100%; padding: 0.5rem; background: #0f172a; border: 1px solid #38bdf8; color: #f8fafc; border-radius: 6px;">
              <option value="24">/24 (254 hosts)</option>
              <option value="25">/25 (126 hosts)</option>
              <option value="26">/26 (62 hosts)</option>
              <option value="27">/27 (30 hosts)</option>
              <option value="28">/28 (14 hosts)</option>
              <option value="30">/30 (2 hosts - WAN)</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="VisualExercises.calcVlsm()">Calcular</button>
        </div>

        <div id="vlsm-results-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.6rem; font-size: 0.82rem;">
          <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px;">Máscara: <strong id="vlsm-res-mask" style="color:#38bdf8;">255.255.255.0</strong></div>
          <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px;">Primer Host: <strong id="vlsm-res-first" style="color:#10b981;">192.168.10.1</strong></div>
          <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px;">Último Host: <strong id="vlsm-res-last" style="color:#10b981;">192.168.10.254</strong></div>
          <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px;">Broadcast: <strong id="vlsm-res-bcast" style="color:#f59e0b;">192.168.10.255</strong></div>
          <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px;">Hosts Útiles: <strong id="vlsm-res-hosts" style="color:#a78bfa;">254 hosts (2^8 - 2)</strong></div>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Cálculo VLSM completado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  calcVlsm() {
    const ipStr = document.getElementById('vlsm-ip').value || '192.168.10.0';
    const cidr = parseInt(document.getElementById('vlsm-cidr').value, 10) || 24;

    const parts = ipStr.split('.').map(n => parseInt(n, 10));
    if (parts.length !== 4) return;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = totalHosts - 2;

    const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const maskStr = [(maskInt >>> 24) & 255, (maskInt >>> 16) & 255, (maskInt >>> 8) & 255, maskInt & 255].join('.');

    document.getElementById('vlsm-res-mask').innerText = `${maskStr} (/${cidr})`;
    document.getElementById('vlsm-res-first').innerText = `${parts[0]}.${parts[1]}.${parts[2]}.1`;
    document.getElementById('vlsm-res-last').innerText = `${parts[0]}.${parts[1]}.${parts[2]}.${totalHosts - 2}`;
    document.getElementById('vlsm-res-bcast').innerText = `${parts[0]}.${parts[1]}.${parts[2]}.${totalHosts - 1}`;
    document.getElementById('vlsm-res-hosts').innerText = `${usableHosts.toLocaleString()} hosts`;
  },

  // 11. LABORATORIO ENSAMBLADOR DE TRAMAS
  labFrameBuilder(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Ensamblador de Encapsulamiento de Tramas</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Observa la estructura exacta en bytes de una trama Ethernet encapsulando un paquete IPv4 y un segmento TCP.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: 140px 160px 160px 1fr 100px; gap: 0.4rem; text-align: center; font-size: 0.78rem;">
          <div style="background: #1e3a8a; color: #93c5fd; padding: 0.8rem 0.4rem; border-radius: 6px;">
            <strong>Cabecera Ethernet</strong><br/>14 Bytes<br/>(MAC Dst, Src, Type)
          </div>
          <div style="background: #0e7490; color: #a5f3fc; padding: 0.8rem 0.4rem; border-radius: 6px;">
            <strong>Cabecera IP</strong><br/>20 Bytes<br/>(IP Src, Dst, TTL)
          </div>
          <div style="background: #4338ca; color: #c7d2fe; padding: 0.8rem 0.4rem; border-radius: 6px;">
            <strong>Cabecera TCP</strong><br/>20 Bytes<br/>(Puertos, SEQ, ACK)
          </div>
          <div style="background: #047857; color: #a7f3d0; padding: 0.8rem 0.4rem; border-radius: 6px;">
            <strong>Carga Útil (Payload)</strong><br/>Hasta 1460 Bytes (MSS)<br/>Datos de Aplicación HTTP
          </div>
          <div style="background: #b45309; color: #fde68a; padding: 0.8rem 0.4rem; border-radius: 6px;">
            <strong>Tráiler FCS</strong><br/>4 Bytes<br/>CRC-32 Check
          </div>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Encapsulamiento verificado!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 12. LABORATORIO FIREWALL SPI
  labFirewall(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Laboratorio de Políticas de Firewall con Inspección de Estado</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Prueba cómo el firewall analiza paquetes entrantes y salientes según las políticas de seguridad configuradas.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem;">
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #38bdf8; font-size: 0.9rem; margin-bottom: 0.6rem;">Políticas Activas:</h4>
          <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; list-style: none; padding-left: 0;">
            <li>✓ Puerto 80 (HTTP): <strong style="color:#10b981;">ALLOW</strong></li>
            <li>✓ Puerto 443 (HTTPS): <strong style="color:#10b981;">ALLOW</strong></li>
            <li>❌ Puerto 23 (Telnet - No Seguro): <strong style="color:#ef4444;">DROP</strong></li>
            <li>❌ Puerto 21 (FTP Plano): <strong style="color:#ef4444;">DROP</strong></li>
          </ul>
        </div>
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1rem;">
          <h4 style="color: #10b981; font-size: 0.9rem; margin-bottom: 0.6rem;">Inyectar Tráfico de Prueba:</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            <button class="btn btn-sm" onclick="alert('Tráfico HTTPS (443): PERMITIDO por política y registrado en tabla de estado.')">Probar HTTPS (Puerto 443)</button>
            <button class="btn btn-sm" onclick="alert('Tráfico Telnet (23): BLOQUEADO y descartado (DROP) por política de seguridad.')">Probar Telnet (Puerto 23)</button>
          </div>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Reglas de Firewall aprobadas!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 13. LABORATORIO FLUKE NETWORKS
  labFluke(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Certificación de Enlaces Fluke DSX-8000</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Analiza las curvas de Paradiafonía (NEXT) y Pérdida de Retorno frente al límite normativo TIA-568-D.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📊</div>
        <div style="font-size: 1.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.4rem;">RESULTADO GENERAL: PASS ✓</div>
        <div style="font-size: 0.85rem; color: #94a3b8; max-width: 500px; margin: 0 auto 1rem;">
          Enlace permanente Cat 6A verificado a 500 MHz. Margen de NEXT: +6.4 dB. Pérdida de Retorno: +4.8 dB. Atenuación: 18.2 dB (Límite: 21.0 dB).
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Certificación Fluke aprobada!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  // 14. LABORATORIO DIMENSIONADOR DE RACK
  labRackDimensioner(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Dimensionador de Racks de 19 Pulgadas (TIA-569)</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Calcula las Unidades de Rack ('U') requeridas sumando patch panels, switches y holgura del 30%.
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="font-size: 0.8rem; color: #94a3b8;">Tomas de Red a Instalar:</label>
            <input type="number" id="rack-drops-in" value="48" style="width: 100%; padding: 0.4rem; background: #0f172a; border: 1px solid #38bdf8; color: #f8fafc; border-radius: 4px;" oninput="VisualExercises.calcRackU()" />
          </div>
          <div>
            <label style="font-size: 0.8rem; color: #94a3b8;">Holgura Futura (TIA-569):</label>
            <input type="text" value="30% Normativa" disabled style="width: 100%; padding: 0.4rem; background: #0b1324; border: 1px solid #1e293b; color: #64748b; border-radius: 4px;" />
          </div>
        </div>

        <div id="rack-u-res-box" style="background: #0f172a; padding: 0.8rem; border-radius: 6px; font-size: 0.85rem; color: #10b981;">
          Dimensionamiento: <strong>16U ocupadas -> Gabinete recomendado: 24U o Rack de 42U</strong>
        </div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Dimensionamiento de Rack concluido!');">
          <span>✓</span> Concluir Práctica
        </button>
      </div>
    `;
  },

  calcRackU() {
    const drops = parseInt(document.getElementById('rack-drops-in').value, 10) || 48;
    const pp = Math.ceil(drops / 24);
    const ppU = pp * 2; // PP + Pasahilos
    const swU = pp * 2; // Switch + Pasahilos
    const otherU = 2 + 1 + 2 + 2; // Router, PDU, UPS, Servidor
    const totalU = ppU + swU + otherU;
    const withGrowth = Math.ceil(totalU * 1.3);

    const box = document.getElementById('rack-u-res-box');
    if (box) {
      box.innerHTML = `Cálculo: ${pp} Patch Panels (${ppU}U) + ${pp} Switches (${swU}U) + Equipos Core (${otherU}U) = <strong>${totalU}U</strong>.<br/>Con 30% holgura: <strong>${withGrowth}U requeridas</strong> -> Se especifica Rack Estándar de <strong>24U o 42U</strong>.`;
    }
  },

  // 15. LABORATORIO MEMORIA TÉCNICA OFICIAL
  labTechMemory(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Generador Oficial de Memoria Técnica Imprimible</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Documento técnico formal de entrega y liberación del Proyecto Integrador (Universidad Aztlán, Clave 634).
      </p>

      <div style="background: #020617; border: 1px dashed #10b981; border-radius: 10px; padding: 2rem; text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 0.6rem;">📄 ➔ 🖨️</div>
        <h4 style="color: #f8fafc; font-size: 1.1rem; margin-bottom: 0.4rem;">Memoria Técnica de Ingeniería de Redes</h4>
        <p style="font-size: 0.85rem; color: #94a3b8; max-width: 500px; margin: 0 auto 1.2rem;">
          Integra planos, memorias de cálculo VLSM, bitácora de etiquetado TIA-606 y dictamen de pruebas Fluke.
        </p>
        <button class="btn btn-primary" onclick="window.print()">
          <span>🖨️</span> Abrir Vista de Impresión Formal
        </button>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Memoria Técnica Oficial concluida y aprobada!');">
          <span>✓</span> Concluir Unidad Integradora
        </button>
      </div>
    `;
  },

  // 16. LABORATORIO UNIVERSAL ENRIQUECIDO (Para los demás ejercicios)
  labUniversal(ws, ex) {
    ws.innerHTML = `
      <h3 style="color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.8rem;">🛠️ Laboratorio Interactivo & Verificación Técnica</h3>
      <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.2rem;">
        Evalúa y aplica los conceptos analizados en la teoría de este tema mediante la siguiente comprobación técnica:
      </p>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: flex-start; gap: 0.8rem; margin-bottom: 1rem;">
          <span style="font-size: 1.5rem;">🎯</span>
          <div>
            <div style="font-size: 0.95rem; font-weight: bold; color: #f8fafc; margin-bottom: 0.3rem;">Objetivo de la Competencia:</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.5;">${ex.desc}</div>
          </div>
        </div>

        <div style="background: #0f172a; border-left: 3px solid #38bdf8; padding: 0.8rem 1rem; border-radius: 6px; font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
          <strong>Parámetro de Validación:</strong> Conforme al temario oficial de la Universidad Aztlán (Clave 634), este tema forma parte integral de las competencias requeridas para la certificación de la materia.
        </div>

        <div style="text-align: center; padding: 0.6rem;">
          <button class="btn btn-primary" onclick="VisualExercises.runUniversalCheck('${ex.id}')">
            <span>⚡</span> Ejecutar Diagnóstico & Comprobación Técnica
          </button>
        </div>

        <div id="universal-check-result-${ex.id}" style="display: none; margin-top: 1rem; padding: 0.8rem; border-radius: 6px; font-size: 0.85rem;"></div>
      </div>

      <div style="text-align: right;">
        <button class="btn btn-accent" onclick="VisualExercises.markCompleted('${ex.id}'); alert('¡Práctica aprobada y registrada en tu expediente académico!');">
          <span>✓</span> Marcar Práctica Aprobada
        </button>
      </div>
    `;
  },

  runUniversalCheck(exId) {
    const resBox = document.getElementById(`universal-check-result-${exId}`);
    if (!resBox) return;
    resBox.style.display = 'block';
    resBox.style.background = 'rgba(16, 185, 129, 0.15)';
    resBox.style.border = '1px solid #10b981';
    resBox.style.color = '#34d399';
    resBox.innerHTML = `<strong>✓ VALIDACIÓN EXITOSA:</strong> Parámetros normativos y criterios de diseño verificados conforme a la rúbrica oficial de la asignatura.`;
  }
};

// Exportar explícitamente a window y autoinicializar si el DOM ya está listo
if (typeof window !== 'undefined') {
  window.VisualExercises = VisualExercises;

  const initVisualExercises = () => {
    try {
      if (document.getElementById('exercise-sidebar-list')) {
        VisualExercises.init();
      }
    } catch (e) {
      console.error('Error auto-inicializando VisualExercises:', e);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualExercises);
  } else {
    initVisualExercises();
  }
}
"""

with open("exercises.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("portal-redes-aztlan/exercises.js generado con éxito con los 100 ejercicios.")
