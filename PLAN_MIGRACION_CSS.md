# 📋 PLAN DE MIGRACIÓN CSS - ANÁLISIS SLIDE POR SLIDE

## 🎯 Objetivo
Normalizar y limpiar estilos inline del curso, migrando reglas CSS repetitivas a `course.css` mientras se mantienen inline solo los detalles de color específicos como `border-left` y `border-top` en grids/cards.

## 📊 Resumen Ejecutivo

**Total de Slides:** 7 (slide-0 a slide-6)
- **Slides de contenido:** 6
- **Slides de actividad (quiz):** 1
- **Slides de tipo especial (infoCards):** 1

**Estrategia:**
1. ✅ Mantener inline: `border-left`, `border-top`, `border-color` con colores destacados
2. ✅ Mantener inline: Gradientes específicos de íconos cuando son únicos por contexto
3. ✅ Mantener responsive existente (ajustes para móvil probados)
4. 🔄 Migrar: Todos los patrones estructurales repetidos
5. 🔄 Migrar: Layouts, paddings, margins, shadows, border-radius genéricos

---

## 🔍 PATRONES COMUNES IDENTIFICADOS

### 1️⃣ Hero Sections
**Ubicación:** slide-0  
**Patrón:**
```css
background: linear-gradient(...), url('...') center/cover;
border-radius: 16px;
padding: 3.5rem 2.5rem;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
```
**Acción:** Crear clase `.hero-section`

---

### 2️⃣ Feature Cards (con border-top de color)
**Ubicación:** slide-0, slide-1, slide-2  
**Patrón:**
```css
background: white;
padding: 2rem;
border-radius: 12px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
border-top: 4px solid var(--color-*); /* ⚠️ MANTENER INLINE */
```
**Acción:** Crear clase `.card-feature` (sin border-top)  
**Inline:** `border-top: 4px solid var(--color-primary);`

---

### 3️⃣ Info Cards (con border-left de color)
**Ubicación:** slide-1, slide-3, slide-5  
**Patrón:**
```css
background: white;
padding: 1.5rem;
border-radius: 12px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
border-left: 4px solid var(--color-*); /* ⚠️ MANTENER INLINE */
```
**Acción:** Crear clase `.card-info`  
**Inline:** `border-left: 4px solid var(--color-primary);`

---

### 4️⃣ Icon Boxes (con gradientes)
**Ubicación:** Todos los slides  
**Patrón:**
```css
width: 50-60px;
height: 50-60px;
background: linear-gradient(135deg, var(--color-*) 0%, ... 100%);
border-radius: 12px;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
```
**Acción:** Crear clase `.icon-box` (tamaños: `.icon-box-sm`, `.icon-box-md`, `.icon-box-lg`)  
**Inline:** Gradientes específicos cuando varían por contexto

---

### 5️⃣ Grid Layouts Responsivos
**Ubicación:** Múltiples slides  
**Patrones:**
```css
/* Grid 2 columnas */
display: grid;
grid-template-columns: 1fr 1fr;
gap: 2.5rem;

/* Grid auto-fit */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 1.5-2rem;
```
**Acción:** Crear clases `.grid-2col`, `.grid-auto-250`, `.grid-auto-280`

---

### 6️⃣ Section Backgrounds con Gradiente
**Ubicación:** Múltiples slides  
**Patrón:**
```css
background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
border-radius: 16px;
padding: 2.5rem;
```
**Acción:** Crear clase `.section-gradient-bg`

---

### 7️⃣ Titles y Headers
**Ubicación:** Todos los slides  
**Patrón:**
```css
/* H2 */
color: var(--color-primary-dark);
font-size: 2.8rem;
font-weight: 800;
margin-bottom: 1rem;

/* H3 */
color: var(--color-primary);
font-size: 1.8rem;
font-weight: 700;
margin-bottom: 1rem;
```
**Acción:** Ya existe parcialmente, reforzar en `.slide-content h2`, `.slide-content h3`

---

## 📝 PLAN SLIDE POR SLIDE

---

## 🎬 SLIDE-0: Hero/Portada

### Análisis Actual
- Hero section con background gradient + imagen
- Grid de 3 feature cards
- Section de stats con grid
- Responsive ya implementado en `<style>` interno

### Migración a course.css

