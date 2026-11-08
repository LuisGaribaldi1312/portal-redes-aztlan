/**
 * PORTAL EDUCATIVO DE REDES DE COMPUTADORAS
 * UNIVERSIDAD AZTLÁN - INGENIERÍA EN SISTEMAS COMPUTACIONALES
 * CICLO: SEXTO CUATRIMESTRE | CLAVE: 634
 */

// Instancias globales de simuladores
let topoSim = null;
let encapSim = null;
let switchSim = null;
let crimpSim = null;

// Base de preguntas para Quizzes y Exámenes
const COURSE_QUIZZES = {
  "u1": [
    {
      "q": "¿Qué red de conmutación de paquetes creada en 1969 por DARPA sentó las bases de la Internet moderna?",
      "options": [
        "NSFNET",
        "ARPANET",
        "ALOHANET",
        "BITNET"
      ],
      "answer": 1,
      "why": "ARPANET conectó inicialmente 4 nodos universitarios (UCLA, Stanford, UCSB y Utah) utilizando minicomputadoras Honeywell DDP-516 como procesadores de mensajes IMP (RFC 1)."
    },
    {
      "q": "En una topología en Malla Completa (Full Mesh) con 8 enrutadores, ¿cuántos enlaces físicos se requieren?",
      "options": [
        "16 enlaces",
        "28 enlaces",
        "56 enlaces",
        "64 enlaces"
      ],
      "answer": 1,
      "why": "La fórmula matemática para topología en malla completa es n(n - 1) / 2. Por tanto: 8 * (7) / 2 = 56 / 2 = 28 enlaces físicos."
    },
    {
      "q": "¿Cuál es la principal desventaja de una topología física en Bus clásico con cable coaxial?",
      "options": [
        "Alto costo en cableado de fibra óptica",
        "Punto único de fallo en el switch central",
        "Todo el tráfico comparte un único medio y una ruptura en el cable o falla de terminador colapsa toda la red",
        "Requiere baterías redundantes en cada terminador"
      ],
      "answer": 2,
      "why": "En la topología en bus, si el cable coaxial se corta o se desconecta un terminador de 50 ohms, la señal rebota produciendo interferencia destructiva que inutiliza toda la red."
    },
    {
      "q": "Según el Teorema de Shannon-Hartley C = B · log₂(1 + S/N), ¿qué ocurre con la capacidad máxima de un canal si el nivel de ruido aumenta drásticamente manteniendo constante el ancho de banda?",
      "options": [
        "La capacidad aumenta porque el ruido amplifica la señal",
        "La capacidad se reduce porque disminuye la relación Señal/Ruido (SNR)",
        "La capacidad se mantiene constante porque solo depende del voltaje",
        "El canal se convierte automáticamente en full-dúplex"
      ],
      "answer": 1,
      "why": "El Teorema de Shannon establece que la capacidad de información C es proporcional a log₂(1 + SNR). Si el ruido N aumenta, la relación S/N disminuye, reduciendo la tasa de bits sin error que el canal puede sostener."
    },
    {
      "q": "Conforme al Teorema de Nyquist para canales sin ruido C = 2B · log₂(M), si se utiliza modulación de 16 niveles de señalización (M=16) en un canal de 1 MHz, ¿cuál es la tasa binaria teórica?",
      "options": [
        "2 Mbps",
        "4 Mbps",
        "8 Mbps",
        "16 Mbps"
      ],
      "answer": 2,
      "why": "log₂(16) = 4 bits por símbolo. Aplicando la fórmula de Nyquist: C = 2 * 1,000,000 * 4 = 8,000,000 bps = 8 Mbps."
    },
    {
      "q": "¿Qué modo de transmisión describe una comunicación bidireccional donde ambos extremos pueden transmitir, pero NO de manera simultánea (ej. walkie-talkie o Hub Ethernet)?",
      "options": [
        "Simplex",
        "Half-Dúplex",
        "Full-Dúplex",
        "Multiplex"
      ],
      "answer": 1,
      "why": "Half-Dúplex permite la comunicación en ambos sentidos pero de forma alternada en el tiempo; si ambos transmiten a la vez ocurre una colisión en el medio compartido."
    },
    {
      "q": "¿Cuál es la clasificación geográfica correspondiente a una red que interconecta múltiples edificios de una misma universidad o corporativo mediante fibra óptica privada?",
      "options": [
        "PAN (Personal Area Network)",
        "LAN (Local Area Network)",
        "CAN (Campus Area Network)",
        "WAN (Wide Area Network)"
      ],
      "answer": 2,
      "why": "Una red CAN (Campus Area Network) cubre un área geográfica delimitada de varios edificios contiguos (como una ciudad universitaria o parque industrial) interconectados por infraestructura privada."
    },
    {
      "q": "¿Cuál es la diferencia fundamental entre la conmutación de circuitos y la conmutación de paquetes?",
      "options": [
        "La conmutación de circuitos solo utiliza fibra óptica y la de paquetes cable de cobre",
        "La conmutación de circuitos reserva un canal físico dedicado continuo durante toda la sesión, mientras que la de paquetes divide la información en fragmentos que comparten dinámicamente los enlaces",
        "La conmutación de paquetes no permite transmitir voz ni video",
        "La conmutación de circuitos fue inventada por el IETF en 1991"
      ],
      "answer": 1,
      "why": "La conmutación de circuitos (telefonía tradicional) reserva ancho de banda fijo ininterrumpido. La conmutación de paquetes (Internet) aprovecha la multiplexación estadística compartiendo enlaces de forma eficiente."
    },
    {
      "q": "En métricas de calidad de servicio (QoS), ¿cómo se define el parámetro de Jitter y cuál es su umbral máximo aceptable para telefonía IP (VoIP)?",
      "options": [
        "Es el ancho de banda mínimo y debe ser mayor a 1 Gbps",
        "Es la variación estadística en el retardo de llegada de paquetes sucesivos y debe ser estrictamente menor a 30 ms",
        "Es la pérdida de potencia en decibelios y debe ser de 100 dB",
        "Es el número de saltos de router y debe ser menor a 3"
      ],
      "answer": 1,
      "why": "El Jitter es la fluctuación temporal en la latencia de paquetes. Para telefonía IP y videoconferencia en tiempo real, valores superiores a 30 ms provocan audio entrecortado y pérdida de inteligibilidad."
    },
    {
      "q": "¿Cuál es la causa física de la atenuación de una señal en cables de par trenzado de cobre y por qué la norma TIA limita el enlace permanente a 90 metros?",
      "options": [
        "La señal se destruye por la presencia de conectores RJ-45 dorados",
        "La resistencia óhmica del conductor de cobre y las pérdidas dieléctricas disipan energía en calor, haciendo que la señal caiga por debajo de la sensibilidad del receptor a más de 90 m",
        "El estándar IEEE 802.3 prohíbe cables largos para evitar la radiación solar",
        "Los routers no pueden enviar paquetes IP a más de 90 metros"
      ],
      "answer": 1,
      "why": "La resistencia del cobre (R = ρ·L/S) produce atenuación proporcional a la distancia y la frecuencia. A más de 90 metros de cable sólido, la atenuación degrada la señal impidiendo distinguir los bits de forma fiable."
    }
  ],
  "u2": [
    {
      "q": "¿En qué capa del Modelo OSI opera el protocolo IP y cuál es su PDU correspondiente?",
      "options": [
        "Capa 2 (Enlace) - Trama (Frame)",
        "Capa 3 (Red) - Paquete (Packet)",
        "Capa 4 (Transporte) - Segmento (Segment)",
        "Capa 1 (Física) - Bits"
      ],
      "answer": 1,
      "why": "La capa 3 (Red) maneja el direccionamiento lógico global (IP) y el enrutamiento. Su Unidad de Datos de Protocolo (PDU) es el Paquete."
    },
    {
      "q": "¿Qué estándar del Comité IEEE 802 define formalmente a las redes inalámbricas Wi-Fi?",
      "options": [
        "IEEE 802.3",
        "IEEE 802.5",
        "IEEE 802.11",
        "IEEE 802.15"
      ],
      "answer": 2,
      "why": "IEEE 802.11 define la capa física y MAC para redes inalámbricas WLAN (Wi-Fi). Por contraste, IEEE 802.3 define Ethernet cableado."
    },
    {
      "q": "¿Cuál es la función del campo FCS (Frame Check Sequence) en el tráiler de una trama Ethernet (Capa 2)?",
      "options": [
        "Cifrar la contraseña de red",
        "Detectar errores de transmisión en los bits usando el algoritmo matemático CRC-32",
        "Establecer la velocidad del puerto a 1 Gbps",
        "Asignar una dirección IP dinámica por DHCP"
      ],
      "answer": 1,
      "why": "El campo FCS contiene un valor de comprobación de redundancia cíclica CRC-32 de 4 bytes. Si el receptor detecta discrepancia al recalcular el CRC, la trama se descarta de inmediato por corrupta."
    },
    {
      "q": "¿Cuál de las siguientes describe con exactitud la correspondencia entre el Modelo OSI (7 capas) y la suite TCP/IP (4 capas)?",
      "options": [
        "La capa de Internet de TCP/IP equivale a las capas Física y Enlace de OSI",
        "La capa de Aplicación de TCP/IP engloba las capas 5 (Sesión), 6 (Presentación) y 7 (Aplicación) de OSI",
        "Ambos modelos tienen exactamente el mismo número y nombre de capas",
        "TCP/IP eliminó la capa de transporte"
      ],
      "answer": 1,
      "why": "En la arquitectura TCP/IP (modelo DoD), la capa de Aplicación agrupa todas las funciones de diálogo, formateo y servicios de usuario que OSI separó en Sesión, Presentación y Aplicación."
    },
    {
      "q": "¿Cuál es la diferencia crítica entre los protocolos de transporte TCP y UDP?",
      "options": [
        "TCP no utiliza números de puerto y UDP sí",
        "TCP es orientado a conexión con 3-Way Handshake, garantía de entrega y control de flujo; UDP es no orientado a conexión y sin confirmaciones, ideal para streaming y VoIP",
        "UDP es más lento que TCP porque cifra todos los paquetes",
        "TCP solo funciona sobre fibra óptica"
      ],
      "answer": 1,
      "why": "TCP (RFC 793) establece conexión previa mediante SYN, SYN-ACK, ACK y retransmite paquetes perdidos. UDP (RFC 768) envía datagramas sin acuse de recibo para privilegiar la mínima latencia en tráfico multimedia."
    },
    {
      "q": "¿Cuál es el propósito del protocolo ARP (Address Resolution Protocol, RFC 826)?",
      "options": [
        "Traducir nombres de dominio como google.com a direcciones IP",
        "Resolver la dirección física MAC de Capa 2 correspondiente a una dirección lógica IPv4 conocida en la misma subred",
        "Asignar contraseñas a los switches",
        "Filtrar virus en los puertos Ethernet"
      ],
      "answer": 1,
      "why": "Cuando un host desea enviar una trama Ethernet a un vecino cuya IP conoce pero desconoce su MAC, emite un ARP Request en broadcast; el dueño responde con su MAC en un ARP Reply unicast."
    },
    {
      "q": "¿Cómo utiliza la herramienta 'Traceroute' el campo TTL (Time to Live) del encabezado IPv4 para descubrir la ruta hacia un destino?",
      "options": [
        "Envía paquetes con TTL aleatorio para medir el ancho de banda",
        "Envía paquetes sucesivos incrementando el TTL desde 1; cada router decrementa el TTL en 1 y al llegar a cero descarta el paquete respondiendo con un mensaje ICMP Time Exceeded",
        "Cifra la dirección MAC de cada router intermedio",
        "Solicita la tabla de contraseñas de cada enrutador"
      ],
      "answer": 1,
      "why": "Al enviar paquetes con TTL=1, TTL=2, TTL=3..., cada salto intermedio agota el TTL y devuelve un mensaje ICMP Tipo 11 (Time Exceeded), permitiendo identificar la dirección IP de cada router de la ruta."
    },
    {
      "q": "¿Cuáles son los 4 pasos del ciclo DORA que ejecuta el protocolo DHCP (RFC 2131) para autoconfigurar una estación de trabajo?",
      "options": [
        "Download, Open, Read, Apply",
        "Discover (Broadcast), Offer (Unicast/Broadcast), Request (Broadcast), Acknowledge (Unicast)",
        "Domain, Option, Route, Address",
        "Disconnect, Overload, Reset, Authenticate"
      ],
      "answer": 1,
      "why": "DORA: 1) Discover (el cliente busca servidores DHCP); 2) Offer (el servidor ofrece una IP disponible); 3) Request (el cliente formaliza la petición de esa IP); 4) Acknowledge (el servidor confirma la concesión)."
    },
    {
      "q": "En el Sistema de Nombres de Dominio (DNS), ¿qué tipo de registro vincula un nombre de host (FQDN) con una dirección IPv4 de 32 bits?",
      "options": [
        "Registro MX",
        "Registro CNAME",
        "Registro A",
        "Registro AAAA"
      ],
      "answer": 2,
      "why": "El registro 'A' (Address) mapea un nombre a una dirección IPv4. El registro 'AAAA' mapea a IPv6, 'MX' define el servidor de correo y 'CNAME' define un alias canónico."
    },
    {
      "q": "¿Cuál es el tamaño máximo estándar de la Unidad de Transmisión Máxima (MTU) en redes Ethernet para la carga útil de Capa 3?",
      "options": [
        "64 bytes",
        "512 bytes",
        "1500 bytes",
        "9000 bytes"
      ],
      "answer": 2,
      "why": "La MTU estándar de Ethernet IEEE 802.3 es de 1500 bytes de carga útil (Payload). Si un paquete IP excede 1500 bytes y la bandera DF (Don't Fragment) está activa, el router lo descartará."
    }
  ],
  "u3": [
    {
      "q": "¿Cuál es la diferencia crítica entre un Hub (Concentrador) y un Switch (Conmutador)?",
      "options": [
        "El Hub opera en Capa 3 y el Switch en Capa 1",
        "El Hub reenvía tramas por unicast y el Switch por broadcast",
        "El Hub es un repetidor de Capa 1 que comparte un solo dominio de colisión; el Switch es de Capa 2 y separa dominios de colisión por cada puerto",
        "Los Hubs solo soportan fibra óptica y los Switches par trenzado"
      ],
      "answer": 2,
      "why": "Cada puerto de un switch constituye un dominio de colisión independiente gracias a su tabla de direcciones MAC (CAM), eliminando colisiones en dúplex completo."
    },
    {
      "q": "¿Qué dispositivo de red separa DOMINIOS DE BROADCAST (difusión) y trabaja con direcciones IP de Capa 3?",
      "options": [
        "Repetidor",
        "Puente (Bridge)",
        "Switch Capa 2",
        "Router (Enrutador)"
      ],
      "answer": 3,
      "why": "Los routers no propagan broadcasts de Capa 2 de forma predeterminada; dividen la red en subredes lógicas diferentes y enrutan paquetes en Capa 3."
    },
    {
      "q": "¿Cuál de los siguientes es un dispositivo de red PASIVO según la norma de infraestructura?",
      "options": [
        "Punto de Acceso (Access Point)",
        "Patch Panel (Panel de parcheo)",
        "Firewall perimetral",
        "Switch gestionable"
      ],
      "answer": 1,
      "why": "Un dispositivo pasivo no requiere alimentación eléctrica ni modifica/regenera las señales (ej. cables UTP, canaletas, racks, patch panels)."
    },
    {
      "q": "¿Cómo aprende un switch Ethernet qué dirección MAC corresponde a cada uno de sus puertos físicos en su tabla CAM?",
      "options": [
        "El administrador debe escribir manualmente todas las direcciones MAC una por una",
        "Inspecciona la dirección MAC de ORIGEN de cada trama entrante y la asocia al puerto por donde ingresó",
        "Interroga al servidor DNS de la red",
        "Envía un paquete ICMP Ping a todos los hosts cada 10 segundos"
      ],
      "answer": 1,
      "why": "El switch aprende dinámicamente examinando la dirección MAC origen de cada trama que entra por un puerto. La registra en su tabla CAM con un temporizador de envejecimiento (Aging Time, por defecto 300 segundos)."
    },
    {
      "q": "¿Cuál es la principal ventaja del método de conmutación 'Store-and-Forward' en comparación con 'Cut-Through' en un switch?",
      "options": [
        "Tiene menor latencia que Cut-Through",
        "Almacena la trama completa y valida el cálculo CRC-32 del tráiler FCS, descartando tramas corruptas antes de propagarlas",
        "No requiere memoria RAM en el switch",
        "Permite convertir cable de cobre en fibra óptica"
      ],
      "answer": 1,
      "why": "Store-and-Forward lee la trama entera y comprueba el código CRC; si hubo un error de transmisión en los bits, la descarta en el puerto de entrada evitando saturar la red con tramas dañadas."
    },
    {
      "q": "¿Qué estándar del IEEE define formalmente la segmentación de redes locales virtuales (VLANs) mediante una etiqueta (Tag) de 4 bytes en la trama Ethernet?",
      "options": [
        "IEEE 802.1D",
        "IEEE 802.1Q",
        "IEEE 802.3ad",
        "IEEE 802.11ax"
      ],
      "answer": 1,
      "why": "IEEE 802.1Q inserta una etiqueta de 4 bytes (VLAN Tag) entre la dirección MAC de origen y el campo EtherType, conteniendo el VLAN ID de 12 bits (que permite hasta 4,094 VLANs)."
    },
    {
      "q": "¿Cuál es la función del Protocolo Spanning Tree (STP, IEEE 802.1D) en una red con switches redundantes?",
      "options": [
        "Aumentar la velocidad de los puertos a 10 Gbps",
        "Evitar bucles de Capa 2 y tormentas de difusión (broadcast storms) bloqueando lógicamente enlaces redundantes",
        "Asignar direcciones IPv6 automáticas a los servidores",
        "Cifrar el tráfico entre edificios"
      ],
      "answer": 1,
      "why": "Como las tramas Ethernet carecen de campo TTL, enlaces redundantes provocan bucles donde las tramas broadcast circulan eternamente; STP elige un Root Bridge y bloquea puertos para mantener una topología lógica en árbol sin bucles."
    },
    {
      "q": "Cuando un router recibe un paquete y tiene en su tabla de enrutamiento las rutas 10.0.0.0/8, 10.1.0.0/16 y 10.1.1.0/24, ¿cuál de ellas elige para reenviar un paquete dirigido a 10.1.1.50?",
      "options": [
        "La ruta 10.0.0.0/8 por ser la más antigua",
        "La ruta 10.1.0.0/16 por tener un prefijo intermedio",
        "La ruta 10.1.1.0/24 por la regla de Longest Prefix Match (coincidencia de prefijo más específico)",
        "Descarta el paquete por existir ambigüedad de rutas"
      ],
      "answer": 2,
      "why": "La regla Longest Prefix Match (LPM) obliga al enrutador a escoger la ruta con la máscara más larga (/24 > /16 > /8) por ser la más precisa y específica para el destino."
    },
    {
      "q": "¿Qué sucede con las direcciones IP y MAC de un paquete cuando éste atraviesa un enrutador (Router)?",
      "options": [
        "Tanto las IPs como las MACs permanecen intactas de extremo a extremo",
        "Las direcciones IP origen y destino se mantienen intactas, pero las direcciones MAC cambian en cada salto de red adaptándose al nuevo enlace físico",
        "Las IPs cambian y las MACs se mantienen",
        "Se eliminan todas las cabeceras y viajan solo los datos"
      ],
      "answer": 1,
      "why": "Las direcciones IP (Capa 3) son de extremo a extremo y no cambian en el tránsito (salvo con NAT). Las direcciones MAC (Capa 2) son de salto local (Hop-by-Hop); cada router reescribe la MAC origen (la suya) y MAC destino (el siguiente salto)."
    },
    {
      "q": "¿En qué se diferencia un Firewall con Inspección de Estado (SPI) de un filtro de paquetes simple por listas de acceso (ACL)?",
      "options": [
        "El firewall SPI es más barato que una ACL",
        "El firewall SPI mantiene una tabla de conexiones activas que rastrea el estado de las sesiones TCP/UDP, permitiendo automáticamente el tráfico de retorno legítimo y bloqueando conexiones no solicitadas",
        "Las ACLs son de Capa 7 y los firewalls SPI son de Capa 1",
        "Los firewalls SPI solo funcionan con redes Wi-Fi"
      ],
      "answer": 1,
      "why": "Una ACL estática solo analiza paquetes aislados sin contexto. El firewall SPI (Stateful Packet Inspection) entiende el flujo de la sesión; si un usuario interno navega a una web, autoriza el regreso de los paquetes porque pertenecen a una conexión TCP abierta previamente."
    }
  ],
  "u4": [
    {
      "q": "Según la norma ANSI/TIA/EIA-568, ¿cuál es la distancia máxima recomendada para el cableado horizontal permanente de par trenzado (desde el patch panel hasta el jack en la roseta)?",
      "options": [
        "50 metros",
        "90 metros",
        "100 metros",
        "150 metros"
      ],
      "answer": 1,
      "why": "La norma estipula 90 metros de enlace permanente + 10 metros en total para cordones de parcheo (patch cords), dando un canal total máximo de 100 metros."
    },
    {
      "q": "En el código de colores de la norma TIA/EIA-568B, ¿cuál es el orden exacto de los 8 hilos de izquierda a derecha (con la pestaña del RJ-45 hacia abajo)?",
      "options": [
        "Blanco/Verde, Verde, Blanco/Naranja, Azul, Blanco/Azul, Naranja, Blanco/Marrón, Marrón",
        "Blanco/Naranja, Naranja, Blanco/Verde, Azul, Blanco/Azul, Verde, Blanco/Marrón, Marrón",
        "Naranja, Blanco/Naranja, Verde, Blanco/Verde, Azul, Blanco/Azul, Marrón, Blanco/Marrón",
        "Blanco/Azul, Azul, Blanco/Naranja, Verde, Blanco/Verde, Naranja, Blanco/Marrón, Marrón"
      ],
      "answer": 1,
      "why": "La norma T568B inicia con el par Naranja en pines 1 y 2 (Blanco/Naranja, Naranja), par Verde partido en pines 3 y 6, par Azul en pines 4 y 5, y par Marrón en 7 y 8."
    },
    {
      "q": "¿Qué norma internacional de telecomunicaciones regula los Espacios y Canalizaciones (ductos, charolas portacables, factor de llenado del 40% y cuartos de telecomunicaciones)?",
      "options": [
        "ANSI/TIA-568",
        "ANSI/TIA-569",
        "ANSI/TIA-606",
        "ANSI/TIA-607"
      ],
      "answer": 1,
      "why": "TIA-569 define las especificaciones arquitectónicas de cuartos de telecomunicaciones, ductos y charolas portacables, limitando el factor de llenado inicial al 40%."
    },
    {
      "q": "¿Cuál es la norma que rige la administración, identificación unívoca y etiquetado industrial normalizado de cables, racks y tomas de red?",
      "options": [
        "ANSI/TIA-568",
        "ANSI/TIA-569",
        "ANSI/TIA-606",
        "ANSI/TIA-607"
      ],
      "answer": 2,
      "why": "ANSI/TIA-606 rige el etiquetado y administración de enlaces horizontales, armarios de telecomunicaciones y cuartos de equipos (formato fs-an.d-r:p)."
    },
    {
      "q": "¿Qué función cumple la Barra Principal de Puesta a Tierra de Telecomunicaciones (TMGB) según la norma ANSI/TIA-607?",
      "options": [
        "Suministrar energía de 110V a los switches",
        "Servir como punto central de unión equipotencial de telecomunicaciones conectada al electrodo de tierra del edificio para proteger contra sobretensiones",
        "Medir la velocidad de navegación de los usuarios",
        "Sujetar los cables de fibra óptica"
      ],
      "answer": 1,
      "why": "La TMGB (Telecommunications Main Grounding Busbar) interconecta las barras de piso (TGB) y los racks al sistema eléctrico de tierra para drenar descargas estáticas y transitorias."
    },
    {
      "q": "¿Cuáles son los 6 subsistemas que integran la norma ANSI/TIA-568 de Cableado Estructurado?",
      "options": [
        "CPU, RAM, Disco duro, Teclado, Monitor y Mouse",
        "Entrada de Servicios (EF), Cuarto de Equipos (ER), Cableado Backbone, Cuarto de Telecomunicaciones (TR), Cableado Horizontal y Área de Trabajo (WA)",
        "Router, Switch, Hub, Bridge, Modem y Access Point",
        "VLAN 10, VLAN 20, VLAN 30, VLAN 40, VLAN 50 y VLAN 99"
      ],
      "answer": 1,
      "why": "Los 6 subsistemas modulares TIA-568 son: 1) Entrada de Servicios (EF); 2) Cuarto de Equipos (ER); 3) Backbone troncal; 4) Cuarto de Telecomunicaciones (TR); 5) Cableado Horizontal; 6) Área de Trabajo (WA)."
    },
    {
      "q": "¿Qué tipo de cable de par trenzado cuenta con lámina de aluminio individual alrededor de cada par y una malla de blindaje general trenzada exterior?",
      "options": [
        "U/UTP",
        "F/UTP",
        "S/FTP",
        "Cable Coaxial"
      ],
      "answer": 2,
      "why": "El cable S/FTP (Shielded Foiled Twisted Pair) ofrece la máxima protección contra interferencias electromagnéticas (EMI) y diafonía foránea (Alien Crosstalk) gracias a su doble blindaje."
    },
    {
      "q": "¿Cuál es la diferencia principal entre la fibra óptica Monomodo (SMF) y la fibra óptica Multimodo (MMF)?",
      "options": [
        "La fibra monomodo es de plástico y la multimodo de vidrio",
        "La fibra monomodo tiene un núcleo delgado (9 µm) y usa láser para distancias de decenas de km sin dispersión modal; la multimodo tiene núcleo ancho (50 µm) y usa VCSEL para distancias cortas (<550 m)",
        "La fibra multimodo es inmune al agua y la monomodo no",
        "La fibra monomodo solo transmite datos de audio"
      ],
      "answer": 1,
      "why": "En la fibra monomodo (9/125 µm), la luz viaja en un solo modo axial eliminando la dispersión modal. En multimodo (50/125 µm), viajan múltiples rayos rebotando en ángulos distintos, limitando el alcance por dispersión."
    },
    {
      "q": "Al rematar cables UTP en bloques IDC 110 de un patch panel o jack Keystone, ¿cuál es el des-trenzado máximo de los pares permitido por la norma TIA-568?",
      "options": [
        "5 mm",
        "13 mm (0.5 pulgadas)",
        "50 mm (2 pulgadas)",
        "100 mm"
      ],
      "answer": 1,
      "why": "La norma exige estrictamente no des-trenzar más de 13 mm (0.5 pulgadas). El trenzado cancela el ruido electromagnético mutuo; des-trenzar de más incrementa drásticamente la paradiafonía (NEXT)."
    },
    {
      "q": "En la certificación de cableado con equipos Fluke DSX, ¿qué evalúa el parámetro NEXT (Near-End Crosstalk)?",
      "options": [
        "La velocidad de la conexión a Internet contratada con el ISP",
        "El acoplamiento de señal no deseado (diafonía) que induce un par transmisor sobre los pares adyacentes en el mismo extremo donde se inyecta la señal",
        "El peso físico de la bobina de cable",
        "La resistencia de los tornillos del rack"
      ],
      "answer": 1,
      "why": "NEXT mide la interferencia electromagnética acoplada entre pares adyacentes en el extremo cercano del enlace. Un margen de NEXT positivo alto indica excelente aislamiento y calidad de ponchado."
    }
  ],
  "u5": [
    {
      "q": "En una red corporativa con dirección de red 192.168.10.0/26, ¿cuántos hosts útiles se pueden direccionar por subred?",
      "options": [
        "30 hosts",
        "62 hosts",
        "64 hosts",
        "126 hosts"
      ],
      "answer": 1,
      "why": "Con máscara /26 quedan 32 - 26 = 6 bits para host. 2^6 = 64 direcciones totales - 2 (Red y Broadcast) = 62 hosts útiles asignables."
    },
    {
      "q": "¿Cuál es el propósito principal de una Memoria Técnica en la entrega y liberación de un proyecto de redes corporativo?",
      "options": [
        "Facturar la mano de obra al cliente",
        "Respaldar por escrito el inventario físico, planos de cableado, etiquetado TIA-606, resultados de certificación Fluke y diagramas lógicos para mantenimiento y garantías futuras",
        "Instalar antivirus en las estaciones de trabajo",
        "Pedir una auditoría ante la IEEE"
      ],
      "answer": 1,
      "why": "La memoria técnica documenta formalmente toda la infraestructura instalada, garantizando trazabilidad, resolución expedita de fallas y la validez de la garantía de 25 años del fabricante."
    },
    {
      "q": "En el modelo de diseño jerárquico de redes de 3 capas de Cisco, ¿cuál es la función de la Capa de Distribución?",
      "options": [
        "Conectar las laptops y teléfonos IP directamente al usuario final",
        "Transportar rápidamente grandes volúmenes de tráfico entre sitios sin filtrar paquetes",
        "Agregar el tráfico de los switches de acceso, implementar políticas de seguridad, enrutamiento entre VLANs y filtrado ACL",
        "Suministrar energía eléctrica a la sala de servidores"
      ],
      "answer": 2,
      "why": "La capa de distribución es el punto de agregación y control donde se aplican listas de control de acceso (ACLs), enrutamiento inter-VLAN y calidad de servicio (QoS) antes de enviar al Core."
    },
    {
      "q": "Al presupuestar potencia PoE en switches para alimentar 20 puntos de acceso Wi-Fi 6 bajo el estándar IEEE 802.3at (PoE+ de hasta 30W), ¿cuál es el Power Budget mínimo requerido?",
      "options": [
        "154 Watts",
        "300 Watts",
        "600 Watts",
        "1800 Watts"
      ],
      "answer": 2,
      "why": "20 dispositivos * 30 Watts por puerto = 600 Watts mínimos dedicados a PoE en la fuente de alimentación del switch."
    },
    {
      "q": "¿Cómo opera un protocolo de redundancia de primer salto (FHRP) como HSRP o VRRP para garantizar alta disponibilidad de acceso a Internet?",
      "options": [
        "Obliga al usuario a reiniciar su computadora cuando un router falla",
        "Dos routers físicos comparten una dirección IP y MAC virtual que sirve de Gateway; si el router activo falla, el router standby asume el tráfico en <3 segundos sin interrupción de servicio",
        "Duplica la velocidad de navegación del enlace WAN",
        "Elimina la necesidad de utilizar switches"
      ],
      "answer": 1,
      "why": "FHRP (HSRP/VRRP) evita que el router de salida sea un punto único de falla (SPOF). Los hosts apuntan a la IP virtual (VIP); ante caída del primario, el secundario asume el control transparentemente."
    },
    {
      "q": "¿Cuál es la regla fundamental al diseñar un plan de direccionamiento mediante Máscaras de Subred de Longitud Variable (VLSM)?",
      "options": [
        "Asignar primero las subredes más pequeñas y dejar las grandes al final",
        "Ordenar los requerimientos de mayor a menor número de hosts necesarios para asignar bloques que no se solapen y optimicen el espacio de direcciones",
        "Asignar siempre máscaras /24 a todos los departamentos por igual",
        "Usar solo direcciones IP de Clase A públicas"
      ],
      "answer": 1,
      "why": "El algoritmo VLSM exige ordenar las subredes descendentemente por número de hosts. Esto garantiza que las fronteras de bloque binarias no colisionen ni se desperdicien direcciones intermedias."
    },
    {
      "q": "¿Qué ventaja ofrece utilizar una máscara /31 (RFC 3021) en lugar de una máscara /30 tradicional para enlaces punto a punto entre routers?",
      "options": [
        "Permite conectar switches a 10 Gbps",
        "Aprovecha el 100% de las 2 direcciones IP del bloque sin desperdiciar direcciones de red y broadcast",
        "Aumenta la longitud del cable a 500 metros",
        "Hace que el enlace sea inalámbrico"
      ],
      "answer": 1,
      "why": "El RFC 3021 define el uso de /31 (255.255.255.254) para enlaces seriales o troncales punto a punto entre 2 routers, eliminando la necesidad de reservar IP de red y broadcast (ahorro del 50%)."
    },
    {
      "q": "Conforme a la norma ANSI/TIA-569, ¿qué factor de crecimiento u holgura futura mínima debe considerarse al dimensionar la capacidad de unidades de rack (U) en un gabinete?",
      "options": [
        "5%",
        "10%",
        "30%",
        "75%"
      ],
      "answer": 2,
      "why": "TIA-569 estipula considerar al menos un 30% de espacio disponible adicional (Unidades de Rack vacías y holgura en ductos) para permitir expansiones tecnológicas futuras sin saturación."
    },
    {
      "q": "¿Cuál es la fórmula para calcular la disipación térmica en BTU/h generada por equipos activos en un cuarto de telecomunicaciones consumiendo 2,000 Watts continuos?",
      "options": [
        "BTU/h = Watts / 100 = 20 BTU/h",
        "BTU/h = Watts * 3.4121 = aprox. 6,824 BTU/h",
        "BTU/h = Watts * 12,000 = 24,000,000 BTU/h",
        "Los equipos de red no generan calor"
      ],
      "answer": 1,
      "why": "1 Watt de potencia eléctrica disipada equivale exactamente a 3.4121 BTU/h. Por tanto, 2,000 W * 3.4121 = 6,824.2 BTU/h, dato esencial para dimensionar el equipo de aire acondicionado de precisión."
    },
    {
      "q": "¿Qué tipo de sistema de alimentación ininterrumpida (UPS) es el estándar obligatorio para proteger conmutadores centrales y servidores de misión crítica en cuartos ER?",
      "options": [
        "Regulador de voltaje doméstico",
        "UPS Standby / Offline básico",
        "UPS Online de Doble Conversión (Double Conversion Online)",
        "Batería portátil de litio para smartphone"
      ],
      "answer": 2,
      "why": "Un UPS Online de Doble Conversión rectifica continuamente la corriente AC a DC y la vuelve a invertir a AC limpia con cero tiempo de transferencia (0 ms) ante apagones, protegiendo contra cualquier fluctuación de la red eléctrica."
    }
  ]
};

