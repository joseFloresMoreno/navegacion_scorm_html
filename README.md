# Sistema de Navegación SCORM Responsivo con IA

Sistema profesional de cursos e-learning con soporte SCORM 1.2, diseño modular, navegación guiada y múltiples tipos de slides interactivos. Optimizado para producción rápida mediante IA y compatible con cualquier LMS.

## ✨ Características Principales

- 🎯 **Compatibilidad SCORM 1.2** - Integración completa con cualquier LMS
- 📱 **100% Responsivo** - Diseño adaptable a móvil, tablet y desktop
- 🚀 **Producción Rápida** - Desarrollo acelerado con IA
- 🎨 **CSS Modular** - Sistema de clases reutilizables (50+ componentes)
- 🧩 **5 Tipos de Slides** - Page, Quiz, DragDrop, InfoCards e Image
- 🎵 **Reproductor de Audio** - Control de narración por slide
- 📊 **Progreso Visual** - Dots y contador personalizables
- 🖥️ **Modo Pantalla Completa** - Experiencia inmersiva
- 🎨 **Temas Personalizables** - Variables CSS para branding
- 📦 **Standalone Pages** - Slides independientes para desarrollo/pruebas

## 🏗️ Estructura del Proyecto

```
navegacion_scorm_html/
├── course.html              # HTML principal del curso
├── course.js                # Lógica del curso (2000+ líneas)
├── course.css               # Sistema de estilos modular (2200+ líneas)
├── api.js                   # API SCORM 1.2
├── courseData.json          # Contenido estructurado del curso
├── imsmanifest.xml          # Manifiesto SCORM
│
├── audios/                  # Archivos de audio (mp3)
├── images/                  # Imágenes del curso
├── videos/                  # Videos del curso
├── material/                # Material descargable
│
├── *_standalone.html        # Slides independientes para desarrollo
│   ├── hero_moodle_standalone.html
│   ├── slide_0_standalone.html
│   ├── slide_1_standalone.html
│   └── ... (más slides)
│
├── DEMO_PRUEBAS/            # Demo completo del sistema
│   ├── course.html
│   ├── course.js
│   ├── course.css
│   ├── courseData.json
│   └── ... (recursos completos)
│
├── README.md                # Este archivo
├── RESUMEN_MIGRACION.md     # Documentación de migración CSS
└── PLAN_MIGRACION_CSS.md    # Plan de migración CSS
```

## 🎨 Sistema de Diseño

### Variables CSS Personalizables

El archivo `course.css` incluye un completo sistema de variables para personalizar el tema:

```css
:root {
    /* Colores principales */
    --color-primary: #436AB1;
    --color-primary-dark: #141B59;
    --color-secondary: #49BEA6;
    --color-accent: #F7C146;
    --color-accent-alt: #F171AB;
    
    /* Colores de texto */
    --text-primary: #141B59;
    --text-secondary: #436AB1;
    --text-muted: #6c757d;
    --header-title-color: #141B59;
    
    /* Progress dots */
    --progress-dot-default: rgba(67, 106, 177, 0.25);
    --progress-dot-active: #436AB1;
    --progress-dot-completed: #49BEA6;
    
    /* Visibilidad de progress dots */
    --progress-dots-display-desktop: none;
    --progress-dots-display-mobile: none;
}
```

### Biblioteca de Clases CSS (50+ componentes)

#### Hero & Landing
- `.hero-section`, `.hero-content`, `.hero-badge`, `.hero-title`, `.hero-description`
- `.feature-grid`, `.card-feature`, `.stats-section`, `.stats-grid`

#### Iconos & Cajas
- `.icon-box-sm`, `.icon-box-md`, `.icon-box-lg`
- `.infocard-icon-box`, `.section-icon-box`

#### Secciones & Headers
- `.section-header`, `.section-title`, `.section-subtitle`, `.section-gradient-bg`
- `.section-icon-header`, `.infocard-section-header`

#### Layouts & Grids
- `.content-grid-2col`, `.infocard-grid`, `.info-grid`, `.benefits-grid`
- `.comparison-grid`, `.legend-grid`

#### Cards & Boxes
- `.card-info`, `.card-feature`, `.comparison-card`, `.legend-card`
- `.quote-box`, `.benefits-box`, `.alert-warning`

#### Y más de 30 clases adicionales...

