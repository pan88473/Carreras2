# Apex Horizon 3D — Edición Montañas, Peligros Dinámicos, Multijugador y TV Replay

Juego de carreras 3D optimizado para pantallas pequeñas de celular y PC con carreteras elevadas (subidas, bajadas y viaductos), tramos de vista cinematográfica, peligros dinámicos (animales cruzando la vía y desprendimiento de rocas en pendientes), modo multijugador (Pantalla Dividida Local 2P y Salas Online P2P con código) y repetición televisiva estilo transmisión en vivo al finalizar la carrera.

## Novedades de esta actualización
1. **Diseño Móvil Compacto (No cubre el vehículo)**:
   - Panel inferior organizado en 4 pestañas compactas (`1. Coche`, `2. Pista`, `3. Multijugador`, `4. Dificultad`) y botón **Ver 3D / Minimizar** para admirar y girar el coche 360° con el dedo en pantallas pequeñas.
   - Encabezado compacto y controles táctiles ergonómicos.
2. **Carreteras con Subidas, Bajadas y Vistas Cinematográficas**:
   - Desniveles verticales reales de hasta **+48 metros** con viaductos sobre pilares, pendientes que afectan la aceleración/velocidad y **Miradores Panorámicos** con cascadas animadas 3D, puentes colgantes, faros costeros con veleros y arcos de cañón.
   - Al pasar por los miradores se activa suavemente la **Cámara Cinematográfica** con barras panorámicas (con botón para volver a cámara normal si lo prefieres).
3. **Peligros Dinámicos y Mayor Dificultad**:
   - **Cruces de Fauna 3D**: Ciervos alpinos, berrendos y cyber-fauna articulada que cruzan la carretera con alerta previa en el HUD. Esquivarlos de cerca otorga **+22% de Nitro**.
   - **Desprendimiento de Rocas en Pendientes**: En tramos inclinados caen rocas gigantes desde las laderas marcando círculos rojos de impacto sobre el asfalto.
   - **Selector de Dificultad**: `Normal`, `Retador` (predeterminado con rivales competitivos que usan nitro) y `Extremo`.
4. **Modo Multijugador (Local y Online P2P)**:
   - **2P Pantalla Dividida Local**: Juega con un amigo en el mismo teléfono (división Superior/Inferior con controles táctiles dobles) o en PC (`WASD` vs `Flechas`).
   - **Sala Online P2P (WebRTC / PeerJS)**: Crea una sala con código (`APX-XXX`) y compártelo con otro jugador para conectarse directamente de navegador a navegador sin configurar servidores.
5. **Repetición de Carrera estilo Transmisión de TV / Reportaje en Vivo**:
   - Al cruzar la meta se lanza automáticamente la **Transmisión de Apex Sports TV** con cámaras de grúa con zoom, helicóptero, dron rasante y cámara onboard, titular periodístico dinámico, barra de noticias en vivo con tus jugadas destacadas y controles de reproducción (`Pausa`, `0.5x Cámara Lenta`, `2.0x`, línea de tiempo y acceso al Podio).

## Estructura del paquete
- `index.html`: Archivo principal modular.
- `css/styles.css`: Estilos responsivos para móvil, barras cinematográficas y ticker de TV.
- `js/data_and_audio.js`: Catálogo de coches, circuitos con elevación/miradores/peligros, niveles de dificultad y sintetizador Web Audio API.
- `js/engine_3d_game.js`: Motor gráfico 3D (Three.js), físicas en pendientes, fauna y derrumbes, multijugador P2P/Split-Screen y sistema de repetición TV.
- `apex_horizon_standalone.html`: Versión autocontenida en un solo archivo HTML.
- `manifest.json`: Manifiesto PWA.
