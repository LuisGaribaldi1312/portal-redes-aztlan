# -*- coding: utf-8 -*-
"""
GENERADOR INTEGRAL DEL CATÁLOGO DE 100 EJERCICIOS VISUALES INTERACTIVOS
UNIVERSIDAD AZTLÁN - INGENIERÍA EN SISTEMAS COMPUTACIONALES
REDES DE COMPUTADORAS (CLAVE 634)
"""

import json
import os

catalog = []

# =========================================================================
# UNIDAD 1: ASPECTOS BÁSICOS DE REDES (1.1 AL 1.20)
# =========================================================================
u1_items = [
    {
        "id": "ex_1_1", "unit": "U1", "code": "1.1", "title": "Línea de Tiempo de Evolución de Redes",
        "category": "Historia & Fundamentos",
        "desc": "Ordena cronológicamente los 6 hitos fundamentales desde ARPANET hasta la actualidad.",
        "theory": "Las redes de datos nacieron a finales de los años 60 impulsadas por la necesidad de compartir recursos computacionales distribuidos. DARPA financió ARPANET en 1969 como la primera red de conmutación de paquetes. Robert Metcalfe concibió Ethernet en Xerox PARC (1973), sentando las bases del acceso por cable coaxial a 2.94 Mbps. El 1 de enero de 1983 (Flag Day), ARPANET reemplazó NCP por la suite TCP/IP (RFC 791/793), naciendo formalmente la Internet. En 1991 Tim Berners-Lee creó la World Wide Web en el CERN, y en 1997 el IEEE ratificó el estándar 802.11 para redes inalámbricas.",
        "industryCase": "En proyectos de modernización de infraestructura, comprender la evolución permite discernir por qué los protocolos actuales heredan restricciones históricas de compatibilidad (como el tamaño MTU de 1500 bytes heredado de la especificación Ethernet de 1973).",
        "interactiveType": "timeline",
        "interactiveConfig": {
            "targetOrder": ["1969: ARPANET", "1973: Ethernet", "1983: TCP/IP Flag Day", "1991: World Wide Web", "1997: Wi-Fi IEEE 802.11", "2026: SDN & Wi-Fi 7"],
            "options": ["1983: TCP/IP Flag Day", "1969: ARPANET", "1997: Wi-Fi IEEE 802.11", "1973: Ethernet", "2026: SDN & Wi-Fi 7", "1991: World Wide Web"]
        }
    },
    {
        "id": "ex_1_2", "unit": "U1", "code": "1.1", "title": "Conmutación de Paquetes vs Circuitos",
        "category": "Fundamentos de Transmisión",
        "desc": "Compara visualmente cómo viaja la información en telefonía analógica frente a datagramas IP.",
        "theory": "En la conmutación de circuitos (ej. red telefónica PSTN clásica), se reserva un canal físico dedicado e ininterrumpido durante toda la llamada; si no hay datos, el canal queda desaprovechado y ningún otro usuario puede usarlo. En contraste, la conmutación de paquetes divide los datos en fragmentos independientes (datagramas) que comparten dinámicamente los mismos enlaces de transmisión mediante multiplexación estadística.",
        "industryCase": "Un enlace WAN de 1 Gbps con conmutación de paquetes puede dar servicio concurrente a más de 5,000 empleados utilizando multiplexación por paquetes, mientras que por circuitos sólo soportaría un número fijo y rígido de canales.",
        "interactiveType": "circuit_packet_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_3", "unit": "U1", "code": "1.1", "title": "El Primer Enlace ARPANET y los Nodos IMP",
        "category": "Historia de Redes",
        "desc": "Simula la transmisión del histórico primer mensaje entre UCLA y Stanford Research Institute en 1969.",
        "theory": "El 29 de octubre de 1969, Leonard Kleinrock y Charley Kline enviaron la palabra 'LOGIN' desde la computadora SDS Sigma 7 en UCLA hacia la SDS 940 en SRI a través de minicomputadoras Honeywell DDP-516 acondicionadas como IMP (Interface Message Processor), los precursores de los routers modernos. El sistema colapsó al teclear la 'G', logrando transmitir únicamente 'LO'.",
        "industryCase": "Los IMPs introdujeron el concepto de separación entre la computadora anfitriona (Host) y el procesador de comunicaciones de red (Interface Message Processor), base de la separación moderna entre plano de control y plano de datos.",
        "interactiveType": "arpanet_simulator",
        "interactiveConfig": {"chars": ["L", "O", "G", "I", "N"]}
    },
    {
        "id": "ex_1_4", "unit": "U1", "code": "1.1", "title": "Evolución de Velocidades de Enlace",
        "category": "Tasas de Transmisión",
        "desc": "Calcula el tiempo real de descarga de un archivo de 1 GB a través de la evolución histórica de medios.",
        "theory": "La velocidad de transmisión ha crecido exponencialmente desde los 300 baudios del módem Bell 103 (1962), pasando por el módem telefónico V.90 de 56 kbps, RDSI de 128 kbps, Fast Ethernet (100 Mbps), Gigabit Ethernet (1000 Mbps) y los enlaces troncales de centros de datos de 100G/400G (IEEE 802.3bs). El tiempo de transmisión se calcula como T = Tamaño / Ancho de Banda.",
        "industryCase": "Descargar 1 GB a 56 kbps tomaba aproximadamente 40 horas; a 1 Gbps toma 8 segundos; en una troncal óptica de 400 Gbps toma 0.02 segundos.",
        "interactiveType": "speed_comparison",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_5", "unit": "U1", "code": "1.1", "title": "Estructura y Rol de los RFCs del IETF",
        "category": "Estandarización",
        "desc": "Explora los documentos Requests for Comments fundamentales que rigen la arquitectura de Internet.",
        "theory": "Los RFCs (Requests for Comments), iniciados por Steve Crocker en 1969 con el RFC 1 ('Host Software'), son las especificaciones técnicas formales de Internet gestionadas por el IETF (Internet Engineering Task Force). Algunos de los más trascendentales son: RFC 791 (IPv4), RFC 793 (TCP), RFC 826 (ARP), RFC 1918 (Direccionamiento Privado) y RFC 2616 (HTTP/1.1).",
        "industryCase": "Un ingeniero en telecomunicaciones debe consultar los RFCs oficiales para asegurar la interoperabilidad entre fabricantes como Cisco, Juniper y Huawei.",
        "interactiveType": "rfc_explorer",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_6", "unit": "U1", "code": "1.2", "title": "Modelo de Comunicación de Shannon & Weaver",
        "category": "Transmisión & Señales",
        "desc": "Ajusta las fuentes de ruido y comprende la interacción entre emisor, codificador, canal y receptor.",
        "theory": "Propuesto en 1948 por Claude Shannon y Warren Weaver, este modelo establece que toda comunicación consta de: Fuente de información, Transmisor/Codificador, Canal de transmisión con ruido añadido, Receptor/Decodificador y Destino. El ruido físico (térmico, diafonía, EMI) altera la señal durante su viaje por el medio, requiriendo algoritmos de detección y corrección de errores (como CRC y paridad).",
        "industryCase": "En cableado UTP, el ruido inducido por motores de elevadores o lámparas fluorescentes adyacentes a las canalizaciones degrada la señal si no se respeta la separación de 30 cm de la norma TIA-569.",
        "interactiveType": "shannon_interactive",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_7", "unit": "U1", "code": "1.2", "title": "Osciloscopio de Señales & Relación SNR",
        "category": "Transmisión & Señales",
        "desc": "Ajusta en tiempo real el nivel de ruido (SNR dB) y evalúa la capacidad teórica según el Teorema de Shannon.",
        "theory": "El Teorema de Shannon-Hartley determina la capacidad máxima teórica (C en bits/segundo) de un canal de transmisión con ancho de banda B (Hertz) en presencia de ruido gaussiano: C = B * log2(1 + S/N). La relación señal/ruido se expresa comúnmente en decibelios (dB) mediante SNR_dB = 10 * log10(S/N). A mayor ruido, menor capacidad disponible para enviar datos limpios sin error.",
        "industryCase": "Los certificadores de cable Fluke Networks miden la SNR para determinar si un enlace puede soportar 10GBASE-T sin paquetes descartados.",
        "interactiveType": "oscilloscope_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_8", "unit": "U1", "code": "1.2", "title": "Teorema de Nyquist para Canales Ideales",
        "category": "Transmisión & Señales",
        "desc": "Calcula la tasa binaria máxima sin ruido incrementando los niveles de señalización discretos (M).",
        "theory": "En 1928, Harry Nyquist demostró que para un canal ideal sin ruido de ancho de banda B (Hz), la velocidad máxima teórica es: C = 2 * B * log2(M), donde M es el número de niveles de voltaje o estados de señalización discretos. Si M=2 (binario puro: 0V y 5V), C = 2B. Si se emplean 16 niveles (M=16), cada pulso transporta log2(16) = 4 bits, cuadruplicando la tasa binaria.",
        "industryCase": "Las tecnologías modernas como PAM4 en redes 400G Ethernet y 10G-PON emplean 4 niveles de amplitud de pulso para duplicar el rendimiento sin requerir duplicar el ancho de banda analógico.",
        "interactiveType": "nyquist_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_9", "unit": "U1", "code": "1.2", "title": "Laboratorio de Modulación Digital (ASK, FSK, PSK, QAM)",
        "category": "Transmisión & Señales",
        "desc": "Modifica la amplitud, frecuencia y fase de una onda portadora para transmitir un tren de datos binario.",
        "theory": "La modulación digital adapta una señal binaria para ser transmitida a través de un medio analógico mediante variaciones de una onda portadora senoidal: ASK (Amplitud), FSK (Frecuencia), PSK (Fase) y QAM (Modulación de Amplitud en Cuadratura). QAM combina modulación de amplitud y fase simultáneamente, permitiendo constelaciones densas (16-QAM, 64-QAM, 256-QAM, 1024-QAM en Wi-Fi 6).",
        "industryCase": "En enlaces de radio microondas y Wi-Fi 6E, los equipos ajustan dinámicamente la modulación: si la señal es fuerte usan 1024-QAM; si llueve o aumenta el ruido, bajan a QPSK para no perder el enlace.",
        "interactiveType": "modulation_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_10", "unit": "U1", "code": "1.2", "title": "Modos de Transmisión: Simplex, Half y Full-Dúplex",
        "category": "Fundamentos de Transmisión",
        "desc": "Experimenta visualmente con el sentido de flujo de los datos y analiza el impacto en las colisiones.",
        "theory": "Existen 3 modos fundamentales de flujo de información: 1) Simplex: Flujo unidireccional permanente (ej. transmisión de radio comercial o sensores broadcast); 2) Half-Dúplex: Comunicación bidireccional alternada (ambos pueden transmitir, pero no al mismo tiempo; ej. walkie-talkies o Hubs Ethernet con CSMA/CD); 3) Full-Dúplex: Comunicación bidireccional simultánea sin colisiones (ej. switches modernos y fibra óptica con líneas Tx y Rx separadas).",
        "industryCase": "Configurar accidentalmente un puerto de switch a Half-Dúplex conectado a una tarjeta en Full-Dúplex causa 'Duplex Mismatch', provocando una colisión masiva y pérdida del 80% del rendimiento.",
        "interactiveType": "duplex_interactive",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_11", "unit": "U1", "code": "1.2", "title": "Atenuación y Pérdida por Distancia",
        "category": "Medios Físicos",
        "desc": "Simula la pérdida de potencia de la señal (dB) en cable de cobre frente a fibra óptica a lo largo de los kilómetros.",
        "theory": "La atenuación es la pérdida progresiva de energía que sufre una señal al propagarse por el medio. Se mide en decibelios por unidad de longitud (dB/100m en cobre o dB/km en fibra óptica). En cable UTP Cat 6 a 100 MHz la atenuación es de aprox. 19.8 dB por cada 100 m (por eso el límite normativo estricto es 90 m de enlace permanente). En contraste, la fibra monomodo a 1310 nm pierde únicamente 0.35 dB/km.",
        "industryCase": "Superar los 100 metros en cable UTP provoca que la señal caiga por debajo de la sensibilidad del receptor Ethernet (-20 dBm), provocando errores de CRC y desconexiones intermitentes.",
        "interactiveType": "attenuation_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_12", "unit": "U1", "code": "1.2", "title": "Diagnóstico de Latencia, RTT y Jitter",
        "category": "Métricas de Rendimiento",
        "desc": "Ejecuta una ráfaga de paquetes y evalúa la variación de retardo (Jitter) para servicios de Telefonía IP (VoIP).",
        "theory": "La latencia es el tiempo total que tarda un paquete en viajar desde el origen al destino. El RTT (Round Trip Time) es el tiempo de ida y vuelta. El Jitter es la variación estadística en el retardo de llegada de paquetes sucesivos. Mientras que la navegación web tolera jitter de 200 ms, la telefonía IP (VoIP) y videoconferencia requieren un jitter estrictamente inferior a 30 ms para evitar audio entrecortado.",
        "industryCase": "En auditorías de QoS para centros de contacto (Call Centers), el monitoreo continuo de jitter permite detectar saturación en las colas de los enrutadores perimetrales.",
        "interactiveType": "jitter_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_13", "unit": "U1", "code": "1.3", "title": "Clasificador Geográfico Universal",
        "category": "Clasificación de Redes",
        "desc": "Clasifica 8 escenarios reales de la industria en su categoría de alcance geográfico (PAN a WAN/SAN).",
        "theory": "Las redes se clasifican por su extensión física y cobertura geográfica: PAN (Área Personal: hasta 10 m, ej. Bluetooth, NFC, Zigbee); LAN (Área Local: hasta 1 km en edificios u oficinas, Ethernet/Wi-Fi); CAN (Área de Campus: interconexión de edificios universitarios o corporativos); MAN (Área Metropolitana: cobertura ciudad, ej. fibra metropolitana municipal); WAN (Área Amplia: regiones, países o continentes conectados por ISPs); SAN (Storage Area Network: red dedicada a almacenamiento con Fibre Channel o iSCSI).",
        "industryCase": "Un banco implementa una LAN en cada sucursal, una MAN de fibra oscura entre sedes del centro de la ciudad y una WAN encriptada por satélite y MPLS para las sucursales foráneas.",
        "interactiveType": "geo_classifier_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_14", "unit": "U1", "code": "1.3", "title": "Redes de Difusión (Broadcast) vs Punto a Punto",
        "category": "Métodos de Transmisión",
        "desc": "Visualiza cómo se propaga una trama: entrega global a todos los hosts vs canal exclusivo dedicado.",
        "theory": "En redes de difusión (Broadcast networks), todos los hosts comparten el mismo medio físico de transmisión; cuando una máquina emite, todas las demás reciben la señal, pero solo la que coincide con la dirección destino la procesa (ej. Ethernet tradicional, Wi-Fi). En redes punto a punto (Point-to-Point), existen enlaces dedicados exclusivos entre pares de nodos (ej. enlaces WAN seriales HDLC/PPP o fibra óptica monomodo punto a punto).",
        "industryCase": "Las tramas broadcast innecesarias saturan el ancho de banda y consumen ciclos de CPU de todos los hosts; por ello, en redes grandes se fragmenta la red en VLANs y subredes mediante routers.",
        "interactiveType": "broadcast_vs_p2p_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_15", "unit": "U1", "code": "1.3", "title": "Cliente-Servidor vs Peer-to-Peer (P2P)",
        "category": "Topologías Lógicas",
        "desc": "Compara el cuello de botella en un servidor central frente a la escalabilidad distribuida en redes entre pares.",
        "theory": "En el modelo Cliente-Servidor, un equipo centralizado (Servidor) atiende peticiones de múltiples clientes; ofrece control y seguridad centralizada, pero sufre de punto único de falla (SPOF) y saturación en horas pico. En el modelo Peer-to-Peer (P2P), todos los nodos actúan simultáneamente como clientes y servidores, distribuyendo la carga de transferencia y haciéndose más robusto mientras más nodos se unan.",
        "industryCase": "Distribución masiva de parches de software: Microsoft utiliza 'Delivery Optimization' basado en tecnología P2P para que las PCs de una oficina descarguen actualizaciones de Windows entre sí en lugar de saturar el enlace a Internet.",
        "interactiveType": "c2s_vs_p2p_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_16", "unit": "U1", "code": "1.3", "title": "Intranet, Extranet e Internet",
        "category": "Clasificación por Acceso",
        "desc": "Configura los niveles de acceso y zonas de seguridad para empleados, socios comerciales y público general.",
        "theory": "Las redes se dividen por su nivel de acceso y políticas de seguridad: 1) Intranet: Red privada y restringida exclusivamente a los colaboradores de una organización (ej. sistema de nóminas o servidor de archivos); 2) Extranet: Extensión controlada de la intranet que permite acceso seguro a socios comerciales, proveedores o clientes autorizados (vía VPN); 3) Internet: Red global pública no confiable accesible por cualquier usuario del planeta.",
        "industryCase": "Un sistema ERP universitario debe albergar las calificaciones de los estudiantes en la Intranet, permitir a los profesores subir actas desde casa vía Extranet/VPN y publicar la oferta académica general en la Internet pública.",
        "interactiveType": "access_zones_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_17", "unit": "U1", "code": "1.4", "title": "Topología en Bus & Rebote de Onda",
        "category": "Topologías Físicas",
        "desc": "Simula la desconexión de un terminador de 50 ohms en cable coaxial 10BASE2 y analiza el colapso total de la red.",
        "theory": "La topología en Bus conecta todos los equipos a un único cable troncal continuo (típicamente cable coaxial RG-58 de 50 ohms). En los extremos del cable se deben instalar resistencias terminadoras de 50 ohms para disipar la energía de la señal. Si un terminador se afloja o el cable se corta, la onda eléctrica rebota (reflexión de onda), generando interferencia destructiva y colapsando de inmediato la comunicación de toda la red.",
        "industryCase": "Comprender la falla del bus histórico ilustra por qué la industria migró masivamente a la topología en estrella con switches en la década de 1990.",
        "interactiveType": "bus_coaxial_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_18", "unit": "U1", "code": "1.4", "title": "Topología en Anillo y Paso de Testigo (Token Ring)",
        "category": "Topologías Físicas",
        "desc": "Observa el flujo ordenado del token lógico según la norma IEEE 802.5 y analiza su comportamiento determinista.",
        "theory": "En la topología en anillo, cada nodo se conecta estrictamente a sus dos vecinos formando un circuito cerrado. Un marco especial denominado 'Token' (testigo) circula constantemente de estación en estación. Solo el nodo que posee el token puede transmitir datos; esto elimina las colisiones al 100%, convirtiéndola en una red determinista ideal para entornos industriales.",
        "industryCase": "Las redes FDDI (Fiber Distributed Data Interface) y los anillos ópticos metropolitanos SONET/SDH utilizan un diseño de doble anillo autorregenerable (Self-Healing Ring) para tolerar cortes de fibra.",
        "interactiveType": "token_ring_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_19", "unit": "U1", "code": "1.4", "title": "Topología en Estrella & Concentrador Central",
        "category": "Topologías Físicas",
        "desc": "Simula fallas en estaciones cliente demostrando por qué la estrella aísla los fallos en puertos individuales.",
        "theory": "En la topología en estrella, todos los dispositivos se conectan mediante enlaces punto a punto a un concentrador o conmutador central (Switch). Es la topología dominante en el cableado estructurado moderno (ANSI/TIA-568). Su principal ventaja es el aislamiento de fallas: si un cable de una computadora se corta o se desconecta, solo ese equipo queda fuera de línea, mientras que el resto de la red sigue operando con total normalidad.",
        "industryCase": "El 99% de las redes empresariales contemporáneas se diseñan bajo topología física en estrella y estrella extendida (árbol jerárquico).",
        "interactiveType": "star_switch_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_1_20", "unit": "U1", "code": "1.4", "title": "Constructor de Malla Completa & Tolerancia a Fallos",
        "category": "Topologías Físicas",
        "desc": "Calcula el número de enlaces físicos requeridos mediante la fórmula n(n-1)/2 y simula cortes de rutas múltiples.",
        "theory": "La topología en Malla Completa (Full Mesh) conecta cada nodo directamente con todos los demás de la red. El número de enlaces físicos requeridos crece cuadráticamente conforme a la fórmula matemática: L = n * (n - 1) / 2, donde n es el número de routers o nodos. Ofrece la máxima redundancia y tolerancia a fallos, pero resulta prohibitiva en costos para redes de gran escala.",
        "industryCase": "En el núcleo (Core) de un proveedor de servicios de Internet (ISP) o entre centros de datos de misión crítica se utiliza malla completa para garantizar que la caída de un enlace troncal jamás desconecte a los usuarios.",
        "interactiveType": "full_mesh_lab",
        "interactiveConfig": {}
    }
]
catalog.extend(u1_items)