#### Nuevas Clases a Crear:

1. **`.hero-section`**
   ```css
   background-position: center;
   background-size: cover;
   border-radius: 16px;
   padding: 3.5rem 2.5rem;
   margin-bottom: 3rem;
   box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
   position: relative;
   overflow: hidden;
   ```

2. **`.hero-content`**
   ```css
   max-width: 650px;
   ```

3. **`.hero-badge`**
   ```css
   display: inline-block;
   background: rgba(255, 255, 255, 0.15);
   backdrop-filter: blur(10px);
   padding: 0.5rem 1.5rem;
   border-radius: 50px;
   margin-bottom: 1.5rem;
   border: 1px solid rgba(255, 255, 255, 0.2);
   ```

4. **`.hero-title`** (mejorar existente)
   ```css
   color: white;
   font-size: 3.2rem;
   font-weight: 800;
   margin-bottom: 1.2rem;
   line-height: 1.2;
   text-align: left;
   ```

5. **`.hero-description`**
   ```css
   color: rgba(255, 255, 255, 0.95);
   font-size: 1.25rem;
   line-height: 1.7;
   margin: 0;
   text-align: left;
   ```

6. **`.feature-grid`**
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   gap: 1.5rem;
   margin-top: 2rem;
   ```

7. **`.card-feature`** (base sin border-top)
   ```css
   background: white;
   padding: 2rem;
   border-radius: 12px;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
   transition: all 0.3s ease;
   ```

8. **`.icon-box-lg`**
   ```css
   width: 60px;
   height: 60px;
   border-radius: 12px;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 1.2rem;
   font-size: 1.8rem;
   flex-shrink: 0;
   ```

9. **`.stats-section`**
   ```css
   background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
   border-radius: 16px;
   padding: 2.5rem 2rem;
   margin-top: 3rem;
   text-align: center;
   ```

10. **`.stats-grid`**
    ```css
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    ```

11. **`.stat-value`**
    ```css
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
    ```

12. **`.stat-label`**
    ```css
    color: var(--text-muted);
    font-size: 1rem;
    font-weight: 500;
    ```

#### Mantener Inline:
- `border-top: 4px solid var(--color-primary)` en cada feature card
- `background: linear-gradient(...)` en cada icon-box (colores específicos)
- `color` específico en `.stat-value` de cada stat

#### Media Queries a Agregar/Mejorar:
```css
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1.5rem;
  }
  .hero-title {
    font-size: 2rem !important;
  }
  .hero-description {
    font-size: 1rem !important;
  }
  .feature-grid {
    grid-template-columns: 1fr !important;
  }
}
```

#### HTML Resultante (ejemplo):
```html
<div class="hero-section" style="background: linear-gradient(135deg, rgba(67, 106, 177, 0.92) 0%, rgba(20, 27, 89, 0.88) 100%), url('images/image_1.jpg') center/cover;">
  <div class="hero-content">
    <div class="hero-badge">
      <span style="color: white; font-weight: 600; font-size: 0.95rem;">✨ Powered by AI</span>
    </div>
    <h2 class="hero-title">Desarrollo de Cursos<br>Responsivos con IA</h2>
    <p class="hero-description">Sistema de desarrollo de cursos e-learning...</p>
  </div>
</div>

<div class="feature-grid">
  <div class="card-feature" style="border-top: 4px solid var(--color-primary);">
    <div class="icon-box-lg" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);">📱</div>
    <h4>100% Responsivo</h4>
    <p>Adaptable a cualquier dispositivo...</p>
  </div>
  <!-- más cards -->