## 🚀 Inicio Rápido

### 1. Configuración Básica

#### HTML Principal (course.html)
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curso SCORM</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Estilos del curso -->
    <link rel="stylesheet" href="course.css">
</head>
<body>
    <div id="main-content" class="course-container">
        <!-- Header con logo, título y botón fullscreen -->
        <div class="course-header">
            <button id="fullscreen-btn" class="fullscreen-btn" title="Pantalla completa">
                <i class="bi bi-arrows-fullscreen"></i>
            </button>
            <div class="header-content">
                <div id="course-logo-container" class="course-logo-container" style="display: none;">
                    <img id="course-logo" src="" alt="Logo" class="course-logo">
                </div>
                <h1 id="course-title"></h1>
            </div>
            <div class="course-progress" id="course-progress"></div>
        </div>
        
        <!-- Navegación sticky -->
        <div class="slide-nav slide-nav-top" id="slide-navigation"></div>
        
        <!-- Contenedor de slides -->
        <div id="course-content" class="slide-container"></div>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="api.js"></script>
    <script src="course.js"></script>
</body>
</html>
```

### 2. Estructura de courseData.json

```json
{
  "courseData": {
    "name": "Nombre del Curso",
    "logo": "images/logo.png",
    "navigationMode": "slides",
    "slides": [
      {
        "id": "slide-0",
        "order": 0,
        "type": "page",
        "title": "Título del Slide",
        "audioSrc": "audios/audio_0.mp3",
        "convertedHtml": "<div class='slide-content'>...</div>"
      }
    ]
  }
}
```

## 📚 Tipos de Slides

### 1. Page (Página de Contenido)

Slide de contenido con HTML personalizado. Soporta texto, imágenes, videos y componentes complejos.

```json
{
  "id": "slide-0",
  "order": 0,
  "type": "page",
  "title": "Título del Slide",
  "audioSrc": "audios/audio_0.mp3",
  "convertedHtml": "<div class='slide-content'>...</div>"
}
```

**Características:**
- HTML totalmente personalizable
- Integración de videos y multimedia
- Sistema de clases CSS modular
- Audio descriptivo opcional

### 2. Quiz (Evaluación)

Pregunta de selección múltiple con feedback inmediato.

```json
{
  "id": "slide-quiz",
  "order": 1,
  "type": "quiz",
  "title": "Evaluación",
  "audioSrc": "audios/audio_quiz.mp3",
  "content": {
    "question": "¿Cuál es la respuesta correcta?",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": 2,
    "explanation": "Explicación detallada de la respuesta",
    "feedbackCorrect": "¡Correcto! Excelente trabajo.",
    "feedbackIncorrect": "Incorrecto. Revisa el contenido e intenta nuevamente."
  }
}
```

**Características:**
- Bloquea navegación hasta responder
- Modal de retroalimentación inmediata
- Explicación detallada post-respuesta
- Registro de respuestas
- Compatible con audio

### 3. DragDrop (Arrastrar y Soltar)

Actividad interactiva de categorización mediante drag & drop.

```json
{
  "id": "slide-drag",
  "order": 2,
  "type": "dragdrop",
  "title": "Actividad de Clasificación",
  "audioSrc": "audios/audio_drag.mp3",
  "content": {
    "question": "Arrastra cada elemento a su categoría correcta",
    "items": [
      {"id": "item-1", "text": "Elemento 1", "category": "cat1"},
      {"id": "item-2", "text": "Elemento 2", "category": "cat2"}
    ],
    "categories": [
      {"id": "cat1", "label": "Categoría 1"},
      {"id": "cat2", "label": "Categoría 2"}
    ],
    "explanation": "Explicación de la solución correcta",
    "feedbackCorrect": "¡Excelente! Todas las respuestas son correctas.",
    "feedbackIncorrect": "Algunas respuestas son incorrectas. Inténtalo de nuevo."
  }
}
```

**Características:**
- HTML5 Drag & Drop API
- Validación automática de categorías
- Reinicio automático en error
- Bloquea navegación hasta completar
- Feedback visual de correctas/incorrectas

### 4. InfoCards (Tarjetas Interactivas)

Grid de tarjetas que abren modales con información detallada.

```json
{
  "id": "slide-cards",
  "order": 3,
  "type": "infoCards",
  "title": "Explorar Contenido",
  "audioSrc": "audios/audio_cards.mp3",
  "convertedHtml": true,
  "content": {
    "convertedDescription": "<div class='infocard-section-header'>...</div>",
    "cards": [
      {
        "icon": "📚",
        "title": "Título de la Tarjeta",
        "subtitle": "Subtítulo descriptivo",
        "bgColor": "#e8f3f8",
        "iconColor": "#7fb3c4",
        "modalContent": "<h4>Contenido del Modal</h4><p>Información detallada...</p>"
      }
    ]
  }
}
```

**Características:**
- Grid responsive (3/2/1 columnas)
- Modales Bootstrap 5 (modal-xl)
- Iconos emoji y colores personalizables
- HTML enriquecido en modales
- No bloquea navegación
- Registro de tarjetas visitadas

### 5. Image (Imagen Destacada)

Slide centrado en una imagen de alta calidad.

```json
{
  "id": "slide-image",
  "order": 4,
  "type": "image",
  "title": "Título de la Imagen",
  "audioSrc": "audios/audio_image.mp3",
  "content": {
    "imageSrc": "images/infografia.jpg",
    "imageAlt": "Descripción de la imagen",
    "caption": "Pie de imagen opcional"
  }
}
```

**Características:**
- Imagen de alta resolución
- Caption opcional
- Compatible con audio
- Responsive y optimizada

## 🎵 Reproductor de Audio

Cada slide puede incluir narración de audio mediante la propiedad `audioSrc`:

```json
{
  "id": "slide-1",
  "audioSrc": "audios/audio_1.mp3"
}
```

**Funcionalidades:**
- ▶️ Play/Pause automático al cambiar slide
- 🔊 Control de volumen
- ⏯️ Barra de progreso
- 📱 Diseño responsive
- ♿ Accesibilidad (teclas de atajo)

## 🖥️ Modo Pantalla Completa

El sistema incluye un botón de pantalla completa en el header:

```html
<button id="fullscreen-btn" class="fullscreen-btn" title="Pantalla completa">
    <i class="bi bi-arrows-fullscreen"></i>
