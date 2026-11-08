/**
 * SIMULADORES INTERACTIVOS DE REDES DE COMPUTADORAS
 * UNIVERSIDAD AZTLÁN - CLAVE 634
 */

// ==========================================
// 1. SIMULADOR DE TOPOLOGÍAS DE RED (UNIDAD 1)
// ==========================================
class TopologySimulator {
  constructor(canvasId, logContainerId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.logBox = document.getElementById(logContainerId);
    this.currentTopology = 'star';
    this.nodes = [];
    this.links = [];
    this.packets = [];
    this.selectedNode = null;
    this.animating = false;
    this.isDragging = false;
    this.draggedNode = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.initEvents();
    this.loadTopology('star');
    this.startAnimationLoop();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : null;
    this.canvas.width = (rect && rect.width > 0) ? rect.width : 800;
    this.canvas.height = 420;
    if (this.nodes && this.nodes.length) {
      this.repositionNodes();
    }
  }

  log(msg, type = 'info') {
    if (!this.logBox) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `log-line log-${type}`;
    line.innerHTML = `<span class="log-time">[${time}]</span> ${msg}`;
    this.logBox.prepend(line);
    while (this.logBox.children.length > 30) {
      this.logBox.removeChild(this.logBox.lastChild);
    }
  }

  loadTopology(type) {
    this.currentTopology = type;
    this.nodes = [];
    this.links = [];
    this.packets = [];
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    if (type === 'star') {
      // Switch central y 5 PCs periféricas
      const hub = { id: 'HUB-Central', label: 'Switch Central', x: cx, y: cy, type: 'switch', online: true };
      this.nodes.push(hub);
      const count = 5;
      const radius = Math.min(w, h) * 0.35;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        const pc = {
          id: `PC-${i + 1}`,
          label: `Estación ${i + 1}`,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          type: 'pc',
          online: true
        };
        this.nodes.push(pc);
        this.links.push({ from: hub.id, to: pc.id, active: true });
      }
      this.log('Topología en Estrella cargada. Cada estación se conecta a un punto central (Switch). Un fallo en una PC no afecta al resto; un fallo en el centro colapsa la red.', 'info');
    } else if (type === 'bus') {
      // Bus troncal horizontal con derivaciones
      const count = 5;
      const startX = w * 0.15;
      const stepX = (w * 0.7) / (count - 1);
      const spineY = cy;

      // Terminadores
      this.nodes.push({ id: 'Term-1', label: 'Terminador 50Ω', x: startX - 30, y: spineY, type: 'term', online: true });
      this.nodes.push({ id: 'Term-2', label: 'Terminador 50Ω', x: startX + (count - 1) * stepX + 30, y: spineY, type: 'term', online: true });
      this.links.push({ from: 'Term-1', to: 'Term-2', active: true, isBus: true });

      for (let i = 0; i < count; i++) {
        const x = startX + i * stepX;
        const tap = { id: `Tap-${i + 1}`, label: `Vampiro/T-${i + 1}`, x: x, y: spineY, type: 'tap', online: true };
        const pc = {
          id: `PC-${i + 1}`,
          label: `PC ${i + 1}`,
          x: x,
          y: (i % 2 === 0) ? spineY - 90 : spineY + 90,
          type: 'pc',
          online: true
        };
        this.nodes.push(tap);
        this.nodes.push(pc);
        this.links.push({ from: tap.id, to: pc.id, active: true });
      }
      this.log('Topología en Bus cargada (Cable Coaxial 10BASE2/5). Todo el tráfico comparte el mismo medio físico. Requiere terminadores para evitar rebote de onda.', 'warn');
    } else if (type === 'ring') {
      // Anillo circular con paso de testigo (Token)
      const count = 6;
      const radius = Math.min(w, h) * 0.35;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        this.nodes.push({
          id: `Nodo-${i + 1}`,
          label: `Estación ${i + 1}`,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          type: 'pc',
          online: true
        });
      }
      for (let i = 0; i < count; i++) {
        const next = (i + 1) % count;
        this.links.push({ from: this.nodes[i].id, to: this.nodes[next].id, active: true });
      }
      this.log('Topología en Anillo cargada (Token Ring / FDDI). Los datos viajan en un único sentido. Si un nodo o enlace se corta sin anillo doble, la red colapsa.', 'info');
    } else if (type === 'mesh') {
      // Malla completa (Full Mesh)
      const count = 5;
      const radius = Math.min(w, h) * 0.35;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        this.nodes.push({
          id: `Router-${i + 1}`,
          label: `Router ${i + 1}`,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          type: 'router',
          online: true
        });
      }
      // Conectar todos con todos: n(n-1)/2 = 5*4/2 = 10 enlaces
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          this.links.push({ from: this.nodes[i].id, to: this.nodes[j].id, active: true });
        }
      }
      this.log('Topología en Malla Completa (Full Mesh) cargada. Fórmula de enlaces: n(n-1)/2 = 10 enlaces para 5 nodos. Máxima redundancia y tolerancia a fallos.', 'success');
    } else if (type === 'tree') {
      // Jerárquica / Árbol (Core -> Distribution -> Access)
      const core = { id: 'Core', label: 'Core Switch', x: cx, y: h * 0.18, type: 'core', online: true };
      const dist1 = { id: 'Dist-1', label: 'Dist Norte', x: cx - w * 0.22, y: h * 0.45, type: 'switch', online: true };
      const dist2 = { id: 'Dist-2', label: 'Dist Sur', x: cx + w * 0.22, y: h * 0.45, type: 'switch', online: true };
      this.nodes.push(core, dist1, dist2);
      this.links.push({ from: core.id, to: dist1.id, active: true });
      this.links.push({ from: core.id, to: dist2.id, active: true });

      const countLeaves = 2;
      for (let i = 0; i < countLeaves; i++) {
        const pc1 = { id: `PC-N${i + 1}`, label: `Acceso N${i + 1}`, x: cx - w * 0.32 + i * (w * 0.2), y: h * 0.8, type: 'pc', online: true };
        const pc2 = { id: `PC-S${i + 1}`, label: `Acceso S${i + 1}`, x: cx + w * 0.12 + i * (w * 0.2), y: h * 0.8, type: 'pc', online: true };
        this.nodes.push(pc1, pc2);
        this.links.push({ from: dist1.id, to: pc1.id, active: true });
        this.links.push({ from: dist2.id, to: pc2.id, active: true });
      }
      this.log('Topología en Árbol (Jerárquica) cargada. Empleada en campus corporativos: Capa de Núcleo (Core), Distribución y Acceso.', 'info');
    }
  }

  repositionNodes() {
    this.loadTopology(this.currentTopology);
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const clicked = this.findNodeAt(x, y);

      if (clicked) {
        if (e.shiftKey) {
          // Toggle online/offline (falla intencional)
          clicked.online = !clicked.online;
          this.log(`Nodo [${clicked.label}] ahora está: ${clicked.online ? 'ACTIVO' : 'EN FALLA / APAGADO'}`, clicked.online ? 'success' : 'error');
        } else {
          this.draggedNode = clicked;
          this.isDragging = true;
        }
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging && this.draggedNode) {
        const rect = this.canvas.getBoundingClientRect();
        this.draggedNode.x = e.clientX - rect.left;
        this.draggedNode.y = e.clientY - rect.top;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.draggedNode = null;
    });
  }

  findNodeAt(x, y) {
    return this.nodes.find(n => Math.hypot(n.x - x, n.y - y) <= 25);
  }

  sendPing() {
    const onlineNodes = this.nodes.filter(n => n.online && n.type !== 'term' && n.type !== 'tap');
    if (onlineNodes.length < 2) {
      this.log('No hay suficientes nodos activos para enviar un ping.', 'warn');
      return;
    }
    const src = onlineNodes[0];
    const dst = onlineNodes[onlineNodes.length - 1];

    this.log(`Iniciando Ping ICMP desde [${src.label}] hacia [${dst.label}]...`, 'info');

    // Create packet animation
    this.packets.push({
      fromNode: src,
      toNode: dst,
      currentNode: src,
      progress: 0,
      speed: 0.015,
      route: this.calculateRoute(src, dst)
    });
  }

  calculateRoute(src, dst) {
    // Dijkstra / BFS para encontrar camino de nodos activos
    const queue = [[src]];
    const visited = new Set([src.id]);

    while (queue.length > 0) {
      const path = queue.shift();
      const curr = path[path.length - 1];

      if (curr.id === dst.id) {
        return path;
      }

      // Buscar vecinos conectados por enlaces activos
      const neighbors = [];
      this.links.forEach(l => {
        if (!l.active) return;
        if (l.isBus) {
          // In bus topology, taps along spine are all interconnected
          const taps = this.nodes.filter(n => (n.type === 'tap' || n.type === 'term') && n.online);
          if (curr.type === 'tap') {
            taps.forEach(t => { if (t.id !== curr.id) neighbors.push(t); });
          }
        }
        if (l.from === curr.id) {
          const n = this.nodes.find(node => node.id === l.to && node.online);
          if (n) neighbors.push(n);
        } else if (l.to === curr.id) {
          const n = this.nodes.find(node => node.id === l.from && node.online);
          if (n) neighbors.push(n);
        }
      });

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          queue.push([...path, neighbor]);
        }
      }
    }
    return null; // Ruta no encontrada (red particionada)
  }

  startAnimationLoop() {
    const loop = () => {
      this.updatePackets();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updatePackets() {
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      if (!p.route || p.route.length < 2) {
        this.log(`Fallo de entrega: Red dividida o ruta interrumpida por nodos en falla.`, 'error');
        this.packets.splice(i, 1);
        continue;
      }

      p.progress += p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
        p.route.shift(); // Siguiente salto
        if (p.route.length <= 1) {
          this.log(`¡Éxito! Paquete entregado a [${p.toNode.label}]. RTT = 12ms.`, 'success');
          this.packets.splice(i, 1);
        }
      }
    }
  }

  draw() {
    const { ctx, canvas } = this;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isLight) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dibujar enlaces
    this.links.forEach(link => {
      const fromNode = this.nodes.find(n => n.id === link.from);
      const toNode = this.nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      if (link.isBus) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
      } else if (!fromNode.online || !toNode.online) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Dibujar nodos
    this.nodes.forEach(node => {
      ctx.save();
      ctx.translate(node.x, node.y);

      // Sombra
      ctx.shadowBlur = node.online ? 12 : 2;
      ctx.shadowColor = node.online ? '#38bdf8' : '#ef4444';

      // Círculo principal
      ctx.beginPath();
      const r = (node.type === 'switch' || node.type === 'router' || node.type === 'core') ? 24 : 18;
      ctx.arc(0, 0, r, 0, Math.PI * 2);

      if (!node.online) {
        ctx.fillStyle = '#450a0a';
        ctx.strokeStyle = '#ef4444';
      } else if (node.type === 'switch' || node.type === 'core') {
        ctx.fillStyle = '#0369a1';
        ctx.strokeStyle = '#38bdf8';
      } else if (node.type === 'router') {
        ctx.fillStyle = '#4338ca';
        ctx.strokeStyle = '#818cf8';
      } else if (node.type === 'term') {
        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#f59e0b';
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
      }

      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();

      // Icono o texto central
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (!node.online) {
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('FALLA', 0, 0);
      } else if (node.type === 'switch') {
        ctx.fillText('SW', 0, 0);
      } else if (node.type === 'router') {
        ctx.fillText('RT', 0, 0);
      } else if (node.type === 'core') {
        ctx.fillText('CORE', 0, 0);
      } else if (node.type === 'term') {
        ctx.fillText('50Ω', 0, 0);
      } else {
        ctx.fillText('PC', 0, 0);
      }

      // Etiqueta abajo
      ctx.font = '11px Segoe UI, sans-serif';
      ctx.fillStyle = node.online ? (isLight ? '#0f172a' : '#e2e8f0') : '#94a3b8';
      ctx.fillText(node.label, 0, r + 15);

      ctx.restore();
    });

    // Dibujar paquetes en tránsito
    this.packets.forEach(p => {
      if (!p.route || p.route.length < 2) return;
      const n1 = p.route[0];
      const n2 = p.route[1];
      const px = n1.x + (n2.x - n1.x) * p.progress;
      const py = n1.y + (n2.y - n1.y) * p.progress;

      ctx.save();
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });
  }
}