const FINAL_EXAM_QUESTIONS = [
  {
    "q": "¿Qué red de conmutación de paquetes creada en 1969 por DARPA sentó las bases de la Internet moderna?",
    "options": [
      "NSFNET",
      "ARPANET",
      "ALOHANET",
      "BITNET"
    ],
    "answer": 1,
    "why": "ARPANET conectó inicialmente 4 nodos universitarios (UCLA, Stanford, UCSB y Utah) utilizando minicomputadoras Honeywell DDP-516 como procesadores de mensajes IMP (RFC 1)."
  },
  {
    "q": "En una topología en Malla Completa (Full Mesh) con 8 enrutadores, ¿cuántos enlaces físicos se requieren?",
    "options": [
      "16 enlaces",
      "28 enlaces",
      "56 enlaces",
      "64 enlaces"
    ],
    "answer": 1,
    "why": "La fórmula matemática para topología en malla completa es n(n - 1) / 2. Por tanto: 8 * (7) / 2 = 56 / 2 = 28 enlaces físicos."
  },
  {
    "q": "Según el Teorema de Shannon-Hartley C = B · log₂(1 + S/N), ¿qué ocurre con la capacidad máxima de un canal si el nivel de ruido aumenta drásticamente manteniendo constante el ancho de banda?",
    "options": [
      "La capacidad aumenta porque el ruido amplifica la señal",
      "La capacidad se reduce porque disminuye la relación Señal/Ruido (SNR)",
      "La capacidad se mantiene constante porque solo depende del voltaje",
      "El canal se convierte automáticamente en full-dúplex"
    ],
    "answer": 1,
    "why": "El Teorema de Shannon establece que la capacidad de información C es proporcional a log₂(1 + SNR). Si el ruido N aumenta, la relación S/N disminuye, reduciendo la tasa de bits sin error que el canal puede sostener."
  },
  {
    "q": "¿Qué modo de transmisión describe una comunicación bidireccional donde ambos extremos pueden transmitir, pero NO de manera simultánea (ej. walkie-talkie o Hub Ethernet)?",
    "options": [
      "Simplex",
      "Half-Dúplex",
      "Full-Dúplex",
      "Multiplex"
    ],
    "answer": 1,
    "why": "Half-Dúplex permite la comunicación en ambos sentidos pero de forma alternada en el tiempo; si ambos transmiten a la vez ocurre una colisión en el medio compartido."
  },
  {
    "q": "En métricas de calidad de servicio (QoS), ¿cómo se define el parámetro de Jitter y cuál es su umbral máximo aceptable para telefonía IP (VoIP)?",
    "options": [
      "Es el ancho de banda mínimo y debe ser mayor a 1 Gbps",
      "Es la variación estadística en el retardo de llegada de paquetes sucesivos y debe ser estrictamente menor a 30 ms",
      "Es la pérdida de potencia en decibelios y debe ser de 100 dB",
      "Es el número de saltos de router y debe ser menor a 3"
    ],
    "answer": 1,
    "why": "El Jitter es la fluctuación temporal en la latencia de paquetes. Para telefonía IP y videoconferencia en tiempo real, valores superiores a 30 ms provocan audio entrecortado y pérdida de inteligibilidad."
  },
  {
    "q": "¿En qué capa del Modelo OSI opera el protocolo IP y cuál es su PDU correspondiente?",
    "options": [
      "Capa 2 (Enlace) - Trama (Frame)",
      "Capa 3 (Red) - Paquete (Packet)",
      "Capa 4 (Transporte) - Segmento (Segment)",
      "Capa 1 (Física) - Bits"
    ],
    "answer": 1,
    "why": "La capa 3 (Red) maneja el direccionamiento lógico global (IP) y el enrutamiento. Su Unidad de Datos de Protocolo (PDU) es el Paquete."
  },
  {
    "q": "¿Qué estándar del Comité IEEE 802 define formalmente a las redes inalámbricas Wi-Fi?",
    "options": [
      "IEEE 802.3",
      "IEEE 802.5",
      "IEEE 802.11",
      "IEEE 802.15"
    ],
    "answer": 2,
    "why": "IEEE 802.11 define la capa física y MAC para redes inalámbricas WLAN (Wi-Fi). Por contraste, IEEE 802.3 define Ethernet cableado."
  },
  {
    "q": "¿Cuál es la función del campo FCS (Frame Check Sequence) en el tráiler de una trama Ethernet (Capa 2)?",
    "options": [
      "Cifrar la contraseña de red",
      "Detectar errores de transmisión en los bits usando el algoritmo matemático CRC-32",
      "Establecer la velocidad del puerto a 1 Gbps",
      "Asignar una dirección IP dinámica por DHCP"
    ],
    "answer": 1,
    "why": "El campo FCS contiene un valor de comprobación de redundancia cíclica CRC-32 de 4 bytes. Si el receptor detecta discrepancia al recalcular el CRC, la trama se descarta de inmediato por corrupta."
  },
  {
    "q": "¿Cuál es la diferencia crítica entre los protocolos de transporte TCP y UDP?",
    "options": [
      "TCP no utiliza números de puerto y UDP sí",
      "TCP es orientado a conexión con 3-Way Handshake, garantía de entrega y control de flujo; UDP es no orientado a conexión y sin confirmaciones, ideal para streaming y VoIP",
      "UDP es más lento que TCP porque cifra todos los paquetes",
      "TCP solo funciona sobre fibra óptica"
    ],
    "answer": 1,
    "why": "TCP (RFC 793) establece conexión previa mediante SYN, SYN-ACK, ACK y retransmite paquetes perdidos. UDP (RFC 768) envía datagramas sin acuse de recibo para privilegiar la mínima latencia en tráfico multimedia."
  },
  {
    "q": "¿Cuáles son los 4 pasos del ciclo DORA que ejecuta el protocolo DHCP (RFC 2131) para autoconfigurar una estación de trabajo?",
    "options": [
      "Download, Open, Read, Apply",
      "Discover (Broadcast), Offer (Unicast/Broadcast), Request (Broadcast), Acknowledge (Unicast)",
      "Domain, Option, Route, Address",
      "Disconnect, Overload, Reset, Authenticate"
    ],
    "answer": 1,
    "why": "DORA: 1) Discover (el cliente busca servidores DHCP); 2) Offer (el servidor ofrece una IP disponible); 3) Request (el cliente formaliza la petición de esa IP); 4) Acknowledge (el servidor confirma la concesión)."
  },
  {
    "q": "¿Cuál es la diferencia crítica entre un Hub (Concentrador) y un Switch (Conmutador)?",
    "options": [
      "El Hub opera en Capa 3 y el Switch en Capa 1",
      "El Hub reenvía tramas por unicast y el Switch por broadcast",
      "El Hub es un repetidor de Capa 1 que comparte un solo dominio de colisión; el Switch es de Capa 2 y separa dominios de colisión por cada puerto",
      "Los Hubs solo soportan fibra óptica y los Switches par trenzado"
    ],
    "answer": 2,
    "why": "Cada puerto de un switch constituye un dominio de colisión independiente gracias a su tabla de direcciones MAC (CAM), eliminando colisiones en dúplex completo."
  },
  {
    "q": "¿Qué dispositivo de red separa DOMINIOS DE BROADCAST (difusión) y trabaja con direcciones IP de Capa 3?",
    "options": [
      "Repetidor",
      "Puente (Bridge)",
      "Switch Capa 2",
      "Router (Enrutador)"
    ],
    "answer": 3,
    "why": "Los routers no propagan broadcasts de Capa 2 de forma predeterminada; dividen la red en subredes lógicas diferentes y enrutan paquetes en Capa 3."
  },
  {
    "q": "¿Cómo aprende un switch Ethernet qué dirección MAC corresponde a cada uno de sus puertos físicos en su tabla CAM?",
    "options": [
      "El administrador debe escribir manualmente todas las direcciones MAC una por una",
      "Inspecciona la dirección MAC de ORIGEN de cada trama entrante y la asocia al puerto por donde ingresó",
      "Interroga al servidor DNS de la red",
      "Envía un paquete ICMP Ping a todos los hosts cada 10 segundos"
    ],
    "answer": 1,
    "why": "El switch aprende dinámicamente examinando la dirección MAC origen de cada trama que entra por un puerto. La registra en su tabla CAM con un temporizador de envejecimiento (Aging Time, por defecto 300 segundos)."
  },
  {
    "q": "¿Qué estándar del IEEE define formalmente la segmentación de redes locales virtuales (VLANs) mediante una etiqueta (Tag) de 4 bytes en la trama Ethernet?",
    "options": [
      "IEEE 802.1D",
      "IEEE 802.1Q",
      "IEEE 802.3ad",
      "IEEE 802.11ax"
    ],
    "answer": 1,
    "why": "IEEE 802.1Q inserta una etiqueta de 4 bytes (VLAN Tag) entre la dirección MAC de origen y el campo EtherType, conteniendo el VLAN ID de 12 bits (que permite hasta 4,094 VLANs)."
  },
  {
    "q": "¿Qué sucede con las direcciones IP y MAC de un paquete cuando éste atraviesa un enrutador (Router)?",
    "options": [
      "Tanto las IPs como las MACs permanecen intactas de extremo a extremo",
      "Las direcciones IP origen y destino se mantienen intactas, pero las direcciones MAC cambian en cada salto de red adaptándose al nuevo enlace físico",
      "Las IPs cambian y las MACs se mantienen",
      "Se eliminan todas las cabeceras y viajan solo los datos"
    ],
    "answer": 1,
    "why": "Las direcciones IP (Capa 3) son de extremo a extremo y no cambian en el tránsito (salvo con NAT). Las direcciones MAC (Capa 2) son de salto local (Hop-by-Hop); cada router reescribe la MAC origen (la suya) y MAC destino (el siguiente salto)."
  },
  {
    "q": "Según la norma ANSI/TIA/EIA-568, ¿cuál es la distancia máxima recomendada para el cableado horizontal permanente de par trenzado (desde el patch panel hasta el jack en la roseta)?",
    "options": [
      "50 metros",
      "90 metros",
      "100 metros",
      "150 metros"
    ],
    "answer": 1,
    "why": "La norma estipula 90 metros de enlace permanente + 10 metros en total para cordones de parcheo (patch cords), dando un canal total máximo de 100 metros."
  },
  {
    "q": "En el código de colores de la norma TIA/EIA-568B, ¿cuál es el orden exacto de los 8 hilos de izquierda a derecha (con la pestaña del RJ-45 hacia abajo)?",
    "options": [
      "Blanco/Verde, Verde, Blanco/Naranja, Azul, Blanco/Azul, Naranja, Blanco/Marrón, Marrón",
      "Blanco/Naranja, Naranja, Blanco/Verde, Azul, Blanco/Azul, Verde, Blanco/Marrón, Marrón",
      "Naranja, Blanco/Naranja, Verde, Blanco/Verde, Azul, Blanco/Azul, Marrón, Blanco/Marrón",
      "Blanco/Azul, Azul, Blanco/Naranja, Verde, Blanco/Verde, Naranja, Blanco/Marrón, Marrón"
    ],
    "answer": 1,
    "why": "La norma T568B inicia con el par Naranja en pines 1 y 2 (Blanco/Naranja, Naranja), par Verde partido en pines 3 y 6, par Azul en pines 4 y 5, y par Marrón en 7 y 8."
  },
  {
    "q": "¿Qué norma internacional de telecomunicaciones regula los Espacios y Canalizaciones (ductos, charolas portacables, factor de llenado del 40% y cuartos de telecomunicaciones)?",
    "options": [
      "ANSI/TIA-568",
      "ANSI/TIA-569",
      "ANSI/TIA-606",
      "ANSI/TIA-607"
    ],
    "answer": 1,
    "why": "TIA-569 define las especificaciones arquitectónicas de cuartos de telecomunicaciones, ductos y charolas portacables, limitando el factor de llenado inicial al 40%."
  },
  {
    "q": "¿Cuáles son los 6 subsistemas que integran la norma ANSI/TIA-568 de Cableado Estructurado?",
    "options": [
      "CPU, RAM, Disco duro, Teclado, Monitor y Mouse",
      "Entrada de Servicios (EF), Cuarto de Equipos (ER), Cableado Backbone, Cuarto de Telecomunicaciones (TR), Cableado Horizontal y Área de Trabajo (WA)",
      "Router, Switch, Hub, Bridge, Modem y Access Point",
      "VLAN 10, VLAN 20, VLAN 30, VLAN 40, VLAN 50 y VLAN 99"
    ],
    "answer": 1,
    "why": "Los 6 subsistemas modulares TIA-568 son: 1) Entrada de Servicios (EF); 2) Cuarto de Equipos (ER); 3) Backbone troncal; 4) Cuarto de Telecomunicaciones (TR); 5) Cableado Horizontal; 6) Área de Trabajo (WA)."
  },
  {
    "q": "Al rematar cables UTP en bloques IDC 110 de un patch panel o jack Keystone, ¿cuál es el des-trenzado máximo de los pares permitido por la norma TIA-568?",
    "options": [
      "5 mm",
      "13 mm (0.5 pulgadas)",
      "50 mm (2 pulgadas)",
      "100 mm"
    ],
    "answer": 1,
    "why": "La norma exige estrictamente no des-trenzar más de 13 mm (0.5 pulgadas). El trenzado cancela el ruido electromagnético mutuo; des-trenzar de más incrementa drásticamente la paradiafonía (NEXT)."
  },
  {
    "q": "En una red corporativa con dirección de red 192.168.10.0/26, ¿cuántos hosts útiles se pueden direccionar por subred?",
    "options": [
      "30 hosts",
      "62 hosts",
      "64 hosts",
      "126 hosts"
    ],
    "answer": 1,
    "why": "Con máscara /26 quedan 32 - 26 = 6 bits para host. 2^6 = 64 direcciones totales - 2 (Red y Broadcast) = 62 hosts útiles asignables."
  },
  {
    "q": "¿Cuál es el propósito principal de una Memoria Técnica en la entrega y liberación de un proyecto de redes corporativo?",
    "options": [
      "Facturar la mano de obra al cliente",
      "Respaldar por escrito el inventario físico, planos de cableado, etiquetado TIA-606, resultados de certificación Fluke y diagramas lógicos para mantenimiento y garantías futuras",
      "Instalar antivirus en las estaciones de trabajo",
      "Pedir una auditoría ante la IEEE"
    ],
    "answer": 1,
    "why": "La memoria técnica documenta formalmente toda la infraestructura instalada, garantizando trazabilidad, resolución expedita de fallas y la validez de la garantía de 25 años del fabricante."
  },
  {
    "q": "En el modelo de diseño jerárquico de redes de 3 capas de Cisco, ¿cuál es la función de la Capa de Distribución?",
    "options": [
      "Conectar las laptops y teléfonos IP directamente al usuario final",
      "Transportar rápidamente grandes volúmenes de tráfico entre sitios sin filtrar paquetes",
      "Agregar el tráfico de los switches de acceso, implementar políticas de seguridad, enrutamiento entre VLANs y filtrado ACL",
      "Suministrar energía eléctrica a la sala de servidores"
    ],
    "answer": 2,
    "why": "La capa de distribución es el punto de agregación y control donde se aplican listas de control de acceso (ACLs), enrutamiento inter-VLAN y calidad de servicio (QoS) antes de enviar al Core."
  },
  {
    "q": "¿Cómo opera un protocolo de redundancia de primer salto (FHRP) como HSRP o VRRP para garantizar alta disponibilidad de acceso a Internet?",
    "options": [
      "Obliga al usuario a reiniciar su computadora cuando un router falla",
      "Dos routers físicos comparten una dirección IP y MAC virtual que sirve de Gateway; si el router activo falla, el router standby asume el tráfico en <3 segundos sin interrupción de servicio",
      "Duplica la velocidad de navegación del enlace WAN",
      "Elimina la necesidad de utilizar switches"
    ],
    "answer": 1,
    "why": "FHRP (HSRP/VRRP) evita que el router de salida sea un punto único de falla (SPOF). Los hosts apuntan a la IP virtual (VIP); ante caída del primario, el secundario asume el control transparentemente."
  },
  {
    "q": "Conforme a la norma ANSI/TIA-569, ¿qué factor de crecimiento u holgura futura mínima debe considerarse al dimensionar la capacidad de unidades de rack (U) en un gabinete?",
    "options": [
      "5%",
      "10%",
      "30%",
      "75%"
    ],
    "answer": 2,
    "why": "TIA-569 estipula considerar al menos un 30% de espacio disponible adicional (Unidades de Rack vacías y holgura en ductos) para permitir expansiones tecnológicas futuras sin saturación."
  }
];