</button>
```

**Funcionalidades:**
- Toggle fullscreen/exit fullscreen
- Icono dinámico según estado
- Compatible con todos los navegadores
- Soporte para eventos de teclado (Esc)

## 📊 Sistema de Progreso

### Progress Dots

Indicadores visuales del progreso del estudiante:

```css
:root {
    /* Controlar visibilidad */
    --progress-dots-display-desktop: flex; /* o none */
    --progress-dots-display-mobile: none;  /* o flex */
    
    /* Personalizar colores */
    --progress-dot-default: rgba(67, 106, 177, 0.25);
    --progress-dot-active: #436AB1;
    --progress-dot-completed: #49BEA6;
}
```

### Contador de Slides

Muestra el slide actual y total en la navegación:
```
Slide 3 de 12
```

## 📦 Standalone Pages

El proyecto incluye slides independientes para desarrollo y pruebas:

- `hero_moodle_standalone.html` - Hero section standalone
- `slide_0_standalone.html` - Slide 0 independiente
- `slide_1_standalone.html` - Slide 1 independiente
- `slide_3_standalone.html` - Slide 3 independiente
- `slide_4_standalone.html` - Slide 4 independiente
- `slide_5_standalone.html` - Slide 5 independiente
- `slide_5_drag_standalone.html` - Drag & Drop independiente

**Uso:**
1. Abrir directamente en navegador para pruebas rápidas
2. No requiere servidor web
3. Ideal para diseño y ajustes visuales
4. Incluyen estilos y scripts necesarios

## 🔧 Configuración Avanzada

### Logo del Curso

Agregar logo en `courseData.json`:

```json
{
  "courseData": {
    "name": "Nombre del Curso",
    "logo": "images/logo.png"
  }
}
```

El logo aparecerá automáticamente en el header junto al título.

### Navegación

El sistema utiliza navegación sticky (fija en la parte superior):

```html
<div class="slide-nav slide-nav-top" id="slide-navigation">
    <!-- Generado automáticamente por course.js -->