# =========================================================================
# UNIDAD 2: NORMAS Y ESTÁNDARES (2.1 AL 2.20)
# =========================================================================
u2_items = [
    {
        "id": "ex_2_1", "unit": "U2", "code": "2.1", "title": "Mapeo de Organismos de Estandarización",
        "category": "Comités & Normas",
        "desc": "Asocia cada organismo internacional (ISO, IEEE, IETF, ITU-T, ANSI, TIA) con su alcance rector.",
        "theory": "Los estándares de telecomunicaciones evitan el monopolio y garantizan la compatibilidad entre fabricantes. ISO (Organización Internacional de Normalización) define modelos de referencia como OSI; IEEE (Instituto de Ingenieros Eléctricos y Electrónicos) normaliza las capas física y de enlace (IEEE 802); IETF (Internet Engineering Task Force) publica los RFCs de Internet; ITU-T define estándares globales de telecomunicaciones y portadoras; ANSI y TIA normalizan el cableado estructurado comercial.",
        "industryCase": "En una licitación pública de redes, los pliegos de condiciones exigen el cumplimiento irrestricto de normas IEEE 802.3ab (1000BASE-T) y ANSI/TIA-568-D para aceptar la entrega de la infraestructura.",
        "interactiveType": "standard_orgs_matcher",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_2", "unit": "U2", "code": "2.1", "title": "El Comité IEEE 802 y sus Estándares",
        "category": "Comités & Normas",
        "desc": "Clasifica las tecnologías de red según su subcomité oficial (802.1, 802.3, 802.11, 802.15).",
        "theory": "Creado en febrero de 1980 (de ahí el nombre 802), este comité divide la Capa 2 de OSI en dos subcapas: LLC (802.2) y MAC. Sus grupos de trabajo más influyentes son: 802.1 (Arquitectura de red, VLANs 802.1Q y Spanning Tree 802.1D); 802.3 (Ethernet por par trenzado y fibra); 802.11 (Redes Inalámbricas WLAN / Wi-Fi); 802.15 (Redes Inalámbricas de Área Personal WPAN como Bluetooth y Zigbee).",
        "industryCase": "Al comprar puntos de acceso inalámbricos, se verifica que soporten IEEE 802.11ax (Wi-Fi 6) y que los switches alimentadores cumplan con IEEE 802.3at (PoE+ de 30W).",
        "interactiveType": "ieee_classifier",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_3", "unit": "U2", "code": "2.1", "title": "Recomendaciones de Telecomunicaciones ITU-T",
        "category": "Comités & Normas",
        "desc": "Explora las series rectoras de la Unión Internacional de Telecomunicaciones (G, V y X).",
        "theory": "La ITU-T (Sector de Normalización de las Telecomunicaciones de la ONU) emite 'Recomendaciones' técnicas de alcance mundial. La Serie G normaliza sistemas de transmisión e infraestructura digital (como G.652 para fibra óptica monomodo estándar); la Serie V rige la comunicación de datos sobre redes telefónicas; y la Serie X rige las redes de datos públicas y la seguridad criptográfica (como el estándar de certificados digitales X.509).",
        "industryCase": "Las bobinas de fibra óptica instaladas en los backbones de campus deben especificar cumplimiento con ITU-T G.652.D (baja pérdida por pico de agua) para soportar multiplexación por división de longitud de onda (CWDM/DWDM).",
        "interactiveType": "itut_explorer",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_4", "unit": "U2", "code": "2.1", "title": "El Proceso de Estandarización de Internet del IETF",
        "category": "Estandarización",
        "desc": "Simula las etapas por las que pasa un protocolo: Internet-Draft -> Proposed Standard -> Internet Standard.",
        "theory": "El IETF opera bajo el principio de 'consenso general y código en ejecución' (rough consensus and running code). Un protocolo comienza como un borrador (Internet-Draft); si el grupo de trabajo lo aprueba, se publica como 'Proposed Standard' (Estándar Propuesto). Tras rigurosas pruebas de interoperabilidad con al menos dos implementaciones independientes, se promueve a 'Internet Standard' (STD) con asignación definitiva de número RFC.",
        "industryCase": "Protocolos contemporáneos como HTTP/3 (RFC 9114) sobre QUIC (RFC 9000) transitaron durante más de 5 años por este proceso antes de ser adoptados por Google Chrome, Cloudflare y servidores Nginx.",
        "interactiveType": "ietf_lifecycle_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_5", "unit": "U2", "code": "2.2", "title": "Las 7 Capas del Modelo OSI (ISO/IEC 7498-1)",
        "category": "Modelos de Referencia",
        "desc": "Organiza verticalmente las 7 capas de la arquitectura OSI y comprende la modularidad de cada nivel.",
        "theory": "El modelo OSI (Open Systems Interconnection), publicado en 1984 por ISO, estandarizó la comunicación en 7 niveles conceptuales: 1) Física (señales eléctricas/ópticas), 2) Enlace (tramas y direccionamiento MAC), 3) Red (paquetes y enrutamiento IP), 4) Transporte (segmentos, control de flujo y puertos), 5) Sesión (diálogo y sincronización), 6) Presentación (formato, sintaxis y cifrado), y 7) Aplicación (interfaz con procesos de usuario).",
        "industryCase": "En soporte técnico de redes de misión crítica, la metodología 'Top-Down' o 'Bottom-Up' de resolución de fallas se basa enteramente en aislar la capa del modelo OSI en la que ocurre el problema.",
        "interactiveType": "osi_stacker_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_6", "unit": "U2", "code": "2.2", "title": "Mapeo de Unidades de Datos de Protocolo (PDUs)",
        "category": "Modelos de Referencia",
        "desc": "Empareja cada capa del modelo OSI con su PDU oficial: Bits, Tramas, Paquetes, Segmentos y Datos.",
        "theory": "Una PDU (Protocol Data Unit) es el bloque estructurado de información que intercambian dos entidades de la misma capa. Capa 1 Física maneja Bits; Capa 2 Enlace maneja Tramas (Frames con cabecera y tráiler); Capa 3 Red maneja Paquetes (Packets o Datagramas); Capa 4 Transporte maneja Segmentos (en TCP) o Datagramas (en UDP); y las Capas 5, 6 y 7 manejan Datos puros o Mensajes de aplicación.",
        "industryCase": "Un analizador de protocolos como Wireshark permite al ingeniero inspeccionar cada PDU desglosada capa por capa para identificar retransmisiones o errores de CRC.",
        "interactiveType": "pdu_matcher_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_7", "unit": "U2", "code": "2.2", "title": "Capa 1 Física a Fondo: Codificación de Línea",
        "category": "Capa Física",
        "desc": "Compara la codificación Manchester utilizada en Ethernet clásico frente a la codificación NRZ.",
        "theory": "La Capa 1 no comprende el significado de los datos; únicamente transmite y recibe trenes de bits. Para sincronizar el reloj entre emisor y receptor sin requerir una línea de reloj separada, Ethernet 10BASE-T utiliza codificación Manchester: un bit '0' se representa por una transición de nivel alto a bajo en el centro del bit, y un bit '1' por una transición de bajo a alto. Por su parte, NRZ (Non-Return-to-Zero) mantiene el nivel durante todo el período.",
        "industryCase": "La codificación garantiza que haya transiciones de voltaje constantes para que el chip receptor mantenga sincronizado su bucle de enganche de fase (PLL) sin derivar en el tiempo.",
        "interactiveType": "line_encoding_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_8", "unit": "U2", "code": "2.2", "title": "Capa 2 Enlace de Datos: Subcapas LLC y MAC",
        "category": "Capa de Enlace",
        "desc": "Analiza el control de acceso al medio CSMA/CD y la función del encabezado MAC de 48 bits.",
        "theory": "La Capa de Enlace garantiza el transporte confiable entre dos equipos conectados al mismo medio físico. Se divide en: 1) Subcapa LLC (IEEE 802.2), que interactúa con la capa de red independientemente del hardware; y 2) Subcapa MAC (IEEE 802.3/802.11), que gestiona el acceso al medio físico mediante CSMA/CD (Ethernet cableado) o CSMA/CA (Wi-Fi) y asigna direcciones físicas únicas de 48 bits (6 bytes en formato hexadecimal).",
        "industryCase": "En una red con problemas, inspeccionar si las tarjetas de red tienen configurado 'promiscuous mode' permite diagnosticar herramientas de captura no autorizadas en el segmento LAN.",
        "interactiveType": "llc_mac_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_9", "unit": "U2", "code": "2.2", "title": "Capa 3 Red: Direccionamiento Lógico y Ruta Óptima",
        "category": "Capa de Red",
        "desc": "Comprende la separación de dominios de broadcast mediante direcciones IP jerárquicas y tablas de rutas.",
        "theory": "La Capa de Red proporciona conectividad y selección de la mejor ruta entre dos sistemas que pueden estar ubicados en redes geográficamente distintas. Emplea direccionamiento lógico jerárquico (IPv4 de 32 bits o IPv6 de 128 bits), compuesto por una porción de red (Network ID) y una porción de host (Host ID), delimitadas por la máscara de subred. Los enrutadores (Routers) toman decisiones basándose en la dirección IP destino.",
        "industryCase": "A diferencia de las direcciones MAC que son planas y no escalables en Internet, las direcciones IP son jerárquicas y permiten sumarización de rutas en las tablas BGP de los operadores globales.",
        "interactiveType": "l3_routing_concept",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_10", "unit": "U2", "code": "2.2", "title": "Capa 4 Transporte: Multiplexación por Puertos",
        "category": "Capa de Transporte",
        "desc": "Observa cómo los puertos TCP/UDP permiten que una misma máquina ejecute decenas de servicios en red concurrentes.",
        "theory": "La Capa de Transporte es responsable de la comunicación extremo a extremo (End-to-End) entre procesos. Utiliza números de puerto de 16 bits (rango 0 a 65535): Puertos bien conocidos (0-1023, ej. 80 HTTP, 443 HTTPS, 53 DNS, 22 SSH); Puertos registrados (1024-49151); y Puertos dinámicos/efímeros (49152-65535) asignados automáticamente a las conexiones de clientes salientes. La combinación de IP + Puerto se denomina Socket.",
        "industryCase": "Un servidor web de comercio electrónico puede recibir 100,000 conexiones concurrentes en la IP 200.1.2.3 en el puerto 443, diferenciando a cada usuario por su socket de origen único.",
        "interactiveType": "socket_multiplexing_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_11", "unit": "U2", "code": "2.2", "title": "Capa 5 Sesión: Checkpoints y Diálogo Dúplex",
        "category": "Capa de Sesión",
        "desc": "Simula la transferencia de un archivo de 500 MB con puntos de control (checkpoints) ante caídas de enlace.",
        "theory": "La Capa de Sesión establece, administra, sincroniza y finaliza las sesiones de diálogo entre aplicaciones en ejecución. Su función más representativa es la inserción de puntos de control (checkpoints o puntos de sincronización) en flujos de datos continuos. Si ocurre una desconexión en el 85% de la descarga, la sesión se restablece y se reanuda desde el último checkpoint confirmado sin repetir la transferencia completa.",
        "industryCase": "Los protocolos de sincronización de bases de datos distribuidas y llamadas remotas RPC dependen de la Capa de Sesión para garantizar transacciones ACID sin inconsistencias.",
        "interactiveType": "session_checkpoints_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_12", "unit": "U2", "code": "2.2", "title": "Capa 6 Presentación: Sintaxis, Compresión y Cifrado",
        "category": "Capa de Presentación",
        "desc": "Experimenta con la serialización JSON, compresión gzip y negociación criptográfica TLS 1.3.",
        "theory": "La Capa de Presentación se encarga de la representación de la información: asegura que los datos enviados por la capa de aplicación de un sistema sean legibles por la capa de aplicación de otro. Se ocupa de: 1) Traducción de formatos de caracteres (ej. EBCDIC a ASCII/UTF-8); 2) Compresión de datos (algoritmos Gzip, Deflate, JPEG, MPEG) para optimizar el ancho de banda; y 3) Cifrado y descifrado de seguridad (ej. TLS/SSL).",
        "industryCase": "Habilitar compresión Brotli o Gzip en servidores web reduce el peso de las páginas en un 70%, acelerando drásticamente el tiempo de carga móvil sin tocar el código fuente.",
        "interactiveType": "presentation_compression_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_13", "unit": "U2", "code": "2.2", "title": "Capa 7 Aplicación: Peticiones HTTP y Códigos de Estado",
        "category": "Capa de Aplicación",
        "desc": "Simula clientes HTTP enviando solicitudes GET y analiza respuestas 200 OK, 301, 404 y 500.",
        "theory": "La Capa de Aplicación es la más cercana al usuario final; proporciona los protocolos que las aplicaciones de software utilizan directamente para comunicarse sobre la red. El protocolo HTTP/1.1 y HTTP/2 rige la Web. Cada respuesta del servidor contiene un código de estado de 3 dígitos: 1xx (Informativo), 2xx (Éxito, ej. 200 OK), 3xx (Redirección, ej. 301 Moved Permanently), 4xx (Error del Cliente, ej. 404 Not Found, 403 Forbidden) y 5xx (Error del Servidor, ej. 500 Internal Error, 503 Unavailable).",
        "industryCase": "En monitoreo de APIs de pagos y comercio electrónico, alarmas automatizadas notifican a los ingenieros si la tasa de errores HTTP 500 supera el 0.1% de las transacciones.",
        "interactiveType": "http_status_simulator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_14", "unit": "U2", "code": "2.3", "title": "Mapeo Comparativo OSI (7 capas) vs TCP/IP (4 capas)",
        "category": "Arquitectura TCP/IP",
        "desc": "Conecta interactivamente las capas equivalentes entre el modelo teórico OSI y la suite práctica TCP/IP.",
        "theory": "Mientras que el modelo OSI es un estándar conceptual de 7 capas desarrollado por comités, la arquitectura TCP/IP (modelo DARPA) es el estándar práctico que rige la Internet moderna y consta de 4 capas: 1) Capa de Acceso a la Red (engloba las Capas 1 y 2 de OSI); 2) Capa de Internet (equivalente a la Capa 3 de OSI, rige IP, ICMP, ARP); 3) Capa de Transporte (Capa 4 de OSI, rige TCP y UDP); y 4) Capa de Aplicación (unifica las Capas 5, 6 y 7 de OSI, rige HTTP, DNS, SSH, etc.).",
        "industryCase": "En las certificaciones de la industria (como Cisco CCNA y CompTIA Network+), dominar la equivalencia entre ambos modelos es indispensable para diagnosticar fallas de red con precisión.",
        "interactiveType": "osi_tcp_mapper_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_15", "unit": "U2", "code": "2.3", "title": "TCP vs UDP: Fiabilidad vs Velocidad",
        "category": "Protocolos de Transporte",
        "desc": "Compara el 3-Way Handshake y control de flujo de TCP frente a la baja latencia de datagramas UDP.",
        "theory": "TCP (Transmission Control Protocol, RFC 793) es orientado a conexión, confiable, garantiza el orden de llegada mediante números de secuencia, realiza control de congestión y retransmite paquetes perdidos utilizando un apretón de manos inicial de 3 vías (SYN, SYN-ACK, ACK). Por su parte, UDP (User Datagram Protocol, RFC 768) es no orientado a conexión (Connectionless), sin confirmación (Best-Effort), con cabecera mínima de 8 bytes (frente a los 20 bytes de TCP), haciéndolo óptimo para streaming de video, VoIP, DNS y videojuegos multijugador.",
        "industryCase": "Si se utilizara TCP para telefonía de voz en vivo, la retransmisión de sílabas perdidas 500 ms después causaría cacofonía ininteligible; por ello, VoIP utiliza UDP (con protocolo RTP).",
        "interactiveType": "tcp_vs_udp_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_16", "unit": "U2", "code": "2.3", "title": "Resolución de Direcciones con ARP (RFC 826)",
        "category": "Protocolos de Internet",
        "desc": "Simula la emisión de una trama ARP Request en broadcast y la respuesta ARP Reply en unicast.",
        "theory": "El protocolo ARP (Address Resolution Protocol) mapea una dirección lógica IPv4 conocida a una dirección física MAC de Capa 2 desconocida en el mismo segmento local. La máquina emisora emite una trama Ethernet con MAC destino de broadcast (FF:FF:FF:FF:FF:FF) preguntando '¿Quién tiene la IP 192.168.1.1?'. El host dueño responde mediante un ARP Reply unicast directamente a la MAC del emisor, quien actualiza su tabla de caché ARP (arp -a).",
        "industryCase": "El ataque de ciberseguridad 'ARP Spoofing' o envenenamiento de caché ARP permite a un atacante engañar a los hosts de la LAN haciéndose pasar por el Gateway para interceptar todo el tráfico.",
        "interactiveType": "arp_protocol_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_17", "unit": "U2", "code": "2.3", "title": "Diagnóstico ICMP: Ping y Traceroute",
        "category": "Protocolos de Internet",
        "desc": "Envía paquetes de prueba ICMP Echo Request y comprende cómo Traceroute utiliza el campo TTL.",
        "theory": "ICMP (Internet Control Message Protocol, RFC 792) reporta errores y condiciones de red en la Capa 3. La utilidad 'ping' envía mensajes 'Echo Request' (Tipo 8) esperando 'Echo Reply' (Tipo 0). La utilidad 'traceroute' (o tracert en Windows) descubre cada salto intermedio enviando paquetes sucesivos con TTL=1, TTL=2, TTL=3... Cada router en el camino decrementa el TTL; al llegar a cero, descarta el paquete y responde con un mensaje ICMP 'Time-to-Live Exceeded' (Tipo 11), revelando su dirección IP.",
        "industryCase": "Traceroute permite a los ingenieros identificar exactamente en qué enlace troncal o proveedor de tránsito (Carrier) se está produciendo la pérdida de paquetes o congestión de una ruta hacia Internet.",
        "interactiveType": "icmp_diag_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_18", "unit": "U2", "code": "2.3", "title": "Protocolo DHCP y Ciclo DORA (RFC 2131)",
        "category": "Protocolos de Aplicación",
        "desc": "Simula paso a paso el proceso de autoconfiguración IP: Discover -> Offer -> Request -> Acknowledge.",
        "theory": "DHCP (Dynamic Host Configuration Protocol) asigna dinámicamente parámetros de red a los clientes mediante el ciclo DORA de 4 pasos por UDP (puertos 67 servidor y 68 cliente): 1) Discover: El cliente sin IP emite en broadcast buscando servidores; 2) Offer: El servidor ofrece una IP disponible y máscara; 3) Request: El cliente solicita formalmente usar dicha IP; 4) Acknowledge: El servidor confirma la concesión (Lease Time), enviando además Gateway y servidores DNS.",
        "industryCase": "En redes corporativas grandes, se configuran agentes 'DHCP Relay' (comando ip helper-address en routers Cisco) para que un servidor central DHCP atienda a múltiples VLANs remotas sin requerir un servidor en cada piso.",
        "interactiveType": "dhcp_dora_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_19", "unit": "U2", "code": "2.3", "title": "Resolución de Nombres de Dominio con DNS",
        "category": "Protocolos de Aplicación",
        "desc": "Sigue la consulta recursiva de un nombre de dominio desde los Servidores Raíz hasta el registro autoritativo.",
        "theory": "El DNS (Domain Name System, RFC 1035) es la base de datos distribuida y jerárquica que traduce nombres FQDN legibles (como www.aztlan.edu.mx) en direcciones IP numéricas. La jerarquía comprende: 1) Servidores Raíz (Root Servers, 13 letras identitarias a nivel global); 2) Servidores de Dominio de Nivel Superior TLD (.com, .mx, .edu); y 3) Servidores Autoritativos de la organización. Los tipos de registro clave son: A (IPv4), AAAA (IPv6), CNAME (alias), MX (correo electrónico) y PTR (resolución inversa).",
        "industryCase": "Los ataques de envenenamiento de DNS (DNS Cache Poisoning) redirigen a usuarios hacia sitios bancarios falsos; por ello, la industria ha adoptado masivamente extensiones de seguridad criptográfica DNSSEC.",
        "interactiveType": "dns_hierarchy_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_2_20", "unit": "U2", "code": "2.4", "title": "Ensamblador y Desensamblador de Tramas (Encapsulamiento)",
        "category": "Encapsulamiento",
        "desc": "Construye una trama completa capa por capa agregando cabeceras HTTP, TCP, IP, Ethernet y el tráiler CRC-32.",
        "theory": "El encapsulamiento es el proceso por el cual cada capa del emisor agrega su propia cabecera (Header) y/o cola (Trailer) a los datos recibidos de la capa superior antes de descender al medio físico: Datos de Aplicación -> +Header TCP (20 bytes: puertos, secuencia) = Segmento -> +Header IP (20 bytes: IPs origen/destino, TTL) = Paquete -> +Header Ethernet (14 bytes: MACs, EtherType) + Trailer FCS (4 bytes: CRC-32) = Trama Ethernet. En el receptor, ocurre el proceso inverso (Desencapsulamiento). La MTU (Maximum Transmission Unit) estándar es de 1500 bytes de carga útil.",
        "industryCase": "Si un paquete excede la MTU del enlace y tiene la bandera 'Don't Fragment' (DF) activa en la cabecera IP, el router lo descartará enviando un mensaje ICMP 'Fragmentation Needed', causando caídas en transferencias de archivos grandes (problema clásico de Path MTU Discovery).",
        "interactiveType": "frame_encapsulation_builder",
        "interactiveConfig": {}
    }
]
catalog.extend(u2_items)