</div>
```

---

## 📄 SLIDE-1: ¿Qué es?

### Análisis Actual
- Título principal + descripción
- Grid 2 columnas: texto (lista con íconos) + imagen
- Section gradient con grid de info cards
- Responsive ya implementado

### Migración a course.css

#### Nuevas Clases a Crear:

1. **`.section-header`**
   ```css
   margin-bottom: 2rem;
   ```

2. **`.section-title`**
   ```css
   color: var(--color-primary-dark);
   font-size: 2.8rem;
   font-weight: 800;
   margin-bottom: 1rem;
   ```

3. **`.section-subtitle`**
   ```css
   color: var(--text-secondary);
   font-size: 1.3rem;
   line-height: 1.6;
   max-width: 800px;
   ```

4. **`.content-grid-2col`**
   ```css
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 2.5rem;
   margin-bottom: 3rem;
   align-items: stretch;
   ```

5. **`.icon-list`**
   ```css
   display: flex;
   flex-direction: column;
   gap: 1rem;
   ```

6. **`.icon-list-item`**
   ```css
   display: flex;
   align-items: start;
   gap: 1rem;
   ```

7. **`.icon-box-md`**
   ```css
   width: 40px;
   height: 40px;
   border-radius: 8px;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
   font-size: 1.2rem;
   ```

8. **`.image-container`**
   ```css
   border-radius: 16px;
   overflow: hidden;
   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
   max-height: 380px;
   ```

9. **`.image-container img`**
   ```css
   width: 100%;
   height: 100%;
   object-fit: cover;
   display: block;
   max-height: 380px;
   ```

10. **`.info-grid`**
    ```css
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    ```

11. **`.card-info`** (base sin border-left)
    ```css
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    ```

12. **`.card-info-icon`**
    ```css
    font-size: 2rem;
    margin-bottom: 0.8rem;
    ```

13. **`.card-info-title`**
    ```css
    color: var(--color-primary-dark);
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    ```

14. **`.card-info-text`**
    ```css
    color: var(--text-muted);
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    ```

#### Mantener Inline:
- `border-left: 4px solid var(--color-*)` en cada info card
- Gradientes en icon-box cuando son específicos

#### Media Queries:
```css
@media (max-width: 768px) {
  .content-grid-2col {
    grid-template-columns: 1fr !important;
  }
  .info-grid {
    grid-template-columns: 1fr !important;
  }
}
```

---

## 🗂️ SLIDE-2: Recursos (InfoCards)

### Análisis Actual
- Descripción con título
- Grid de cards clickeables (tipo especial infoCards)
- Cards con modalContent

### Migración a course.css

#### Clases ya Existentes a Mejorar:
- `.info-card-item` (ya existe)

#### Nuevas Clases:

1. **`.infocard-section-header`**
   ```css
   margin-bottom: 2.5rem;
   ```

2. **`.infocard-grid`**
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   gap: 2rem;
   margin-bottom: 2rem;
   ```

3. **`.infocard-item`** (mejorar existente)
   ```css
   background: white;
   padding: 2rem;
   border-radius: 16px;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
   cursor: pointer;
   transition: all 0.3s ease;
   ```

4. **`.infocard-header`**
   ```css
   display: flex;
   align-items: center;
   gap: 1rem;
   margin-bottom: 1.5rem;
   ```

5. **`.infocard-icon-box`**
   ```css
   width: 50px;
   height: 50px;
   border-radius: 12px;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
   font-size: 1.5rem;
   ```

#### Mantener Inline:
- `border-top: 4px solid var(--color-*)` en cards
- Gradientes de icon boxes

#### Media Queries:
```css
@media (max-width: 768px) {
  .infocard-grid {
    grid-template-columns: 1fr !important;
  }
}
```

---

## 🎥 SLIDE-3: Ejemplos con Video

### Análisis Actual
- Video container
- Section gradient con grid de benefits
- Quote box con border-left
- Responsive implementado

### Migración a course.css

#### Mejorar Existentes:
- `.video-container` (ya existe)

#### Nuevas Clases:

1. **`.section-gradient-bg`**
   ```css
   background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
   border-radius: 16px;
   padding: 2.5rem;
   margin-top: 2rem;
   ```

2. **`.section-icon-header`**
   ```css
   display: flex;
   align-items: center;
   gap: 1rem;
   margin-bottom: 1.5rem;
   ```

3. **`.section-icon-box`**
   ```css
   width: 60px;
   height: 60px;
   border-radius: 12px;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 2rem;
   flex-shrink: 0;
   ```