</div>
```

**Controles:**
- Botón Anterior (◀ Anterior)
- Contador (Slide X de Y)
- Botón Siguiente (Siguiente ▶)
- Botón Finalizar (aparece en último slide)

### Modal de Finalización

Al completar el curso, se muestra un modal de confirmación:

```html
<div id="completion-modal" class="completion-modal">
    <div class="modal-content">
        <div class="modal-icon">🎉</div>
        <h2>¡Curso Completado!</h2>
        <p>Felicitaciones...</p>
        <div class="modal-buttons">
            <button onclick="closeCompletionModal()">Revisar Curso</button>
            <button onclick="finishAndClose()">Finalizar</button>
        </div>
    </div>
</div>
```

## 📋 SCORM 1.2

### Integración con LMS

El archivo `api.js` implementa la API SCORM 1.2 completa:

**Funciones principales:**
- `LMSInitialize()` - Inicializar comunicación
- `LMSSetValue()` - Guardar datos
- `LMSGetValue()` - Recuperar datos
- `LMSCommit()` - Confirmar cambios
- `LMSFinish()` - Finalizar sesión

**Datos registrados:**
- `cmi.core.lesson_status` - Estado del curso (incomplete/completed)
- `cmi.core.lesson_location` - Slide actual
- `cmi.core.score.raw` - Puntaje (si aplica)
- `cmi.core.session_time` - Tiempo de sesión
- `cmi.suspend_data` - Datos personalizados (respuestas, progreso)

### Manifiesto SCORM

El archivo `imsmanifest.xml` define la estructura del paquete:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="SCORM_COURSE_001" version="1.0">
    <organizations default="ORG-001">
        <organization identifier="ORG-001">
            <title>Nombre del Curso</title>
            <item identifier="ITEM-001" identifierref="RES-001">
                <title>Curso Principal</title>
            </item>
        </organization>
    </organizations>
    <resources>
        <resource identifier="RES-001" type="webcontent" href="course.html">
            <file href="course.html"/>
            <file href="course.js"/>
            <file href="course.css"/>
            <file href="api.js"/>
            <file href="courseData.json"/>
            <!-- Agregar todos los recursos -->
        </resource>
    </resources>
</manifest>
```

### Empaquetar para LMS

1. Comprimir todo en un archivo ZIP:
   ```
   - course.html
   - course.js
   - course.css
   - api.js
   - courseData.json
   - imsmanifest.xml
   - audios/ (carpeta completa)
   - images/ (carpeta completa)
   - videos/ (carpeta completa)
   - material/ (carpeta completa)
   ```

2. Subir el ZIP al LMS (Moodle, Blackboard, Canvas, etc.)

## 🎨 Personalización de Estilos

### Cambiar Colores del Tema

Editar variables en `course.css`:

```css
:root {
    --color-primary: #TU_COLOR;
    --color-secondary: #TU_COLOR;
    --text-primary: #TU_COLOR;
}
```

### Cambiar Fuente

```css
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE&display=swap');

* {
    font-family: 'TU_FUENTE', sans-serif;
}
```

### Personalizar Navegación

```css
.slide-nav {
    background: #TU_COLOR;
    padding: 1rem 2rem;
}

.btn-nav-primary {
    background: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
}
```

## 🚀 Producción Rápida con IA

El sistema está optimizado para producción acelerada:

**Flujo de trabajo recomendado:**
1. ✍️ **Diseño Instruccional**: Definir objetivos y estructura (15 hrs para 30 slides)
2. 🤖 **Generación con IA**: Crear contenido HTML usando clases CSS (25 hrs)
3. 🎨 **Ajustes Visuales**: Refinar diseño y multimedia (10 hrs)

**Total: ~50 horas** (50% menos que método tradicional)

### Ventajas:
- Sistema de clases CSS reutilizables
- Componentes modulares listos para usar
- Estructura estandarizada en JSON
- Sin dependencias de herramientas propietarias

## 📁 Demo Completa

La carpeta `DEMO_PRUEBAS/` contiene un curso completo de ejemplo con:

- 7 slides de demostración
- Todos los tipos de slides implementados
- Ejemplos de cada componente CSS
- Audio de muestra
- Imágenes y videos de ejemplo

**Para ejecutar:**
1. Abrir `DEMO_PRUEBAS/course.html` en navegador
2. Explorar todos los tipos de slides
3. Probar interactividad (quiz, drag-drop, cards)

## 📝 Buenas Prácticas

### Estructura de Slides