// ==========================================
// 2. SIMULADOR DE ENCAPSULAMIENTO OSI (UNIDAD 2)
// ==========================================
class EncapsulationSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStep = 0;
    this.appData = 'GET /index.html HTTP/1.1';
    this.protocol = 'HTTP';
    this.render();
  }

  setProtocol(proto) {
    this.protocol = proto;
    if (proto === 'HTTP') this.appData = 'GET /portal-aztlan.html HTTP/1.1';
    else if (proto === 'DNS') this.appData = 'Query: www.aztlan.edu.mx (Type A)';
    else if (proto === 'FTP') this.appData = 'RETR silabo_redes_634.pdf';
    this.currentStep = 0;
    this.render();
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
      this.render();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  reset() {
    this.currentStep = 0;
    this.render();
  }

  render() {
    if (!this.container) return;

    const steps = [
      {
        num: 0,
        layer: 'Capa 7/6/5: Aplicación, Presentación, Sesión',
        name: 'DATOS DE USUARIO',
        color: '#ec4899',
        pdu: 'Datos',
        header: `Payload: "${this.appData}"`,
        desc: 'El usuario genera una solicitud desde el navegador o cliente. Los datos se formatean (ej. ASCII/JSON) y se establece la sesión de diálogo.'
      },
      {
        num: 1,
        layer: 'Capa 4: Transporte (TCP)',
        name: 'SEGMENTACIÓN Y PUERTOS',
        color: '#3b82f6',
        pdu: 'Segmento',
        header: `[TCP Hdr | Puerto Origen: 51240 | Puerto Destino: ${this.protocol === 'HTTP' ? '80/443' : this.protocol === 'DNS' ? '53' : '21'} | Seq#: 1001 | ACK: 0 | Flags: SYN]`,
        desc: 'Se divide la información en segmentos y se agregan los puertos para identificar el servicio exacto en los hosts emisor y receptor.'
      },
      {
        num: 2,
        layer: 'Capa 3: Red (IP)',
        name: 'DIRECCIONAMIENTO LÓGICO Y RUTEO',
        color: '#06b6d4',
        pdu: 'Paquete',
        header: `[IP Hdr | IP Origen: 192.168.1.50 | IP Destino: 200.33.170.12 | TTL: 64 | Protocolo: TCP (6)]`,
        desc: 'Se agrega la cabecera IP con las direcciones lógicas de origen y destino, más el tiempo de vida (TTL) para evitar bucles de enrutamiento infinitos.'
      },
      {
        num: 3,
        layer: 'Capa 2: Enlace de Datos (Ethernet IEEE 802.3)',
        name: 'ENTRAMADO Y DIRECCIONES MAC',
        color: '#10b981',
        pdu: 'Trama (Frame)',
        header: `[ETH Hdr | MAC Origen: 00:1A:2B:3C:4D:5E | MAC Destino: C0:FF:EE:99:88:77 | Tipo: 0x0800 (IPv4)] ... [FCS CRC-32: 0x7A9B1C]`,
        desc: 'Se encapsula el paquete en una trama, agregando direcciones MAC físicas del salto local y un código de verificación de redundancia cíclica (CRC/FCS) para detectar errores en el canal.'
      },
      {
        num: 4,
        layer: 'Capa 1: Física',
        name: 'SEÑALES Y BITS EN EL MEDIO',
        color: '#f59e0b',
        pdu: 'Bits',
        header: `Modulación: 01000111 01000101 01010100 00100000 00101111 ... (Voltajes ±2.5V o Pulsos de Luz)`,
        desc: 'La trama completa se codifica en pulsos eléctricos (UTP), pulsos de luz (Fibra Óptica) u ondas electromagnéticas de radio (Wi-Fi 802.11) para cruzar el medio físico.'
      },
      {
        num: 5,
        layer: 'Receptor (Desencapsulamiento)',
        name: 'LLEGADA Y VERIFICACIÓN EN DESTINO',
        color: '#a855f7',
        pdu: 'Procesamiento Inverso',
        header: `El Servidor valida CRC (sin errores), retira ETH, verifica IP Destino local, entrega al socket TCP y responde la petición HTTP.`,
        desc: '¡Desencapsulamiento completado con éxito! El receptor procesa de abajo hacia arriba cada cabecera y entrega el mensaje original a la aplicación.'
      }
    ];

    const current = steps[this.currentStep];

    this.container.innerHTML = `
      <div style="background: #0f172a; border: 1px solid #243552; border-radius: 12px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em;">Paso ${this.currentStep + 1} de 6</span>
            <h3 style="color: ${current.color}; margin-top: 0.2rem; font-size: 1.2rem;">${current.layer}</h3>
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm" onclick="encapSim.prevStep()" ${this.currentStep === 0 ? 'disabled' : ''}>◀ Anterior</button>
            <button class="btn btn-sm btn-primary" onclick="encapSim.nextStep()" ${this.currentStep === 5 ? 'disabled' : ''}>Siguiente Salto ▶</button>
            <button class="btn btn-sm" onclick="encapSim.reset()">Reiniciar</button>
          </div>
        </div>

        <div style="background: #020617; border: 2px solid ${current.color}; border-radius: 8px; padding: 1rem; margin-bottom: 1.2rem; font-family: monospace; font-size: 0.85rem; color: #f8fafc; overflow-x: auto;">
          <div style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 0.4rem;">PDU ACTIVO: <strong style="color: ${current.color};">${current.pdu}</strong></div>
          <div style="white-space: pre-wrap; line-height: 1.5;">${current.header}</div>
        </div>

        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem;">
          ${current.desc}
        </p>

        <!-- Visual Stack Representation -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; text-align: center;">
          <div style="background: ${this.currentStep >= 0 ? '#ec4899' : '#1e293b'}; color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; transition: all 0.3s;">
            DATOS
          </div>
          <div style="background: ${this.currentStep >= 1 ? '#3b82f6' : '#1e293b'}; color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; transition: all 0.3s;">
            + TCP HDR
          </div>
          <div style="background: ${this.currentStep >= 2 ? '#06b6d4' : '#1e293b'}; color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; transition: all 0.3s;">
            + IP HDR
          </div>
          <div style="background: ${this.currentStep >= 3 ? '#10b981' : '#1e293b'}; color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; transition: all 0.3s;">
            + ETH + FCS
          </div>
          <div style="background: ${this.currentStep >= 4 ? '#f59e0b' : '#1e293b'}; color: white; padding: 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: bold; transition: all 0.3s;">
            BITS (FÍSICO)
          </div>
        </div>
      </div>
    `;
  }
}