4. **`.benefits-grid`**
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
   gap: 1.5rem;
   margin-bottom: 2rem;
   ```

5. **`.quote-box`**
   ```css
   background: white;
   padding: 2rem;
   border-radius: 12px;
   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
   margin-top: 2rem;
   ```

6. **`.quote-highlight`**
   ```css
   border-left: 4px solid var(--color-primary);
   padding-left: 1.5rem;
   margin-top: 1.5rem;
   ```

#### Mantener Inline:
- `border-left: 4px solid var(--color-*)` en benefit cards
- Color en quote highlight si varía

#### Media Queries:
```css
@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: 1fr !important;
  }
}
```

---

## ✅ SLIDE-4: Quiz

### Análisis
- ✅ **No requiere migración**
- Los estilos de quiz ya están completamente en `course.css`
- Secciones: `.quiz-options`, `.quiz-option`, `.quiz-explanation`, etc.

---

## 📊 SLIDE-5: Impacto/Comparación

### Análisis Actual
- Grid de comparación 2 columnas (cards con headers de color)
- Lista de horas con grid interno
- Benefits box
- Alert warning
- Responsive complejo

### Migración a course.css

#### Nuevas Clases:

1. **`.comparison-grid`**
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   gap: 2rem;
   margin-top: 2rem;
   ```

2. **`.comparison-card`**
   ```css
   background: white;
   border-radius: 16px;
   overflow: hidden;
   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
   transition: transform 0.3s ease;
   ```

3. **`.comparison-card:hover`**
   ```css
   transform: translateY(-8px);
   box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
   ```

4. **`.comparison-header`**
   ```css
   padding: 1.5rem;
   text-align: center;
   ```

5. **`.comparison-header-icon`**
   ```css
   font-size: 2.5rem;
   margin-bottom: 0.5rem;
   ```

6. **`.comparison-header-title`**
   ```css
   color: white;
   font-size: 1.3rem;
   font-weight: 700;
   margin: 0;
   ```

7. **`.comparison-body`**
   ```css
   padding: 2rem;
   ```

8. **`.stat-display`**
   ```css
   text-align: center;
   margin-bottom: 1.5rem;
   ```

9. **`.stat-display-number`**
   ```css
   font-size: 3rem;
   font-weight: 800;
   margin-bottom: 0.3rem;
   ```

10. **`.stat-display-label`**
    ```css
    color: var(--text-muted);
    font-size: 1.1rem;
    font-weight: 600;
    ```

11. **`.stat-display-badge`**
    ```css
    display: inline-block;
    background: #e8f3e8;
    color: #2d7738;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
    margin-top: 0.8rem;
    ```

12. **`.hours-list`**
    ```css
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 2px solid var(--bg-light);
    padding-top: 1.5rem;
    ```

13. **`.hours-list-item`**
    ```css
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid #f7fafc;
    gap: 1rem;
    ```

14. **`.hours-list-item:last-child`**
    ```css
    border-bottom: none;
    ```

15. **`.benefits-box`**
    ```css
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-top: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    ```

16. **`.benefits-box-content`**
    ```css
    display: flex;
    align-items: start;
    gap: 1.5rem;
    ```

17. **`.benefits-list`**
    ```css
    color: var(--text-muted);
    font-size: 1.05rem;
    line-height: 1.8;
    margin: 0;
    padding-left: 1.5rem;
    ```

18. **`.benefits-list li`**
    ```css
    margin-bottom: 0.8rem;
    ```

19. **`.alert-warning`**
    ```css
    background: linear-gradient(135deg, #fff5e6 0%, #ffe4b3 100%);
    border-radius: 12px;
    padding: 1.8rem;
    margin-top: 2rem;
    border: 2px solid var(--color-accent);
    ```

20. **`.alert-warning-content`**
    ```css
    display: flex;
    align-items: start;
    gap: 1rem;
    ```

21. **`.alert-warning-icon`**
    ```css
    font-size: 2rem;
    flex-shrink: 0;
    ```

#### Mantener Inline:
- Gradientes del comparison-header (rojo vs verde)
- `border-left` en benefits-box
- Colores de números en stat-display cuando varían

#### Media Queries:
```css
@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr !important;
  }
  
  .comparison-card {
    padding: 0 !important;
  }
  
  .comparison-body {
    padding: 1.5rem !important;
  }
  
  .hours-list-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.3rem !important;
  }
  
  .benefits-box {
    padding: 1.5rem !important;
    text-align: center;
  }
  
  .benefits-box-content {
    flex-direction: column !important;
    align-items: center !important;
  }
  
  .alert-warning {
    padding: 1.5rem !important;
    text-align: center;
  }
  
  .alert-warning-content {
    flex-direction: column !important;
    align-items: center !important;
  }
}
```