// App Principal
const App = {
  state: {
    studentName: 'Estudiante Aztlán',
    scores: {
      u1: 0,
      u2: 0,
      u3: 0,
      u4: 0,
      u5: 0,
      finalExam: null
    },
    readingReportsDone: 100, // 20%
    researchDone: 90,        // 30%
    unitQuizzesDone: [false, false, false, false, false]
  },

  init() {
    try { this.initTheme(); } catch (e) { console.error('Error en initTheme:', e); }
    try { this.loadState(); } catch (e) { console.error('Error en loadState:', e); }
    try { this.setupNavigation(); } catch (e) { console.error('Error en setupNavigation:', e); }
    try { this.setupSubnetCalc(); } catch (e) { console.error('Error en setupSubnetCalc:', e); }
    try { this.setupRackDimensioner(); } catch (e) { console.error('Error en setupRackDimensioner:', e); }
    try { this.renderQuizzes(); } catch (e) { console.error('Error en renderQuizzes:', e); }
    try { this.renderFinalExam(); } catch (e) { console.error('Error en renderFinalExam:', e); }
    try { this.updateStatsUI(); } catch (e) { console.error('Error en updateStatsUI:', e); }

    // Iniciar simuladores cuando se cargue la vista
    try {
      if (typeof TopologySimulator !== 'undefined' && document.getElementById('topo-canvas')) {
        topoSim = new TopologySimulator('topo-canvas', 'topo-log');
      }
    } catch (e) { console.error('Error iniciando TopologySimulator:', e); }

    try {
      if (typeof EncapsulationSimulator !== 'undefined' && document.getElementById('encapsulation-sim-container')) {
        encapSim = new EncapsulationSimulator('encapsulation-sim-container');
      }
    } catch (e) { console.error('Error iniciando EncapsulationSimulator:', e); }

    try {
      if (typeof SwitchCamSimulator !== 'undefined' && document.getElementById('switch-sim-container')) {
        switchSim = new SwitchCamSimulator('switch-sim-container');
      }
    } catch (e) { console.error('Error iniciando SwitchCamSimulator:', e); }

    try {
      if (typeof CrimpSimulator !== 'undefined' && document.getElementById('crimp-sim-container')) {
        crimpSim = new CrimpSimulator('crimp-sim-container');
      }
    } catch (e) { console.error('Error iniciando CrimpSimulator:', e); }

    // Iniciar Sistema de Autenticación y Roles
    try {
      if (window.AuthSystem && typeof window.AuthSystem.init === 'function') {
        window.AuthSystem.init();
      }
    } catch (e) { console.error('Error iniciando AuthSystem:', e); }

    // Iniciar Taller de Ejercicios Visuales
    try {
      if (window.VisualExercises && typeof window.VisualExercises.init === 'function') {
        window.VisualExercises.init();
      }
    } catch (e) { console.error('Error iniciando VisualExercises:', e); }

    // Iniciar Laboratorio de Prácticas Activas de Red
    try {
      if (window.NetworkLabs && typeof window.NetworkLabs.init === 'function') {
        window.NetworkLabs.init();
      }
    } catch (e) { console.error('Error iniciando NetworkLabs:', e); }

    // Iniciar Motor de Desbloqueo y Progresión Secuencial
    try {
      if (window.AcademicProgression && typeof window.AcademicProgression.init === 'function') {
        window.AcademicProgression.init();
      }
    } catch (e) { console.error('Error iniciando AcademicProgression:', e); }
  },

  initTheme() {
    const savedTheme = localStorage.getItem('aztlan_theme') || 'dark';
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aztlan_theme', theme);

    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (icon && text) {
      if (theme === 'light') {
        icon.innerText = '☀️';
        text.innerText = 'Modo Día';
      } else {
        icon.innerText = '🌙';
        text.innerText = 'Modo Noche';
      }
    }

    // Redibujar canvas si están presentes para contraste visual
    if (typeof topoSim !== 'undefined' && topoSim && typeof topoSim.draw === 'function') {
      try { topoSim.draw(); } catch (e) {}
    }
    if (window.NetworkLabs && typeof window.NetworkLabs.drawU1Canvas === 'function') {
      try { window.NetworkLabs.drawU1Canvas(); } catch (e) {}
    }
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  },

  loadState() {
    const saved = localStorage.getItem('aztlan_redes_state');
    if (saved) {
      try {
        this.state = Object.assign(this.state, JSON.parse(saved));
      } catch (e) {
        console.error('Error loading state:', e);
      }
    }
  },

  saveState() {
    localStorage.setItem('aztlan_redes_state', JSON.stringify(this.state));
    this.updateStatsUI();
  },

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    const panels = document.querySelectorAll('.view-panel');

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.dataset.view;

        // Comprobación de Candado y Desbloqueo Académico
        if (window.AcademicProgression && !window.AcademicProgression.canAccessUnit(targetView, true)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        navButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`view-${targetView}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }

        // Si se cambia al Taller, asegurar que se renderiza el ejercicio activo de inmediato
        if (targetView === 'workshop' && window.VisualExercises) {
          window.VisualExercises.renderExerciseList();
          if (!window.VisualExercises.currentExerciseId) {
            window.VisualExercises.loadFirstAccessibleExercise();
          } else {
            window.VisualExercises.loadExercise(window.VisualExercises.currentExerciseId);
          }
        }

        // Si se cambia al Laboratorio de Prácticas, renderizar laboratorio activo
        if (targetView === 'labs' && window.NetworkLabs) {
          window.NetworkLabs.renderCurrentLab();
        }

        // Si se cambia a la vista de topologías, redimensionar canvas
        if (targetView === 'u1' && topoSim) {
          setTimeout(() => topoSim.resizeCanvas(), 50);
        }
      });
    });
  },

  navigateTo(viewId) {
    if (window.AcademicProgression && !window.AcademicProgression.canAccessUnit(viewId, true)) {
      return;
    }
    const targetBtn = document.querySelector(`.nav-tab-btn[data-view="${viewId}"]`);
    if (targetBtn) {
      targetBtn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  updateStatsUI() {
    // Cálculo de ponderación oficial Aztlán:
    // Reportes de lectura: 20%
    // Investigación: 30%
    // Exámenes parciales (Quizzes U1-U5): 20%
    // Examen final integrador: 30%
    const readingPart = (this.state.readingReportsDone / 100) * 20;
    const researchPart = (this.state.researchDone / 100) * 30;

    let totalQuizScore = 0;
    let answeredQuizzes = 0;
    ['u1', 'u2', 'u3', 'u4', 'u5'].forEach(u => {
      if (this.state.scores[u] !== undefined) {
        totalQuizScore += this.state.scores[u];
        answeredQuizzes++;
      }
    });
    const avgQuizzes = answeredQuizzes > 0 ? (totalQuizScore / answeredQuizzes) : 0;
    const partialsPart = (avgQuizzes / 100) * 20;

    const finalExamScore = this.state.scores.finalExam !== null ? this.state.scores.finalExam : 0;
    const finalPart = (finalExamScore / 100) * 30;

    const globalGrade = Math.round((readingPart + researchPart + partialsPart + finalPart) * 10) / 10;

    // Actualizar UI
    const gradeElem = document.getElementById('stat-grade');
    if (gradeElem) gradeElem.innerText = `${globalGrade} / 100`;

    const progBar = document.getElementById('stat-prog-fill');
    if (progBar) progBar.style.width = `${Math.min(100, globalGrade)}%`;

    const statusBadge = document.getElementById('rubric-global-status');
    if (statusBadge) {
      if (globalGrade >= 70) {
        statusBadge.innerHTML = `<span style="color: #10b981;">✓ ACREDITADO (Nota: ${globalGrade})</span>`;
      } else {
        statusBadge.innerHTML = `<span style="color: #f59e0b;">⏳ EN PROCESO (Nota: ${globalGrade} - Mínimo 70 para aprobar)</span>`;
      }
    }
  },

  // Quizzes por Unidad
  renderQuizzes() {
    ['u1', 'u2', 'u3', 'u4', 'u5'].forEach(unitKey => {
      const container = document.getElementById(`quiz-${unitKey}-container`);
      if (!container) return;

      const questions = COURSE_QUIZZES[unitKey];
      container.innerHTML = `
        <div class="quiz-question-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="color: #38bdf8; font-size: 1rem;">Cuestionario Práctico de Validación (${unitKey.toUpperCase()})</h4>
            <span style="font-size: 0.8rem; color: #94a3b8;" id="score-text-${unitKey}">Puntaje: ${this.state.scores[unitKey]}%</span>
          </div>
          ${questions.map((qItem, qIdx) => `
            <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #1e293b; padding-bottom: 1rem;">
              <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #f8fafc;">
                ${qIdx + 1}. ${qItem.q}
              </p>
              <div class="quiz-options-list">
                ${qItem.options.map((opt, optIdx) => `
                  <div class="quiz-option" onclick="App.checkUnitQuizAnswer('${unitKey}', ${qIdx}, ${optIdx}, this)">
                    <span style="font-weight: bold; color: #38bdf8;">${String.fromCharCode(65 + optIdx)})</span>
                    <span>${opt}</span>
                  </div>
                `).join('')}
              </div>
              <div class="quiz-explanation" id="exp-${unitKey}-${qIdx}"></div>
            </div>
          `).join('')}
        </div>
      `;
    });
  },

  checkUnitQuizAnswer(unitKey, qIdx, selectedIdx, elem) {
    const qItem = COURSE_QUIZZES[unitKey][qIdx];
    const parent = elem.closest('.quiz-options-list');
    const options = parent.querySelectorAll('.quiz-option');
    const expBox = document.getElementById(`exp-${unitKey}-${qIdx}`);

    options.forEach(o => o.style.pointerEvents = 'none');

    if (selectedIdx === qItem.answer) {
      elem.classList.add('correct', 'user-chosen-correct');
      if (expBox) {
        expBox.style.display = 'block';
        expBox.style.borderLeftColor = '#10b981';
        expBox.innerHTML = `<strong style="color: #10b981;">✓ ¡Correcto!</strong> ${qItem.why}`;
      }
    } else {
      elem.classList.add('incorrect', 'user-chosen-incorrect');
      options[qItem.answer].classList.add('correct');
      if (expBox) {
        expBox.style.display = 'block';
        expBox.style.borderLeftColor = '#ef4444';
        expBox.innerHTML = `<strong style="color: #ef4444;">✗ Incorrecto.</strong> La opción correcta es la ${String.fromCharCode(65 + qItem.answer)}. ${qItem.why}`;
      }
    }

    // Actualizar score
    this.recalcUnitScore(unitKey);
  },

  recalcUnitScore(unitKey) {
    const container = document.getElementById(`quiz-${unitKey}-container`);
    if (!container) return;
    const correctCount = container.querySelectorAll('.quiz-option.user-chosen-correct').length;
    const totalQuestions = COURSE_QUIZZES[unitKey].length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    this.state.scores[unitKey] = percentage;
    this.saveState();

    const scoreText = document.getElementById(`score-text-${unitKey}`);
    if (scoreText) scoreText.innerText = `Puntaje: ${percentage}% (${correctCount} de ${totalQuestions} reactivos)`;

    // Registrar en el motor de progresión secuencial
    if (window.AcademicProgression) {
      window.AcademicProgression.recordQuizCompleted(unitKey, percentage);
    }
  },

  // Examen Final Integrador (20 preguntas)
  renderFinalExam() {
    const container = document.getElementById('final-exam-questions-list');
    if (!container) return;

    container.innerHTML = FINAL_EXAM_QUESTIONS.map((q, idx) => `
      <div class="quiz-question-card" style="margin-bottom: 1.5rem;">
        <div class="quiz-q-title">
          <span style="background: #0284c7; color: white; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Reactivo ${idx + 1}/${FINAL_EXAM_QUESTIONS.length}</span>
          <span>${q.q}</span>
        </div>
        <div class="quiz-options-list">
          ${q.options.map((opt, oIdx) => `
            <label class="quiz-option" style="cursor: pointer;">
              <input type="radio" name="final_q_${idx}" value="${oIdx}" style="margin-right: 0.5rem;">
              <span>${String.fromCharCode(65 + oIdx)}) ${opt}</span>
            </label>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="final-exp-${idx}"></div>
      </div>
    `).join('');
  },

  gradeFinalExam() {
    let correct = 0;
    FINAL_EXAM_QUESTIONS.forEach((q, idx) => {
      const selected = document.querySelector(`input[name="final_q_${idx}"]:checked`);
      const expBox = document.getElementById(`final-exp-${idx}`);
      if (selected) {
        const val = parseInt(selected.value, 10);
        if (val === q.answer) {
          correct++;
          if (expBox) {
            expBox.style.display = 'block';
            expBox.style.borderLeftColor = '#10b981';
            expBox.innerHTML = `<strong style="color: #10b981;">✓ Correcto:</strong> ${q.why}`;
          }
        } else {
          if (expBox) {
            expBox.style.display = 'block';
            expBox.style.borderLeftColor = '#ef4444';
            expBox.innerHTML = `<strong style="color: #ef4444;">✗ Respuesta incorrecta.</strong> La opción correcta era la ${String.fromCharCode(65 + q.answer)}. ${q.why}`;
          }
        }
      } else {
        if (expBox) {
          expBox.style.display = 'block';
          expBox.style.borderLeftColor = '#f59e0b';
          expBox.innerHTML = `⚠️ Sin responder. Respuesta correcta: ${String.fromCharCode(65 + q.answer)}. ${q.why}`;
        }
      }
    });

    const finalPct = Math.round((correct / FINAL_EXAM_QUESTIONS.length) * 100);
    this.state.scores.finalExam = finalPct;
    this.saveState();

    const resCard = document.getElementById('final-exam-result');
    if (resCard) {
      resCard.style.display = 'block';
      resCard.innerHTML = `
        <div style="background: ${finalPct >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border: 2px solid ${finalPct >= 70 ? '#10b981' : '#ef4444'}; border-radius: 12px; padding: 1.5rem; text-align: center;">
          <h3 style="font-size: 1.4rem; color: ${finalPct >= 70 ? '#6ee7b7' : '#fca5a5'}; margin-bottom: 0.5rem;">
            ${finalPct >= 70 ? '🎉 ¡FELICIDADES! EXAMEN FINAL APROBADO' : '⚠️ RESULTADO DEL EXAMEN FINAL'}
          </h3>
          <p style="font-size: 1.1rem; color: #f8fafc; margin-bottom: 0.8rem;">
            Aciertos: <strong>${correct} de 20</strong> (${finalPct}%)
          </p>
          <p style="font-size: 0.88rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">
            ${finalPct >= 70 
              ? 'Has demostrado el dominio de las competencias en diseño, modelos de referencia, protocolos, cableado estructurado y direccionamiento de redes.'
              : 'Se requiere un mínimo de 70% para aprobar. Revisa las justificaciones técnicas en cada reactivo y vuelve a intentarlo.'}
          </p>
        </div>
      `;
      window.scrollTo({ top: resCard.offsetTop - 100, behavior: 'smooth' });
    }
  },

  // Calculadora de Subredes UI
  setupSubnetCalc() {
    const ipInput = document.getElementById('calc-ip');
    const cidrSelect = document.getElementById('calc-cidr');
    const runBtn = document.getElementById('calc-btn-run');

    if (!runBtn) return;

    const doCalculate = () => {
      const ip = ipInput.value || '192.168.1.100';
      const cidr = cidrSelect.value || '24';
      const res = SubnetCalculator.calculate(ip, cidr);

      if (!res) {
        alert('Por favor introduce una dirección IPv4 válida (ej. 192.168.1.10).');
        return;
      }

      document.getElementById('res-net-ip').innerText = res.network;
      document.getElementById('res-mask-ip').innerText = `${res.mask} (${res.cidr})`;
      document.getElementById('res-bcast-ip').innerText = res.broadcast;
      document.getElementById('res-first-host').innerText = res.firstHost;
      document.getElementById('res-last-host').innerText = res.lastHost;
      document.getElementById('res-usable-hosts').innerText = res.usableHosts;
      document.getElementById('res-total-hosts').innerText = res.totalHosts;
      document.getElementById('res-ip-type').innerText = `${res.ipClass} - ${res.type}`;
    };

    runBtn.addEventListener('click', doCalculate);
    cidrSelect.addEventListener('change', doCalculate);
    doCalculate();
  },

  // Dimensionador de Cableado y Rack (Unidad 5)
  setupRackDimensioner() {
    const waInput = document.getElementById('rack-wa-count');
    const dropsSelect = document.getElementById('rack-drops-per-wa');
    const calcRackBtn = document.getElementById('rack-calc-btn');

    if (!calcRackBtn) return;

    const computeRack = () => {
      const wa = parseInt(waInput.value, 10) || 48;
      const drops = parseInt(dropsSelect.value, 10) || 2;
      const totalDrops = wa * drops;

      // Patch panels de 24 puertos
      const ppCount = Math.ceil(totalDrops / 24);
      // Cada PP (1U) se acompaña de un organizador de cables horizontal (1U)
      const ppRackUnits = ppCount * 2; 

      // Switches de 24 puertos (PoE para VoIP/AP)
      const swCount = Math.ceil(totalDrops / 24);
      const swRackUnits = swCount * 2; // Switch (1U) + Organizador (1U)

      // Router / Firewall perimetral: 2U
      const routerUnits = 2;

      // PDU de alimentación: 1U
      const pduUnits = 1;

      // UPS para respaldo eléctrico (2kVA): 2U
      const upsUnits = 2;

      // Servidor local / NVR para cámaras: 2U
      const srvUnits = 2;

      const totalRequiredU = ppRackUnits + swRackUnits + routerUnits + pduUnits + upsUnits + srvUnits;
      
      // Factor de crecimiento 30% según TIA-569
      const recommendedTotalU = Math.ceil(totalRequiredU * 1.3);

      let rackSizeName = 'Gabinete de Pared 18U';
      if (recommendedTotalU > 24) rackSizeName = 'Rack de Piso Estándar de 42U o 45U (19 pulgadas)';
      else if (recommendedTotalU > 18) rackSizeName = 'Rack de Piso / Bastidor de 24U (19 pulgadas)';

      document.getElementById('rack-res-drops').innerText = `${totalDrops} servicios (Jacks RJ-45 Cat 6)`;
      document.getElementById('rack-res-pp').innerText = `${ppCount} paneles de 24 puertos (${ppCount * 2}U con pasacables)`;
      document.getElementById('rack-res-sw').innerText = `${swCount} switches Gigabit PoE de 24 puertos`;
      document.getElementById('rack-res-units').innerText = `${totalRequiredU}U ocupadas (${recommendedTotalU}U con 30% holgura)`;
      document.getElementById('rack-res-rec').innerText = rackSizeName;
    };

    calcRackBtn.addEventListener('click', computeRack);
    computeRack();
  },

  // Generador de Memoria Técnica Imprimible (Unidad 5.7)
  printTechnicalMemory() {
    window.print();
  }
};

// Exportar explícitamente a window
if (typeof window !== 'undefined') {
  window.App = App;
}

// Iniciar al cargar el DOM de manera segura
function startApp() {
  if (window.App && typeof window.App.init === 'function') {
    window.App.init();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