```json
{
  "slides": [
    {"order": 0, "type": "page", "title": "Bienvenida"},
    {"order": 1, "type": "page", "title": "Introducción"},
    {"order": 2, "type": "infoCards", "title": "Conceptos"},
    {"order": 3, "type": "quiz", "title": "Evaluación 1"},
    {"order": 4, "type": "page", "title": "Desarrollo"},
    {"order": 5, "type": "dragdrop", "title": "Actividad"},
    {"order": 6, "type": "quiz", "title": "Evaluación Final"}
  ]
}
```

### Optimización de Imágenes

- Formato: JPG (fotografías), PNG (gráficos)
- Tamaño máximo: 1920x1080px
- Compresión: 80-85% calidad
- Peso: < 300KB por imagen

### Optimización de Audio

- Formato: MP3
- Bitrate: 128kbps
- Mono (si es solo voz)
- Normalizar volumen

### Optimización de Videos

- Formato: MP4 (H.264)
- Resolución: 1280x720px (720p)
- Framerate: 30fps
- Bitrate: 2-3 Mbps

## 🛠️ Troubleshooting

### El audio no se reproduce

1. Verificar ruta en `courseData.json`
2. Confirmar formato MP3
3. Revisar consola del navegador

### Quiz no bloquea navegación

1. Verificar tipo: `"type": "quiz"`
2. Confirmar `correctAnswer` es número (0-based index)
3. Revisar estructura de `content`

### Drag & Drop no funciona

1. Verificar que IDs sean únicos
2. Confirmar `category` coincide entre items y categories
3. Probar en navegador moderno (Chrome, Firefox, Edge)

### SCORM no guarda progreso

1. Verificar `api.js` está incluido
2. Probar en LMS real (no en navegador local)
3. Revisar consola para errores de SCORM

## 📚 Recursos Adicionales

### Documentación

- [README.md](README.md) - Este archivo
- [RESUMEN_MIGRACION.md](RESUMEN_MIGRACION.md) - Migración CSS detallada
- [PLAN_MIGRACION_CSS.md](PLAN_MIGRACION_CSS.md) - Plan de migración

### Archivos de Referencia

- `courseData.json` - Estructura completa de ejemplo
- `course.css` - Todas las clases CSS disponibles
- `DEMO_PRUEBAS/` - Implementación completa de referencia

## 🎯 Casos de Uso

### Curso Corporativo de 30 Slides

```json
{
  "courseData": {
    "name": "Inducción Corporativa 2024",
    "logo": "images/company-logo.png",
    "navigationMode": "slides",
    "slides": [
      // 1 Hero
      {"order": 0, "type": "page", "title": "Bienvenida"},
      // 24 Contenido
      {"order": 1, "type": "page", "title": "Misión y Visión"},
      // ...
      // 5 Evaluaciones
      {"order": 25, "type": "quiz", "title": "Evaluación Final"}
    ]
  }
}
```

### Curso Académico Interactivo

```json
{
  "slides": [
    {"type": "page", "title": "Introducción al Tema"},
    {"type": "infoCards", "title": "Conceptos Clave"},
    {"type": "page", "title": "Desarrollo Teórico"},
    {"type": "dragdrop", "title": "Práctica Guiada"},
    {"type": "quiz", "title": "Autoevaluación"},
    {"type": "page", "title": "Conclusiones"}
  ]
}
```

## 📊 Estadísticas del Proyecto

- **Líneas de código total**: ~5,000+
  - `course.js`: ~2,095 líneas
  - `course.css`: ~2,277 líneas
  - `api.js`: ~500 líneas
  
- **Componentes CSS**: 50+ clases reutilizables
- **Tipos de slides**: 5 tipos diferentes
- **Compatibilidad**: SCORM 1.2, todos los LMS
- **Frameworks**: Bootstrap 5, Tailwind CSS

## 🤝 Contribuciones

Este es un proyecto de plantilla para cursos e-learning. Siéntete libre de:

- Agregar nuevos tipos de slides
- Crear componentes CSS adicionales
- Mejorar la integración SCORM
- Optimizar el rendimiento
- Documentar casos de uso

## 📄 Licencia

Este proyecto es una plantilla de código abierto para desarrollo de cursos e-learning.

## 👥 Soporte

Para preguntas o soporte:
- Revisar documentación en `/docs`
- Consultar ejemplos en `/DEMO_PRUEBAS`
- Verificar archivos standalone para pruebas rápidas

---