# =========================================================================
# UNIDAD 3: DISPOSITIVOS DE RED (3.1 AL 3.20)
# =========================================================================
u3_items = [
    {
        "id": "ex_3_1", "unit": "U3", "code": "3.1", "title": "Clasificador Universal de Componentes Activos vs Pasivos",
        "category": "Hardware de Red",
        "desc": "Clasifica 10 componentes de infraestructura según consuman o no energía eléctrica para procesar señales.",
        "theory": "Los elementos de una red se clasifican estrictamente en dos categorías: 1) Componentes Pasivos: Aquellos que no consumen energía eléctrica ni modifican o regeneran activamente las señales; sirven exclusivamente como medio de conducción o soporte físico (ej. cable UTP, fibra óptica, patch panels, jacks modulares RJ-45, canalizaciones, racks y gabinetes); 2) Componentes Activos: Equipos electrónicos que requieren alimentación eléctrica para generar, regenerar, amplificar, enrutar o conmutar señales de datos (ej. switches, routers, firewalls, repetidores, transceptores y access points).",
        "industryCase": "En la presupuestación de un proyecto de red, las garantías son drásticamente distintas: el cableado pasivo suele certificarse con garantía del fabricante de 25 años (ej. Panduit, Belden), mientras que los equipos activos tienen ciclos de vida útil de 5 años con pólizas de soporte anual (ej. Cisco SmartNet).",
        "interactiveType": "active_passive_classifier",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_2", "unit": "U3", "code": "3.1", "title": "Mapeo de Dispositivos en la Pila OSI",
        "category": "Hardware de Red",
        "desc": "Ubica cada equipo en la capa OSI más alta en la que es capaz de tomar decisiones de reenvío.",
        "theory": "Cada dispositivo de red opera hasta una capa específica de la pila OSI: Capa 1 Física: Repetidores y Hubs (solo manejan voltajes y bits, sin interpretar direcciones); Capa 2 Enlace: Bridges y Switches Ethernet estándar (toman decisiones basándose en direcciones MAC de 48 bits); Capa 3 Red: Routers y Switches Capa 3 (examinan direcciones lógicas IP y tablas de enrutamiento); Capa 4 a 7: Firewalls con inspección de estado (SPI), proxies reversos, balanceadores de carga y firewalls de aplicaciones web (WAF).",
        "industryCase": "Comprar un switch 'Capa 2+' no sustituye a un router perimetral si el proyecto requiere soporte de protocolos de enrutamiento dinámico como OSPF o BGP hacia el proveedor de Internet.",
        "interactiveType": "device_osi_matcher",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_3", "unit": "U3", "code": "3.2", "title": "El Repetidor y la Regeneración de Señales",
        "category": "Capa Física",
        "desc": "Visualiza cómo un repetidor limpia el ruido y reconstruye la forma de onda digital cuadrada.",
        "theory": "Un repetidor es un dispositivo de Capa 1 puramente analógico/digital. A diferencia de un simple amplificador analógico (que amplifica la señal junto con el ruido acumulado), un repetidor digital muestrea la señal recibida, determina los 1s y 0s lógicos, elimina el jitter y la distorsión, y genera una señal completamente nueva y limpia con su voltaje y sincronización originales, permitiendo extender la distancia física del medio.",
        "industryCase": "En enlaces transoceánicos de fibra óptica submarina se instalan repetidores ópticos (EDFA - Erbium Doped Fiber Amplifiers) cada 70 km en el lecho marino para regenerar pulsos láser que viajan miles de kilómetros.",
        "interactiveType": "repeater_cleaner_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_4", "unit": "U3", "code": "3.2", "title": "El Hub y el Dominio de Colisión Compartido",
        "category": "Capa Física",
        "desc": "Simula la transmisión concurrente de computadoras conectadas a un Hub y observa la colisión CSMA/CD.",
        "theory": "Un Hub (concentrador) es simplemente un repetidor multipuerto de Capa 1. Todo bit que ingresa por un puerto es retransmitido ciegamente por todos los demás puertos ('inundación eléctrica'). Todos los dispositivos conectados al Hub comparten un único dominio de colisión y un único dominio de broadcast, operando obligatoriamente en modo Half-Dúplex. Si dos hosts transmiten al unísono, las señales se superponen, produciendo una colisión que activa el algoritmo de retroceso exponencial (Backoff).",
        "industryCase": "Los Hubs están obsoletos comercialmente desde el año 2000, pero comprender su funcionamiento es vital para entender por qué los switches revolucionaron el rendimiento de las redes LAN al eliminar las colisiones.",
        "interactiveType": "hub_collision_simulator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_5", "unit": "U3", "code": "3.2", "title": "Transceptores y Conversores de Medios",
        "category": "Capa Física",
        "desc": "Configura la interconexión entre cable de cobre UTP 1000BASE-T y fibra óptica mediante módulos SFP.",
        "theory": "Un transceptor (Transceiver) convierte señales de un tipo de medio físico a otro. En equipos modernos modulares, se emplean bahías SFP (Small Form-factor Pluggable para 1 Gbps) y SFP+ (para 10 Gbps). Permiten acoplar transceptores ópticos 1000BASE-SX (láser 850 nm para fibra multimodo hasta 550 m), 1000BASE-LX (1310 nm para fibra monomodo hasta 10 km) o módulos RJ-45 de cobre.",
        "industryCase": "Al conectar el switch de un piso con el del cuarto de servidores principal distante 300 metros, el ingeniero instala un módulo SFP óptico en cada switch para interconectarlos por fibra óptica, evitando la limitación de 90 m del cobre.",
        "interactiveType": "transceiver_sfp_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_6", "unit": "U3", "code": "3.3", "title": "El Puente de Red (Bridge) de 2 Puertos",
        "category": "Capa de Enlace",
        "desc": "Simula el filtrado selectivo de tramas basado en dirección MAC entre dos segmentos de red separados.",
        "theory": "El Bridge (puente de red) fue el primer dispositivo de Capa 2 en segmentar redes locales. Al recibir una trama en un puerto, examina la dirección MAC destino: si el destino está en el mismo segmento de origen, descarta la trama ('Forward/Filter decision'), evitando que el tráfico innecesario pase al otro segmento; si el destino está del otro lado, la reenvía. De este modo, divide un dominio de colisión en dos dominios independientes.",
        "industryCase": "Los switches Ethernet modernos son conceptualmente 'Bridges multipuerto de alta velocidad' donde la decisión de reenvío se ejecuta por hardware mediante circuitos ASIC en nanosegundos.",
        "interactiveType": "bridge_filtering_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_7", "unit": "U3", "code": "3.3", "title": "Operador y Aprendizaje de la Tabla CAM del Switch",
        "category": "Capa 2 (MAC)",
        "desc": "Construye paso a paso la memoria asociativa de direcciones MAC y puertos evitando el flooding innecesario.",
        "theory": "Un switch mantiene en memoria de contenido direccionable (CAM - Content Addressable Memory) una tabla que asocia direcciones MAC con sus respectivos puertos físicos. El switch aprende dinámicamente examinando la MAC ORIGEN de cada trama entrante. Si la MAC DESTINO ya está registrada en la tabla CAM, la trama se conmuta exclusivamente al puerto destino correspondiente (Unicast Forwarding); si la MAC destino es desconocida, la reenvía por todos los puertos excepto el de entrada (Flooding).",
        "industryCase": "El ataque 'CAM Table Overflow' satura la memoria del switch con 100,000 MACs falsas por segundo, forzando al switch a degradarse a modo Hub (Fail-Open) para permitir al atacante espiar el tráfico de la red.",
        "interactiveType": "cam_table_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_8", "unit": "U3", "code": "3.3", "title": "Métodos de Conmutación: Store-and-Forward vs Cut-Through",
        "category": "Conmutación en Switch",
        "desc": "Compara la verificación total de errores de Store-and-Forward frente a la ultra-baja latencia de Cut-Through.",
        "theory": "Existen 3 métodos de conmutación en switches: 1) Store-and-Forward: El switch almacena la trama completa (mínimo 64 bytes, máximo 1518 bytes), recalcula el CRC de 4 bytes del tráiler FCS y, si no hay errores, la reenvía; si hay error la descarta; 2) Cut-Through: Lee únicamente los primeros 6 bytes de la cabecera (MAC destino) y reenvía inmediatamente sin verificar errores, con latencia mínima (<5 microsegundos); 3) Fragment-Free: Lee los primeros 64 bytes para filtrar colisiones de trama antes de reenviar.",
        "industryCase": "En entornos de trading financiero de alta frecuencia y clusters de supercomputación AI se configuran switches Cisco Nexus o Arista en modo Cut-Through para raspar nanosegundos de latencia.",
        "interactiveType": "switching_methods_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_9", "unit": "U3", "code": "3.3", "title": "Dominios de Colisión vs Dominios de Broadcast",
        "category": "Arquitectura de Conmutación",
        "desc": "Identifica y contabiliza con precisión cuántos dominios de colisión y de difusión existen en una topología mixta.",
        "theory": "Reglas de oro de arquitectura de redes: 1) Un Hub forma 1 solo dominio de colisión y 1 solo dominio de broadcast en todos sus puertos; 2) Cada puerto individual de un Switch es un dominio de colisión independiente, pero todos sus puertos comparten por defecto 1 solo dominio de broadcast; 3) Cada interfaz de un Router separa tanto dominios de colisión como dominios de broadcast (los routers bloquean por defecto las tramas de difusión de Capa 2).",
        "industryCase": "En el examen de certificación Cisco CCNA, identificar el número exacto de dominios de colisión y de broadcast en diagramas de red es una competencia obligatoria de diseño.",
        "interactiveType": "domains_counter_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_10", "unit": "U3", "code": "3.3", "title": "Segmentación con VLANs (IEEE 802.1Q)",
        "category": "VLANs & Troncales",
        "desc": "Asigna puertos a VLAN 10 (Alumnos) y VLAN 20 (Docentes), y comprueba el aislamiento total del broadcast.",
        "theory": "Una VLAN (Virtual Local Area Network, IEEE 802.1Q) es una subred lógica independiente creada dentro del mismo switch físico. Cada VLAN constituye un dominio de broadcast aislado. Para transportar múltiples VLANs a través de un solo cable inter-switch, el estándar 802.1Q inserta una etiqueta (VLAN Tag) de 4 bytes en la cabecera Ethernet conteniendo un VID (VLAN Identifier de 12 bits, rango 1 a 4094). Los puertos se configuran como 'Access' (pertenecen a una sola VLAN) o 'Trunk' (transportan múltiples VLANs etiquetadas).",
        "industryCase": "En un hospital, separar la red médica de monitores cardiacos (VLAN 50) de la red Wi-Fi para pacientes (VLAN 90) mediante VLANs evita que un malware descargado por un visitante colapse los equipos biomédicos.",
        "interactiveType": "vlan_segmentation_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_11", "unit": "U3", "code": "3.3", "title": "Protocolo Spanning Tree (STP IEEE 802.1D)",
        "category": "Redundancia Capa 2",
        "desc": "Simula una topología triangular redundante de switches y observa cómo STP bloquea puertos para evitar bucles.",
        "theory": "Cuando se interconectan switches con enlaces redundantes para alta disponibilidad, se crean bucles físicos de Capa 2. Como las tramas Ethernet no poseen un campo TTL (a diferencia de los paquetes IP), una trama broadcast recirculará indefinidamente, provocando una 'Tormenta de Broadcast' (Broadcast Storm) que satura los enlaces y colapsa la red en segundos. STP (IEEE 802.1D / RSTP 802.1w) intercambia tramas BPDU, elige un Switch Raíz (Root Bridge) y bloquea lógicamente puertos redundantes (Blocking/Discarding), reactivándolos si un enlace principal falla.",
        "industryCase": "Si STP está deshabilitado por error en un switch de acceso y un usuario conecta los dos extremos de un cable de red a dos tomas del mismo switch, colapsará instantáneamente la red de todo el edificio.",
        "interactiveType": "stp_loop_prevention_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_12", "unit": "U3", "code": "3.3", "title": "Agregación de Enlaces (EtherChannel / LACP 802.3ad)",
        "category": "Agregación de Enlaces",
        "desc": "Agrupa de 2 a 4 enlaces Gigabit físicos en un solo enlace lógico Port-Channel de alta velocidad sin bucles.",
        "theory": "Normalmente STP bloquearía los enlaces paralelos entre dos switches para evitar bucles. La tecnología de agregación de enlaces (IEEE 802.3ad / LACP - Link Aggregation Control Protocol, o EtherChannel propietario de Cisco) permite combinar hasta 8 puertos físicos en un único canal lógico (Port-Channel). Esto suma el ancho de banda agregado (ej. 4 x 1 Gbps = 4 Gbps) y ofrece balanceo de carga y redundancia transparente: si un cable se corta, el canal sigue operando a 3 Gbps sin recálculo de STP.",
        "industryCase": "Las troncales entre los switches de distribución de piso y el switch central de centro de datos se configuran siempre como EtherChannel LACP para evitar cuellos de botella en horas pico.",
        "interactiveType": "etherchannel_lacp_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_13", "unit": "U3", "code": "3.4", "title": "Arquitectura Interna del Router",
        "category": "Enrutamiento IP",
        "desc": "Explora los componentes de hardware de un router empresarial: CPU, RAM, NVRAM, Flash y plano de datos.",
        "theory": "Un enrutador es una computadora especializada en interconectar redes disímiles. Su arquitectura interna comprende: 1) CPU: Ejecuta el sistema operativo de red y algoritmos de enrutamiento; 2) RAM: Almacena la tabla de enrutamiento activa, la caché ARP, buffers de paquetes y el archivo running-config; 3) NVRAM: Memoria no volátil que guarda el archivo de configuración de arranque (startup-config); 4) Memoria Flash: Almacena las imágenes del sistema operativo (Cisco IOS); 5) ROM: Contiene el programa bootstrap para el arranque (POST).",
        "industryCase": "Comprender la diferencia entre RAM y NVRAM evita que el técnico pierda horas de trabajo por olvidar ejecutar el comando 'copy running-config startup-config' antes de apagar o reiniciar el equipo.",
        "interactiveType": "router_hardware_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_14", "unit": "U3", "code": "3.4", "title": "Tabla de Enrutamiento y Prefijo Más Largo (LPM)",
        "category": "Enrutamiento IP",
        "desc": "Simula la decisión de reenvío de un router comparando múltiples rutas coincidentes según la regla Longest Prefix Match.",
        "theory": "Cuando un router recibe un paquete, busca en su tabla de enrutamiento la mejor ruta hacia la IP destino aplicando el algoritmo LPM (Longest Prefix Match o Coincidencia de Prefijo Más Largo). Si existen rutas hacia 192.168.0.0/16, 192.168.1.0/24 y 192.168.1.128/25, un paquete dirigido a 192.168.1.130 se enviará por la ruta /25 por ser la más específica (mayor cantidad de bits de red coincidentes). Si no hay coincidencia, se usa la Ruta por Defecto (0.0.0.0/0).",
        "industryCase": "Este principio permite a los proveedores de Internet tener tablas globales con más de 900,000 rutas BGP reenviando paquetes a velocidad de cable mediante hardware TCAM.",
        "interactiveType": "longest_prefix_match_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_15", "unit": "U3", "code": "3.4", "title": "Decremento de TTL y Reescritura de Cabeceras Ethernet",
        "category": "Enrutamiento IP",
        "desc": "Rastrea el paso de un paquete a través de dos routers: observa cómo cambian las MACs pero las IPs permanecen.",
        "theory": "En el enrutamiento de paquetes entre subredes: 1) Las direcciones IP de origen y destino de Capa 3 NUNCA cambian de extremo a extremo (salvo con NAT); 2) Las direcciones MAC de Capa 2 CAMBIAN en cada salto de red: el router desencapsula la trama Ethernet entrante, decrementa el campo TTL en 1 unidad, recalcula el checksum de la cabecera IP y re-encapsula el paquete en una NUEVA trama Ethernet con la MAC de su propia interfaz de salida como origen y la MAC del siguiente salto como destino.",
        "industryCase": "Si el contador TTL llega a 0, el router descarta el paquete y devuelve un mensaje ICMP 'Time Exceeded' al emisor, evitando que paquetes huérfanos circulen por siempre en la red.",
        "interactiveType": "ttl_mac_rewrite_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_16", "unit": "U3", "code": "3.4", "title": "Enrutamiento Inter-VLAN: Router-on-a-Stick vs SVI",
        "category": "Enrutamiento IP",
        "desc": "Configura subinterfaces virtuales dot1q en un router y compáralo con interfaces virtuales de Switch L3 (SVI).",
        "theory": "Como los switches de Capa 2 aíslan las VLANs, para comunicar dos VLANs distintas se requiere un dispositivo de Capa 3: 1) Router-on-a-Stick: Un router físico se conecta al switch mediante un único enlace troncal 802.1Q; en la interfaz física del router se crean subinterfaces lógicas (ej. G0/0.10 y G0/0.20) con comando 'encapsulation dot1q'; 2) Switch Capa 3 con SVI (Switch Virtual Interface): El propio switch de distribución enruta entre VLANs internamente a velocidad de bus por hardware ('interface vlan 10').",
        "industryCase": "En campus modernos con miles de usuarios, se sustituye el Router-on-a-Stick por Switches de Capa 3 porque el router físico de un solo cable se convierte en un cuello de botella severo de tráfico.",
        "interactiveType": "intervlan_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_17", "unit": "U3", "code": "3.4", "title": "Traducción de Direcciones de Red (NAT / PAT)",
        "category": "Servicios de Red",
        "desc": "Construye la tabla NAT que traduce múltiples IPs privadas RFC 1918 a una única IP pública enrutable por Internet.",
        "theory": "Debido al agotamiento de direcciones IPv4 públicas, el RFC 1631 definió NAT (Network Address Translation). La modalidad más común es PAT (Port Address Translation o NAT Overload): cientos de dispositivos con direcciones privadas (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) comparten una única IP pública asignada por el proveedor de Internet. El router mantiene una tabla de estado donde asigna a cada conexión privada un número de puerto TCP/UDP público único de salida.",
        "industryCase": "Todos los módems residenciales y routers empresariales aplican PAT; gracias a esto, una empresa con 10,000 computadoras sólo necesita pagar a su ISP por una dirección IP pública fija.",
        "interactiveType": "nat_pat_table_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_18", "unit": "U3", "code": "3.5", "title": "Firewall con Inspección de Estado (SPI)",
        "category": "Seguridad Perimetral",
        "desc": "Configura políticas de filtrado y evalúa cómo la tabla de estados permite el tráfico de retorno legítimo.",
        "theory": "Un Firewall con Inspección de Estado (Stateful Packet Inspection - SPI) no solo analiza las cabeceras individuales de los paquetes (como las antiguas listas de acceso ACL estáticas), sino que rastrea el ciclo de vida completo de cada conexión TCP/UDP en una tabla de estado activa. Si una PC interna inicia una conexión TCP hacia un servidor web externo, el firewall registra la sesión y autoriza automáticamente el tráfico de respuesta entrante, bloqueando cualquier paquete que no corresponda a una sesión previa.",
        "industryCase": "Los firewalls de última generación (NGFW de marcas como Fortinet, Palo Alto Networks y Cisco Firepower) combinan SPI con inspección profunda de paquetes (DPI) y descifrado SSL.",
        "interactiveType": "firewall_spi_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_19", "unit": "U3", "code": "3.5", "title": "Sistema de Detección y Prevención de Intrusos (IDS / IPS)",
        "category": "Seguridad Perimetral",
        "desc": "Compara la acción pasiva de un IDS (alarma) frente a la acción activa de corte de tráfico de un IPS en línea.",
        "theory": "1) IDS (Intrusion Detection System): Se ubica fuera de banda (Out-of-Band) mediante un puerto espejo (SPAN port). Analiza una copia del tráfico buscando firmas de ataques maliciosos (ej. escaneo de puertos Nmap, intentos de inyección SQL) y emite alertas al administrador, pero no puede detener el ataque en tiempo real; 2) IPS (Intrusion Prevention System): Se instala en línea (In-Line) en el flujo del tráfico; al detectar un paquete malicioso, lo descarta ('DROP') de inmediato y reconfigura el firewall para bloquear la IP del atacante.",
        "industryCase": "Un IPS correctamente configurado protege servidores contra vulnerabilidades de día cero (Zero-Day exploits) aplicando firmas de 'Virtual Patching' mientras el fabricante publica el parche definitivo.",
        "interactiveType": "ids_ips_comparison_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_3_20", "unit": "U3", "code": "3.5", "title": "Balanceador de Carga y Proxy Reverso",
        "category": "Servicios Capa 4-7",
        "desc": "Distribuye solicitudes web hacia un grupo de 3 servidores utilizando Round Robin y Menos Conexiones.",
        "theory": "Un Balanceador de Carga (Load Balancer) distribuye el tráfico entrante de los usuarios entre múltiples servidores de backend para evitar saturación y garantizar alta disponibilidad. Opera en Capa 4 (basado en IP/puerto) o en Capa 7 (inspeccionando URLs, cookies y cabeceras HTTP). Los algoritmos típicos son: Round Robin (turno secuencial), Least Connections (envía al servidor con menos conexiones activas) y Source IP Hash (afinidad de sesión persistente). Además, realiza 'Health Checks' para excluir servidores caídos.",
        "industryCase": "Plataformas como Netflix, Google y Amazon emplean balanceadores elásticos de carga para atender picos de millones de solicitudes por segundo redirigiendo el tráfico sin interrupciones.",
        "interactiveType": "load_balancer_sim",
        "interactiveConfig": {}
    }
]
catalog.extend(u3_items)

