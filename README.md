# Sistema de Slides para Cursos SCORM

Sistema completo de presentación de contenido educativo con soporte SCORM 1.2, navegación personalizada y múltiples tipos de slides interactivos.

## 📋 Características Principales

- ✅ **Compatibilidad SCORM 1.2** - Integración completa con LMS
- ✅ **Navegación Personalizada** - Control total del flujo del curso
- ✅ **Múltiples Tipos de Slides** - 7 tipos diferentes de contenido
- ✅ **Diseño Responsive** - Adaptable a todos los dispositivos
- ✅ **Progreso Visual** - Puntos de progreso y contador de slides
- ✅ **Reproductor de Audio** - Soporte para narración en cada slide
- ✅ **Modales Bootstrap 5** - Popups interactivos para quizzes y contenido

## 🏗️ Estructura del Proyecto

```
navegacion_scorm_html/
├── course.html              # HTML principal del curso
├── course.js                # Lógica del curso y SCORM
├── course.css               # Estilos personalizados
├── api.js                   # API SCORM 1.2
├── courseData.json          # Datos y contenido de los slides
├── imsmanifest.xml          # Manifiesto SCORM
├── audios/                  # Archivos de audio (mp3)
├── images/                  # Imágenes del curso
└── README.md                # Este archivo
```

## 🚀 Inicio Rápido

### 1. Estructura Base
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="course.css">
</head>
<body>
    <div id="main-content" class="course-container">
        <div class="course-header">
            <h1 id="course-title">Título del Curso</h1>
            <div class="course-progress" id="course-progress"></div>
        </div>
        <div id="course-content" class="slide-container"></div>
        <div class="slide-nav" id="slide-navigation"></div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="api.js"></script>
    <script src="course.js"></script>
</body>
</html>
```

### 2. Configurar courseData.json

El archivo `courseData.json` contiene toda la estructura del curso:

```json
{
  "courseData": {
    "title": "Nombre del Curso",
    "navigationMode": "slides",
    "slides": [
      {
        "id": "slide-0",
        "order": 0,
        "type": "page",
        "title": "Título del Slide",
        "audioSrc": "audios/audio_0.mp3",
        "content": { ... }
      }
    ]
  }
}
```

### 3. Actualizar Contador de Slides

En `course.html`, actualizar la variable:
```javascript
let totalSlidesCount = 12; // Número total de slides
```

## 📚 Tipos de Slides

### 1. Page (Página de Contenido)
Slide básico con contenido HTML.

```json
{
  "id": "slide-0",
  "order": 0,
  "type": "page",
  "title": "Título",
  "convertedHtml": "<div class='slide-content'>...</div>"
}
```

### 2. Quiz (Evaluación)
Pregunta de opción múltiple con feedback.

```json
{
  "id": "slide-1",
  "order": 1,
  "type": "quiz",
  "title": "Evaluación",
  "audioSrc": "audios/audio_1.mp3",
  "content": {
    "question": "¿Pregunta?",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": 2,
    "explanation": "Explicación de la respuesta",
    "feedbackCorrect": "¡Correcto!",
    "feedbackIncorrect": "Intenta de nuevo"
  }
}
```

**Características:**
- Bloquea el botón "Siguiente" hasta responder
- Modal de feedback correcto/incorrecto
- Muestra explicación después de responder
- Compatible con reproductor de audio

### 3. DragDrop (Arrastrar y Soltar)
Actividad interactiva de categorización.

```json
{
  "id": "slide-2",
  "order": 2,
  "type": "dragdrop",
  "title": "Actividad",
  "audioSrc": "audios/audio_2.mp3",
  "content": {
    "question": "Arrastra cada elemento a su categoría",
    "items": [
      {"id": "item-1", "text": "Elemento 1", "category": "cat1"}
    ],
    "categories": [
      {"id": "cat1", "label": "Categoría 1"}
    ],
    "explanation": "Explicación de la solución",
    "feedbackCorrect": "¡Excelente!",
    "feedbackIncorrect": "Revisa las categorías"
  }
}
```

**Características:**
- Drag & drop funcional
- Validación de categorías
- Reinicio automático en error
- Bloquea navegación hasta completar

### 4. InfoCards (Tarjetas Interactivas)
Grid de tarjetas que abren modales con información detallada.

```json
{
  "id": "slide-3",
  "order": 3,
  "type": "infoCards",
  "title": "Explorar Temas",
  "audioSrc": "audios/audio_3.mp3",
  "content": {
    "description": "Haz clic en cada tarjeta para más información",
    "cards": [
      {
        "icon": "📚",
        "title": "Título",
        "subtitle": "Subtítulo",
        "bgColor": "#e8f3f8",
        "iconColor": "#7fb3c4",
        "modalContent": "<h4>Contenido del modal</h4><p>...</p>"
      }
    ]
  }
}
```

**Características:**
- Grid responsive (3 columnas desktop, 2 tablet, 1 móvil)
- Modales Bootstrap 5 centrados (modal-xl)
- Iconos y colores personalizables
- HTML enriquecido en modales

### 5. Image (Imagen)
Slide con imagen destacada.

```json
{
  "id": "slide-4",
  "order": 4,
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

## 🎨 Paleta de Colores Predeterminada

```css
Azul claro:    #e8f3f8 / #7fb3c4
Beige:         #fef3e2 / #d4a373
Verde claro:   #e8f3e8 / #a0c491
Morado claro:  #f3e8f8 / #b19cd9
Rosa claro:    #ffe8e8 / #d99999
Turquesa:      #e8f8f8 / #7fc4c4
```

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

## 👥 Soporte

Para más información sobre tipos específicos de slides:
- Ver `INFOCARDS_README.md` para InfoCards detallado

---

**Versión:** 1.0  
**Última actualización:** Enero 2026  
**Compatibilidad:** SCORM 1.2, Bootstrap 5, Tailwind CSS
