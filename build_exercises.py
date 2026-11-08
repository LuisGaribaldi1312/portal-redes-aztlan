# -*- coding: utf-8 -*-
"""
Generador del Catálogo de 100 Ejercicios Visuales Interactivos
Universidad Aztlán - Asignatura: Redes de Computadoras (Clave 634)
20 Ejercicios por Unidad x 5 Unidades = 100 Ejercicios con Fundamento Teórico y Laboratorios
"""

import os
import json

exercises = []

# =========================================================================
# UNIDAD 1: ASPECTOS BÁSICOS DE REDES DE COMPUTADORAS (20 EJERCICIOS)
# =========================================================================
u1_items = [
    {
        "id": "ex_1_1", "unit": "U1", "code": "1.1", "title": "Línea de Tiempo de Evolución de Redes",
        "category": "Historia & Fundamentos",
        "desc": "Ordena cronológicamente los 6 hitos fundamentales desde ARPANET hasta la actualidad.",
        "theory": "Las redes de datos nacieron a finales de la década de 1960 impulsadas por la necesidad de compartir recursos computacionales distribuidos. DARPA financió ARPANET en 1969 como la primera red de conmutación de paquetes. Posteriormente, Robert Metcalfe inventó Ethernet en Xerox PARC (1973), sentando las bases del acceso por cable coaxial a 2.94 Mbps. El 1 de enero de 1983 (Flag Day), ARPANET reemplazó NCP por la suite TCP/IP (RFC 791/793), naciendo la Internet. En 1991 Tim Berners-Lee creó la World Wide Web (HTTP/HTML), y en 1997 el IEEE ratificó el estándar 802.11 para redes inalámbricas.",
        "caseStudy": "En proyectos de modernización de infraestructura, comprender la evolución permite discernir por qué los protocolos actuales heredan restricciones de compatibilidad (como el tamaño MTU de 1500 bytes heredado de Ethernet de 1973).",
        "type": "timeline",
        "data": {
            "milestones": [
                {"year": 1969, "name": "ARPANET", "desc": "Primera red conmutada por paquetes conectando 4 nodos universitarios."},
                {"year": 1973, "name": "Ethernet", "desc": "Robert Metcalfe patenta la tecnología de difusión por cable coaxial en Xerox PARC."},
                {"year": 1983, "name": "TCP/IP Flag Day", "desc": "ARPANET adopta formalmente TCP/IP (RFC 791/793); nace Internet."},
                {"year": 1991, "name": "World Wide Web", "desc": "Tim Berners-Lee publica el protocolo HTTP y HTML en el CERN."},
                {"year": 1997, "name": "IEEE 802.11 Wi-Fi", "desc": "Primer estándar comercial de redes inalámbricas locales a 2 Mbps."},
                {"year": 2026, "name": "SDN, IPv6 & Wi-Fi 7", "desc": "Redes definidas por software, automatización con telemetría y ultra-alta capacidad."}
            ]
        }
    },
    {
        "id": "ex_1_2", "unit": "U1", "code": "1.1", "title": "Conmutación de Paquetes vs Circuitos",
        "category": "Fundamentos de Transmisión",
        "desc": "Compara de forma visual e interactiva cómo viaja la información en telefonía analógica frente a datagramas IP.",
        "theory": "En la conmutación de circuitos (ej. red telefónica PSTN clásica), se reserva un canal físico dedicado e ininterrumpido durante toda la llamada; si no hay datos, el canal queda desaprovechado. En contraste, la conmutación de paquetes divide los datos en fragmentos independientes (datagramas) que comparten dinámicamente los mismos enlaces de transmisión mediante multiplexación estadística.",
        "caseStudy": "Un enlace WAN de 1 Gbps con conmutación de paquetes puede dar servicio concurrente a más de 5,000 empleados utilizando multiplexación por paquetes, mientras que por circuitos sólo soportaría un número fijo y rígido de canales.",
        "type": "circuit_vs_packet",
        "data": {"packetCount": 5, "circuitActive": True}
    },
    {
        "id": "ex_1_3", "unit": "U1", "code": "1.1", "title": "El Primer Enlace ARPANET y los Nodos IMP",
        "category": "Historia de Redes",
        "desc": "Simula la transmisión del histórico primer mensaje entre UCLA y Stanford Research Institute en 1969.",
        "theory": "El 29 de octubre de 1969, Leonard Kleinrock y Charley Kline enviaron la palabra 'LOGIN' desde la computadora SDS Sigma 7 en UCLA hacia la SDS 940 en SRI a través de minicomputadoras Honeywell DDP-516 acondicionadas como IMP (Interface Message Processor), los abuelos de los routers modernos. El sistema colapsó al teclear la 'G', logrando transmitir únicamente 'LO'.",
        "caseStudy": "Los IMPs introdujeron el concepto de separación entre la computadora anfitriona (Host) y el procesador de comunicaciones de red (Interface Message Processor).",
        "type": "arpanet_msg",
        "data": {"word": "LOGIN", "delivered": "LO"}
    },
    {
        "id": "ex_1_4", "unit": "U1", "code": "1.1", "title": "Evolución de Velocidades de Enlace",
        "category": "Tasas de Transmisión",
        "desc": "Calcula el tiempo real de descarga de un archivo de 1 GB a través de la evolución histórica de medios.",
        "theory": "La velocidad de transmisión ha crecido exponencialmente desde los 300 baudios del módem Bell 103 (1962), pasando por el módem telefónico V.90 de 56 kbps, RDSI de 128 kbps, Fast Ethernet (100 Mbps), Gigabit Ethernet (1000 Mbps) y los enlaces troncales de centros de datos de 100G/400G (IEEE 802.3bs). El tiempo de transmisión se calcula como T = Tamaño / Ancho de Banda.",
        "caseStudy": "Descargar 1 GB a 56 kbps tomaba aproximadamente 40 horas; a 1 Gbps toma 8 segundos; en una troncal óptica de 400 Gbps toma 0.02 segundos.",
        "type": "bandwidth_calc",
        "data": {"fileSizeMB": 1024}
    },
    {
        "id": "ex_1_5", "unit": "U1", "code": "1.1", "title": "Estructura y Rol de los RFCs del IETF",
        "category": "Estandarización",
        "desc": "Explora los documentos Requests for Comments fundamentales que rigen la arquitectura de Internet.",
        "theory": "Los RFCs (Requests for Comments), iniciados por Steve Crocker en 1969 con el RFC 1 ('Host Software'), son las especificaciones técnicas formales de Internet gestionadas por el IETF (Internet Engineering Task Force). Algunos de los más trascendentales son: RFC 791 (IPv4), RFC 793 (TCP), RFC 826 (ARP), RFC 1918 (Direccionamiento Privado) y RFC 2616 (HTTP/1.1).",
        "caseStudy": "Un ingeniero en telecomunicaciones debe consultar los RFCs oficiales para asegurar la interoperabilidad entre fabricantes como Cisco, Juniper y Huawei.",
        "type": "rfc_explorer",
        "data": {}
    },
    {
        "id": "ex_1_6", "unit": "U1", "code": "1.2", "title": "Modelo de Comunicación de Shannon & Weaver",
        "category": "Transmisión & Señales",
        "desc": "Ajusta las fuentes de ruido y comprende la interacción entre emisor, codificador, canal y receptor.",
        "theory": "Propuesto en 1948 por Claude Shannon y Warren Weaver, este modelo establece que toda comunicación consta de: Fuente de información, Transmisor/Codificador, Canal de transmisión con ruido añadido, Receptor/Decodificador y Destino. El ruido físico (térmico, diafonía, EMI) altera la señal durante su viaje por el medio, requiriendo algoritmos de detección y corrección de errores (como CRC y paridad).",
        "caseStudy": "En cableado UTP, el ruido inducido por motores de elevadores o lámparas fluorescentes adyacentes a las canalizaciones degrada la señal si no se respeta la separación de 30 cm de la norma TIA-569.",
        "type": "shannon_model",
        "data": {}
    },
    {
        "id": "ex_1_7", "unit": "U1", "code": "1.2", "title": "Osciloscopio de Señales & Relación SNR",
        "category": "Transmisión & Señales",
        "desc": "Ajusta en tiempo real el nivel de ruido (SNR dB) y evalúa la capacidad teórica según el Teorema de Shannon.",
        "theory": "El Teorema de Shannon-Hartley determina la capacidad máxima teórica (C en bits/segundo) de un canal de transmisión con ancho de banda B (Hertz) en presencia de ruido gaussiano: C = B * log2(1 + S/N). La relación señal/ruido se expresa comúnmente en decibelios (dB) mediante SNR_dB = 10 * log10(S/N). A mayor ruido, menor capacidad disponible para enviar datos limpios sin error.",
        "caseStudy": "Los certificadores de cable Fluke Networks miden la SNR para determinar si un enlace puede soportar 10GBASE-T sin paquetes descartados.",
        "type": "oscilloscope",
        "data": {}
    },
    {
        "id": "ex_1_8", "unit": "U1", "code": "1.2", "title": "Teorema de Nyquist para Canales Ideales",
        "category": "Transmisión & Señales",
        "desc": "Calcula la tasa binaria máxima sin ruido incrementando los niveles de señalización discretos (M).",
        "theory": "En 1928, Harry Nyquist demostró que para un canal ideal sin ruido de ancho de banda B (Hz), la velocidad máxima teórica es: C = 2 * B * log2(M), donde M es el número de niveles de voltaje o estados de señalización discretos. Si M=2 (binario puro: 0V y 5V), C = 2B. Si se emplean 16 niveles (M=16), cada pulso transporta log2(16) = 4 bits, cuadruplicando la tasa binaria.",
        "caseStudy": "Las tecnologías modernas como PAM4 en redes 400G Ethernet y 10G-PON emplean 4 niveles de amplitud de pulso para duplicar el rendimiento sin requerir duplicar el ancho de banda analógico.",
        "type": "nyquist_calc",
        "data": {}
    },
    {
        "id": "ex_1_9", "unit": "U1", "code": "1.2", "title": "Laboratorio de Modulación Digital (ASK, FSK, PSK, QAM)",
        "category": "Transmisión & Señales",
        "desc": "Modifica la amplitud, frecuencia y fase de una onda portadora para transmitir un tren de datos binario.",
        "theory": "La modulación digital adapta una señal binaria para ser transmitida a través de un medio analógico mediante variaciones de una onda portadora senoidal: ASK (Amplitud), FSK (Frecuencia), PSK (Fase) y QAM (Modulación de Amplitud en Cuadratura). QAM combina modulación de amplitud y fase simultáneamente, permitiendo constelaciones densas (16-QAM, 64-QAM, 256-QAM, 1024-QAM en Wi-Fi 6).",
        "caseStudy": "En enlaces de radio microondas y Wi-Fi 6E, los equipos ajustan dinámicamente la modulación: si la señal es fuerte usan 1024-QAM; si llueve o aumenta el ruido, bajan a QPSK para no perder el enlace.",
        "type": "modulation_lab",
        "data": {}
    },
    {
        "id": "ex_1_10", "unit": "U1", "code": "1.2", "title": "Modos de Transmisión: Simplex, Half y Full-Dúplex",
        "category": "Fundamentos de Transmisión",
        "desc": "Experimenta visualmente con el sentido de flujo de los datos y analiza el impacto en las colisiones.",
        "theory": "Existen 3 modos fundamentales de flujo de información: 1) Simplex: Flujo unidireccional permanente (ej. transmisión de radio comercial o sensores broadcast); 2) Half-Dúplex: Comunicación bidireccional alternada (ambos pueden transmitir, pero no al mismo tiempo; ej. walkie-talkies o Hubs Ethernet con CSMA/CD); 3) Full-Dúplex: Comunicación bidireccional simultánea sin colisiones (ej. switches modernos y fibra óptica con líneas Tx y Rx separadas).",
        "caseStudy": "Configurar accidentalmente un puerto de switch a Half-Dúplex conectado a una tarjeta en Full-Dúplex causa 'Duplex Mismatch', provocando una colisión masiva y pérdida del 80% del rendimiento.",
        "type": "duplex_mode",
        "data": {}
    },
    {
        "id": "ex_1_11", "unit": "U1", "code": "1.2", "title": "Atenuación y Pérdida por Distancia",
        "category": "Medios Físicos",
        "desc": "Simula la pérdida de potencia de la señal (dB) en cable de cobre frente a fibra óptica a lo largo de los kilómetros.",
        "theory": "La atenuación es la pérdida progresiva de energía que sufre una señal al propagarse por el medio. Se mide en decibelios por unidad de longitud (dB/100m en cobre o dB/km en fibra óptica). En cable UTP Cat 6 a 100 MHz la atenuación es de aprox. 19.8 dB por cada 100 m (por eso el límite normativo estricto es 90 m de enlace permanente). En contraste, la fibra monomodo a 1310 nm pierde únicamente 0.35 dB/km.",
        "caseStudy": "Superar los 100 metros en cable UTP provoca que la señal caiga por debajo de la sensibilidad del receptor Ethernet (-20 dBm), provocando errores de CRC y desconexiones intermitentes.",
        "type": "attenuation_sim",
        "data": {}
    },
    {
        "id": "ex_1_12", "unit": "U1", "code": "1.2", "title": "Diagnóstico de Latencia, RTT y Jitter",
        "category": "Métricas de Rendimiento",
        "desc": "Ejecuta una ráfaga de paquetes y evalúa la variación de retardo (Jitter) para servicios de Telefonía IP (VoIP).",
        "theory": "La latencia es el tiempo total que tarda un paquete en viajar desde el origen al destino. El RTT (Round Trip Time) es el tiempo de ida y vuelta. El Jitter es la variación estadística en el retardo de llegada de paquetes sucesivos. Mientras que la navegación web tolera jitter de 200 ms, la telefonía IP (VoIP) y videoconferencia requieren un jitter estrictamente inferior a 30 ms para evitar audio entrecortado.",
        "caseStudy": "En auditorías de QoS para centros de contacto (Call Centers), el monitoreo continuo de jitter permite detectar saturación en las colas de los enrutadores perimetrales.",
        "type": "jitter_sim",
        "data": {}
    },
    {
        "id": "ex_1_13", "unit": "U1", "code": "1.3", "title": "Clasificador Geográfico Universal",
        "category": "Clasificación de Redes",
        "desc": "Clasifica 8 escenarios reales de la industria en su categoría de alcance geográfico (PAN a WAN/SAN).",
        "theory": "Las redes se clasifican por su extensión física y cobertura geográfica: PAN (Área Personal: hasta 10 m, ej. Bluetooth, NFC, Zigbee); LAN (Área Local: hasta 1 km en edificios u oficinas, Ethernet/Wi-Fi); CAN (Área de Campus: interconexión de edificios universitarios o corporativos); MAN (Área Metropolitana: cobertura ciudad, ej. fibra metropolitana municipal); WAN (Área Amplia: regiones, países o continentes conectados por ISPs); SAN (Storage Area Network: red dedicada a almacenamiento con Fibre Channel o iSCSI).",
        "caseStudy": "Un banco implementa una LAN en cada sucursal, una MAN de fibra oscura entre sedes del centro de la ciudad y una WAN encriptada por satélite y MPLS para las sucursales foráneas.",
        "type": "geo_classifier",
        "data": {}
    },
    {
        "id": "ex_1_14", "unit": "U1", "code": "1.3", "title": "Redes de Difusión (Broadcast) vs Punto a Punto",
        "category": "Métodos de Transmisión",
        "desc": "Visualiza cómo se propaga una trama: entrega global a todos los hosts vs canal exclusivo dedicado.",
        "theory": "En redes de difusión (Broadcast networks), todos los hosts comparten el mismo medio físico de transmisión; cuando una máquina emite, todas las demás reciben la señal, pero solo la que coincide con la dirección destino la procesa (ej. Ethernet tradicional, Wi-Fi). En redes punto a punto (Point-to-Point), existen enlaces dedicados exclusivos entre pares de nodos (ej. enlaces WAN seriales HDLC/PPP o fibra óptica monomodo punto a punto).",
        "caseStudy": "Las tramas broadcast innecesarias saturan el ancho de banda y consumen ciclos de CPU de todos los hosts; por ello, en redes grandes se fragmenta la red en VLANs y subredes mediante routers.",
        "type": "broadcast_vs_p2p",
        "data": {}
    },
    {
        "id": "ex_1_15", "unit": "U1", "code": "1.3", "title": "Cliente-Servidor vs Peer-to-Peer (P2P)",
        "category": "Topologías Lógicas",
        "desc": "Compara el cuello de botella en un servidor central frente a la escalabilidad distribuida en redes entre pares.",
        "theory": "En el modelo Cliente-Servidor, un equipo centralizado (Servidor) atiende peticiones de múltiples clientes; ofrece control y seguridad centralizada, pero sufre de punto único de falla (SPOF) y saturación en horas pico. En el modelo Peer-to-Peer (P2P), todos los nodos actúan simultáneamente como clientes y servidores, distribuyendo la carga de transferencia y haciéndose más robusto mientras más nodos se unan.",
        "caseStudy": "Distribución masiva de parches de software: Microsoft utiliza 'Delivery Optimization' basado en tecnología P2P para que las PCs de una oficina descarguen actualizaciones de Windows entre sí en lugar de saturar el enlace a Internet.",
        "type": "c2s_vs_p2p",
        "data": {}
    },
    {
        "id": "ex_1_16", "unit": "U1", "code": "1.3", "title": "Intranet, Extranet e Internet",
        "category": "Clasificación por Acceso",
        "desc": "Configura los niveles de acceso y zonas de seguridad para empleados, socios comerciales y público general.",
        "theory": "Las redes se dividen por su nivel de acceso y políticas de seguridad: 1) Intranet: Red privada y restringida exclusivamente a los colaboradores de una organización (ej. sistema de nóminas o servidor de archivos); 2) Extranet: Extensión controlada de la intranet que permite acceso seguro a socios comerciales, proveedores o clientes autorizados (vía VPN); 3) Internet: Red global pública no confiable accesible por cualquier usuario del planeta.",
        "caseStudy": "Un sistema ERP universitario debe albergar las calificaciones de los estudiantes en la Intranet, permitir a los profesores subir actas desde casa vía Extranet/VPN y publicar la oferta académica general en la Internet pública.",
        "type": "net_security_zones",
        "data": {}
    },
    {
        "id": "ex_1_17", "unit": "U1", "code": "1.4", "title": "Topología en Bus & Rebote de Onda",
        "category": "Topologías Físicas",
        "desc": "Simula la desconexión de un terminador de 50 ohms en cable coaxial 10BASE2 y analiza el colapso total de la red.",
        "theory": "La topología en Bus conecta todos los equipos a un único cable troncal continuo (típicamente cable coaxial RG-58 de 50 ohms). En los extremos del cable se deben instalar resistencias terminadoras de 50 ohms para disipar la energía de la señal. Si un terminador se afloja o el cable se corta, la onda eléctrica rebota (reflexión de onda), generando interferencia destructiva y colapsando de inmediato la comunicación de toda la red.",
        "caseStudy": "Comprender la falla del bus histórico ilustra por qué la industria migró masivamente a la topología en estrella con switches en la década de 1990.",
        "type": "bus_bounce",
        "data": {}
    },
    {
        "id": "ex_1_18", "unit": "U1", "code": "1.4", "title": "Topología en Anillo y Paso de Testigo (Token Ring)",
        "category": "Topologías Físicas",
        "desc": "Observa el flujo ordenado del token lógico según la norma IEEE 802.5 y analiza su comportamiento determinista.",
        "theory": "En la topología en anillo, cada nodo se conecta estrictamente a sus dos vecinos formando un circuito cerrado. Un marco especial denominado 'Token' (testigo) circula constantemente de estación en estación. Solo el nodo que posee el token puede transmitir datos; esto elimina las colisiones al 100%, convirtiéndola en una red determinista ideal para entornos industriales.",
        "caseStudy": "Las redes FDDI (Fiber Distributed Data Interface) y los anillos ópticos metropolitanos SONET/SDH utilizan un diseño de doble anillo autorregenerable (Self-Healing Ring) para tolerar cortes de fibra.",
        "type": "token_ring",
        "data": {}
    },
    {
        "id": "ex_1_19", "unit": "U1", "code": "1.4", "title": "Topología en Estrella & Concentrador Central",
        "category": "Topologías Físicas",
        "desc": "Simula fallas en estaciones cliente demostrando por qué la estrella aísla los fallos en puertos individuales.",
        "theory": "En la topología en estrella, todos los dispositivos se conectan mediante enlaces punto a punto a un concentrador o conmutador central (Switch). Es la topología dominante en el cableado estructurado moderno (ANSI/TIA-568). Su principal ventaja es el aislamiento de fallas: si un cable de una computadora se corta o se desconecta, solo ese equipo queda fuera de línea, mientras que el resto de la red sigue operando con total normalidad.",
        "caseStudy": "El 99% de las redes empresariales contemporáneas se diseñan bajo topología física en estrella y estrella extendida (árbol jerárquico).",
        "type": "star_fault_isol",
        "data": {}
    },
    {
        "id": "ex_1_20", "unit": "U1", "code": "1.4", "title": "Constructor de Malla Completa & Tolerancia a Fallos",
        "category": "Topologías Físicas",
        "desc": "Calcula el número de enlaces físicos requeridos mediante la fórmula n(n-1)/2 y simula cortes de rutas múltiples.",
        "theory": "La topología en Malla Completa (Full Mesh) conecta cada nodo directamente con todos los demás de la red. El número de enlaces físicos requeridos crece cuadráticamente conforme a la fórmula matemática: L = n * (n - 1) / 2, donde n es el número de routers o nodos. Ofrece la máxima redundancia y tolerancia a fallos, pero resulta prohibitiva en costos para redes de gran escala.",
        "caseStudy": "En el núcleo (Core) de un proveedor de servicios de Internet (ISP) o entre centros de datos de misión crítica se utiliza malla completa para garantizar que la caída de un enlace troncal jamás desconecte a los usuarios.",
        "type": "full_mesh_calc",
        "data": {}
    }
]

exercises.extend(u1_items)
print(f"U1 generada: {len(u1_items)} ejercicios.")