// ==========================================
// 3. SIMULADOR DE SWITCH Y TABLA CAM (UNIDAD 3)
// ==========================================
class SwitchCamSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.camTable = {};
    this.hosts = [
      { port: 1, name: 'PC-A', mac: '00:1A:2B:01:01:01', ip: '192.168.1.10' },
      { port: 2, name: 'PC-B', mac: '00:1A:2B:02:02:02', ip: '192.168.1.20' },
      { port: 3, name: 'PC-C', mac: '00:1A:2B:03:03:03', ip: '192.168.1.30' },
      { port: 4, name: 'PC-D', mac: '00:1A:2B:04:04:04', ip: '192.168.1.40' }
    ];
    this.history = [];
    this.render();
  }

  sendFrame(srcName, dstName) {
    const src = this.hosts.find(h => h.name === srcName);
    const dst = this.hosts.find(h => h.name === dstName);
    if (!src || !dst) return;

    // 1. Aprendizaje: registrar MAC origen en el puerto
    const learnedBefore = !!this.camTable[src.mac];
    this.camTable[src.mac] = { port: src.port, host: src.name, time: new Date().toLocaleTimeString() };

    let actionMsg = '';
    let actionType = 'info';

    // 2. Reenvío: consultar MAC destino en tabla CAM
    if (this.camTable[dst.mac]) {
      const outPort = this.camTable[dst.mac].port;
      actionMsg = `[FORWARDING UNICAST]: La MAC destino ${dst.mac} está registrada en el Puerto ${outPort}. La trama se conmuta EXCLUSIVAMENTE al Puerto ${outPort}. ¡Sin colisiones ni inundación!`;
      actionType = 'success';
    } else {
      actionMsg = `[FLOODING / INUNDACIÓN]: La MAC destino ${dst.mac} aún NO se encuentra en la tabla CAM. El switch inunda la trama por TODOS los demás puertos (Puertos ${this.hosts.filter(h => h.port !== src.port).map(h => h.port).join(', ')}).`;
      actionType = 'warn';
    }

    this.history.unshift({
      time: new Date().toLocaleTimeString(),
      src: src.name,
      dst: dst.name,
      action: actionMsg,
      type: actionType
    });

    this.render();
  }

  clearCam() {
    this.camTable = {};
    this.history = [];
    this.render();
  }

  render() {
    if (!this.container) return;

    const tableRows = Object.keys(this.camTable).length === 0
      ? `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 1rem;">La tabla CAM está vacía. Envía una trama para que el switch aprenda direcciones MAC.</td></tr>`
      : Object.entries(this.camTable).map(([mac, data]) => `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 0.6rem; color: #38bdf8; font-weight: bold;">Puerto Fa0/${data.port}</td>
            <td style="padding: 0.6rem; font-family: monospace;">${mac}</td>
            <td style="padding: 0.6rem; color: #a5b4fc;">${data.host}</td>
            <td style="padding: 0.6rem; color: #94a3b8; font-size: 0.75rem;">Dinámica (${data.time})</td>
          </tr>
        `).join('');

    this.container.innerHTML = `
      <div style="background: #0f172a; border: 1px solid #243552; border-radius: 12px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="color: #f8fafc; font-size: 1.15rem;">Simulador de Switch Capa 2 (Tabla CAM / Forwarding)</h3>
            <p style="font-size: 0.82rem; color: #94a3b8;">Observa cómo el switch aprende dinámicamente y conmuta tramas sin saturar el ancho de banda.</p>
          </div>
          <button class="btn btn-sm btn-danger" onclick="switchSim.clearCam()">Vaciar Tabla CAM</button>
        </div>

        <!-- Panel de Hosts -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-bottom: 1.5rem;">
          ${this.hosts.map(h => `
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.75rem; text-align: center;">
              <div style="font-weight: bold; color: #38bdf8; font-size: 0.95rem;">${h.name}</div>
              <div style="font-size: 0.72rem; color: #cbd5e1; font-family: monospace; margin: 0.2rem 0;">${h.mac}</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">Conectado a: <strong>Puerto ${h.port}</strong></div>
              <div style="margin-top: 0.5rem;">
                <button class="btn btn-sm btn-primary" onclick="switchSim.sendFrame('${h.name}', '${h.name === 'PC-A' ? 'PC-C' : 'PC-A'}')">Enviar a ${h.name === 'PC-A' ? 'PC-C' : 'PC-A'}</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Tabla CAM en vivo -->
        <div style="background: #090f1e; border: 1px solid #243552; border-radius: 8px; padding: 1rem; margin-bottom: 1.2rem;">
          <h4 style="color: #38bdf8; font-size: 0.9rem; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📋</span> Tabla CAM del Switch (Dirección MAC ➔ Puerto)
          </h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #334155; color: #94a3b8;">
                <th style="padding: 0.5rem;">Puerto</th>
                <th style="padding: 0.5rem;">Dirección MAC</th>
                <th style="padding: 0.5rem;">Dispositivo</th>
                <th style="padding: 0.5rem;">Tipo / Hora</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>

        <!-- Bitácora de eventos del Switch -->
        ${this.history.length > 0 ? `
          <div style="background: #020617; border-left: 4px solid #38bdf8; border-radius: 6px; padding: 0.8rem; font-size: 0.8rem; color: #e2e8f0;">
            <div style="font-weight: bold; color: #38bdf8; margin-bottom: 0.2rem;">ÚLTIMA ACCIÓN DEL SWITCH:</div>
            <div>${this.history[0].action}</div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

// ==========================================
// 4. SIMULADOR DE CRIMPEADO T568A / T568B (UNIDAD 4)
// ==========================================
class CrimpSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.targetStandard = 'T568B'; // T568A o T568B
    this.selectedWires = new Array(8).fill(null);
    this.testerActive = false;
    this.testerLedIndex = -1;
    this.testerTimer = null;

    this.standardColors = {
      T568B: [
        { id: 'w-orange', name: 'Blanco / Naranja', class: 'wire-w-orange' },
        { id: 'orange', name: 'Naranja', class: 'wire-orange' },
        { id: 'w-green', name: 'Blanco / Verde', class: 'wire-w-green' },
        { id: 'blue', name: 'Azul', class: 'wire-blue' },
        { id: 'w-blue', name: 'Blanco / Azul', class: 'wire-w-blue' },
        { id: 'green', name: 'Verde', class: 'wire-green' },
        { id: 'w-brown', name: 'Blanco / Marrón', class: 'wire-w-brown' },
        { id: 'brown', name: 'Marrón', class: 'wire-brown' }
      ],
      T568A: [
        { id: 'w-green', name: 'Blanco / Verde', class: 'wire-w-green' },
        { id: 'green', name: 'Verde', class: 'wire-green' },
        { id: 'w-orange', name: 'Blanco / Naranja', class: 'wire-w-orange' },
        { id: 'blue', name: 'Azul', class: 'wire-blue' },
        { id: 'w-blue', name: 'Blanco / Azul', class: 'wire-w-blue' },
        { id: 'orange', name: 'Naranja', class: 'wire-orange' },
        { id: 'w-brown', name: 'Blanco / Marrón', class: 'wire-w-brown' },
        { id: 'brown', name: 'Marrón', class: 'wire-brown' }
      ]
    };

    this.availableWires = [
      { id: 'w-orange', name: 'Blanco/Naranja', class: 'wire-w-orange' },
      { id: 'orange', name: 'Naranja', class: 'wire-orange' },
      { id: 'w-green', name: 'Blanco/Verde', class: 'wire-w-green' },
      { id: 'green', name: 'Verde', class: 'wire-green' },
      { id: 'w-blue', name: 'Blanco/Azul', class: 'wire-w-blue' },
      { id: 'blue', name: 'Azul', class: 'wire-blue' },
      { id: 'w-brown', name: 'Blanco/Marrón', class: 'wire-w-brown' },
      { id: 'brown', name: 'Marrón', class: 'wire-brown' }
    ];

    this.render();
  }

  setStandard(std) {
    this.targetStandard = std;
    this.resetWires();
  }

  resetWires() {
    this.selectedWires = new Array(8).fill(null);
    this.stopTester();
    this.render();
  }

  autoFill() {
    this.selectedWires = [...this.standardColors[this.targetStandard]];
    this.render();
  }

  placeWire(pinIndex, wireId) {
    const wire = this.availableWires.find(w => w.id === wireId);
    if (!wire) return;
    this.selectedWires[pinIndex] = wire;
    this.render();
  }

  removeWire(pinIndex) {
    this.selectedWires[pinIndex] = null;
    this.render();
  }

  testCable() {
    this.stopTester();
    this.testerActive = true;
    this.testerLedIndex = 0;

    // Verificar correspondencia
    const expected = this.standardColors[this.targetStandard];
    let allCorrect = true;
    for (let i = 0; i < 8; i++) {
      if (!this.selectedWires[i] || this.selectedWires[i].id !== expected[i].id) {
        allCorrect = false;
        break;
      }
    }

    this.testerTimer = setInterval(() => {
      this.testerLedIndex++;
      if (this.testerLedIndex >= 8) {
        this.testerLedIndex = 0;
      }
      this.updateTesterLeds(allCorrect);
    }, 400);

    const resultBox = document.getElementById('tester-feedback');
    if (resultBox) {
      if (allCorrect) {
        resultBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; padding: 0.8rem; border-radius: 6px; font-size: 0.85rem; margin-top: 1rem;">
            <strong>✓ ¡CERTIFICACIÓN EXITOSA!</strong><br>
            El conector RJ-45 cumple estrictamente con el estándar <strong>ANSI/TIA/EIA-568-${this.targetStandard.replace('T568', '')}</strong>. Mapa de cableado perfecto (Wiremap 1:1, sin pares cruzados ni abiertos).
          </div>
        `;
      } else {
        resultBox.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 0.8rem; border-radius: 6px; font-size: 0.85rem; margin-top: 1rem;">
            <strong>✗ FALLA EN EL MAPA DE CABLEADO (WIREMAP FAIL)</strong><br>
            El orden de los 8 hilos no coincide con la norma <strong>${this.targetStandard}</strong>. Revisa los pares trenzados y vuelve a ordenarlos antes de ponchar.
          </div>
        `;
      }
    }
  }

  updateTesterLeds(allCorrect) {
    const leds = document.querySelectorAll('.led-bulb');
    leds.forEach((led, idx) => {
      led.classList.remove('active', 'error');
      if (idx === this.testerLedIndex) {
        if (allCorrect) led.classList.add('active');
        else led.classList.add('error');
      }
    });
  }

  stopTester() {
    if (this.testerTimer) {
      clearInterval(this.testerTimer);
      this.testerTimer = null;
    }
    this.testerActive = false;
    this.testerLedIndex = -1;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="crimp-bench">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="color: #f8fafc; font-size: 1.15rem;">Banco de Ponchado y Crimpeado RJ-45 (TIA/EIA-568)</h3>
            <p style="font-size: 0.82rem; color: #94a3b8;">Selecciona la norma y posiciona los 8 hilos del cable UTP Categoría 6 en su respectivo pin del plug RJ-45.</p>
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-sm ${this.targetStandard === 'T568B' ? 'btn-primary' : ''}" onclick="crimpSim.setStandard('T568B')">Norma T-568B (Comercial)</button>
            <button class="btn btn-sm ${this.targetStandard === 'T568A' ? 'btn-primary' : ''}" onclick="crimpSim.setStandard('T568A')">Norma T-568A (Residencial/Gob)</button>
            <button class="btn btn-sm" onclick="crimpSim.autoFill()">Auto-Alinear</button>
            <button class="btn btn-sm btn-danger" onclick="crimpSim.resetWires()">Limpiar</button>
          </div>
        </div>

        <!-- Plug RJ-45 Pins 1-8 -->
        <div style="background: #030712; border: 2px solid #38bdf8; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; position: relative;">
          <div style="text-align: center; font-size: 0.85rem; font-weight: bold; color: #38bdf8; margin-bottom: 0.8rem;">
            CONECTOR RJ-45 HEMBRA / PLUG MACHO (Vista de Pines hacia el frente, lengüeta hacia abajo)
          </div>

          <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.5rem;">
            ${[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
              const wire = this.selectedWires[idx];
              return `
                <div style="background: #0b1329; border: 1px dashed ${wire ? '#38bdf8' : '#334155'}; border-radius: 8px; height: 130px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 0.4rem;">
                  <span style="font-size: 0.75rem; font-weight: bold; color: #94a3b8;">Pin ${idx + 1}</span>
                  ${wire ? `
                    <div class="wire-cable ${wire.class}" style="width: 24px; height: 75px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.6);" title="${wire.name}"></div>
                    <button class="btn btn-sm btn-danger" style="padding: 0.1rem 0.3rem; font-size: 0.65rem;" onclick="crimpSim.removeWire(${idx})">×</button>
                  ` : `
                    <span style="font-size: 0.7rem; color: #475569; text-align: center;">Vacío</span>
                    <div style="height: 20px;"></div>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Paleta de cables disponibles -->
        <div style="margin-bottom: 1.5rem;">
          <div style="font-size: 0.8rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.5rem;">Haz clic en un cable para insertarlo en el siguiente pin disponible:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; background: #0f172a; padding: 0.8rem; border-radius: 8px; border: 1px solid #1e293b;">
            ${this.availableWires.map(w => `
              <div onclick="crimpSim.insertNextAvailable('${w.id}')" style="cursor: pointer; display: flex; align-items: center; gap: 0.4rem; background: #1e293b; padding: 0.4rem 0.8rem; border-radius: 6px; border: 1px solid #334155; font-size: 0.78rem;">
                <div class="wire-cable ${w.class}" style="width: 14px; height: 18px; border-radius: 2px;"></div>
                <span>${w.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Probador de Cable con LEDs -->
        <div class="cable-tester-unit">
          <div style="font-weight: bold; font-size: 0.85rem; color: #f8fafc;">TESTER DIGITAL DE CONTINUIDAD RJ-45</div>
          <div class="tester-leds">
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `
              <div class="led-indicator">
                <div class="led-bulb" id="led-${i}"></div>
                <span>${i}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-sm btn-accent" onclick="crimpSim.testCable()">▶ Probar Continuidad y Wiremap</button>
          <div id="tester-feedback"></div>
        </div>
      </div>
    `;
  }

  insertNextAvailable(wireId) {
    const nextIdx = this.selectedWires.findIndex(w => w === null);
    if (nextIdx !== -1) {
      this.placeWire(nextIdx, wireId);
    }
  }
}

// ==========================================
// 5. CALCULADORA DE SUBREDES IPV4 (UNIDAD 5)
// ==========================================
class SubnetCalculator {
  static calculate(ipStr, cidr) {
    cidr = parseInt(cidr, 10);
    const parts = ipStr.trim().split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255) || cidr < 0 || cidr > 32) {
      return null;
    }

    const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | ~maskInt) >>> 0;

    const intToIp = (n) => [ (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255 ].join('.');

    const netIp = intToIp(netInt);
    const bcastIp = intToIp(bcastInt);
    const maskIp = intToIp(maskInt);

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

    const firstHost = cidr >= 31 ? 'N/A' : intToIp(netInt + 1);
    const lastHost = cidr >= 31 ? 'N/A' : intToIp(bcastInt - 1);

    // Clase y RFC 1918
    let ipClass = 'E';
    if (parts[0] <= 127) ipClass = 'A';
    else if (parts[0] <= 191) ipClass = 'B';
    else if (parts[0] <= 223) ipClass = 'C';
    else if (parts[0] <= 239) ipClass = 'D (Multicast)';

    let isPrivate = false;
    if (parts[0] === 10) isPrivate = true;
    else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) isPrivate = true;
    else if (parts[0] === 192 && parts[1] === 168) isPrivate = true;

    return {
      ip: ipStr,
      cidr: `/${cidr}`,
      mask: maskIp,
      network: netIp,
      broadcast: bcastIp,
      firstHost,
      lastHost,
      usableHosts: usableHosts.toLocaleString(),
      totalHosts: totalHosts.toLocaleString(),
      ipClass,
      type: isPrivate ? 'Privada (RFC 1918)' : 'Pública Enrutable en Internet'
    };
  }
}

// Exportar clases explícitamente a window para compatibilidad global
if (typeof window !== 'undefined') {
  window.TopologySimulator = TopologySimulator;
  window.EncapsulationSimulator = EncapsulationSimulator;
  window.SwitchCamSimulator = SwitchCamSimulator;
  window.CrimpSimulator = CrimpSimulator;
  window.SubnetCalculator = SubnetCalculator;
}