# =========================================================================
# UNIDAD 4: CABLEADO ESTRUCTURADO (4.1 AL 4.20)
# =========================================================================
u4_items = [
    {
        "id": "ex_4_1", "unit": "U4", "code": "4.1", "title": "Mapa Normativo ANSI/TIA/EIA, ISO y NOM",
        "category": "Normatividad",
        "desc": "Relaciona las normas rectoras de infraestructura con sus aplicaciones en edificios comerciales.",
        "theory": "El cableado estructurado se rige por un cuerpo normativo internacional riguroso: ANSI/TIA-568-D (estándar de cableado para telecomunicaciones en edificios comerciales); ANSI/TIA-569-D (estándar para espacios y canalizaciones); ANSI/TIA-606-C (estándar para administración, rotulado y etiquetado); ANSI/TIA-607-C (requisitos de puesta a tierra y unión); ISO/IEC 11801 (estándar internacional de cableado genérico); y en México, la NOM-001-SEDE para instalaciones eléctricas y seguridad de personas.",
        "industryCase": "No cumplir con las normas TIA/EIA anula automáticamente la certificación del fabricante del cable y expone a la empresa a clausuras o rechazo en auditorías de protección civil.",
        "interactiveType": "standards_map_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_2", "unit": "U4", "code": "4.1", "title": "Norma TIA-569: Espacios, Canalizaciones y Llenado de Ductos",
        "category": "Canalizaciones",
        "desc": "Calcula el factor de llenado máximo permitido (40%) en tuberías conduit y charolas portacables.",
        "theory": "La norma TIA-569-D especifica el diseño y construcción de canalizaciones (charolas tipo malla, escalerilla, tubería conduit de pared gruesa o delgada, ductos bajo piso). Establece estrictamente que en la instalación inicial, el factor de llenado de cables en una canalización no debe exceder el 40% del área de su sección transversal útil, reservando el 60% restante para permitir disipación térmica y futuras expansiones de cableado sin estrangulamiento.",
        "industryCase": "Saturar una charola portacable más allá del 40% incrementa la temperatura de los cables, empeora la atenuación y causa aplastamiento de los pares inferiores, destruyendo la certificación Cat 6A.",
        "interactiveType": "conduit_fill_calc",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_3", "unit": "U4", "code": "4.1", "title": "Norma TIA-606: Estándar de Administración y Etiquetado",
        "category": "Administración de Red",
        "desc": "Construye la nomenclatura oficial normalizada para identificar cuartos, racks, paneles y tomas de usuario.",
        "theory": "La norma ANSI/TIA-606-C establece los esquemas de etiquetado y registros para la infraestructura física de telecomunicaciones. Define 4 clases de administración según el tamaño de la organización. Para cada enlace horizontal, especifica un formato unívoco: 'fs-an.d-r:p', donde 'f' es el número de piso, 's' es el cuarto de telecomunicaciones, 'an' es el identificador del rack/gabinete, 'd' es el patch panel y 'p' es el número de puerto.",
        "industryCase": "Un técnico que deba reparar un servicio tarda 3 minutos en localizar la falla en una red etiquetada bajo TIA-606; en una red sin etiquetar, puede tardar días rastreando cables a ciegas.",
        "interactiveType": "tia606_labeling_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_4", "unit": "U4", "code": "4.1", "title": "Norma TIA-607: Puesta a Tierra para Telecomunicaciones",
        "category": "Sistemas de Puesta a Tierra",
        "desc": "Traza el diagrama de unión desde la barra principal TMGB hacia las barras de piso TGB y racks.",
        "theory": "La norma ANSI/TIA-607-C rige la red de puesta a tierra y unión (Grounding & Bonding) para proteger a los usuarios y equipos de telecomunicaciones contra descargas atmosféricas, picos de voltaje y estática. Los elementos indispensables son: 1) TMGB (Telecommunications Main Grounding Busbar): Barra principal de cobre en el cuarto de equipos principal, unida al electrodo eléctrico del edificio; 2) TGB (Telecommunications Grounding Busbar): Barras secundarias ubicadas en cada cuarto de telecomunicaciones; 3) Conductor vertebral de unión (TBB) de cobre mínimo 2 AWG.",
        "industryCase": "En racks con switches PoE y cables blindados F/UTP, una mala puesta a tierra genera diferencias de potencial (Ground Loops) que queman los puertos ethernet de los conmutadores.",
        "interactiveType": "grounding_tia607_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_5", "unit": "U4", "code": "4.2", "title": "Los 6 Subsistemas en el Plano Arquitectónico",
        "category": "Subsistemas TIA-568",
        "desc": "Ubica e identifica interactivamente los 6 subsistemas normativos en el corte arquitectónico de un edificio corporativo.",
        "theory": "La norma ANSI/TIA-568 estructura el cableado de un edificio comercial en exactamente 6 subsistemas modulares: 1) Instalación de Entrada (Entrance Facility - EF); 2) Cuarto de Equipos Principal (Equipment Room - ER); 3) Cuarto de Telecomunicaciones de piso (Telecommunications Room - TR); 4) Cableado Vertebral / Troncal (Backbone Cabling); 5) Cableado Horizontal (Horizontal Cabling); y 6) Área de Trabajo (Work Area - WA). Cada subsistema tiene especificaciones técnicas y límites de distancia propios.",
        "industryCase": "Esta modularidad permite actualizar la tecnología del núcleo en el cuarto de equipos (ej. cambiar switches a 10G) sin tener que reemplazar los cables horizontales que van a cada escritorio.",
        "interactiveType": "six_subsystems_blueprint",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_6", "unit": "U4", "code": "4.2", "title": "Instalación de Entrada (Entrance Facility - EF)",
        "category": "Subsistemas TIA-568",
        "desc": "Configura el punto de demarcación (Demarc) entre los servicios públicos de la operadora y la red privada.",
        "theory": "La Instalación de Entrada (EF) es el espacio donde los cables de los proveedores de servicios de telecomunicaciones (ISPs, carriers de fibra óptica, líneas troncales de telefonía) ingresan al edificio atravesando la pared exterior. Contiene el Punto de Demarcación (Demarc), que delimita la responsabilidad legal y operativa entre la compañía de telecomunicaciones y el cliente. Aloja protectores contra descargas eléctricas y transitorios primarios.",
        "industryCase": "Si el enlace de fibra de Telmex o AT&T falla antes del Demarc, la reparación corre por cuenta del ISP; si la falla ocurre después del Demarc dentro del edificio, la reparación corre a cargo de la empresa.",
        "interactiveType": "entrance_facility_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_7", "unit": "U4", "code": "4.2", "title": "Cuarto de Equipos Principal (Equipment Room - ER)",
        "category": "Subsistemas TIA-568",
        "desc": "Diseña la distribución espacial del cuarto central de servidores, conmutadores troncales y climatización.",
        "theory": "El Cuarto de Equipos (ER) es el centro neurálgico del edificio. Aloja equipos de cómputo de alta densidad: conmutadores de núcleo (Core Switches), enrutadores de frontera, servidores centrales de datos, sistemas de almacenamiento SAN y conmutadores telefónicos PBX. Sus requisitos ambientales (ASHRAE) son rigurosos: temperatura controlada entre 18°C y 27°C, humedad relativa entre 40% y 55%, piso falso antiestático, control de acceso biométrico y sistema de extinción de fuego por gas limpio (FM-200 / Novec 1230).",
        "industryCase": "Diseñar el cuarto de equipos sin redundancia de aire acondicionado conduce a caídas catastróficas por sobrecalentamiento de servidores en épocas de calor intenso.",
        "interactiveType": "equipment_room_designer",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_8", "unit": "U4", "code": "4.2", "title": "Cuarto de Telecomunicaciones (Telecom Room - TR)",
        "category": "Subsistemas TIA-568",
        "desc": "Dimensiona el cuarto de piso por cada 1,000 m² de oficinas y asegura la cobertura del cableado horizontal.",
        "theory": "El Cuarto de Telecomunicaciones (TR) es el distribuidor de planta que atiende a los usuarios de un piso específico. Aloja los patch panels donde terminan los cables horizontales y los switches de acceso de planta. La norma TIA-568 estipula que debe existir al menos un TR por cada piso del edificio, y si el área de piso excede los 1,000 m² o la distancia hacia alguna toma de usuario supera los 90 metros, se deben habilitar TRs adicionales.",
        "industryCase": "Ubicar el TR en una esquina alejada del piso provoca que los puestos del extremo opuesto violen el límite de los 90 metros; por ello, el TR debe planificarse en el centro geográfico de la planta.",
        "interactiveType": "telecom_room_sizing",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_9", "unit": "U4", "code": "4.2", "title": "Cableado Vertebral / Troncal (Backbone)",
        "category": "Subsistemas TIA-568",
        "desc": "Calcula los enlaces troncales de fibra óptica y cobre multipar que interconectan el ER central con cada TR de piso.",
        "theory": "El cableado vertebral (Backbone) proporciona las interconexiones entre el Cuarto de Equipos Principal (ER), los Cuartos de Telecomunicaciones (TR) y la Instalación de Entrada (EF). Puede ser Backbone de Campus (entre edificios) o Backbone de Edificio (vertical entre pisos). Los medios autorizados por TIA-568-D son: Fibra óptica monomodo (OS1/OS2 para distancias largas), fibra óptica multimodo (OM3/OM4/OM5 de 50/125 µm para enlaces de hasta 300-550 m a 10G/40G) y cables de cobre multipar UTP.",
        "industryCase": "Para garantizar alta disponibilidad, se instalan dos rutas de backbone por ductos completamente separados (Backbone redundante en anillo o estrella doble) para que el corte accidental de una canalización no aísle ningún piso.",
        "interactiveType": "backbone_designer_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_10", "unit": "U4", "code": "4.2", "title": "Cableado Horizontal y el Límite Estricto de 100 Metros",
        "category": "Subsistemas TIA-568",
        "desc": "Verifica las distancias máximas: Enlace permanente (90 m) + Cordones de parcheo (10 m) = Canal total (100 m).",
        "theory": "El cableado horizontal se extiende desde el patch panel del Cuarto de Telecomunicaciones hasta la roseta/jack en el Área de Trabajo. La norma ANSI/TIA-568 establece una regla matemática y física inquebrantable para par trenzado de cobre: la longitud máxima del 'Enlace Permanente' (Permanent Link) de cable rígido sólido es de 90 metros. Se permiten hasta 10 metros combinados de cordones de parcheo (Patch Cords) de cable multifilar flexible (5 m en el rack + 5 m en el puesto), totalizando un canal de 100 metros máximos.",
        "industryCase": "Un certificador Fluke marcará 'FAIL' inmediatamente en la prueba de longitud si el cable mide 91 metros, invalidando la garantía de la instalación aunque la continuidad eléctrica dé positiva.",
        "interactiveType": "horizontal_100m_rule",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_11", "unit": "U4", "code": "4.2", "title": "Área de Trabajo (Work Area - WA)",
        "category": "Subsistemas TIA-568",
        "desc": "Configura placas de pared (faceplates) con tomas de red duales RJ-45 Cat 6 para computadoras y telefonía IP.",
        "theory": "El Área de Trabajo (WA) comprende los componentes de conectividad situados entre la salida de telecomunicaciones en la pared/mueble modular y los dispositivos del usuario final (PC, teléfono VoIP, impresora, punto de acceso Wi-Fi). La norma exige que cada puesto de trabajo individual cuente con al menos dos salidas de telecomunicaciones: la primera debe ser mínimo UTP Cat 6 de 4 pares para datos; la segunda puede ser Cat 6 o fibra óptica.",
        "industryCase": "En oficinas corporativas modernas, una de las dos tomas se destina a la computadora y la otra al teléfono IP, el cual actúa a su vez como switch puente (Bridge) para ahorrar tomas adicionales.",
        "interactiveType": "work_area_faceplate_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_12", "unit": "U4", "code": "4.3", "title": "Tipos de Cable de Par Trenzado (UTP, STP, FTP)",
        "category": "Medios Guiados",
        "desc": "Compara las características constructivas de U/UTP, F/UTP y S/FTP contra interferencias electromagnéticas.",
        "theory": "Los cables de par trenzado se clasifican según la nomenclatura normalizada ISO/IEC 11801 (formato xx/yUTP): 1) U/UTP (Unshielded Twisted Pair): Sin blindaje general ni individual, el más común y económico en oficinas sin fuentes severas de ruido; 2) F/UTP (Foiled Twisted Pair): Cubierta general con lámina de aluminio y blindaje contra ruido EMI/RFI; 3) S/FTP (Shielded/Foiled): Malla de cobre exterior trenzada y cada par individual envuelto en lámina de aluminio, ofreciendo la máxima protección contra diafonía foránea (Alien Crosstalk).",
        "industryCase": "En entornos industriales con maquinaria pesada, plantas automotrices o cerca de cables de media tensión, la instalación de cable UTP sin blindaje causa pérdida masiva de tramas; se debe instalar obligatoriamente S/FTP con aterrizamiento adecuado.",
        "interactiveType": "shielding_comparison_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_13", "unit": "U4", "code": "4.3", "title": "Categorías de Cable de Red (Cat 5e a Cat 8)",
        "category": "Medios Guiados",
        "desc": "Analiza la tabla de ancho de banda en MHz, velocidades en Gbps y distancias máximas según la categoría TIA.",
        "theory": "La evolución de categorías de cable de cobre define el ancho de banda analógico (MHz) y la velocidad de datos digital: Cat 5e (100 MHz, 1 Gbps a 100 m); Cat 6 (250 MHz, 1 Gbps a 100 m y 10 Gbps hasta 37-55 m); Cat 6A (500 MHz, 10 Gbps a los 100 m completos, con aislamiento estricto de Alien Crosstalk); Cat 7 (600 MHz, apantallado individual); Cat 8 (2000 MHz / 2 GHz, 25 Gbps / 40 Gbps hasta 30 m con conectores RJ-45 en centros de datos).",
        "industryCase": "Para proyectos de nueva instalación en 2026, la norma recomienda especificar Categoría 6A como base mínima para soportar puntos de acceso Wi-Fi 6/7 y enlaces PoE++ de alta potencia.",
        "interactiveType": "utp_categories_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_14", "unit": "U4", "code": "4.3", "title": "Fibra Óptica Monomodo vs Multimodo",
        "category": "Medios Guiados",
        "desc": "Compara el diámetro de núcleo (9 µm vs 50 µm), fuentes de luz (Láser vs LED/VCSEL) y distancias de alcance.",
        "theory": "La fibra óptica transmite pulsos de luz modulados por reflexión interna total en un núcleo de sílice fundido: 1) Fibra Multimodo (MMF, OM1 a OM5): Núcleo ancho (50 µm o 62.5 µm); viajan múltiples rayos de luz simultáneos con dispersión modal que limita la distancia a 300-550 m a 10G; utiliza fuentes emisoras económicas VCSEL a 850 nm; 2) Fibra Monomodo (SMF, OS1/OS2): Núcleo ultradelgado de 9 µm; la luz viaja en un solo rayo lineal sin dispersión modal; utiliza láser a 1310 nm y 1550 nm, alcanzando distancias de 10 a 80 km sin repetidores.",
        "industryCase": "Para conectar dos edificios de un campus separados por 800 metros, la fibra multimodo no alcanza por dispersión; se debe instalar obligatoriamente fibra monomodo OS2 con transceptores 1000BASE-LX.",
        "interactiveType": "fiber_optic_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_15", "unit": "U4", "code": "4.3", "title": "Taller de Ponchado RJ-45: Normas T568A vs T568B",
        "category": "Conectividad Física",
        "desc": "Ordena los 8 hilos de colores para la norma comercial T568B y comprueba el código cromático internacional.",
        "theory": "El código de colores para conectores modulares RJ-45 de 8 contactos (8P8C) está normalizado por ANSI/TIA-568: Norma T568B (la más extendida en América Latina y EE.UU.): Pin 1: Blanco/Naranja, Pin 2: Naranja, Pin 3: Blanco/Verde, Pin 4: Azul, Pin 5: Blanco/Azul, Pin 6: Verde, Pin 7: Blanco/Marrón, Pin 8: Marrón. La norma T568A invierte las posiciones de los pares naranja y verde (Pines 1 y 2 Blanco/Verde-Verde, Pines 3 y 6 Blanco/Naranja-Naranja). Lo esencial es mantener la misma norma en ambos extremos.",
        "industryCase": "El error más común de los aprendices es ordenar los hilos por parejas de colores seguidos (ej. poner Blanco/Verde en Pin 3 y Verde en Pin 4), lo que rompe el trenzado de los pines 3 y 6, causando paradiafonía (NEXT) masiva y falla de certificación.",
        "interactiveType": "crimping_pinout_interactive",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_16", "unit": "U4", "code": "4.3", "title": "Confección de Cables Directos vs Cruzados",
        "category": "Conectividad Física",
        "desc": "Determina cuándo se requiere un cable directo (T568B en ambos lados) frente a un cable cruzado (T568A a T568B).",
        "theory": "1) Cable Directo (Straight-Through): Mismo estándar en ambos extremos (T568B - T568B). Se utiliza para conectar dispositivos que operan en diferentes capas OSI (ej. Computadora a Switch, o Router a Switch); 2) Cable Cruzado (Crossover): T568A en un extremo y T568B en el otro. Se utiliza para conectar equipos similares de la misma capa (ej. Switch a Switch, Router a Router, o PC a PC) para que el pin transmisor (Tx) de un equipo coincida con el pin receptor (Rx) del otro.",
        "industryCase": "Los conmutadores modernos implementan la tecnología 'Auto-MDIX' (IEEE 802.3ab), que detecta automáticamente si el cable es directo o cruzado y reconfigura los circuitos internos de transmisión sin intervención manual.",
        "interactiveType": "straight_cross_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_17", "unit": "U4", "code": "4.3", "title": "Terminación en Patch Panel 110 y Jacks Keystone",
        "category": "Conectividad Física",
        "desc": "Aplica la herramienta de impacto (punch-down) respetando el des-trenzado máximo permitido de 13 mm.",
        "theory": "La terminación de cable en patch panels y jacks modulares tipo Keystone se realiza mediante contactos de desplazamiento de aislamiento (IDC - Insulation Displacement Connection) bloque tipo 110 o Krone. La norma TIA-568 exige estrictamente que al abrir la cubierta del cable para ponchar, el des-trenzado de los pares nunca debe superar los 13 mm (0.5 pulgadas). El trenzado de los pares cancela el ruido electromagnético por inducción mutua; si se des-trenza de más, la diafonía (NEXT) arruina el canal.",
        "industryCase": "Un técnico poco experimentado que pele 5 cm de cable antes del conector provocará que los enlaces fallen la certificación de Gigabit Ethernet debido a pérdida de retorno y ruido en alta frecuencia.",
        "interactiveType": "punch_down_keystone_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_18", "unit": "U4", "code": "4.3", "title": "Probador de Continuidad de 8 LEDs y Detección de Fallas",
        "category": "Pruebas de Continuidad",
        "desc": "Diagnostica con el tester de 8 LEDs cables con par abierto, cortocircuito, par invertido y transposición.",
        "theory": "El probador de cableado (Wiremap Tester) envía señales secuenciales de 1 al 8 encendiendo un tren de LEDs en el transmisor y receptor. Permite detectar 5 condiciones físicas: 1) Cable Correcto: Secuencia idéntica 1-2-3-4-5-6-7-8; 2) Par Abierto (Open Pair): Un hilo está roto o mal ponchado (el LED correspondiente no enciende); 3) Cortocircuito (Short): Dos hilos se tocan (encienden dos LEDs simultáneos con brillo atenuado); 4) Par Invertido: Pines cambiados dentro del mismo par (ej. 1 con 2); 5) Par Dividido (Split Pair): Hilos de pares distintos intercambiados.",
        "industryCase": "El probador básico de LEDs solo valida continuidad eléctrica continua (DC); para garantizar que el cable transmita datos a 1 Gbps o 10 Gbps a alta frecuencia, se requiere un certificador de radiofrecuencia.",
        "interactiveType": "wiremap_led_tester_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_19", "unit": "U4", "code": "4.3", "title": "Certificación de Enlaces Fluke (NEXT, Return Loss y Atenuación)",
        "category": "Certificación de Cableado",
        "desc": "Analiza las curvas de respuesta en frecuencia de un certificador Fluke y emite el informe de liberación PASS/FAIL.",
        "theory": "La certificación formal según ANSI/TIA-568-D evalúa parámetros de radiofrecuencia críticos en todo el espectro de la categoría: 1) NEXT (Near-End Crosstalk): Diafonía en el extremo cercano entre pares adyacentes; 2) PS-NEXT (Power Sum NEXT): Suma de diafonía de todos los pares; 3) Return Loss (Pérdida de Retorno): Pérdida por reflexión debida a variaciones de impedancia (estándar 100 ohms ±15%); 4) Insertion Loss (Atenuación): Disminución de potencia; 5) Propagation Delay y Delay Skew: Retardo diferencial de llegada de los bits.",
        "industryCase": "Las pólizas de garantía de 25 años de fabricantes como CommScope, Leviton o Siemon solo se otorgan si se entrega el archivo digital original de certificación emitido por un equipo Fluke DSX-8000.",
        "interactiveType": "fluke_certification_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_4_20", "unit": "U4", "code": "4.3", "title": "Generador Automático de Etiquetas TIA-606",
        "category": "Administración de Red",
        "desc": "Genera la matriz de rotulado industrial para patch panels, placas de pared y cables horizontales de un proyecto.",
        "theory": "Conforme a la norma ANSI/TIA-606-C, las etiquetas deben ser impresas con rotuladora de transferencia térmica industrial indeleble (no escritas a mano) y resistentes al calor, humedad y fricción. La norma exige codificación por colores en el campo de distribución: Naranja (Demarcación), Verde (Conexión de red local/ISP), Morado (Equipos centrales/servidores), Azul (Cableado horizontal a estaciones de trabajo), Blanco (Troncales de primer nivel) y Gris (Troncales de segundo nivel).",
        "industryCase": "En auditorías bancarias (CNBV) y gubernamentales, una red sin rotulado formal TIA-606 no es liberada para puesta en producción, paralizando la entrega de proyectos millonarios.",
        "interactiveType": "tia606_generator_sim",
        "interactiveConfig": {}
    }
]
catalog.extend(u4_items)