**Desarrollado para producción rápida de cursos e-learning con IA** 🚀

*Última actualización: Enero 2026*
  "type": "image",
  "content": {
    "src": "images/foto.jpg",
    "alt": "Descripción",
    "overlayText": "Texto sobre la imagen"
  }
}
```

### 6. Video (Video)
Slide con video (YouTube o archivo).

```json
{
  "id": "slide-5",
  "order": 5,
  "type": "video",
  "content": {
    "src": "https://www.youtube.com/embed/VIDEO_ID",
    "source": "youtube"
  }
}
```

### 7. Audio (Audio)
Slide dedicado a contenido de audio.

```json
{
  "id": "slide-6",
  "order": 6,
  "type": "audio",
  "content": {
    "src": "audios/audio.mp3",
    "audioType": "narration"
  }
}
```

## 🎨 Personalización de Estilos

### Variables CSS (course.css)

```css
:root {
    /* Colores principales */
    --color-primary: #6ba3ba;
    --color-primary-dark: #5a8fa3;
    --color-secondary: #d9c6a8;
    --color-accent: #8fb37d;
    
    /* Fondo */
    --bg-gradient-start: #c5dce3;
    --bg-gradient-end: #b0ccd6;
    
    /* Texto */
    --text-primary: #2d3748;
    --text-secondary: #4a5568;
    --slide-title-color: #5a8fa3;
    
    /* Progress dots */
    --progress-dots-display-desktop: flex;
    --progress-dots-display-mobile: none;
}
```

### Clases Útiles

```css
.slide-content          /* Contenedor principal del slide */
.audio-player           /* Reproductor de audio */
.info-card-item         /* Tarjeta interactiva */
.quiz-option-wrapper    /* Opción de quiz */
.draggable-item         /* Elemento arrastrable */
.progress-dot           /* Punto de progreso */
```

## 🎵 Reproductor de Audio

Todos los tipos de slides soportan audio. Agregar la propiedad `audioSrc`:

```json
{
  "id": "slide-x",
  "type": "cualquier-tipo",
  "audioSrc": "audios/audio_x.mp3",
  "content": { ... }
}
```

El reproductor aparece automáticamente en la parte superior del slide con el diseño:
```html
<div class="audio-player">
    <span class="audio-icon">🎧</span>
    <audio controls preload="metadata">
        <source src="audios/audio_x.mp3" type="audio/mpeg">
    </audio>
