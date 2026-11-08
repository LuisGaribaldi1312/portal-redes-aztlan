/**
 * LABORATORIO DE PRÁCTICAS ACTIVAS DE RED • UNIDADES 1 A 5
 * UNIVERSIDAD AZTLÁN - REDES DE COMPUTADORAS (CLAVE 634)
 * Entorno de simulación digital para poner a prueba los conocimientos de cada unidad
 * con detección inteligente de errores y retroalimentación pedagógica correctiva.
 */

const NetworkLabs = {
  currentLab: 'u1',

  state: {
    // Estado Práctica U1 (Topologías y Máquinas)
    u1: {
      topology: 'star',
      nodes: [
        { id: 'pc1', name: 'PC-1 (Ventas)', ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:01', status: 'online', role: 'client' },
        { id: 'pc2', name: 'PC-2 (Almacén)', ip: '192.168.1.20', mac: '00:1A:2B:3C:4D:02', status: 'online', role: 'client' },
        { id: 'pc3', name: 'PC-3 (Finanzas)', ip: '192.168.1.30', mac: '00:1A:2B:3C:4D:03', status: 'online', role: 'client' },
        { id: 'pc4', name: 'PC-4 (Sistemas)', ip: '192.168.1.40', mac: '00:1A:2B:3C:4D:04', status: 'online', role: 'client' },
        { id: 'srv', name: 'Servidor Web/BD', ip: '192.168.1.100', mac: '00:1A:2B:3C:4D:99', status: 'online', role: 'server' }
      ],
      terminatorLeft: true,
      terminatorRight: true,
      brokenLinks: [],
      sourceNode: 'pc1',
      destNode: 'srv',
      isSimulating: false
    },

    // Estado Práctica U2 (Pila OSI / TCP-IP)
    u2: {
      appProtocol: 'HTTP',
      transportProtocol: 'TCP',
      destPort: 80,
      srcPort: 54321,
      srcIp: '192.168.1.10',
      destIp: '192.168.1.100',
      ttl: 64,
      srcMac: '00:1A:2B:3C:4D:01',
      destMac: '00:1A:2B:3C:4D:99',
      corruptFcs: false
    },

    // Estado Práctica U3 (Switching L2, CAM & VLANs)
    u3: {
      vlans: {
        port1: 10,
        port2: 10,
        port3: 20,
        port4: 20,
        port5: 30,
        port6: 30
      },
      trunkEnabled: false,
      interVlanRouter: false,
      camTable: [
        { port: 1, mac: '00:1A:2B:10:01:01', vlan: 10, age: '12s' },
        { port: 2, mac: '00:1A:2B:10:01:02', vlan: 10, age: '45s' },
        { port: 3, mac: '00:1A:2B:20:02:01', vlan: 20, age: '5s' }
      ],
      srcPort: 1,
      dstPort: 3
    },

    // Estado Práctica U4 (Cableado Fluke Certifier)
    u4: {
      category: 'Cat6',
      standardA: 'T568B',
      standardB: 'T568B',
      lengthMeters: 65,
      untwistMm: 10,
      nearEmisource: false
    },

    // Estado Práctica U5 (Diseño VLSM & FHRP Gateway)
    u5: {
      baseNetwork: '192.168.10.0/24',
      subnets: {
        lab: { req: 60, mask: '26', ip: '192.168.10.0' },
        admin: { req: 20, mask: '27', ip: '192.168.10.64' },
        servers: { req: 10, mask: '28', ip: '192.168.10.96' }
      },
      switchPoeBudgetWatts: 370,
      poeDevicesCount: 8,
      poeStandard: '802.3at', // 30W c/u
      fhrpActive: true,
      primaryRouterOnline: true,
      standbyRouterOnline: true
    }
  },

  init() {
    this.renderTabs();
    this.renderCurrentLab();
  },

  selectLab(unitKey) {
    this.currentLab = unitKey;
    this.renderTabs();
    this.renderCurrentLab();
  },

  renderTabs() {
    const tabsContainer = document.getElementById('network-labs-tabs');
    if (!tabsContainer) return;

    const labs = [
      { id: 'u1', name: 'Práctica U1: Topologías & Comunicación', icon: '📡' },
      { id: 'u2', name: 'Práctica U2: Encapsulado Pila OSI/TCP-IP', icon: '📑' },
      { id: 'u3', name: 'Práctica U3: Conmutación L2, CAM & VLANs', icon: '🔌' },
      { id: 'u4', name: 'Práctica U4: Certificación Fluke de Cableado', icon: '🛠️' },
      { id: 'u5', name: 'Práctica U5: Diseño Integrador & Gateway FHRP', icon: '🏗️' }
    ];

    tabsContainer.innerHTML = labs.map(lab => `
      <button class="lab-tab-btn ${this.currentLab === lab.id ? 'active' : ''}" onclick="NetworkLabs.selectLab('${lab.id}')">
        <span>${lab.icon}</span>
        <span>${lab.name}</span>
      </button>
    `).join('');
  },

  renderCurrentLab() {
    const container = document.getElementById('network-lab-workspace');
    if (!container) return;

    if (this.currentLab === 'u1') this.renderLabU1(container);
    else if (this.currentLab === 'u2') this.renderLabU2(container);
    else if (this.currentLab === 'u3') this.renderLabU3(container);
    else if (this.currentLab === 'u4') this.renderLabU4(container);
    else if (this.currentLab === 'u5') this.renderLabU5(container);
  },

  // ==============================================================
  // PRÁCTICA U1: SIMULADOR DE MÁQUINAS, TOPOLOGÍAS Y FALLAS
  // ==============================================================
  renderLabU1(container) {
    const state = this.state.u1;
    container.innerHTML = `
      <div class="lab-workspace-header">
        <div>
          <span class="lab-badge">PRÁCTICA ACTIVA • UNIDAD 1</span>
          <h3>Simulación de Comunicación de Máquinas en Topologías Digitales</h3>
          <p>Configura las computadoras de la red, prueba la transmisión de paquetes y simula averías intencionales para observar cómo reacciona la topología.</p>
        </div>
        <div class="lab-toolbar">
          <label style="font-size: 0.8rem; color: #94a3b8; margin-right: 0.4rem;">Topología:</label>
          <select class="form-control" style="width: auto; display: inline-block;" onchange="NetworkLabs.setU1Topology(this.value)">
            <option value="star" ${state.topology === 'star' ? 'selected' : ''}>Estrella (Switch Central)</option>
            <option value="bus" ${state.topology === 'bus' ? 'selected' : ''}>Bus Coaxial (Terminadores 50Ω)</option>
            <option value="ring" ${state.topology === 'ring' ? 'selected' : ''}>Anillo (Token Ring 802.5)</option>
            <option value="mesh" ${state.topology === 'mesh' ? 'selected' : ''}>Malla Completa (Full Mesh)</option>
            <option value="tree" ${state.topology === 'tree' ? 'selected' : ''}>Árbol Jerárquico (Core/Acceso)</option>
          </select>
        </div>
      </div>

      <!-- Lienzo Gráfico de la Topología -->
      <div style="background: #020617; border: 1px solid var(--border); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; position: relative;">
        <canvas id="lab-u1-canvas" width="850" height="380" style="width: 100%; height: 380px; display: block; border-radius: 8px;"></canvas>
        <div style="position: absolute; bottom: 1.5rem; right: 1.5rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #334155; font-size: 0.78rem; color: #cbd5e1;">
          💡 <em>Haz clic en cualquier computadora para encenderla/apagarla, o simula desconexión de cables.</em>
        </div>
      </div>

      <!-- Controles de la Práctica y Transmisión -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        
        <!-- Panel de Emisión de Paquetes -->
        <div class="calc-results-card">
          <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
            <span>🚀</span> Transmisión de Paquetes entre Máquinas
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
            <div>
              <label style="font-size: 0.78rem; color: #94a3b8;">Máquina Origen:</label>
              <select class="form-control" id="u1-src-node" onchange="NetworkLabs.state.u1.sourceNode = this.value">
                ${state.nodes.map(n => `<option value="${n.id}" ${state.sourceNode === n.id ? 'selected' : ''}>${n.name} (${n.ip})</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size: 0.78rem; color: #94a3b8;">Máquina Destino:</label>
              <select class="form-control" id="u1-dst-node" onchange="NetworkLabs.state.u1.destNode = this.value">
                ${state.nodes.map(n => `<option value="${n.id}" ${state.destNode === n.id ? 'selected' : ''}>${n.name} (${n.ip})</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 0.6rem; margin-bottom: 1rem;">
            <button class="btn btn-primary" onclick="NetworkLabs.simulateU1Transmission()" style="flex: 1;">
              <span>⚡</span> Enviar Paquete ICMP (Ping)
            </button>
            <button class="btn" onclick="NetworkLabs.resetU1Failures()">
              <span>🔄</span> Restaurar Red
            </button>
          </div>

          <!-- Modificadores de Fallas en Tiempo Real -->
          <div style="background: rgba(30, 41, 59, 0.6); padding: 0.8rem; border-radius: 8px; border: 1px solid #334155;">
            <span style="font-size: 0.78rem; font-weight: bold; color: #f59e0b;">⚠️ Inyección de Averías Físicas para Aprendizaje:</span>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
              ${state.topology === 'bus' ? `
                <button class="btn btn-sm ${!state.terminatorRight ? 'btn-danger' : ''}" onclick="NetworkLabs.toggleU1Terminator('right')">
                  ${state.terminatorRight ? '❌ Desconectar Terminador 50Ω' : '✓ Conectar Terminador 50Ω'}
                </button>
              ` : ''}
              <button class="btn btn-sm ${state.nodes[1].status === 'offline' ? 'btn-danger' : ''}" onclick="NetworkLabs.toggleNodePower('pc2')">
                ${state.nodes[1].status === 'online' ? '🔌 Apagar PC-2 (Almacén)' : '⚡ Encender PC-2'}
              </button>
              <button class="btn btn-sm" onclick="NetworkLabs.corruptNodeIp('pc3')">
                ${state.nodes[2].ip === '10.0.0.99' ? '✓ Restaurar IP PC-3' : '⚠️ Asignar IP Errante en PC-3'}
              </button>
            </div>
          </div>
        </div>

        <!-- Panel de Diagnóstico y Corrección de Errores -->
        <div class="calc-results-card" id="u1-diagnostic-panel">
          <h4 style="color: #38bdf8; margin-bottom: 0.8rem;">
            <span>🩺</span> Diagnóstico de Red & Retroalimentación Pedagógica
          </h4>
          <div style="background: #0f172a; padding: 1rem; border-radius: 8px; border: 1px solid #1e293b; min-height: 180px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;" id="u1-feedback-box">
            <span style="font-size: 2rem; margin-bottom: 0.5rem;">📡</span>
            <strong style="color: #94a3b8; font-size: 0.9rem;">Listo para simular transmisión.</strong>
            <p style="font-size: 0.78rem; color: #64748b; margin-top: 0.3rem;">
              Selecciona origen y destino y haz clic en "Enviar Paquete ICMP" para analizar si la red entrega el mensaje o qué error físico/lógico se produce.
            </p>
          </div>
        </div>

      </div>
    `;

    if (typeof setTimeout !== 'undefined') {
      setTimeout(() => this.drawU1Canvas(), 50);
    } else {
      this.drawU1Canvas();
    }
  },

  setU1Topology(topo) {
    this.state.u1.topology = topo;
    this.drawU1Canvas();
    const fb = document.getElementById('u1-feedback-box');
    if (fb) {
      fb.innerHTML = `
        <span style="font-size: 2rem; margin-bottom: 0.5rem;">🔄</span>
        <strong style="color: #38bdf8; font-size: 0.9rem;">Topología cambiada a: ${topo.toUpperCase()}</strong>
        <p style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.3rem;">
          Se ha reconstruido el cableado físico y la distribución lógica de las 5 máquinas.
        </p>
      `;
    }
    this.renderLabU1(document.getElementById('network-lab-workspace'));
  },

  toggleU1Terminator(side) {
    if (side === 'right') {
      this.state.u1.terminatorRight = !this.state.u1.terminatorRight;
    }
    this.drawU1Canvas();
    this.renderLabU1(document.getElementById('network-lab-workspace'));
  },

  toggleNodePower(nodeId) {
    const node = this.state.u1.nodes.find(n => n.id === nodeId);
    if (node) {
      node.status = node.status === 'online' ? 'offline' : 'online';
    }
    this.drawU1Canvas();
    this.renderLabU1(document.getElementById('network-lab-workspace'));
  },

  corruptNodeIp(nodeId) {
    const node = this.state.u1.nodes.find(n => n.id === nodeId);
    if (node) {
      node.ip = node.ip === '10.0.0.99' ? '192.168.1.30' : '10.0.0.99';
    }
    this.drawU1Canvas();
    this.renderLabU1(document.getElementById('network-lab-workspace'));
  },

  resetU1Failures() {
    this.state.u1.terminatorLeft = true;
    this.state.u1.terminatorRight = true;
    this.state.u1.nodes.forEach(n => {
      n.status = 'online';
      if (n.id === 'pc1') n.ip = '192.168.1.10';
      if (n.id === 'pc2') n.ip = '192.168.1.20';
      if (n.id === 'pc3') n.ip = '192.168.1.30';
      if (n.id === 'pc4') n.ip = '192.168.1.40';
      if (n.id === 'srv') n.ip = '192.168.1.100';
    });
    this.drawU1Canvas();
    this.renderLabU1(document.getElementById('network-lab-workspace'));
  },

  simulateU1Transmission() {
    const s = this.state.u1;
    const src = s.nodes.find(n => n.id === s.sourceNode);
    const dst = s.nodes.find(n => n.id === s.destNode);
    const fb = document.getElementById('u1-feedback-box');
    if (!fb) return;

    if (src.id === dst.id) {
      fb.innerHTML = `
        <div style="color: #f59e0b; text-align: left; width: 100%;">
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">⚠️ Loopback Interno (127.0.0.1)</div>
          <p style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.5;">
            Has seleccionado el mismo nodo como origen y destino. El paquete no viaja por el medio físico de la red; la pila TCP/IP responde en el socket interno local.
          </p>
        </div>
      `;
      return;
    }

    if (src.status === 'offline') {
      fb.innerHTML = `
        <div style="color: #ef4444; text-align: left; width: 100%;">
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">❌ ERROR: Máquina Origen Apagada</div>
          <p style="font-size: 0.82rem; color: #fca5a5; line-height: 1.5;">
            ${src.name} no tiene suministro eléctrico. La tarjeta de red (NIC) no puede generar pulsos eléctricos ni modular fotones.
          </p>
          <div style="background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem;">
            <strong>💡 ¿Cómo solucionarlo?:</strong> Enciende ${src.name} antes de iniciar cualquier sesión de red.
          </div>
        </div>
      `;
      return;
    }

    if (dst.status === 'offline') {
      fb.innerHTML = `
        <div style="color: #ef4444; text-align: left; width: 100%;">
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">❌ ERROR: Destino Inaccesible (Host Unreachable)</div>
          <p style="font-size: 0.82rem; color: #fca5a5; line-height: 1.5;">
            El paquete fue emitido por ${src.name}, pero la máquina destino (${dst.name}) está apagada o desconectada de la red. Tiempo de espera agotado (Timeout).
          </p>
          <div style="background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem;">
            <strong>💡 ¿Cómo solucionarlo?:</strong> Enciende el equipo destino o verifica la conectividad física en el switch.
          </div>
        </div>
      `;
      return;
    }

    // Error en Topología en Bus por falta de terminador
    if (s.topology === 'bus' && (!s.terminatorLeft || !s.terminatorRight)) {
      fb.innerHTML = `
        <div style="color: #ef4444; text-align: left; width: 100%;">
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">❌ ERROR CRÍTICO: Reflexión de Onda en Bus Coaxial</div>
          <p style="font-size: 0.82rem; color: #fca5a5; line-height: 1.5;">
            El cable coaxial del bus carece del <strong>terminador resistivo de 50 Ohms</strong> en uno de sus extremos. La señal eléctrica llega al extremo abierto y rebota produciendo interferencia destructiva que inutiliza todo el medio compartido para todas las computadoras.
          </p>
          <div style="background: rgba(245,158,11,0.15); border-left: 3px solid #f59e0b; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem; color: #fde047;">
            <strong>🛠️ Solución Pedagógica:</strong> Conecta el terminador de 50 Ω para absorber la energía residual al final de la línea.
          </div>
        </div>
      `;
      return;
    }

    // Error en Anillo si un nodo intermedio está apagado
    if (s.topology === 'ring' && s.nodes.some(n => n.status === 'offline')) {
      const offlineNode = s.nodes.find(n => n.status === 'offline');
      fb.innerHTML = `
        <div style="color: #ef4444; text-align: left; width: 100%;">
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">❌ ERROR: Ruptura del Anillo Lógico (Token Ring)</div>
          <p style="font-size: 0.82rem; color: #fca5a5; line-height: 1.5;">
            En una topología en anillo simple, cada estación actúa como repetidor activo regenerando el testigo (token). Como <strong>${offlineNode.name}</strong> está apagado, el anillo se rompe e impide que la trama circule.
          </p>
          <div style="background: rgba(245,158,11,0.15); border-left: 3px solid #f59e0b; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem; color: #fde047;">
            <strong>🛠️ Solución Pedagógica:</strong> Enciende el nodo intermedio o implementa una MAU (Multistation Access Unit) con relé de bypass automático o doble anillo contrarrotatorio (FDDI).
          </div>
        </div>
      `;
      return;
    }

    // Error de subredes dispares sin enrutador
    const srcSub = src.ip.split('.').slice(0, 3).join('.');
    const dstSub = dst.ip.split('.').slice(0, 3).join('.');
    if (srcSub !== dstSub) {
      fb.innerHTML = `
        <div style="color: #ef4444; text-align: left; width: 100%;">
          <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">❌ ERROR LÓGICO: Subred Incompatible sin Gateway</div>
          <p style="font-size: 0.82rem; color: #fca5a5; line-height: 1.5;">
            ${src.name} (${src.ip}/24) y ${dst.name} (${dst.ip}/24) están en <strong>redes lógicas diferentes</strong>. Un conmutador de Capa 2 solo reenvía tramas dentro de la misma subred; para comunicarse requieren un Router (Capa 3) que enrute los datagramas IP.
          </p>
          <div style="background: rgba(56,189,248,0.15); border-left: 3px solid #38bdf8; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem; color: #bae6fd;">
            <strong>🛠️ Solución Pedagógica:</strong> Restaura la dirección IP del nodo para que comparta el segmento de red 192.168.1.0/24.
          </div>
        </div>
      `;
      return;
    }

    // Éxito en la transmisión
    fb.innerHTML = `
      <div style="color: #10b981; text-align: left; width: 100%;">
        <div style="font-weight: bold; font-size: 1rem; margin-bottom: 0.4rem;">✓ ¡TRANSMISIÓN EXITOSA!</div>
        <p style="font-size: 0.82rem; color: #a7f3d0; line-height: 1.5;">
          El paquete ICMP Echo Request partió de <strong>${src.name}</strong> (${src.ip}), transitó correctamente por la topología <strong>${s.topology.toUpperCase()}</strong> y fue recibido y respondido por <strong>${dst.name}</strong> (${dst.ip}) con 0% de pérdida de paquetes.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.75rem; margin-top: 0.6rem; color: #cbd5e1;">
          <div style="background: #1e293b; padding: 0.3rem 0.5rem; border-radius: 4px;">RTT Latencia: <strong>0.84 ms</strong></div>
    if (window.StudentTracker && window.AuthSystem && window.AuthSystem.currentUser) {
      window.StudentTracker.recordLab(window.AuthSystem.currentUser.username, 'u1', 'Topología y Transmisión de Red');
    }
          <div style="background: #1e293b; padding: 0.3rem 0.5rem; border-radius: 4px;">Throughput: <strong>942 Mbps</strong></div>
          <div style="background: #1e293b; padding: 0.3rem 0.5rem; border-radius: 4px;">Jitter: <strong>0.04 ms (Excelente)</strong></div>
          <div style="background: #1e293b; padding: 0.3rem 0.5rem; border-radius: 4px;">Pérdida de Paquetes: <strong>0%</strong></div>
        </div>
      </div>
    `;

    // Registrar en progreso
    if (window.AcademicProgression) {
      window.AcademicProgression.recordExerciseDone('ex_1_1');
    }
  },

  drawU1Canvas() {
    const canvas = document.getElementById('lab-u1-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const s = this.state.u1;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.clearRect(0, 0, w, h);
    if (isLight) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);
    }

    // Fondo con rejilla sutil
    ctx.strokeStyle = isLight ? '#e2e8f0' : '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;
    const nodes = s.nodes;

    // Calcular posiciones de nodos según topología
    const positions = {};
    if (s.topology === 'star') {
      const radius = 130;
      nodes.forEach((n, idx) => {
        const angle = (idx / nodes.length) * 2 * Math.PI - Math.PI / 2;
        positions[n.id] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
      });
      // Dibujar enlaces hacia el switch central
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(positions[n.id].x, positions[n.id].y);
        ctx.stroke();
      });
      // Switch Central
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(cx - 35, cy - 25, 70, 50, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('SWITCH L2', cx, cy - 2);
      ctx.font = '9px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.fillText('24 Puertos GbE', cx, cy + 12);
    } else if (s.topology === 'bus') {
      const busY = cy;
      const startX = 80;
      const endX = w - 80;
      const step = (endX - startX) / (nodes.length - 1);
      // Cable Troncal
      ctx.strokeStyle = (!s.terminatorLeft || !s.terminatorRight) ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(startX, busY); ctx.lineTo(endX, busY); ctx.stroke();

      // Terminadores
      ctx.fillStyle = s.terminatorLeft ? '#10b981' : '#ef4444';
      ctx.fillRect(startX - 12, busY - 10, 12, 20);
      ctx.fillStyle = s.terminatorRight ? '#10b981' : '#ef4444';
      ctx.fillRect(endX, busY - 10, 12, 20);

      nodes.forEach((n, idx) => {
        const nx = startX + idx * step;
        const ny = idx % 2 === 0 ? busY - 90 : busY + 90;
        positions[n.id] = { x: nx, y: ny };
        // Bajada de cable
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(nx, busY); ctx.lineTo(nx, ny); ctx.stroke();
      });
    } else if (s.topology === 'ring') {
      const radius = 135;
      nodes.forEach((n, idx) => {
        const angle = (idx / nodes.length) * 2 * Math.PI - Math.PI / 2;
        positions[n.id] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
      });
      // Anillo circular
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const cur = positions[nodes[i].id];
        const nxt = positions[nodes[(i + 1) % nodes.length].id];
        ctx.moveTo(cur.x, cur.y); ctx.lineTo(nxt.x, nxt.y);
      }
      ctx.stroke();
    } else if (s.topology === 'mesh') {
      const radius = 140;
      nodes.forEach((n, idx) => {
        const angle = (idx / nodes.length) * 2 * Math.PI - Math.PI / 2;
        positions[n.id] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
      });
      // Todos conectados con todos n(n-1)/2
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.beginPath();
          ctx.moveTo(positions[nodes[i].id].x, positions[nodes[i].id].y);
          ctx.lineTo(positions[nodes[j].id].x, positions[nodes[j].id].y);
          ctx.stroke();
        }
      }
    } else if (s.topology === 'tree') {
      positions['srv'] = { x: cx, y: 70 };
      positions['pc1'] = { x: cx - 180, y: 220 };
      positions['pc2'] = { x: cx - 60, y: 220 };
      positions['pc3'] = { x: cx + 60, y: 220 };
      positions['pc4'] = { x: cx + 180, y: 220 };
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ['pc1', 'pc2', 'pc3', 'pc4'].forEach(id => {
        ctx.beginPath();
        ctx.moveTo(positions['srv'].x, positions['srv'].y);
        ctx.lineTo(positions[id].x, positions[id].y);
        ctx.stroke();
      });
    }

    // Dibujar cada nodo (PC / Servidor)
    nodes.forEach(n => {
      const pos = positions[n.id];
      if (!pos) return;
      const isOnline = n.status === 'online';

      ctx.fillStyle = isOnline ? (n.role === 'server' ? '#047857' : (isLight ? '#0284c7' : '#0369a1')) : (isLight ? '#ef4444' : '#7f1d1d');
      ctx.strokeStyle = isOnline ? '#38bdf8' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pos.x - 42, pos.y - 25, 84, 50, 8);
      ctx.fill();
      ctx.stroke();

      // Icono y texto
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.role === 'server' ? '🖥️ ' + n.name : '💻 ' + n.name, pos.x, pos.y - 5);
      ctx.font = '9px monospace';
      ctx.fillStyle = isOnline ? (isLight ? '#e0f2fe' : '#93c5fd') : '#fca5a5';
      ctx.fillText(n.ip, pos.x, pos.y + 8);
      ctx.font = '8px sans-serif';
      ctx.fillStyle = isOnline ? '#34d399' : '#ef4444';
      ctx.fillText(isOnline ? '● EN LÍNEA' : '○ APAGADO', pos.x, pos.y + 20);
    });
  },

  // ==============================================================
  // PRÁCTICA U2: CONSTRUCTOR Y VALIDADOR DE PILA OSI / TCP-IP
  // ==============================================================
  renderLabU2(container) {
    const s = this.state.u2;
    container.innerHTML = `
      <div class="lab-workspace-header">
        <div>
          <span class="lab-badge">PRÁCTICA ACTIVA • UNIDAD 2</span>
          <h3>Constructor de Paquetes & Diagnóstico de Cabeceras OSI / TCP-IP</h3>
          <p>Ensambla cada capa de la PDU (desde Aplicación hasta Bits físicos). Comprueba qué ocurre cuando configuras un puerto incorrecto o un TTL en cero.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
        
        <!-- Pila de Capas Interactiva -->
        <div>
          <div style="display: grid; gap: 0.8rem;">
            
            <!-- Capa 7: Aplicación -->
            <div style="background: rgba(2, 132, 199, 0.15); border: 1px solid #0284c7; padding: 1rem; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #38bdf8;">Capa 7: Aplicación (Datos de Usuario)</strong>
                <span class="badge" style="background: #0284c7; color: white;">PDU: Datos</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">Servicio / Protocolo:</label>
                  <select class="form-control" onchange="NetworkLabs.state.u2.appProtocol = this.value; NetworkLabs.renderLabU2(document.getElementById('network-lab-workspace'));">
                    <option value="HTTP" ${s.appProtocol === 'HTTP' ? 'selected' : ''}>HTTP (Navegación Web)</option>
                    <option value="DNS" ${s.appProtocol === 'DNS' ? 'selected' : ''}>DNS (Resolución de Nombres)</option>
                    <option value="SSH" ${s.appProtocol === 'SSH' ? 'selected' : ''}>SSH (Acceso Remoto Seguro)</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">Mensaje / Carga Útil:</label>
                  <input type="text" class="form-control" value="GET /index.html HTTP/1.1" readonly>
                </div>
              </div>
            </div>

            <!-- Capa 4: Transporte -->
            <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid #6366f1; padding: 1rem; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #a5b4fc;">Capa 4: Transporte (Segmento)</strong>
                <span class="badge" style="background: #6366f1; color: white;">PDU: Segmento</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem;">
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">Protocolo:</label>
                  <select class="form-control" onchange="NetworkLabs.state.u2.transportProtocol = this.value">
                    <option value="TCP" ${s.transportProtocol === 'TCP' ? 'selected' : ''}>TCP (Confiable, 3-Way)</option>
                    <option value="UDP" ${s.transportProtocol === 'UDP' ? 'selected' : ''}>UDP (Datagrama Ligero)</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">Puerto Destino:</label>
                  <input type="number" class="form-control" id="u2-dest-port" value="${s.destPort}" onchange="NetworkLabs.state.u2.destPort = parseInt(this.value, 10)">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">Puerto Origen:</label>
                  <input type="number" class="form-control" value="54321" readonly>
                </div>
              </div>
            </div>

            <!-- Capa 3: Red -->
            <div style="background: rgba(6, 182, 212, 0.15); border: 1px solid #06b6d4; padding: 1rem; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #67e8f9;">Capa 3: Red (Paquete / Datagrama IP)</strong>
                <span class="badge" style="background: #06b6d4; color: white;">PDU: Paquete</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem;">
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">IP Origen:</label>
                  <input type="text" class="form-control" value="${s.srcIp}" readonly>
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">IP Destino:</label>
                  <input type="text" class="form-control" id="u2-dest-ip" value="${s.destIp}" onchange="NetworkLabs.state.u2.destIp = this.value">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">TTL (Time To Live):</label>
                  <input type="number" class="form-control" id="u2-ttl" value="${s.ttl}" onchange="NetworkLabs.state.u2.ttl = parseInt(this.value, 10)">
                </div>
              </div>
            </div>

            <!-- Capa 2: Enlace de Datos -->
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 1rem; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #6ee7b7;">Capa 2: Enlace de Datos (Trama Ethernet)</strong>
                <span class="badge" style="background: #10b981; color: white;">PDU: Trama</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 0.5rem;">
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">MAC Origen (NIC):</label>
                  <input type="text" class="form-control" value="${s.srcMac}" readonly>
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: #94a3b8;">MAC Destino:</label>
                  <input type="text" class="form-control" value="${s.destMac}" readonly>
                </div>
              </div>
              <label style="font-size: 0.75rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: #fca5a5;">
                <input type="checkbox" ${s.corruptFcs ? 'checked' : ''} onchange="NetworkLabs.state.u2.corruptFcs = this.checked">
                Simular corrupción de suma de verificación FCS (CRC-32 erróneo)
              </label>
            </div>

          </div>

          <button class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.8rem;" onclick="NetworkLabs.validateU2Encapsulation()">
            <span>⚡</span> Validar Encapsulado y Transmitir Trama
          </button>
        </div>

        <!-- Panel de Diagnóstico -->
        <div class="calc-results-card">
          <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
            <span>🔬</span> Inspector de Cabeceras & Diagnóstico
          </h4>
          <div id="u2-feedback-box" style="background: #0f172a; padding: 1rem; border-radius: 8px; border: 1px solid #1e293b; min-height: 280px; font-size: 0.82rem; line-height: 1.6; color: #cbd5e1;">
            <p>Configura los campos de cada capa y haz clic en "Validar Encapsulado y Transmitir Trama".</p>
            <p style="color: #94a3b8; font-size: 0.78rem;">
              Prueba cambiar el puerto de destino (ej. 80 para HTTP vs 21 para FTP), o poner el TTL en 0, o activar la casilla de CRC corrupto para ver cómo la pila rechaza la trama.
            </p>
          </div>
        </div>

      </div>
    `;
  },

  validateU2Encapsulation() {
    const s = this.state.u2;
    const fb = document.getElementById('u2-feedback-box');
    if (!fb) return;

    // Validación 1: Desajuste de Puerto vs Protocolo
    if (s.appProtocol === 'HTTP' && s.destPort !== 80 && s.destPort !== 8080) {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <h4 style="margin-bottom: 0.4rem;">❌ ERROR EN CAPA 4 (TRANSPORTE)</h4>
          <p><strong>Puerto de Destino Inválido:</strong> Has configurado el protocolo HTTP (Web) pero el puerto destino es el <strong>${s.destPort}</strong> en lugar del estándar <strong>80 (o 8080)</strong>.</p>
          <div style="background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem;">
            <strong>💡 Lección:</strong> El IANA asigna puertos bien conocidos (0-1023). HTTP opera en el puerto 80/TCP. Si el puerto no coincide, el servidor receptor responderá un paquete <em>TCP Reset (RST)</em> cerrando la conexión.
          </div>
          <button class="btn btn-sm btn-accent" style="margin-top: 0.6rem;" onclick="document.getElementById('u2-dest-port').value = 80; NetworkLabs.state.u2.destPort = 80; NetworkLabs.validateU2Encapsulation();">
            ✓ Corregir Puerto a 80
          </button>
        </div>
      `;
      return;
    }

    // Validación 2: Protocolo de transporte incorrecto para HTTP
    if (s.appProtocol === 'HTTP' && s.transportProtocol === 'UDP') {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <h4 style="margin-bottom: 0.4rem;">❌ ERROR DE PROTOCOLO EN CAPA 4</h4>
          <p><strong>Desajuste de Conexión:</strong> HTTP/1.1 y HTTP/2 requieren estrictamente <strong>TCP</strong> para garantizar entrega fiable y ordenada. UDP no establece sesión 3-Way Handshake ni garantiza acuse de recibo (ACK).</p>
          <div style="background: rgba(245,158,11,0.15); border-left: 3px solid #f59e0b; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem; color: #fde047;">
            <strong>💡 Lección:</strong> UDP solo se emplea en DNS (53), DHCP (67/68) o streaming en tiempo real.
          </div>
        </div>
      `;
      return;
    }

    // Validación 3: TTL = 0
    if (s.ttl <= 0) {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <h4 style="margin-bottom: 0.4rem;">❌ ERROR EN CAPA 3 (RED): TTL EXPIRADO</h4>
          <p><strong>Time To Live Agotado (TTL = ${s.ttl}):</strong> El campo TTL evita que los datagramas circulen infinitamente por la red debido a bucles de enrutamiento. Al llegar a 0, el router descarta inmediatamente el paquete y devuelve un mensaje <em>ICMP Time Exceeded (Tipo 11)</em>.</p>
          <button class="btn btn-sm btn-accent" style="margin-top: 0.6rem;" onclick="document.getElementById('u2-ttl').value = 64; NetworkLabs.state.u2.ttl = 64; NetworkLabs.validateU2Encapsulation();">
            ✓ Restaurar TTL a 64
          </button>
        </div>
      `;
      return;
    }

    // Validación 4: FCS Corrupto
    if (s.corruptFcs) {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <h4 style="margin-bottom: 0.4rem;">❌ ERROR EN CAPA 2 (ENLACE): FCS CRC-32 INVÁLIDO</h4>
          <p><strong>Trama Descartada por Error de Redundancia Cíclica:</strong> La tarjeta de red (NIC) receptora recalculó el código polinomial CRC sobre la trama y difiere del campo FCS. La trama se descarta silenciosamente en hardware sin notificar al sistema operativo.</p>
        </div>
      `;
      return;
    }

    // Encapsulado Perfecto
    fb.innerHTML = `
      <div style="color: #10b981;">
        <h4 style="margin-bottom: 0.4rem;">✓ ¡ENCAPSULADO PERFECTO Y ENTREGADO!</h4>
        <p>La PDU se ensambló siguiendo rigurosamente las especificaciones de la arquitectura TCP/IP y el Modelo OSI:</p>
        <div style="background: #020617; padding: 0.8rem; border-radius: 6px; font-family: monospace; font-size: 0.75rem; margin-top: 0.6rem; line-height: 1.5; color: #e2e8f0;">
          [Ethernet II: MAC Origen: ${s.srcMac} | MAC Destino: ${s.destMac} | EtherType: 0x0800]<br>
          ↳ [IPv4: IP Origen: ${s.srcIp} | IP Destino: ${s.destIp} | TTL: ${s.ttl} | Protocolo: 6 (TCP)]<br>
          &nbsp;&nbsp;↳ [TCP: Puerto Origen: ${s.srcPort} | Puerto Destino: ${s.destPort} | SYN=1 | ACK=0]<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↳ [HTTP Payload: "GET /index.html HTTP/1.1"]<br>
          [FCS: CRC-32 0x7A9B124F ✓ VÁLIDO]
        </div>
        <p style="font-size: 0.78rem; color: #a7f3d0; margin-top: 0.6rem;">
          El servidor web procesó el request y respondió con código <strong>HTTP 200 OK</strong>.
        </p>
      </div>
    `;

    if (window.AcademicProgression) {
      window.AcademicProgression.recordExerciseDone('ex_2_1');
    }
  },

  // ==============================================================
  // PRÁCTICA U3: CONMUTACIÓN L2, TABLA CAM Y VLANs
  // ==============================================================
  renderLabU3(container) {
    const s = this.state.u3;
    container.innerHTML = `
      <div class="lab-workspace-header">
        <div>
          <span class="lab-badge">PRÁCTICA ACTIVA • UNIDAD 3</span>
          <h3>Laboratorio de Conmutación Capa 2, Aprendizaje CAM & Segmentación VLAN</h3>
          <p>Experimenta cómo un switch aprende direcciones MAC, aísla dominios de difusión con VLANs 802.1Q e implementa enrutamiento inter-VLAN.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
        
        <div>
          <!-- Switch Físico de 6 Puertos -->
          <div style="background: #030712; border: 2px solid #334155; border-radius: 12px; padding: 1.2rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-weight: bold; color: #38bdf8; font-size: 0.9rem;">SWITCH GESTIONABLE L2 (CISCO CATALYST 2960)</span>
              <span style="font-size: 0.75rem; color: #10b981;">● Spanning Tree Activo (RSTP 802.1w)</span>
            </div>

            <!-- Puertos 1 al 6 -->
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; margin-bottom: 1rem;">
              ${[1, 2, 3, 4, 5, 6].map(p => {
                const vlan = s.vlans[`port${p}`];
                const color = vlan === 10 ? '#38bdf8' : (vlan === 20 ? '#10b981' : '#f59e0b');
                return `
                  <div style="background: #0f172a; border: 1px solid ${color}; border-radius: 6px; padding: 0.5rem 0.2rem; text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: bold; color: #f8fafc;">P${p}</div>
                    <div style="width: 10px; height: 10px; background: #10b981; border-radius: 50%; margin: 0.3rem auto;"></div>
                    <div style="font-size: 0.65rem; color: ${color}; font-weight: bold;">VLAN ${vlan}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Asignación de VLANs a Puertos -->
            <div style="background: #0f172a; padding: 0.8rem; border-radius: 8px; font-size: 0.78rem;">
              <strong>Configuración de Puertos de Acceso:</strong>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 0.4rem;">
                <div>
                  Puertos 1-2: 
                  <select class="form-control" onchange="NetworkLabs.state.u3.vlans.port1 = parseInt(this.value); NetworkLabs.state.u3.vlans.port2 = parseInt(this.value); NetworkLabs.renderLabU3(document.getElementById('network-lab-workspace'));">
                    <option value="10" ${s.vlans.port1 === 10 ? 'selected' : ''}>VLAN 10 (Ventas)</option>
                    <option value="20" ${s.vlans.port1 === 20 ? 'selected' : ''}>VLAN 20 (Finanzas)</option>
                  </select>
                </div>
                <div>
                  Puertos 3-4: 
                  <select class="form-control" onchange="NetworkLabs.state.u3.vlans.port3 = parseInt(this.value); NetworkLabs.state.u3.vlans.port4 = parseInt(this.value); NetworkLabs.renderLabU3(document.getElementById('network-lab-workspace'));">
                    <option value="10" ${s.vlans.port3 === 10 ? 'selected' : ''}>VLAN 10 (Ventas)</option>
                    <option value="20" ${s.vlans.port3 === 20 ? 'selected' : ''}>VLAN 20 (Finanzas)</option>
                  </select>
                </div>
                <div>
                  Puertos 5-6: 
                  <select class="form-control" onchange="NetworkLabs.state.u3.vlans.port5 = parseInt(this.value); NetworkLabs.state.u3.vlans.port6 = parseInt(this.value); NetworkLabs.renderLabU3(document.getElementById('network-lab-workspace'));">
                    <option value="30" ${s.vlans.port5 === 30 ? 'selected' : ''}>VLAN 30 (Sistemas)</option>
                    <option value="10" ${s.vlans.port5 === 10 ? 'selected' : ''}>VLAN 10 (Ventas)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <!-- Prueba de Ping entre Puertos -->
          <div class="calc-results-card">
            <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
              <span>⚡</span> Prueba de Comunicación entre Equipos
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 0.8rem;">
              <div>
                <label style="font-size: 0.75rem; color: #94a3b8;">Host Emisor (Puerto):</label>
                <select class="form-control" id="u3-src-p" onchange="NetworkLabs.state.u3.srcPort = parseInt(this.value)">
                  <option value="1" ${s.srcPort === 1 ? 'selected' : ''}>Puerto 1 - PC-Ventas1 (VLAN ${s.vlans.port1})</option>
                  <option value="2" ${s.srcPort === 2 ? 'selected' : ''}>Puerto 2 - PC-Ventas2 (VLAN ${s.vlans.port2})</option>
                  <option value="3" ${s.srcPort === 3 ? 'selected' : ''}>Puerto 3 - PC-Finanzas1 (VLAN ${s.vlans.port3})</option>
                  <option value="5" ${s.srcPort === 5 ? 'selected' : ''}>Puerto 5 - PC-Sistemas (VLAN ${s.vlans.port5})</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.75rem; color: #94a3b8;">Host Receptor (Puerto):</label>
                <select class="form-control" id="u3-dst-p" onchange="NetworkLabs.state.u3.dstPort = parseInt(this.value)">
                  <option value="2" ${s.dstPort === 2 ? 'selected' : ''}>Puerto 2 - PC-Ventas2 (VLAN ${s.vlans.port2})</option>
                  <option value="3" ${s.dstPort === 3 ? 'selected' : ''}>Puerto 3 - PC-Finanzas1 (VLAN ${s.vlans.port3})</option>
                  <option value="4" ${s.dstPort === 4 ? 'selected' : ''}>Puerto 4 - PC-Finanzas2 (VLAN ${s.vlans.port4})</option>
                  <option value="6" ${s.dstPort === 6 ? 'selected' : ''}>Puerto 6 - Servidor (VLAN ${s.vlans.port6})</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 0.6rem; align-items: center; margin-bottom: 0.8rem;">
              <button class="btn btn-primary" onclick="NetworkLabs.testU3Switching()">
                <span>⚡</span> Transmitir Trama en Switch
              </button>
              <label style="font-size: 0.75rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;">
                <input type="checkbox" ${s.interVlanRouter ? 'checked' : ''} onchange="NetworkLabs.state.u3.interVlanRouter = this.checked">
                Activar Enrutador Inter-VLAN (Capa 3 / Router-on-a-Stick)
              </label>
            </div>
          </div>
        </div>

        <!-- Tabla CAM y Diagnóstico -->
        <div>
          <!-- Tabla CAM Dinámica -->
          <div class="calc-results-card" style="margin-bottom: 1rem;">
            <h4 style="color: var(--primary-light); margin-bottom: 0.6rem; font-size: 0.95rem;">
              <span>📋</span> Tabla CAM de Direcciones MAC (Content Addressable Memory)
            </h4>
            <table style="width: 100%; font-size: 0.75rem; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid #334155; color: #94a3b8;">
                  <th style="padding: 0.3rem;">Puerto</th>
                  <th style="padding: 0.3rem;">Dirección MAC</th>
                  <th style="padding: 0.3rem;">VLAN</th>
                  <th style="padding: 0.3rem;">Aging Timer</th>
                </tr>
              </thead>
              <tbody>
                ${s.camTable.map(entry => `
                  <tr style="border-bottom: 1px solid #1e293b; color: #f8fafc;">
                    <td style="padding: 0.3rem; font-weight: bold; color: #38bdf8;">FastEthernet 0/${entry.port}</td>
                    <td style="padding: 0.3rem; font-family: monospace;">${entry.mac}</td>
                    <td style="padding: 0.3rem;"><span class="badge" style="background: #1e293b; color: #38bdf8;">VLAN ${entry.vlan}</span></td>
                    <td style="padding: 0.3rem; color: #94a3b8;">${entry.age}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Diagnóstico de Conmutación -->
          <div class="calc-results-card" id="u3-diagnostic-box">
            <h4 style="color: #38bdf8; margin-bottom: 0.6rem; font-size: 0.95rem;">
              <span>🩺</span> Diagnóstico de Capa 2
            </h4>
            <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.5;" id="u3-feedback-text">
              Selecciona el puerto emisor y receptor y haz clic en "Transmitir Trama en Switch".
            </div>
          </div>
        </div>

      </div>
    `;
  },

  testU3Switching() {
    const s = this.state.u3;
    const srcVlan = s.vlans[`port${s.srcPort}`];
    const dstVlan = s.vlans[`port${s.dstPort}`];
    const box = document.getElementById('u3-feedback-text');
    if (!box) return;

    if (s.srcPort === s.dstPort) {
      box.innerHTML = `<span style="color: #f59e0b;">⚠️ Mismo puerto de entrada y salida; la trama se filtra inmediatamente.</span>`;
      return;
    }

    if (srcVlan !== dstVlan) {
      if (!s.interVlanRouter) {
        box.innerHTML = `
          <div style="color: #ef4444;">
            <strong style="font-size: 0.95rem;">❌ ERROR: Aislamiento Estricto de VLAN (IEEE 802.1Q)</strong>
            <p style="margin-top: 0.4rem; color: #fca5a5;">
              El Puerto ${s.srcPort} está asignado a la <strong>VLAN ${srcVlan}</strong> y el Puerto ${s.dstPort} está en la <strong>VLAN ${dstVlan}</strong>. 
              El switch separa lógicamente los dominios de difusión. En Capa 2 es físicamente imposible que las tramas crucen entre VLANs distintas sin un elemento de Capa 3.
            </p>
            <div style="background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 0.6rem; border-radius: 4px; margin-top: 0.6rem; font-size: 0.78rem;">
              <strong>💡 ¿Cómo solucionarlo?:</strong> Marca la casilla <em>"Activar Enrutador Inter-VLAN (Capa 3)"</em> o asigna ambos puertos a la misma VLAN.
            </div>
          </div>
        `;
        return;
      } else {
        box.innerHTML = `
          <div style="color: #10b981;">
            <strong style="font-size: 0.95rem;">✓ ¡ENRUTAMIENTO INTER-VLAN EXITOSO!</strong>
            <p style="margin-top: 0.4rem; color: #a7f3d0;">
              La trama salió de la VLAN ${srcVlan}, subió por el enlace troncal 802.1Q hacia el <strong>Router Inter-VLAN</strong>, el cual inspeccionó las direcciones IP de Capa 3 y la reencaminó hacia la VLAN ${dstVlan} entregándola en el Puerto ${s.dstPort}.
            </p>
          </div>
        `;
        return;
      }
    }

    // Misma VLAN
    box.innerHTML = `
      <div style="color: #10b981;">
        <strong style="font-size: 0.95rem;">✓ ¡CONMUTACIÓN LOCAL CAPA 2 EXITOSA
      if (window.StudentTracker && window.AuthSystem && window.AuthSystem.currentUser) {
        window.StudentTracker.recordLab(window.AuthSystem.currentUser.username, 'u3', 'Conmutación VLAN y Tabla CAM');
      }!</strong>
        <p style="margin-top: 0.4rem; color: #a7f3d0;">
          Ambos puertos pertenecen a la <strong>VLAN ${srcVlan}</strong>. El switch consultó su tabla CAM, verificó que el Puerto ${s.dstPort} aloja la MAC destino y realizó el reenvío directo (*Forwarding*) sin generar broadcast innecesario.
        </p>
      </div>
    `;

    if (window.AcademicProgression) {
      window.AcademicProgression.recordExerciseDone('ex_3_1');
    }
  },

  // ==============================================================
  // PRÁCTICA U4: LABORATORIO DE CERTIFICACIÓN FLUKE DSX
  // ==============================================================
  renderLabU4(container) {
    const s = this.state.u4;
    container.innerHTML = `
      <div class="lab-workspace-header">
        <div>
          <span class="lab-badge">PRÁCTICA ACTIVA • UNIDAD 4</span>
          <h3>Banco de Pruebas & Certificación de Cableado con Fluke Digital</h3>
          <p>Configura las condiciones físicas del cable de par trenzado (categoría, longitud, des-trenzado) y corre una prueba con el certificador de campo para detectar fallas normativas TIA-568.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem;">
        
        <!-- Configuración de Parámetros Físicos -->
        <div class="calc-results-card">
          <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
            <span>🛠️</span> Especificaciones del Enlace Físico
          </h4>

          <div class="form-group">
            <label>Categoría del Cable de Cobre:</label>
            <select class="form-control" onchange="NetworkLabs.state.u4.category = this.value">
              <option value="Cat5e" ${s.category === 'Cat5e' ? 'selected' : ''}>Categoría 5e (100 MHz, 1 Gbps)</option>
              <option value="Cat6" ${s.category === 'Cat6' ? 'selected' : ''}>Categoría 6 (250 MHz, 1 Gbps / 10G a 55m)</option>
              <option value="Cat6A" ${s.category === 'Cat6A' ? 'selected' : ''}>Categoría 6A (500 MHz, 10 Gbps a 100m)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
            <div>
              <label style="font-size: 0.78rem; color: #94a3b8;">Norma Extremo A (Jack):</label>
              <select class="form-control" onchange="NetworkLabs.state.u4.standardA = this.value">
                <option value="T568B" ${s.standardA === 'T568B' ? 'selected' : ''}>T568B (Comercial)</option>
                <option value="T568A" ${s.standardA === 'T568A' ? 'selected' : ''}>T568A</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.78rem; color: #94a3b8;">Norma Extremo B (Patch):</label>
              <select class="form-control" onchange="NetworkLabs.state.u4.standardB = this.value">
                <option value="T568B" ${s.standardB === 'T568B' ? 'selected' : ''}>T568B</option>
                <option value="T568A" ${s.standardB === 'T568A' ? 'selected' : ''}>T568A</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Longitud del Cable Horizontal: <strong id="u4-len-val" style="color: #38bdf8;">${s.lengthMeters} metros</strong></label>
            <input type="range" min="10" max="150" value="${s.lengthMeters}" class="form-control" oninput="NetworkLabs.state.u4.lengthMeters = parseInt(this.value); document.getElementById('u4-len-val').innerText = this.value + ' metros';">
            <span style="font-size: 0.72rem; color: #94a3b8;">Límite normativo TIA-568 para enlace permanente: 90 metros.</span>
          </div>

          <div class="form-group">
            <label>Des-trenzado de Hilos en Conector: <strong id="u4-untwist-val" style="color: #38bdf8;">${s.untwistMm} mm</strong></label>
            <input type="range" min="5" max="40" value="${s.untwistMm}" class="form-control" oninput="NetworkLabs.state.u4.untwistMm = parseInt(this.value); document.getElementById('u4-untwist-val').innerText = this.value + ' mm';">
            <span style="font-size: 0.72rem; color: #94a3b8;">Límite máximo permitido por norma: 13 mm (0.5 pulgadas).</span>
          </div>

          <button class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" onclick="NetworkLabs.runFlukeCertification()">
            <span>📉</span> Ejecutar Prueba de Certificación Fluke DSX
          </button>
        </div>

        <!-- Pantalla del Certificador Fluke -->
        <div style="background: #020617; border: 3px solid #f59e0b; border-radius: 12px; padding: 1.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 0.6rem; margin-bottom: 1rem;">
            <div style="font-weight: bold; color: #f59e0b; font-size: 1rem; letter-spacing: 0.5px;">FLUKE NETWORKS • DSX-8000 CABLEANALYZER</div>
            <span style="font-size: 0.75rem; color: #94a3b8;">TIA Cat 6 Perm. Link</span>
          </div>

          <div id="u4-fluke-screen">
            <div style="text-align: center; padding: 2rem 1rem; color: #64748b;">
              <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">📟</span>
              Presiona "Ejecutar Prueba de Certificación Fluke DSX" para analizar la reflectometría, paradiafonía (NEXT) y pérdidas del enlace.
            </div>
          </div>
        </div>

      </div>
    `;
  },

  runFlukeCertification() {
    if (window.StudentTracker && window.AuthSystem && window.AuthSystem.currentUser) {
      window.StudentTracker.recordLab(window.AuthSystem.currentUser.username, 'u4', 'Certificación TIA/EIA Fluke');
    }
    const s = this.state.u4;
    const screen = document.getElementById('u4-fluke-screen');
    if (!screen) return;

    let hasError = false;
    let errorTitle = '';
    let errorDesc = '';
    let errorFix = '';

    // 1. Error de Longitud > 90m
    if (s.lengthMeters > 90) {
      hasError = true;
      errorTitle = 'FAIL: LENGTH EXCEEDED (LÍMITE SUPERADO)';
      errorDesc = `La longitud medida es de <strong>${s.lengthMeters} metros</strong>. El estándar ANSI/TIA-568.2-D prohíbe enlaces permanentes superiores a 90 metros debido a la atenuación acumulada de la señal en cobre.`;
      errorFix = 'Reduce la distancia a 90 metros o menos, o proyecta un Cuarto de Telecomunicaciones (TR) adicional.';
    }
    // 2. Error de NEXT por des-trenzado > 13mm
    else if (s.untwistMm > 13) {
      hasError = true;
      errorTitle = 'FAIL: NEXT (PARADIAFONÍA CERCANA REPROBADA)';
      errorDesc = `Margen NEXT: <strong>-3.8 dB (REPROBADO)</strong>. El des-trenzado al ponchar fue de <strong>${s.untwistMm} mm</strong> (máximo permitido: 13 mm). Al separar los pares se elimina el efecto de cancelación mutua de ruido electromagnético.`;
      errorFix = 'Recorta el cable y vuelve a crimpar asegurando que los pares mantengan su trenzado original hasta a menos de 13 mm del punto de contacto.';
    }
    // 3. Cable cruzado accidental
    else if (s.standardA !== s.standardB) {
      hasError = true;
      errorTitle = 'FAIL: WIREMAP CROSSOVER DETECTADO';
      errorDesc = `Extremo A ponchado en <strong>${s.standardA}</strong> y Extremo B en <strong>${s.standardB}</strong>. Esto crea un cable cruzado (pares 2 y 3 invertidos). El cableado estructurado horizontal exige la misma norma en ambos extremos.`;
      errorFix = 'Estandariza ambos extremos con la misma combinación (ej. T568B en ambos lados).';
    }

    if (hasError) {
      screen.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 2px solid #ef4444; border-radius: 8px; padding: 1rem; color: #fca5a5;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <strong style="color: #ef4444; font-size: 1.1rem;">❌ ${errorTitle}</strong>
            <span style="background: #ef4444; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem;">FAIL</span>
          </div>
          <p style="font-size: 0.82rem; line-height: 1.5; color: #fecaca; margin-bottom: 0.6rem;">
            ${errorDesc}
          </p>
          <div style="background: #0f172a; border-left: 3px solid #f59e0b; padding: 0.6rem; border-radius: 4px; font-size: 0.78rem; color: #fde047;">
            <strong>🛠️ Acción Correctiva Sugerida:</strong> ${errorFix}
          </div>
        </div>
      `;
    } else {
      screen.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 8px; padding: 1rem; color: #a7f3d0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <strong style="color: #10b981; font-size: 1.1rem;">✓ PASS: ENLACE 100% CERTIFICADO</strong>
            <span style="background: #10b981; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem;">PASS</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.78rem; margin-top: 0.8rem; color: #e2e8f0;">
            <div style="background: #0f172a; padding: 0.4rem 0.6rem; border-radius: 4px;">Longitud: <strong>${s.lengthMeters} m</strong> (Límite 90m) ✓</div>
            <div style="background: #0f172a; padding: 0.4rem 0.6rem; border-radius: 4px;">Margen NEXT: <strong>+6.4 dB (Excelente)</strong> ✓</div>
            <div style="background: #0f172a; padding: 0.4rem 0.6rem; border-radius: 4px;">Pérdida Retorno: <strong>+4.9 dB (Pasa)</strong> ✓</div>
            <div style="background: #0f172a; padding: 0.4rem 0.6rem; border-radius: 4px;">Atenuación: <strong>14.2 dB (Dentro de norma)</strong> ✓</div>
          </div>
          <p style="font-size: 0.78rem; color: #6ee7b7; margin-top: 0.8rem;">
            El enlace cumple plenamente con los requisitos de la norma ANSI/TIA-568.2-D Categoría 6 y califica para la garantía de 25 años del fabricante.
          </p>
        </div>
      `;

      if (window.AcademicProgression) {
        window.AcademicProgression.recordExerciseDone('ex_4_1');
      }
    }
  },

  // ==============================================================
  // PRÁCTICA U5: PROYECTO INTEGRADOR DE DISEÑO, VLSM & FHRP
  // ==============================================================
  renderLabU5(container) {
    const s = this.state.u5;
    container.innerHTML = `
      <div class="lab-workspace-header">
        <div>
          <span class="lab-badge">PRÁCTICA ACTIVA • UNIDAD 5</span>
          <h3>Laboratorio de Diseño de Red Organizacional: VLSM, PoE & Gateway FHRP</h3>
          <p>Aplica ingeniería de redes completa: dimensiona subredes VLSM, calcula el presupuesto PoE del switch y prueba la tolerancia a caídas de routers de salida.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.5rem;">
        
        <div>
          <!-- Módulo VLSM -->
          <div class="calc-results-card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
              <span>🔢</span> 1. Plan de Direccionamiento VLSM (Base: ${s.baseNetwork})
            </h4>
            <div style="display: grid; gap: 0.6rem; font-size: 0.8rem;">
              
              <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px; border: 1px solid #1e293b;">
                <strong>Subred 1: Laboratorios de Cómputo (Req: 60 hosts)</strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.3rem;">
                  <div>
                    Máscara CIDR: 
                    <select class="form-control" id="u5-mask-lab" onchange="NetworkLabs.state.u5.subnets.lab.mask = this.value">
                      <option value="26" ${s.subnets.lab.mask === '26' ? 'selected' : ''}>/26 (62 hosts útiles) ✓</option>
                      <option value="27" ${s.subnets.lab.mask === '27' ? 'selected' : ''}>/27 (30 hosts - Insuficiente)</option>
                    </select>
                  </div>
                  <div>
                    IP de Red:
                    <input type="text" class="form-control" value="192.168.10.0" readonly>
                  </div>
                </div>
              </div>

              <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px; border: 1px solid #1e293b;">
                <strong>Subred 2: Área Administrativa (Req: 20 hosts)</strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.3rem;">
                  <div>
                    Máscara CIDR: 
                    <select class="form-control" id="u5-mask-adm" onchange="NetworkLabs.state.u5.subnets.admin.mask = this.value">
                      <option value="27" ${s.subnets.admin.mask === '27' ? 'selected' : ''}>/27 (30 hosts útiles) ✓</option>
                      <option value="26" ${s.subnets.admin.mask === '26' ? 'selected' : ''}>/26 (Desperdicio)</option>
                    </select>
                  </div>
                  <div>
                    IP de Red:
                    <input type="text" class="form-control" value="192.168.10.64" readonly>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Módulo Presupuesto PoE -->
          <div class="calc-results-card">
            <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
              <span>⚡</span> 2. Presupuesto de Potencia PoE del Switch
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.8rem;">
              <div>
                <label>Número de APs Wi-Fi 6:</label>
                <input type="number" class="form-control" id="u5-poe-count" value="${s.poeDevicesCount}" min="1" max="24" onchange="NetworkLabs.state.u5.poeDevicesCount = parseInt(this.value)">
              </div>
              <div>
                <label>Estándar PoE:</label>
                <select class="form-control" onchange="NetworkLabs.state.u5.poeStandard = this.value">
                  <option value="802.3at" ${s.poeStandard === '802.3at' ? 'selected' : ''}>PoE+ (802.3at - 30W por puerto)</option>
                  <option value="802.3af" ${s.poeStandard === '802.3af' ? 'selected' : ''}>PoE (802.3af - 15.4W)</option>
                </select>
              </div>
            </div>
            <div style="margin-top: 0.6rem; font-size: 0.78rem; color: #94a3b8;">
              Capacidad de Fuente PoE del Switch: <strong>${s.switchPoeBudgetWatts} Watts</strong>
            </div>
          </div>
        </div>

        <!-- Módulo Tolerancia a Fallas FHRP & Resultados -->
        <div>
          <!-- Simulador de Caída de Gateway FHRP -->
          <div class="calc-results-card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--primary-light); margin-bottom: 0.8rem;">
              <span>🛡️</span> 3. Redundancia de Primer Salto (HSRP / VRRP)
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
              <div style="background: ${s.primaryRouterOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border: 1px solid ${s.primaryRouterOnline ? '#10b981' : '#ef4444'}; padding: 0.6rem; border-radius: 6px; text-align: center;">
                <div style="font-size: 0.8rem; font-weight: bold; color: ${s.primaryRouterOnline ? '#34d399' : '#fca5a5'};">ROUTER 1 (ACTIVO)</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">IP Física: 192.168.10.252</div>
                <button class="btn btn-sm ${s.primaryRouterOnline ? 'btn-danger' : 'btn-primary'}" style="margin-top: 0.4rem; padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="NetworkLabs.state.u5.primaryRouterOnline = !NetworkLabs.state.u5.primaryRouterOnline; NetworkLabs.renderLabU5(document.getElementById('network-lab-workspace'));">
                  ${s.primaryRouterOnline ? '⚡ Desconectar R1' : '✓ Conectar R1'}
                </button>
              </div>

              <div style="background: ${s.standbyRouterOnline ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border: 1px solid ${s.standbyRouterOnline ? '#38bdf8' : '#ef4444'}; padding: 0.6rem; border-radius: 6px; text-align: center;">
                <div style="font-size: 0.8rem; font-weight: bold; color: ${s.standbyRouterOnline ? '#38bdf8' : '#fca5a5'};">ROUTER 2 (STANDBY)</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">IP Física: 192.168.10.253</div>
                <div style="font-size: 0.7rem; color: #10b981; margin-top: 0.5rem;">● En Espera Activa</div>
              </div>
            </div>

            <div style="background: #0f172a; padding: 0.6rem; border-radius: 6px; font-size: 0.75rem; color: #cbd5e1; text-align: center;">
              Puerta de Enlace Virtual (VIP): <strong>192.168.10.254</strong> (MAC Virtual HSRP)
            </div>
          </div>

          <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem; padding: 0.8rem;" onclick="NetworkLabs.validateU5Project()">
            <span>✅</span> Validar Diseño Organizacional & Conmutación WAN
          </button>

          <!-- Diagnóstico Final U5 -->
          <div class="calc-results-card" id="u5-feedback-box">
            <h4 style="color: #38bdf8; margin-bottom: 0.6rem; font-size: 0.95rem;">
              <span>📋</span> Auditoría Técnica del Proyecto
            </h4>
            <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.5;">
              Haz clic en "Validar Diseño Organizacional" para auditar VLSM, consumo PoE y supervivencia ante caída de router.
            </div>
          </div>
        </div>

      </div>
    `;
  },

  validateU5Project() {
    if (window.StudentTracker && window.AuthSystem && window.AuthSystem.currentUser) {
      window.StudentTracker.recordLab(window.AuthSystem.currentUser.username, 'u5', 'Proyecto Integrador de Red Empresarial');
    }
    const s = this.state.u5;
    const fb = document.getElementById('u5-feedback-box');
    if (!fb) return;

    // Validar VLSM
    if (s.subnets.lab.mask !== '26') {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <strong>❌ ERROR EN VLSM (SUBRED 1 INSUFICIENTE):</strong>
          <p style="margin-top: 0.3rem;">Los Laboratorios requieren 60 computadoras. La máscara /27 solo provee 30 hosts útiles, lo que dejaría a 30 máquinas sin conexión.</p>
        </div>
      `;
      return;
    }

    // Validar PoE
    const wattsPerPort = s.poeStandard === '802.3at' ? 30 : 15.4;
    const totalWattsNeeded = s.poeDevicesCount * wattsPerPort;
    if (totalWattsNeeded > s.switchPoeBudgetWatts) {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <strong>❌ ERROR: SOBRECARGA EN FUENTE POE DEL SWITCH</strong>
          <p style="margin-top: 0.3rem;">
            ${s.poeDevicesCount} dispositivos a ${wattsPerPort}W demandan <strong>${totalWattsNeeded} Watts</strong>, superando los <strong>${s.switchPoeBudgetWatts} Watts</strong> de la fuente del switch.
          </p>
        </div>
      `;
      return;
    }

    // Validar FHRP
    if (!s.primaryRouterOnline && !s.standbyRouterOnline) {
      fb.innerHTML = `
        <div style="color: #ef4444;">
          <strong>❌ ERROR: CAÍDA TOTAL DE ACCESO A INTERNET</strong>
          <p style="margin-top: 0.3rem;">Ambos routers están fuera de línea. La IP virtual de salida es inalcanzable.</p>
        </div>
      `;
      return;
    }

    const gatewayServing = s.primaryRouterOnline ? 'Router 1 (Primario Activo)' : 'Router 2 (Standby asumió el control en 2.8s por HSRP/VRRP)';

    fb.innerHTML = `
      <div style="color: #10b981;">
        <strong style="font-size: 1rem;">✓ ¡DISEÑO DE RED APROBADO Y RESILIENTE!</strong>
        <div style="font-size: 0.8rem; margin-top: 0.5rem; line-height: 1.6; color: #a7f3d0;">
          • <strong>VLSM Óptimo:</strong> Subred 1 (/26 - 62 hosts) y Subred 2 (/27 - 30 hosts) sin colisiones binarias.<br>
          • <strong>PoE Sostenible:</strong> Demanda de ${totalWattsNeeded}W dentro de la capacidad de ${s.switchPoeBudgetWatts}W (Margen del ${Math.round((1 - totalWattsNeeded / s.switchPoeBudgetWatts) * 100)}%).<br>
          • <strong>Alta Disponibilidad:</strong> Tráfico canalizado a través de <strong>${gatewayServing}</strong> sin pérdida de paquetes para los usuarios.
        </div>
      </div>
    `;

    if (window.AcademicProgression) {
      window.AcademicProgression.recordExerciseDone('ex_5_1');
    }
  }
};

window.NetworkLabs = NetworkLabs;