# =========================================================================
# UNIDAD 5: PLANIFICACIÓN Y DISEÑO DE REDES (5.1 AL 5.20)
# =========================================================================
u5_items = [
    {
        "id": "ex_5_1", "unit": "U5", "code": "5.1", "title": "Análisis de Requerimientos y Levantamiento Técnico",
        "category": "Diseño de Redes",
        "desc": "Completa el formulario de levantamiento técnico para determinar usuarios, aplicaciones y criticidad.",
        "theory": "La fase inicial de diseño (fase 'Plan' del ciclo de vida PPDIOO de Cisco: Plan, Design, Implement, Operate, Optimize) consiste en el levantamiento exhaustivo de requerimientos organizacionales: número de empleados fijos y móviles, aplicaciones que correrán sobre la red (ERP, bases de datos SQL, streaming, CRM), disponibilidad requerida (99.9% o 'tres nueves', frente a 99.999% o 'cinco nueves'), presupuesto disponible y proyecciones de crecimiento a 3 y 5 años.",
        "industryCase": "El 70% de los proyectos de redes que fracasan no lo hacen por fallas de hardware, sino por un deficiente levantamiento inicial de requerimientos que subestimó el tráfico real de la empresa.",
        "interactiveType": "req_analysis_form_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_2", "unit": "U5", "code": "5.1", "title": "Cálculo de Tomas de Red y Densidad por Puesto",
        "category": "Diseño de Redes",
        "desc": "Calcula el número exacto de servicios de datos, telefonía VoIP, cámaras IP y access points por metro cuadrado.",
        "theory": "El dimensionamiento de servicios sigue directrices de densidad arquitectónica: Puestos operativos estándar: 2 tomas RJ-45 Cat 6; Puestos de directivos o diseño: 3 tomas; Salas de reuniones: 4 tomas en mesa + tomas de pared para pantalla/videoconferencia; Puntos de acceso Wi-Fi: 1 toma PoE por cada 100-150 m² de planta libre; Cámaras IP CCTV: tomas perimetrales en accesos, pasillos y áreas de caja; Impresoras de red y fotocopiadoras departamentales: 1 toma dedicada.",
        "industryCase": "Planificar un factor de crecimiento del 25% en el número de tomas evita costosas obras civiles de re-cableado apenas dos años después de inauguradas las oficinas.",
        "interactiveType": "drops_density_calc",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_3", "unit": "U5", "code": "5.1", "title": "Presupuesto de Potencia PoE (Power over Ethernet)",
        "category": "Diseño de Redes",
        "desc": "Calcula el consumo total en watts de teléfonos IP, APs Wi-Fi y cámaras para dimensionar los switches PoE.",
        "theory": "Power over Ethernet (PoE) permite suministrar energía eléctrica continua y datos a través del mismo cable de par trenzado UTP Cat 6. Los estándares IEEE son: 1) IEEE 802.3af (PoE estándar): hasta 15.4W por puerto (12.95W garantizados en el dispositivo, ideal para teléfonos IP básicos); 2) IEEE 802.3at (PoE+): hasta 30W por puerto (25.5W garantizados, para puntos de acceso Wi-Fi 6 y cámaras PTZ); 3) IEEE 802.3bt (4PPoE / PoE++): hasta 60W (Tipo 3) y 90W (Tipo 4, para iluminación LED y pantallas inteligentes).",
        "industryCase": "Un switch de 24 puertos con un presupuesto de energía (PoE Power Budget) de 370W puede alimentar 24 teléfonos 802.3af (24 x 15.4W = 369.6W), pero solo 12 puntos de acceso 802.3at (12 x 30W = 360W); exceder el presupuesto apaga aleatoriamente los puertos.",
        "interactiveType": "poe_budget_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_4", "unit": "U5", "code": "5.1", "title": "Estimación de Ancho de Banda y Capacidad de Enlace WAN",
        "category": "Diseño de Redes",
        "desc": "Calcula el ancho de banda simétrico del enlace a Internet considerando usuarios concurrentes y horas pico.",
        "theory": "El ancho de banda de salida a Internet no es la simple suma de los anchos de banda máximos individuales, sino que se calcula considerando el factor de concurrencia y los perfiles de consumo: BW_total = N_usuarios * BW_perfil * Factor_concurrencia (típicamente 0.6 a 0.8 en empresas). Perfil ligero (correo y web): 1 a 2 Mbps/usuario; Perfil multimedia y videollamadas HD continuas: 4 a 6 Mbps/usuario; Perfil ingeniería y transferencias pesadas: 10 a 20 Mbps/usuario. Se añade un 30% de margen de seguridad para ráfagas.",
        "industryCase": "Contratar un enlace WAN simétrico dedicado con SLA del 99.8% (fibra directa con garantía de latencia <15 ms) es vital para empresas que operan con telefonía IP y sistemas en la nube como Microsoft 365 o AWS.",
        "interactiveType": "bandwidth_wan_estimator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_5", "unit": "U5", "code": "5.2", "title": "Modelo Jerárquico de Red de 3 Capas Cisco",
        "category": "Diseño Lógico",
        "desc": "Distribuye los switches y routers en las tres capas jerárquicas: Núcleo (Core), Distribución y Acceso.",
        "theory": "El diseño jerárquico modularizado divide la red en 3 capas bien diferenciadas: 1) Capa de Acceso: Conecta a los usuarios finales y dispositivos; aplica políticas de seguridad de puertos (Port Security) y asignación de VLANs; 2) Capa de Distribución: Agrega el tráfico de múltiples switches de acceso, realiza enrutamiento inter-VLAN, aplica listas de control de acceso (ACLs) y balanceo de carga; 3) Capa de Núcleo (Core): La autopista de alta velocidad de la red; su única función es conmutar paquetes a velocidad ultra-rápida sin inspección pesada que cause retardo.",
        "industryCase": "En edificios pequeños o medianos, las capas de núcleo y distribución se fusionan en lo que se conoce como 'Diseño de Núcleo Colapsado' (Collapsed Core), abaratando costos de equipamiento.",
        "interactiveType": "three_tier_hierarchy_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_6", "unit": "U5", "code": "5.2", "title": "Matriz Departamental de VLANs y Segmentación",
        "category": "Diseño Lógico",
        "desc": "Construye la matriz lógica asignando IDs de VLAN, nombres descriptivos, subredes y prioridades QoS.",
        "theory": "Una red corporativa bien planificada no mezcla nunca el tráfico en una sola red plana. Se debe estructurar una matriz de VLANs: VLAN 10 (Dirección General), VLAN 20 (Administración y Finanzas), VLAN 30 (Ventas y Mercadotecnia), VLAN 40 (Ingeniería y Sistemas), VLAN 50 (Telefonía IP / Voz, con prioridad de calidad de servicio 802.1p CoS 5), VLAN 60 (Videovigilancia CCTV), VLAN 70 (Invitados Wi-Fi, aislada de la red interna) y VLAN 99 (Gestión de switches y routers).",
        "industryCase": "Asignar la telefonía IP a su propia VLAN de voz garantiza que las llamadas no sufran pérdida de paquetes ni jitter cuando un usuario descargue un archivo pesado en la VLAN de datos.",
        "interactiveType": "vlan_matrix_builder",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_7", "unit": "U5", "code": "5.2", "title": "Redundancia de Primer Salto (HSRP / VRRP)",
        "category": "Alta Disponibilidad",
        "desc": "Configura una dirección IP virtual (VIP) compartida entre dos routers y simula la caída del router activo.",
        "theory": "Los protocolos FHRP (First Hop Redundancy Protocol, como HSRP propietario de Cisco o VRRP estándar IEEE) permiten que dos o más routers compartan una dirección IP y MAC virtual que actúa como Gateway por defecto para todos los hosts de la subred. Uno de los routers asume el rol 'Activo' (Active/Master) y el otro el rol 'En espera' (Standby/Backup) enviando paquetes 'Hello' periódicos. Si el router activo cae, el router standby asume el control en menos de 3 segundos de forma 100% transparente para los usuarios.",
        "industryCase": "Sin HSRP, si el router de salida a Internet falla, el administrador tendría que pasar computadora por computadora reconfigurando manualmente la IP del Gateway para restaurar el servicio.",
        "interactiveType": "hsrp_vrrp_failover_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_8", "unit": "U5", "code": "5.2", "title": "Plan Maestro de Direccionamiento IP y Políticas",
        "category": "Direccionamiento IP",
        "desc": "Elige el bloque privado RFC 1918 adecuado y distribuye los rangos para escalabilidad a 5 años.",
        "theory": "El plan maestro de direccionamiento define cómo se utilizarán los bloques de direcciones IPv4 privadas según el RFC 1918: Clase A (10.0.0.0/8, 16.7 millones de IPs, ideal para corporativos con múltiples sucursales); Clase B (172.16.0.0/12, 1 millón de IPs); Clase C (192.168.0.0/16, 65,536 IPs, ideal para sedes pequeñas). El diseño debe seguir una lógica nemotécnica (ej. 10.Piso.VLAN.Host) para simplificar la lectura de trazas y la configuración de listas de control de acceso (ACLs).",
        "industryCase": "Adoptar una nomenclatura ordenada (ej. IP del switch = .2, IP del router/gateway = .1, rango DHCP = .50 a .200) ahorra cientos de horas de soporte técnico a lo largo de los años.",
        "interactiveType": "ip_master_plan_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_9", "unit": "U5", "code": "5.3", "title": "Conversor Binario / Decimal de Máscaras y Notación CIDR",
        "category": "Subnetting IPv4",
        "desc": "Entrena interactivamente la conversión de prefijos CIDR (/24 a /30) a notación decimal punteada y número de hosts.",
        "theory": "Una máscara de subred IPv4 consta de 32 bits divididos en 4 octetos. Los bits en '1' representan la porción de red y los bits en '0' la porción de host. La notación CIDR (Classless Inter-Domain Routing, RFC 1519) resume los bits encendidos con una barra inclinada: /24 = 255.255.255.0 (8 bits para hosts -> 2^8 - 2 = 254 hosts); /26 = 255.255.255.192 (6 bits para hosts -> 62 hosts); /28 = 255.255.255.240 (14 hosts); /30 = 255.255.255.252 (2 hosts utilizables). La fórmula de hosts utilizables es siempre: N = 2^h - 2 (restando ID de red y broadcast).",
        "industryCase": "El cálculo rápido de máscaras binarias y subredes es una de las destrezas operativas más evaluadas en entrevistas técnicas para puestos de administración de redes y ciberseguridad.",
        "interactiveType": "cidr_binary_trainer",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_10", "unit": "U5", "code": "5.3", "title": "Diseñador de Subredes VLSM para 5 Departamentos",
        "category": "Subnetting IPv4",
        "desc": "Aplica la metodología VLSM para asignar subredes óptimas a requerimientos desiguales de hosts sin desperdicio.",
        "theory": "VLSM (Variable Length Subnet Masking) permite utilizar máscaras de diferente longitud dentro de un mismo espacio de direccionamiento, eliminando el masivo desperdicio de direcciones que ocurría con el subnetting tradicional de clase fija. Metodología estricta de cálculo: 1) Ordenar los requerimientos de mayor a menor número de hosts; 2) Calcular la potencia de 2 suficiente para cada departamento (2^h - 2 >= requerimiento); 3) Determinar la máscara CIDR correspondiente; 4) Asignar el bloque y continuar secuencialmente con el siguiente segmento sin solapamientos.",
        "industryCase": "En una empresa que necesita 120 hosts en Ventas, 60 en Producción y 12 en Servidores, el subnetting clásico obligaría a usar bloques /24 desperdiciando cientos de IPs; con VLSM se asigna un /25, un /26 y un /28 con eficiencia del 90%.",
        "interactiveType": "vlsm_designer_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_11", "unit": "U5", "code": "5.3", "title": "Enlaces WAN Punto a Punto con Máscaras /30 y /31",
        "category": "Subnetting IPv4",
        "desc": "Comprende la asignación de enlaces de interconexión de routers con máscaras /30 tradicionales y /31 según RFC 3021.",
        "theory": "En un enlace serial o túnel punto a punto entre dos routers, únicamente se requieren dos direcciones IP (una para cada interfaz del enlace). Tradicionalmente se utiliza una máscara /30 (255.255.255.252): genera un bloque de 4 direcciones, donde la primera es la red, la última es el broadcast, y las 2 intermedias se asignan a los routers (desperdicio del 50%). El RFC 3021 modernizó esto autorizando máscaras /31 (255.255.255.254) en enlaces punto a punto: no reserva red ni broadcast, aprovechando el 100% de las 2 direcciones.",
        "industryCase": "Los proveedores de tránsito de Internet con miles de enlaces punto a punto migraron masivamente a prefijos /31 para ahorrar miles de valiosas direcciones IPv4 públicas en sus troncales.",
        "interactiveType": "p2p_mask_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_12", "unit": "U5", "code": "5.3", "title": "Resumen de Rutas y Supernetting CIDR",
        "category": "Subnetting IPv4",
        "desc": "Agrupa 4 subredes contiguas /24 en un único prefijo supernet /22 para optimizar tablas de enrutamiento.",
        "theory": "La sumarización de rutas (Route Summarization o Supernetting) consiste en agrupar un conjunto de redes contiguas que comparten los mismos bits iniciales más significativos en una sola ruta representativa. Por ejemplo, las cuatro redes contiguas: 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24 y 192.168.3.0/24 coinciden en sus primeros 22 bits; por lo tanto, pueden anunciarse como una única superred: 192.168.0.0/22.",
        "industryCase": "La sumarización reduce el tamaño de las tablas de rutas de los routers de 5,000 entradas a 200, liberando memoria RAM de los equipos y acelerando drásticamente el tiempo de convergencia de OSPF y BGP.",
        "interactiveType": "supernetting_lab",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_13", "unit": "U5", "code": "5.4", "title": "Dimensionador de Racks y Gabinetes de 19 Pulgadas",
        "category": "Infraestructura Física",
        "desc": "Calcula las unidades de rack 'U' para patch panels, switches, PDU y UPS con holgura del 30% según TIA-569.",
        "theory": "Un rack estándar para telecomunicaciones tiene un ancho de montaje de 19 pulgadas (482.6 mm). La altura de los equipos se mide en Unidades de Rack ('U' o 'RU'), donde 1U equivale exactamente a 1.75 pulgadas (44.45 mm). Todo diseño debe contemplar: Patch panels (1U cada 24 puertos), organizadores horizontales de cable (1U por cada patch panel o switch para mantener el orden de parcheo), switches (1U), servidores (2U a 4U), PDU de alimentación (1U) y UPS de baterías (2U a 3U), añadiendo un 30% de holgura futura según TIA-569.",
        "industryCase": "Seleccionar un gabinete de pared de 12U cuando el proyecto requería 18U obliga a desmontar toda la instalación y comprar un gabinete nuevo con sobrecostos y retrasos.",
        "interactiveType": "rack_dimensioner_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_14", "unit": "U5", "code": "5.4", "title": "Cálculo de Carga Térmica y Climatización en BTUs",
        "category": "Climatización ER/TR",
        "desc": "Calcula la disipación térmica de los equipos en Watts y determina la capacidad del aire acondicionado en BTU/h.",
        "theory": "Toda la energía eléctrica que consumen los equipos activos de red (switches, servidores, fuentes de alimentación) se disipa al ambiente en forma de calor térmico. La conversión fundamental de energía es: 1 Watt de consumo continuo equivale a 3.4121 BTU por hora (British Thermal Units). Para dimensionar el equipo de aire acondicionado del cuarto de cómputo se suman los Watts de todos los equipos, se multiplica por 3.4121 y se agrega la carga térmica de iluminación, personas y transferencia por paredes, más un 20% de factor de seguridad.",
        "industryCase": "1 tonelada de refrigeración equivale a 12,000 BTU/h. Si la sala genera 24,000 BTU/h de calor, se requiere un minisplit de precisión de al menos 2.5 toneladas para mantener la temperatura en los 22°C exigidos por ASHRAE.",
        "interactiveType": "btu_thermal_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_15", "unit": "U5", "code": "5.4", "title": "Dimensionamiento de Respaldo Eléctrico con UPS",
        "category": "Respaldo Eléctrico",
        "desc": "Calcula la potencia en VA/Watts y la autonomía en minutos de las baterías ante cortes de energía.",
        "theory": "Un sistema de alimentación ininterrumpida (UPS - Uninterruptible Power Supply) de tecnología 'Online de Doble Conversión' aísla los equipos de anomalías eléctricas (picos, caídas, ruido armónico) y proporciona energía de emergencia mediante bancos de baterías. La potencia aparente se mide en Volt-Amperios (VA) y la real en Watts: Watts = VA * Factor_de_potencia (típicamente 0.8 o 0.9). El tiempo de autonomía (Runtime) debe dimensionarse para soportar al menos 30 a 60 minutos o hasta el encendido del generador diésel.",
        "industryCase": "Un conmutador de hospital o centro de monitoreo que se apague por 2 minutos ante un apagón de la red eléctrica puede costar vidas humanas y pérdidas financieras irreparables.",
        "interactiveType": "ups_runtime_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_16", "unit": "U5", "code": "5.4", "title": "Diseño de Canalizaciones y Charolas Electro-soldadas",
        "category": "Canalizaciones",
        "desc": "Calcula el peso total de los mazos de cables y verifica los radios de curvatura normativos para cobre y fibra.",
        "theory": "La instalación de canalizaciones colgantes (charolas tipo malla de alambre electro-soldado o escalerillas) debe calcular la carga estática máxima por metro lineal (peso combinado de los cables). Además, se deben respetar los radios mínimos de curvatura: para cable de par trenzado UTP, el radio de curvatura en codos y bajadas nunca debe ser inferior a 4 veces el diámetro exterior del cable (aprox. 25 mm); para fibra óptica, nunca inferior a 10 a 20 veces el diámetro exterior para evitar micro-curvaturas y macro-curvaturas que atenúen el haz de luz.",
        "industryCase": "Doblajes forzados en esquinas a 90 grados sin curva suave estrangulan la fibra óptica por macro-curvatura, provocando una atenuación instantánea de más de 3 dB que bloquea el enlace.",
        "interactiveType": "trays_radius_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_17", "unit": "U5", "code": "5.5", "title": "Generador de Lista de Materiales (BOM) y Presupuesto",
        "category": "Costos & Presupuesto",
        "desc": "Genera la cotización formal de equipamiento pasivo, activo, mano de obra y licencias en dólares y pesos mexicanos.",
        "theory": "El BOM (Bill of Materials o Lista de Materiales) desglosa con exactitud cuantitativa cada uno de los elementos requeridos para ejecutar la obra: número de bobinas de 305 m de cable UTP Cat 6A, cajas de conectores RJ-45, patch panels de 24 puertos, cordones de parcheo de 1 m y 2 m, placas faceplates, jacks modulares, tramos de 3 m de tubería conduit o charola, switches PoE administrables, racks de 42U, UPS de 3 kVA, consumibles y mano de obra calificada de instalación certificada.",
        "industryCase": "Omitir los cordones de parcheo o el herraje de montaje en el BOM inicial puede generar un déficit imprevisto de miles de dólares en el presupuesto de entrega del proyecto.",
        "interactiveType": "bom_budget_generator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_18", "unit": "U5", "code": "5.6", "title": "Plan de Pruebas y Matriz de Aceptación de Enlaces",
        "category": "Control de Calidad",
        "desc": "Ejecuta el protocolo de verificación formal para liberar y certificar el 100% de los nodos instalados.",
        "theory": "El plan de pruebas y aseguramiento de calidad (QA) es el protocolo formal mediante el cual el cliente o interventoría acepta la entrega de la infraestructura de red. Comprende una matriz de 5 pruebas: 1) Inspección visual de canalizaciones, peinado de cables y holgura en racks; 2) Verificación del 100% del etiquetado según norma TIA-606; 3) Pruebas de continuidad y mapa de cableado en todos los nodos; 4) Certificación de radiofrecuencia con equipo Fluke entregando reporte PDF; 5) Prueba funcional de tráfico de red y pruebas de caída controlada de redundancia.",
        "industryCase": "La firma de la 'Matriz de Aceptación Técnica' es el hito contractual que libera el pago del 30% de liquidación final del proyecto por parte del cliente.",
        "interactiveType": "qa_acceptance_matrix_sim",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_19", "unit": "U5", "code": "5.6", "title": "Análisis de Retorno de Inversión (ROI) y Continuidad",
        "category": "Evaluación Financiera",
        "desc": "Calcula el costo del tiempo de inactividad (Downtime) y justifica financieramente la inversión en infraestructura.",
        "theory": "Justificar la inversión en cableado de calidad y redundancia de red ante la dirección de una empresa requiere un análisis financiero de Retorno de Inversión (ROI) y costo del tiempo de inactividad (Downtime Cost): Costo_caída = Horas_caída * (Sueldos_paralizados + Ventas_no_realizadas + Daño_reputación). Una red no redundante con componentes baratos que falle 10 horas al año en una empresa con 100 empleados puede costar más de $50,000 USD en productividad perdida, justificando con creces la inversión en cableado certificado y switches redundantes.",
        "industryCase": "Presentar un análisis de ROI fundamentado en mitigación de riesgos operativos convierte la propuesta técnica de red de un 'gasto de sistemas' a una 'inversión estratégica de continuidad de negocio'.",
        "interactiveType": "roi_downtime_calculator",
        "interactiveConfig": {}
    },
    {
        "id": "ex_5_20", "unit": "U5", "code": "5.7", "title": "Generador Oficial de Memoria Técnica Imprimible",
        "category": "Documentación Final",
        "desc": "Genera el informe técnico formal de entrega y liberación del Proyecto Integrador listo para imprimir y firmar.",
        "theory": "La Memoria Técnica es el documento cumbre de la ingeniería de redes. Sintetiza todo el trabajo realizado en la asignatura: portada oficial con sellos institucionales de la Universidad Aztlán, ficha técnica del proyecto (Clave 634), justificación de la arquitectura adoptada, planos arquitectónicos de ubicación de los 6 subsistemas, memoria de cálculo de direccionamiento VLSM, resultados de las pruebas de certificación Fluke, memoria de etiquetado TIA-606, catálogo de conceptos y firmas de liberación del Ingeniero Responsable y del Docente Titular.",
        "industryCase": "Es el entregable profesional que todo egresado de ingeniería en sistemas debe saber redactar y presentar para acreditar proyectos ejecutivos en el sector corporativo y de gobierno.",
        "interactiveType": "tech_memory_generator",
        "interactiveConfig": {}
    }
]
catalog.extend(u5_items)

print(f"Total de ejercicios compilados: {len(catalog)}")
assert len(catalog) == 100, f"Error: Se esperaban 100 ejercicios y hay {len(catalog)}"

# Guardar catalogo temporal en json para armar el modulo JS
with open("exercises_catalog.json", "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print("exercises_catalog.json generado exitosamente.")