</div>
```

## 🔄 Sistema de Navegación

### Funciones Principales

```javascript
nextSlide()           // Avanzar al siguiente slide
previousSlide()       // Retroceder al slide anterior
goToSlideCustom(i)    // Ir a un slide específico
updateCustomNav()     // Actualizar estado de navegación
checkAndLockNextButton() // Bloquear botón si es quiz/dragdrop
```

### Bloqueo Automático

Los slides de tipo `quiz` y `dragdrop` bloquean automáticamente el botón "Siguiente" hasta que se complete la actividad.

### Progress Dots

Los puntos de progreso se generan dinámicamente y muestran:
- **Activo**: Slide actual
- **Completado**: Slides visitados
- **Pendiente**: Slides no visitados

## 📊 Integración SCORM

### Funciones SCORM Disponibles

```javascript
CourseApp.init(data)           // Inicializar curso
CourseApp.completeCourse()     // Marcar como completado
CourseApp.nextSlide()          // Navegar siguiente
CourseApp.previousSlide()      // Navegar anterior
CourseApp.goToSlide(index)     // Ir a slide específico
```

### Tracking Automático

El sistema registra automáticamente:
- Slides visitados
- Tiempo en el curso
- Respuestas de quiz
- Estado de completado
- Progreso del usuario

### Variables SCORM Utilizadas

```javascript
cmi.core.lesson_location    // Slide actual
cmi.core.lesson_status      // Estado del curso
cmi.core.score.raw          // Puntuación
cmi.core.session_time       // Tiempo de sesión
cmi.suspend_data            // Datos de progreso
```

## 🎯 Funciones Globales Disponibles

### Modales de Quiz
```javascript
CourseApp.handleQuizAnswer(element, slideId)
CourseApp.closeQuizModal(slideId, type)
```

### Drag & Drop
```javascript
CourseApp.handleDragStart(event)
CourseApp.handleDragEnd(event)
CourseApp.handleDragOver(event)
CourseApp.handleDragLeave(event)
CourseApp.handleDrop(event, slideId)
CourseApp.checkDragDropAnswer(slideId)
CourseApp.closeDragDropModal(slideId, type)
```

### InfoCards
```javascript
CourseApp.openInfoCardModal(slideId, cardIndex)
CourseApp.closeInfoCardModal(slideId, cardIndex)
```

### Navegación
```javascript
nextSlide()
previousSlide()
goToSlideCustom(index)
showCompletionModal()
closeCompletionModal()
finishAndClose()
```

## 📱 Responsive Design

### Breakpoints

```css
/* Móvil: < 769px */
/* Tablet: 769px - 1024px */
/* Desktop: > 1024px */
```

### Grid Adaptativo

```css
.grid-auto-fit-md    /* 2-3 columnas responsive */
.grid-auto-fit-lg    /* 3-4 columnas responsive */
.grid-auto-fit-xl    /* 4-6 columnas responsive */
```

## 🔧 Configuración Avanzada

### Modal de Finalización

El modal se muestra automáticamente al llegar al último slide:

```javascript
function showCompletionModal() {
    const modal = document.getElementById('completion-modal');
    modal.classList.add('show');
    CourseApp.completeCourse(); // Marca SCORM como completado
}
```

### Personalizar Navegación

```javascript
function customizeNavigation() {
    const isLastSlide = currentIndex === totalSlidesCount - 1;
    // Personalizar botones según posición
}
```

### Observer de Contenido

```javascript
function setupContentObserver() {
    // Detecta cambios en el contenido
    // Actualiza navegación automáticamente
}
```

## 🐛 Debugging

### Console Logs Útiles

```javascript
console.log('✅ Datos del curso cargados');
console.log('🔍 [SCORM] Searching for SCORM API');
console.log('Slide actual:', currentIndex);
console.log('Quiz respuesta:', quizState);
```

### Verificar Estado SCORM

```javascript
CourseApp.scorm.getValue('cmi.core.lesson_status');
CourseApp.scorm.getValue('cmi.core.lesson_location');
```

## 📦 Exportar para LMS

### 1. Verificar archivos requeridos:
- `imsmanifest.xml`
- `course.html`
- `course.js`
- `course.css`
- `api.js`
- `courseData.json`
- Carpetas: `audios/`, `images/`

### 2. Comprimir en ZIP:
Comprimir todos los archivos en la raíz del ZIP (sin carpetas contenedoras).

### 3. Subir al LMS:
Importar el paquete ZIP como contenido SCORM 1.2.

## 📝 Mejores Prácticas

### Contenido
1. Usar IDs únicos para cada slide
2. Mantener numeración secuencial en `order`
3. Proveer `audioSrc` para mejor accesibilidad
4. Incluir `explanation` en quizzes

### Performance
1. Usar `preload="metadata"` en audios
2. Optimizar imágenes antes de incluir
3. Limitar a 20-30 slides por curso
4. Usar CDN para librerías externas

### Accesibilidad
1. Proveer textos alternativos en imágenes
2. Usar colores con buen contraste
3. Incluir transcripciones de audio
4. Permitir navegación por teclado

### SCORM
1. Llamar a `commit()` después de cambios importantes
2. Manejar errores de API SCORM
3. Guardar progreso frecuentemente
4. Verificar compatibilidad con LMS objetivo

## 🆘 Solución de Problemas

### SCORM no conecta
- Verificar que `api.js` esté cargado
- Revisar console para errores de API
- Comprobar compatibilidad SCORM 1.2 del LMS

### Botón "Siguiente" bloqueado
- Verificar que el quiz/dragdrop tenga respuesta
- Revisar función `checkAndLockNextButton()`
- Comprobar estado en `quizAnswers`

### Modales no se abren
- Verificar que Bootstrap 5 esté cargado
- Revisar ID del modal en HTML
- Comprobar console para errores JavaScript

### Audio no reproduce
- Verificar ruta del archivo `audioSrc`
- Comprobar formato del audio (mp3)
- Revisar permisos del navegador

## 📄 Licencia

Este proyecto es una plantilla educativa para cursos SCORM.

---

**Versión:** 1.0  
**Última actualización:** Enero 2026  
**Compatibilidad:** SCORM 1.2, Bootstrap 5, Tailwind CSS