---

## 🥧 SLIDE-6: Hacia dónde vamos

### Análisis Actual
- Pie chart con conic-gradient
- Labels flotantes
- Legend grid
- Animaciones complejas
- Responsive complejo

### Migración a course.css

#### Nuevas Clases:

1. **`.chart-container`**
   ```css
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 3rem;
   margin-bottom: 2rem;
   background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(247, 250, 252, 0.85) 100%);
   border-radius: 24px;
   padding: 3rem 2rem;
   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
   position: relative;
   ```

2. **`.pie-chart-wrapper`**
   ```css
   position: relative;
   width: 320px;
   height: 320px;
   ```

3. **`.pie-chart`**
   ```css
   width: 100%;
   height: 100%;
   border-radius: 50%;
   box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
   position: relative;
   animation: pieRotate 1.5s ease-out;
   ```

4. **`.pie-chart-center`**
   ```css
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 160px;
   height: 160px;
   background: white;
   border-radius: 50%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.08);
   ```

5. **`.pie-label`**
   ```css
   position: absolute;
   animation: fadeInRight 1s ease-out both;
   ```

6. **`.pie-label-badge`**
   ```css
   background: var(--color-secondary);
   color: white;
   padding: 0.6rem 1.2rem;
   border-radius: 50px;
   font-weight: 700;
   font-size: 1rem;
   box-shadow: 0 4px 15px rgba(73, 190, 166, 0.4);
   white-space: nowrap;
   ```

7. **`.legend-grid`**
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
   gap: 2rem;
   width: 100%;
   max-width: 700px;
   ```

8. **`.legend-card`**
   ```css
   background: white;
   padding: 2rem;
   border-radius: 16px;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
   animation: fadeInUp 1s ease-out both;
   transition: all 0.3s ease;
   ```

9. **`.legend-card:hover`**
   ```css
   transform: translateY(-5px);
   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
   ```

10. **`.legend-header`**
    ```css
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    ```

11. **`.legend-icon-box`**
    ```css
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    flex-shrink: 0;
    ```

12. **`.legend-percentage`**
    ```css
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    ```

13. **`.legend-percentage-label`**
    ```css
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 600;
    ```

14. **`.legend-title`**
    ```css
    color: var(--color-primary-dark);
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    ```

15. **`.legend-text`**
    ```css
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    ```

#### Animaciones a Agregar:
```css
@keyframes pieRotate {
  0% {
    transform: rotate(0deg) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInRight {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
```

#### Mantener Inline:
- `border-left` con colores en legend cards
- `background: conic-gradient(...)` del pie chart
- Colores de porcentajes
- Posiciones absolutas de labels (top, right, bottom)

#### Media Queries:
```css
@media (max-width: 768px) {
  .pie-chart-wrapper {
    width: 280px;
    height: 280px;
  }
  
  .pie-label {
    display: none !important;
  }
  
  .chart-container {
    align-items: center;
  }
  
  .legend-grid {
    grid-template-columns: 1fr !important;
    max-width: 100% !important;
  }
  
  .legend-card {
    width: 100%;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
```

---

## 🔄 WORKFLOW DE IMPLEMENTACIÓN

### Loop de Desarrollo Slide por Slide

```
Para cada slide (0 a 6):
  1. ✅ Agregar clases CSS a course.css
  2. ✅ Actualizar HTML en courseData.json
  3. ✅ Probar en desktop
  4. ✅ Probar en mobile (responsive)
  5. ✅ Verificar que borders de color se mantienen inline
  6. ✅ Commit cambios
  7. ➡️ Siguiente slide
```

### Orden Recomendado de Implementación

**Fase 1: Patrones Comunes (1 sesión)**
- Agregar todas las clases base a course.css
- Clases de layout (grids, containers)
- Clases de cards (feature, info, etc.)
- Clases de iconos (icon-box variantes)

**Fase 2: Slides Individuales (7 sesiones, 1 por slide)**

1. **Sesión 1:** SLIDE-0 (Hero/Portada)
2. **Sesión 2:** SLIDE-1 (¿Qué es?)
3. **Sesión 3:** SLIDE-2 (Recursos - InfoCards)
4. **Sesión 4:** SLIDE-3 (Ejemplos con Video)
5. **Sesión 5:** SLIDE-4 (Quiz) - Solo verificación
6. **Sesión 6:** SLIDE-5 (Impacto)
7. **Sesión 7:** SLIDE-6 (Hacia dónde vamos)

**Fase 3: Testing Final (1 sesión)**
- Test completo del curso
- Verificar responsive en todos los slides
- Optimización final

---

## ✅ CHECKLIST POR SLIDE

### Para cada slide ejecutar:

- [ ] Identificar estilos inline repetidos
- [ ] Crear/usar clases CSS en course.css
- [ ] Actualizar HTML con nuevas clases
- [ ] Mantener inline solo: border-left, border-top, border-color, gradientes únicos
- [ ] Probar en Chrome desktop (1920x1080)
- [ ] Probar en Chrome mobile (375x667)
- [ ] Verificar hover effects
- [ ] Verificar animaciones
- [ ] Verificar que media queries funcionan
- [ ] Commit con mensaje descriptivo

---

## 📌 REGLAS DE ORO

### ✅ SIEMPRE MANTENER INLINE:

1. **Border de color en cards:**
   ```html
   style="border-left: 4px solid var(--color-primary);"
   style="border-top: 4px solid var(--color-secondary);"
   ```

2. **Gradientes de headers específicos:**
   ```html
   style="background: linear-gradient(135deg, #f56565 0%, #c53030 100%);"
   ```

3. **Colores únicos de texto:**
   ```html
   style="color: #c53030;"
   ```

4. **Backgrounds de hero sections:**
   ```html
   style="background: linear-gradient(...), url('...') center/cover;"
   ```

5. **Conic gradients de gráficos:**
   ```html
   style="background: conic-gradient(...);"
   ```

### 🔄 SIEMPRE MIGRAR A CSS:

1. Paddings y margins genéricos
2. Border-radius
3. Box-shadows
4. Display/flex/grid layouts
5. Font-sizes y font-weights
6. Line-heights
7. Gaps
8. Transitions y hovers
9. Media queries
10. Animaciones @keyframes

---

## 📊 MÉTRICAS DE ÉXITO

Al finalizar la migración:

- ✅ **Reducción de código inline:** ~70-80%
- ✅ **Clases reutilizables creadas:** ~50-60
- ✅ **Responsive mantenido:** 100%
- ✅ **Borders de color inline preservados:** 100%
- ✅ **Performance:** Mejorado (menos inline styles)
- ✅ **Mantenibilidad:** Mejorado (CSS centralizado)

---

## 🎯 RESULTADO ESPERADO

### Antes:
```html
<div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border-top: 4px solid var(--color-primary); transition: all 0.3s ease;">
  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.2rem; font-size: 1.8rem;">📱</div>
  <h4 style="color: var(--color-primary-dark); font-size: 1.4rem; margin-bottom: 0.8rem; font-weight: 700;">100% Responsivo</h4>
  <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin: 0;">Adaptable a cualquier dispositivo...</p>
</div>
```

### Después:
```html
<div class="card-feature" style="border-top: 4px solid var(--color-primary);">
  <div class="icon-box-lg" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);">📱</div>
  <h4>100% Responsivo</h4>
  <p>Adaptable a cualquier dispositivo...</p>
</div>
```

**Reducción:** De ~400 caracteres a ~200 caracteres (50% menos código)

---

## 📝 NOTAS ADICIONALES

1. **Variables CSS ya definidas:** Usar siempre variables CSS existentes (`var(--color-primary)`, etc.)
2. **Nombres de clases:** Usar nomenclatura BEM o similar para claridad
3. **Comentarios en CSS:** Documentar cada sección nueva
4. **Testing:** Siempre probar en mobile después de cada cambio
5. **Backup:** Hacer backup de courseData.json antes de empezar
6. **Versionado:** Usar git para cada slide completado

---

## 🚀 COMENZAR IMPLEMENTACIÓN

**Comando inicial:**
```bash
# Crear backup
cp courseData.json courseData_backup_$(date +%Y%m%d).json

# Crear rama de trabajo
git checkout -b feature/css-migration
```

**Siguiente paso:** Comenzar con Fase 1 - Patrones Comunes

---

**Documento creado:** 2025-01-21  
**Versión:** 1.0  
**Última actualización:** 2025-01-21
