
// SCORM 1.2 Course Application with proper LMS integration
(function() {
  'use strict';
  
  let courseData = null;
  let isCompleted = false;
  let sessionStartTime = Date.now();
  let allSlides = [];
  let quizAnswers = {}; // Guardar respuestas de quiz { slideId: { answered: true, correct: true, selectedIndex: 0 } }
  let currentSlideIndex = 0;
  
  // ===== FULLSCREEN FUNCTIONALITY =====
  function initFullscreenButton() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!fullscreenBtn) return;
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Escuchar cambios en el estado de fullscreen
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
    document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
  }
  
  function toggleFullscreen() {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
      // Entrar en fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      // Salir de fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
  
  function updateFullscreenIcon() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!fullscreenBtn) return;
    
    const icon = fullscreenBtn.querySelector('i');
    if (!icon) return;
    
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
      // En modo fullscreen - mostrar icono de salir
      icon.className = 'bi bi-fullscreen-exit';
      fullscreenBtn.title = 'Salir de pantalla completa';
    } else {
      // En modo normal - mostrar icono de entrar
      icon.className = 'bi bi-arrows-fullscreen';
      fullscreenBtn.title = 'Pantalla completa';
    }
  }
  // ===== FIN FULLSCREEN FUNCTIONALITY =====
  
  // SCORM API integration - SCORM 1.2 specific
  let scormAPI = null;
  let scormInitialized = false;
  
  // Constants for SCORM 1.2
  var SCORM_TRUE = "true";
  var SCORM_FALSE = "false";
  var SCORM_NO_ERROR = "0";
  
  // Track whether or not we successfully initialized.
  var initialized = false;
  var finishCalled = false;
  var findAPITries = 0;
  
  // SCORM 1.2 API discovery algorithm
  function findAPI(win) {
    console.log('🔍 [SCORM 1.2] Searching for SCORM API in window:', win.location ? win.location.href : 'unknown');
    
    // Check current window for SCORM 1.2 API
    if (win.API) {
      console.log('✅ [SCORM 1.2] Found SCORM 1.2 API (API) in current window');
      return win.API;
    }
    
    // Check for Moodle-specific API locations
    if (win.parent && win.parent.API) {
      console.log('✅ [SCORM 1.2] Found SCORM 1.2 API in parent window');
      return win.parent.API;
    }
    
    // Try looking in top window
    try {
      if (win.top && win.top !== win && win.top.API) {
        console.log('✅ [SCORM 1.2] Found SCORM 1.2 API in top window');
        return win.top.API;
      }
    } catch (e) {
      console.log('⚠️ [SCORM 1.2] Cannot access top window (cross-origin)');
    }
    
    // Traverse up the parent chain
    while ((win.API == null) &&
           (win.parent != null) &&
           (win.parent != win)) {
      // increment the number of findAPITries
      findAPITries++;
      
      console.log(`🔍 [SCORM 1.2] Checking parent window ${findAPITries}`);
      
      // Note: 7 is an arbitrary number, but should be more than sufficient
      if (findAPITries > 7) {
        console.error("[SCORM 1.2] Error finding API -- too deeply nested.");
        return null;
      }
      
      // set the variable that represents the window being
      // being searched to be the parent of the current window
      // then search for the API again
      win = win.parent;
      
      // Check this parent window
      if (win.API) {
        console.log(`✅ [SCORM 1.2] Found SCORM 1.2 API in parent window ${findAPITries}`);
        return win.API;
      }
    }
    
    console.log('❌ [SCORM 1.2] No SCORM API found in window hierarchy');
    return null;
  }
  
  function getAPI() {
    console.log('🚀 [SCORM 1.2] Starting SCORM API discovery...');
    
    // start by looking for the API in the current window
    var theAPI = findAPI(window);
    
    // if the API is null (could not be found in the current window)
    // and the current window has an opener window
    if ((theAPI == null) &&
        (window.opener != null) &&
        (typeof(window.opener) != "undefined")) {
      console.log('🔍 [SCORM 1.2] Searching in opener window...');
      // try to find the API in the current window's opener
      theAPI = findAPI(window.opener);
    }
    
    // Additional searches for Moodle
    if (theAPI == null) {
      console.log('🔍 [SCORM 1.2] Trying additional Moodle-specific locations...');
      
      // Try common Moodle frame names
      var frameNames = ['scorm_object', 'scorm_api', 'API', 'api'];
      for (var i = 0; i < frameNames.length; i++) {
        try {
          var frame = window.parent.frames[frameNames[i]];
          if (frame && frame.API) {
            theAPI = frame.API;
            console.log('✅ [SCORM 1.2] Found SCORM API in frame:', frameNames[i]);
            break;
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
    }
    
    // Try looking for global SCORM objects
    if (theAPI == null) {
      console.log('🔍 [SCORM 1.2] Searching for global SCORM objects...');
      try {
        // Some LMS implementations use different global names
        var globalNames = ['scormAPI', 'ScormAPI', 'SCORM_API', 'LMSScormAPI'];
        for (var i = 0; i < globalNames.length; i++) {
          if (window[globalNames[i]]) {
            theAPI = window[globalNames[i]];
            console.log('✅ [SCORM 1.2] Found SCORM API as global:', globalNames[i]);
            break;
          }
          if (window.parent && window.parent[globalNames[i]]) {
            theAPI = window.parent[globalNames[i]];
            console.log('✅ [SCORM 1.2] Found SCORM API as parent global:', globalNames[i]);
            break;
          }
        }
      } catch (e) {
        console.log('⚠️ [SCORM 1.2] Error checking global SCORM objects:', e);
      }
    }
    
    // if the API has not been found
    if (theAPI == null) {
      console.error("❌ [SCORM 1.2] Unable to find a SCORM API adapter after extensive search");
      console.log('Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('api') || key.toLowerCase().includes('scorm')));
      if (window.parent !== window) {
        console.log('Available parent properties:', Object.keys(window.parent).filter(key => key.toLowerCase().includes('api') || key.toLowerCase().includes('scorm')));
      }
    } else {
      console.log('✅ [SCORM 1.2] SCORM API found successfully');
      // Log available methods for debugging
      var methods = Object.keys(theAPI).filter(key => typeof theAPI[key] === 'function');
      console.log('Available API methods:', methods);
    }
    
    return theAPI;
  }
  
  // Initialize SCORM 1.2
  function initScorm() {
    try {
      scormAPI = getAPI();
      
      if (scormAPI == null) {
        console.error("ERROR - Could not establish a connection with the LMS. Your results may not be recorded.");
        return false;
      }
      
      console.log('🚀 [SCORM 1.2] Initializing SCORM 1.2 API...');
      var result = scormAPI.LMSInitialize("");
      
      if (result == SCORM_FALSE) {
        var errorNumber = getLastError();
        var errorString = getErrorString(errorNumber);
        var diagnostic = getDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        console.error("Error - Could not initialize communication with the LMS. Your results may not be recorded. " + errorDescription);
        return false;
      }
      
      scormInitialized = true;
      initialized = true;
      
      console.log('✅ [SCORM 1.2] SCORM API initialized successfully');
      
      // Set initial lesson status using SCORM 1.2 elements
      setValue('cmi.core.lesson_status', 'incomplete');
      setValue('cmi.core.session_time', '0000:00:00.00');
      commit();
      
      return true;
    } catch (error) {
      console.error('Error initializing SCORM 1.2:', error);
      return false;
    }
  }
  
  function setValue(element, value) {
    if (!scormAPI || !scormInitialized) return false;
    
    try {
      console.log('📝 [SCORM 1.2] Setting SCORM value:', element, '=', value);
      var result = scormAPI.LMSSetValue(element, value);
      
      if (result == SCORM_FALSE) {
        var errorNumber = getLastError();
        var errorString = getErrorString(errorNumber);
        var diagnostic = getDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        console.error("Error - Could not store a value in the LMS. " + errorDescription);
        return false;
      }
      
      console.log('✅ [SCORM 1.2] SCORM value set successfully');
      return true;
    } catch (error) {
      console.error('Error setting SCORM 1.2 value:', error);
      return false;
    }
  }
  
  function getValue(element) {
    if (!scormAPI || !scormInitialized) return '';
    
    try {
      var result = scormAPI.LMSGetValue(element);
      
      if (result == "") {
        var errorNumber = getLastError();
        
        if (errorNumber != SCORM_NO_ERROR) {
          var errorString = getErrorString(errorNumber);
          var diagnostic = getDiagnostic(errorNumber);
          
          var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
          console.error("Error - Could not retrieve a value from the LMS. " + errorDescription);
          return "";
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting SCORM 1.2 value:', error);
      return '';
    }
  }
  
  function commit() {
    if (!scormAPI || !scormInitialized) return false;
    try {
      console.log('💾 [SCORM 1.2] Committing SCORM data to LMS...');
      var result = scormAPI.LMSCommit('');
      
      if (result === SCORM_TRUE) {
        console.log('✅ [SCORM 1.2] SCORM data committed successfully to LMS');
      }
      return result === SCORM_TRUE;
    } catch (error) {
      console.error('Error committing SCORM 1.2 data:', error);
      return false;
    }
  }
  
  function terminate() {
    if (!scormAPI || !scormInitialized || finishCalled) return false;
    
    try {
      console.log('🏁 [SCORM 1.2] Terminating SCORM session...');
      // Update session time before terminating
      updateSessionTime();
      commit();
      
      var result = scormAPI.LMSFinish('');
      
      finishCalled = true;
      
      if (result == SCORM_FALSE) {
        var errorNumber = getLastError();
        var errorString = getErrorString(errorNumber);
        var diagnostic = getDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        console.error("Error - Could not terminate communication with the LMS. " + errorDescription);
        return false;
      }
      
      console.log('✅ [SCORM 1.2] SCORM session terminated successfully');
      return true;
    } catch (error) {
      console.error('Error terminating SCORM 1.2:', error);
      return false;
    }
  }
  
  function updateSessionTime() {
    var sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    var hours = Math.floor(sessionTime / 3600);
    var minutes = Math.floor((sessionTime % 3600) / 60);
    var seconds = sessionTime % 60;
    
    // SCORM 1.2 time format: HHHH:MM:SS.SS
    var timeStr = hours.toString().padStart(4, '0') + ':' + 
                  minutes.toString().padStart(2, '0') + ':' + 
                  seconds.toString().padStart(2, '0') + '.00';
    setValue('cmi.core.session_time', timeStr);
  }
  
  function getLastError() {
    if (!scormAPI) return "0";
    return scormAPI.LMSGetLastError();
  }
  
  function getErrorString(errorNumber) {
    if (!scormAPI) return "No error";
    return scormAPI.LMSGetErrorString(errorNumber);
  }
  
  function getDiagnostic(errorNumber) {
    if (!scormAPI) return "No error";
    return scormAPI.LMSGetDiagnostic(errorNumber);
  }

  // TipTap JSON to HTML converter
  function tiptapToHtml(json) {
    if (!json || !json.content || !Array.isArray(json.content)) {
      return '<p></p>';
    }
    
    function processNode(node) {
      if (!node || !node.type) return '';
      
      var html = '';
      var tag = 'div';
      var attrs = {};
      
      // Map TipTap node types to HTML
      switch (node.type) {
        case 'paragraph':
          tag = 'p';
          break;
        case 'heading':
          tag = 'h' + (node.attrs?.level || 1);
          break;
        case 'bulletList':
          tag = 'ul';
          break;
        case 'orderedList':
          tag = 'ol';
          break;
        case 'listItem':
          tag = 'li';
          break;
        case 'blockquote':
          tag = 'blockquote';
          break;
        case 'codeBlock':
          tag = 'pre';
          var codeTag = document.createElement('code');
          if (node.attrs?.language) {
            codeTag.className = 'language-' + node.attrs.language;
          }
          if (node.content && node.content.length > 0) {
            codeTag.textContent = node.content.map(function(c) {
              return c.type === 'text' ? c.text : '';
            }).join('');
          }
          return codeTag.outerHTML;
        case 'hardBreak':
          return '<br>';
        case 'horizontalRule':
          return '<hr>';
        case 'text':
          var text = node.text || '';
          if (node.marks) {
            node.marks.forEach(function(mark) {
              switch (mark.type) {
                case 'bold':
                  text = '<strong>' + text + '</strong>';
                  break;
                case 'italic':
                  text = '<em>' + text + '</em>';
                  break;
                case 'underline':
                  text = '<u>' + text + '</u>';
                  break;
                case 'code':
                  text = '<code>' + text + '</code>';
                  break;
                case 'link':
                  text = '<a href="' + (mark.attrs?.href || '#') + '" target="_blank">' + text + '</a>';
                  break;
                case 'highlight':
                  text = '<mark>' + text + '</mark>';
                  break;
              }
            });
          }
          return text;
        case 'image':
          var imgSrc = node.attrs?.src || '';
          var imgAlt = node.attrs?.alt || '';
          var imgTitle = node.attrs?.title || '';
          var width = node.attrs?.width ? 'width="' + node.attrs.width + '"' : '';
          var height = node.attrs?.height ? 'height="' + node.attrs.height + '"' : '';
          return '<img src="' + imgSrc + '" alt="' + imgAlt + '" title="' + imgTitle + '" ' + width + ' ' + height + ' style="max-width: 100%; height: auto;" />';
        case 'video':
          var videoSrc = node.attrs?.src || '';
          var videoHeight = node.attrs?.height || '400';
          return '<div class="video-wrapper" style="width: 100%; height: ' + videoHeight + 'px;"><video src="' + videoSrc + '" controls style="width: 100%; height: 100%; object-fit: contain;"></video></div>';
        case 'audio':
          var audioSrc = node.attrs?.src || '';
          return '<div class="audio-wrapper"><audio src="' + audioSrc + '" controls style="width: 100%;"></audio></div>';
        case 'table':
          tag = 'table';
          attrs.class = 'border-collapse border border-gray-300 w-full';
          break;
        case 'tableRow':
          tag = 'tr';
          break;
        case 'tableHeader':
          tag = 'th';
          attrs.class = 'border border-gray-300 px-4 py-2 bg-gray-100';
          break;
        case 'tableCell':
          tag = 'td';
          attrs.class = 'border border-gray-300 px-4 py-2';
          break;
        default:
          tag = 'div';
      }
      
      // Process children
      if (node.content && Array.isArray(node.content)) {
        html = node.content.map(processNode).join('');
      }
      
      // Build attributes string
      var attrStr = '';
      for (var key in attrs) {
        attrStr += ' ' + key + '="' + attrs[key] + '"';
      }
      
      return '<' + tag + attrStr + '>' + html + '</' + tag + '>';
    }
    
    return json.content.map(processNode).join('');
  }
  
  // Course rendering state
  let currentPageId = null;
  let visitedSlides = new Set();
  let visitedPages = new Set();
  let totalSlides = 0;
  let totalPages = 0;
  
  // Course functionality
  function loadCourse() {
    if (!courseData || !courseData.courseData) return;
    
    const data = courseData.courseData;
    console.log('📚 [SCORM 1.2] Loading course:', data.name);
    
    // Update course title in header
    const courseTitleElement = document.getElementById('course-title');
    if (courseTitleElement && data.name) {
      courseTitleElement.textContent = data.name;
    }
    
    // SCORM 1.2 tracking - set initial status
    setValue('cmi.core.lesson_status', 'incomplete');
    commit();
    
    // Cargar interacciones guardadas
    loadInteractions();
    
    // Inicializar botón de fullscreen
    initFullscreenButton();
    
    const contentDiv = document.getElementById('course-content');
    if (!contentDiv) return;
    
    // Determine navigation mode
    if (data.navigationMode === 'slides' && data.slides && data.slides.length > 0) {
      // Slide-based course
      totalSlides = data.slides.length;
      renderSlideCourse(data.slides, contentDiv);
    } else if (data.plan && data.plan.length > 0) {
      // Page-based course
      countTotalPages(data.plan);
      renderPageCourse(data.plan, contentDiv);
    } else {
      contentDiv.innerHTML = '<div class="p-8 text-center"><p class="text-gray-600">No course content available.</p></div>';
    }
  }
  
  // Count total pages in hierarchical structure
  function countTotalPages(plan) {
    plan.forEach(function(node) {
      totalPages++;
      if (node.children && node.children.length > 0) {
        countTotalPages(node.children);
      }
    });
  }
  
  // Render slide-based course
  function renderSlideCourse(slides, container) {
    if (slides.length === 0) {
      container.innerHTML = '<div class="p-8 text-center"><p class="text-gray-600">No slides available.</p></div>';
      return;
    }
    
    // Sort slides by order
    var sortedSlides = slides.slice().sort(function(a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    
    allSlides = sortedSlides;
    
    // SCORM Resume: Intentar retomar en la última slide vista
    var savedPosition = getValue('cmi.core.lesson_location');
    if (savedPosition && savedPosition !== '' && !isNaN(parseInt(savedPosition))) {
      currentSlideIndex = parseInt(savedPosition);
      // Validar que el índice esté dentro del rango
      if (currentSlideIndex < 0 || currentSlideIndex >= sortedSlides.length) {
        currentSlideIndex = 0;
      }
    } else {
      currentSlideIndex = 0;
    }
    
    // Guardar posición inicial en SCORM
    setValue('cmi.core.lesson_location', currentSlideIndex.toString());
    commit();
    
    renderSlide(sortedSlides[currentSlideIndex], container, sortedSlides);
    
    // Add navigation controls
    addSlideNavigation(container, sortedSlides);
  }
  
  // Helper function to render background media with overlay
  function renderBackgroundMedia(content, slideHtml) {
    var hasBackgroundVideo = content?.backgroundVideo;
    var hasBackgroundImage = content?.backgroundImage;
    var hasBackgroundMedia = hasBackgroundVideo || hasBackgroundImage;
    var blurLevel = content?.backgroundBlurLevel ?? 2;
    
    if (hasBackgroundVideo) {
      slideHtml += '<video src="' + escapeHtml(content.backgroundVideo) + '" autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover"></video>';
    } else if (hasBackgroundImage) {
      slideHtml += '<img src="' + escapeHtml(content.backgroundImage) + '" alt="Background" class="absolute inset-0 w-full h-full object-cover" />';
    }
    
    if (hasBackgroundMedia) {
      slideHtml += '<div class="absolute inset-0 bg-black/40" style="backdrop-filter: blur(' + blurLevel + 'px);"></div>';
    }
    
    return hasBackgroundMedia;
  }
  
  // Helper function to render audio player (reusable component)
  function renderAudioPlayer(content, slide) {
    var audioSrc = content?.audioSrc || slide?.audioSrc;
    
    // Solo retornar HTML si hay una ruta de audio
    if (!audioSrc) {
      return '';
    }
    
    var html = '<div class="audio-player">';
    html += '<span class="audio-icon">🎧</span>';
    html += '<audio controls preload="metadata">';
    html += '<source src="' + escapeHtml(audioSrc) + '" type="audio/mpeg">';
    html += 'Tu navegador no soporta el elemento de audio.';
    html += '</audio>';
    html += '</div>';
    
    return html;
  }
  
  // Render a single slide
  function renderSlide(slide, container, allSlides) {
    if (!slide) return;
    
    visitedSlides.add(slide.id);
    
    // If slide has pre-converted HTML, use it directly
    if (slide.convertedHtml && typeof slide.convertedHtml === 'string') {
      var slideHtml = '<div class="slide-container w-full min-h-screen relative overflow-hidden">';
      
      // Inject audio player at the beginning of the content if audioSrc exists
      var audioPlayerHtml = renderAudioPlayer(slide.content, slide);
      if (audioPlayerHtml) {
        // Insert audio player right after the opening div of slide-content
        var convertedHtml = slide.convertedHtml;
        var slideContentIndex = convertedHtml.indexOf('<div class="slide-content">');
        if (slideContentIndex !== -1) {
          var insertPosition = slideContentIndex + '<div class="slide-content">'.length;
          convertedHtml = convertedHtml.slice(0, insertPosition) + '\n' + audioPlayerHtml + convertedHtml.slice(insertPosition);
        } else {
          // If no slide-content div, prepend to the beginning
          convertedHtml = audioPlayerHtml + convertedHtml;
        }
        slideHtml += convertedHtml;
      } else {
        slideHtml += slide.convertedHtml;
      }
      
      slideHtml += '</div>';
      container.innerHTML = slideHtml;
      
      // Re-execute any scripts in the converted HTML
      var scripts = container.querySelectorAll('script');
      scripts.forEach(function(oldScript) {
        var newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(function(attr) {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
      return;
    }
    
    var content = slide.content || {};
    var slideHtml = '<div class="slide-container w-full min-h-screen relative overflow-hidden">';
    
    // Render slide content based on type
    switch (slide.type) {
      case 'page':
        slideHtml += '<div class="p-8 bg-white">';
        
        // Audio player
        slideHtml += renderAudioPlayer(content, slide);
        
        if (slide.title) {
          slideHtml += '<h1 class="text-3xl font-bold mb-6">' + escapeHtml(slide.title) + '</h1>';
        }
        if (content) {
          slideHtml += '<div class="prose max-w-none">' + tiptapToHtml(content) + '</div>';
        }
        slideHtml += '</div>';
        break;
        
      case 'image':
        var hasBackgroundMedia = renderBackgroundMedia(content, slideHtml);
        var imageSrc = content?.src || content?.url;
        var overlayText = content?.overlayText;
        
        if (hasBackgroundMedia || (imageSrc && overlayText)) {
          slideHtml += '<div class="relative w-full h-full flex items-center justify-center">';
          if (!hasBackgroundMedia && imageSrc) {
            slideHtml += '<img src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(content?.alt || '') + '" class="absolute inset-0 w-full h-full object-cover" />';
            slideHtml += '<div class="absolute inset-0 bg-black/40" style="backdrop-filter: blur(' + (content?.backgroundBlurLevel || 2) + 'px);"></div>';
          }
          if (overlayText) {
            slideHtml += '<div class="text-center max-w-3xl px-8 relative z-10"><h1 class="text-5xl font-bold text-white">' + escapeHtml(overlayText) + '</h1></div>';
          }
          slideHtml += '</div>';
        } else if (imageSrc) {
          slideHtml += '<div class="p-8 bg-white flex items-center justify-center"><img src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(content?.alt || '') + '" class="max-w-full h-auto" /></div>';
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No image available</p></div>';
        }
        break;
        
      case 'video':
        var hasBackgroundMedia = renderBackgroundMedia(content, slideHtml);
        var videoSrc = content?.src || content?.url;
        var overlayText = content?.overlayText;
        var isYouTube = content?.source === 'youtube' || (videoSrc && (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')));
        
        if (hasBackgroundMedia || (videoSrc && overlayText)) {
          slideHtml += '<div class="relative w-full h-full flex items-center justify-center">';
          if (!hasBackgroundMedia && videoSrc && !isYouTube) {
            slideHtml += '<video src="' + escapeHtml(videoSrc) + '" autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover"></video>';
            slideHtml += '<div class="absolute inset-0 bg-black/40" style="backdrop-filter: blur(' + (content?.backgroundBlurLevel || 2) + 'px);"></div>';
          }
          if (overlayText) {
            slideHtml += '<div class="text-center max-w-3xl px-8 relative z-10"><h1 class="text-5xl font-bold text-white">' + escapeHtml(overlayText) + '</h1></div>';
          }
          slideHtml += '</div>';
        } else if (videoSrc) {
          slideHtml += '<div class="p-8 bg-white">';
          if (isYouTube) {
            slideHtml += '<iframe src="' + escapeHtml(videoSrc) + '" class="w-full" style="height: 70vh;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
          } else {
            slideHtml += '<video src="' + escapeHtml(videoSrc) + '" controls class="w-full" style="max-height: 70vh;"></video>';
          }
          slideHtml += '</div>';
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No video available</p></div>';
        }
        break;
        
      case 'audio':
        var audioSrc = content?.src || content?.url;
        slideHtml += '<div class="p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 min-h-screen flex items-center justify-center">';
        slideHtml += '<div class="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">';
        if (content?.audioType) {
          slideHtml += '<p class="text-white/60 text-sm text-center mb-4 capitalize">' + escapeHtml(content.audioType.replace('-', ' ')) + '</p>';
        }
        if (audioSrc) {
          slideHtml += '<audio src="' + escapeHtml(audioSrc) + '" controls class="w-full"></audio>';
        } else {
          slideHtml += '<p class="text-white/80 text-center">No audio available</p>';
        }
        if (content?.generatedText) {
          slideHtml += '<details class="mt-4 bg-white/5 rounded-lg overflow-hidden"><summary class="cursor-pointer px-4 py-2 text-white/80 hover:text-white text-sm font-medium">View Generated Script</summary>';
          slideHtml += '<div class="px-4 py-3 border-t border-white/10"><p class="text-white/90 text-sm whitespace-pre-wrap">' + escapeHtml(content.generatedText) + '</p></div></details>';
        }
        slideHtml += '</div></div>';
        break;
        
      case 'block':
        if (content?.blockId) {
          slideHtml += '<div class="p-8 bg-white"><div class="block-slide w-full h-full min-h-[600px]" data-block-id="' + escapeHtml(content.blockId) + '" data-props-id="' + escapeHtml(content.propsId || '') + '" data-props="' + escapeHtml(content.props ? JSON.stringify(content.props) : '') + '"><div class="block-loading p-8 text-center">Loading block...</div></div></div>';
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No block selected</p></div>';
        }
        break;
        
      case 'opening':
      case 'chapter':
        var hasBackgroundMedia = renderBackgroundMedia(content, slideHtml);
        var color = content?.color || (slide.type === 'opening' ? '#3b82f6' : 'blue');
        var title = slide.title || (slide.type === 'opening' ? 'Course Title' : 'New Chapter');
        var subtitle = content?.subtitle || (slide.type === 'opening' ? 'Welcome' : 'Chapter');
        
        slideHtml += '<div class="relative w-full h-full flex items-center justify-center">';
        if (!hasBackgroundMedia) {
          slideHtml += '<div class="absolute inset-0" style="background: linear-gradient(to bottom right, ' + color + '15, ' + color + '30, ' + color + '45);"></div>';
        }
        slideHtml += '<div class="text-center max-w-3xl px-8 relative z-10">';
        slideHtml += '<h1 class="text-5xl font-bold mb-4 ' + (hasBackgroundMedia ? 'text-white' : '') + '" style="' + (!hasBackgroundMedia ? 'color: ' + color + ';' : '') + '">' + escapeHtml(title) + '</h1>';
        slideHtml += '<p class="text-lg uppercase tracking-widest font-semibold ' + (hasBackgroundMedia ? 'text-white/80' : '') + '" style="' + (!hasBackgroundMedia ? 'color: ' + color + 'b0;' : '') + '">' + escapeHtml(subtitle) + '</p>';
        slideHtml += '</div></div>';
        break;
        
      case 'conclusion':
        slideHtml += '<div class="slide-content p-8 bg-white">';
        if (slide.title) {
          slideHtml += '<h1 class="text-3xl font-bold mb-6">' + escapeHtml(slide.title) + '</h1>';
        }
        if (content) {
          slideHtml += '<div class="prose max-w-none">' + tiptapToHtml(content) + '</div>';
        }
        slideHtml += '</div>';
        break;
        
      case 'document':
        var docSrc = content?.src || content?.url;
        var fileName = content?.name || content?.fileName || 'Document';
        var fileType = content?.type || content?.mimeType || '';
        var isPDF = fileType.toLowerCase().includes('pdf') || fileName.toLowerCase().endsWith('.pdf');
        
        if (docSrc) {
          if (isPDF) {
            slideHtml += '<div class="h-full w-full flex flex-col bg-white">';
            slideHtml += '<div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">';
            slideHtml += '<div class="flex items-center gap-3"><div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><span class="text-red-600 font-bold">PDF</span></div>';
            slideHtml += '<div><h3 class="text-sm font-medium text-gray-900">' + escapeHtml(fileName) + '</h3></div></div>';
            slideHtml += '<a href="' + escapeHtml(docSrc) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">Open in new tab</a></div>';
            slideHtml += '<div class="flex-1 bg-gray-100"><iframe src="' + escapeHtml(docSrc) + '" class="w-full h-full border-0" title="' + escapeHtml(fileName) + '"></iframe></div></div>';
          } else {
            slideHtml += '<div class="p-8 bg-white flex items-center justify-center"><div class="max-w-2xl w-full text-center">';
            slideHtml += '<div class="mb-6"><h2 class="text-2xl font-bold text-gray-900 mb-2">' + escapeHtml(fileName) + '</h2></div>';
            slideHtml += '<div class="flex items-center justify-center gap-3">';
            slideHtml += '<a href="' + escapeHtml(docSrc) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">Open Document</a>';
            slideHtml += '<a href="' + escapeHtml(docSrc) + '" download="' + escapeHtml(fileName) + '" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl">Download</a>';
            slideHtml += '</div></div></div>';
          }
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No document available</p></div>';
        }
        break;
        
      case 'googleDoc':
        var docSrc = content?.src || content?.url;
        if (docSrc) {
          slideHtml += '<div class="p-8 bg-white"><iframe src="' + escapeHtml(docSrc) + '" class="w-full" style="height: 600px;" frameborder="0" title="Google Doc"></iframe></div>';
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No Google Doc available</p></div>';
        }
        break;
        
      case 'iframe':
        var iframeSrc = content?.src || content?.url;
        if (iframeSrc) {
          slideHtml += '<div class="p-8 bg-white">';
          if (content?.caption) {
            slideHtml += '<div class="p-3 bg-gray-50 border-b border-gray-200"><p class="text-sm text-gray-700">' + escapeHtml(content.caption) + '</p></div>';
          }
          slideHtml += '<iframe src="' + escapeHtml(iframeSrc) + '" class="w-full" style="height: 80vh;" frameborder="0" title="' + escapeHtml(content?.caption || 'Embedded content') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
          slideHtml += '</div>';
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No embedded content available</p></div>';
        }
        break;
        
      case 'threeDModel':
        var modelSrc = content?.src || content?.url;
        if (modelSrc) {
          slideHtml += '<div class="p-8 bg-white text-center">';
          slideHtml += '<p class="text-gray-600 mb-4">3D models require WebGL support. Please view in a compatible browser.</p>';
          slideHtml += '<a href="' + escapeHtml(modelSrc) + '" target="_blank" class="text-blue-600 hover:underline">Open 3D Model</a>';
          if (content?.caption) {
            slideHtml += '<p class="text-sm text-gray-500 mt-4">' + escapeHtml(content.caption) + '</p>';
          }
          slideHtml += '</div>';
        } else {
          slideHtml += '<div class="p-8 bg-white text-center"><p class="text-gray-600">No 3D model available</p></div>';
        }
        break;
        
      case 'quiz':
        slideHtml += '<div class="slide-content p-8 bg-white">';
        
        // Audio player
        slideHtml += renderAudioPlayer(content, slide);
        
        // Header del quiz
        slideHtml += '<div class="container">';
        slideHtml += '<div class="row justify-content-center">';
        slideHtml += '<div class="col-lg-8">';
        
        if (slide.title) {
          slideHtml += '<h1 class="text-3xl font-bold mb-6">' + escapeHtml(slide.title) + '</h1>';
        }
        
        // Card principal
        slideHtml += '<div class="card shadow-lg border-0 rounded-4">';
        slideHtml += '<div class="card-body p-4 p-md-5">';
        
        // Pregunta
        if (content?.question) {
          slideHtml += '<div class="alert alert-primary border-0 mb-4" style="background: linear-gradient(135deg, #cfe2ff 0%, #e7f1ff 100%); border-left: 4px solid var(--color-primary) !important;">';
          slideHtml += '<p class="fs-5 fw-semibold mb-0" style="color: var(--text-primary);">' + escapeHtml(content.question) + '</p>';
          slideHtml += '</div>';
        }
        
        var options = content?.options || [];
        var correctAnswer = content?.correctAnswer || 0;
        var quizId = 'quiz-' + slide.id;
        var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        // Opciones
        slideHtml += '<div class="quiz-options-container">';
        options.forEach(function(option, index) {
          slideHtml += '<div class="quiz-option-wrapper mb-3 p-3 rounded-3" onclick="document.getElementById(\'' + quizId + '-' + index + '\').click();">';
          slideHtml += '<div class="d-flex align-items-center">';
          slideHtml += '<input class="quiz-radio-hidden" type="radio" name="' + quizId + '" id="' + quizId + '-' + index + '" value="' + index + '" data-correct="' + (index === correctAnswer ? 'true' : 'false') + '" onchange="CourseApp.handleQuizAnswer(this, \'' + slide.id + '\')">';
          slideHtml += '<span class="badge bg-primary me-3 px-3 py-2">' + letters[index] + '</span>';
          slideHtml += '<span class="fs-6 fw-medium flex-grow-1">' + escapeHtml(option) + '</span>';
          slideHtml += '<i class="bi bi-circle quiz-check-icon ms-2"></i>';
          slideHtml += '</div>';
          slideHtml += '</div>';
        });
        slideHtml += '</div>';
        
        // Explicación
        if (content?.explanation) {
          slideHtml += '<div id="quiz-explanation-' + slide.id + '" class="alert alert-info border-0 mt-4 d-none" style="background: linear-gradient(135deg, #cff4fc 0%, #e7f6fc 100%); border-left: 4px solid #0dcaf0 !important;">';
          slideHtml += '<div class="d-flex">';
          slideHtml += '<i class="bi bi-lightbulb-fill fs-4 me-3" style="color: #0dcaf0;"></i>';
          slideHtml += '<div>';
          slideHtml += '<h6 class="fw-bold mb-2" style="color: #055160;">Explicación</h6>';
          slideHtml += '<p class="mb-0" style="color: var(--text-secondary);">' + escapeHtml(content.explanation) + '</p>';
          slideHtml += '</div>';
          slideHtml += '</div>';
          slideHtml += '</div>';
        }
        
        slideHtml += '</div></div>'; // Cierre card
        slideHtml += '</div></div></div></div>'; // Cierre columnas, container y slide-content
        
        // Modal de feedback correcto
        slideHtml += '<div class="modal fade" id="quiz-modal-correct-' + slide.id + '" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">';
        slideHtml += '<div class="modal-dialog modal-dialog-centered">';
        slideHtml += '<div class="modal-content border-0 shadow-lg">';
        slideHtml += '<div class="modal-body text-center p-5">';
        slideHtml += '<div class="mb-4"><i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i></div>';
        slideHtml += '<h3 class="fw-bold text-success mb-3">¡Correcto!</h3>';
        slideHtml += '<p class="text-muted mb-4">' + escapeHtml(content?.feedbackCorrect || 'Has seleccionado la respuesta correcta.') + '</p>';
        slideHtml += '<button type="button" class="btn btn-success btn-lg px-5 rounded-pill" onclick="CourseApp.closeQuizModal(\'' + slide.id + '\', \'correct\')">Continuar</button>';
        slideHtml += '</div></div></div></div>';
        
        // Modal de feedback incorrecto
        slideHtml += '<div class="modal fade" id="quiz-modal-incorrect-' + slide.id + '" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">';
        slideHtml += '<div class="modal-dialog modal-dialog-centered">';
        slideHtml += '<div class="modal-content border-0 shadow-lg">';
        slideHtml += '<div class="modal-body text-center p-5">';
        slideHtml += '<div class="mb-4"><i class="bi bi-x-circle-fill text-danger" style="font-size: 5rem;"></i></div>';
        slideHtml += '<h3 class="fw-bold text-danger mb-3">Incorrecto</h3>';
        slideHtml += '<p class="text-muted mb-4">' + escapeHtml(content?.feedbackIncorrect || 'Intenta nuevamente. Revisa la pregunta y las opciones.') + '</p>';
        slideHtml += '<button type="button" class="btn btn-danger btn-lg px-5 rounded-pill" onclick="CourseApp.closeQuizModal(\'' + slide.id + '\', \'incorrect\')">Intentar de nuevo</button>';
        slideHtml += '</div></div></div></div>';
        break;
        
      case 'dragdrop':
        slideHtml += '<div class="slide-content p-8 bg-white">';
        
        // Audio player
        slideHtml += renderAudioPlayer(content, slide);
        
        if (slide.title) {
          slideHtml += '<h1 class="text-3xl font-bold mb-4">' + escapeHtml(slide.title) + '</h1>';
        }
        
        // Pregunta/instrucción
        if (content?.question) {
          slideHtml += '<div class="mb-3">';
          slideHtml += '<p class="text-md text-gray-700 font-semibold">' + escapeHtml(content.question) + '</p>';
          slideHtml += '</div>';
        }
        
        var items = content?.items || [];
        var objective = content?.objective || 'Zona de respuesta';
        var dragDropId = 'dragdrop-' + slide.id;
        
        // ITEMS DISPONIBLES ARRIBA (Grid compacto)
        slideHtml += '<div class="mb-3">';
        slideHtml += '<div id="items-container-' + slide.id + '" class="dragdrop-items-grid">';
        items.forEach(function(item) {
          slideHtml += '<div class="draggable-item" ';
          slideHtml += 'draggable="true" ';
          slideHtml += 'data-id="' + escapeHtml(item.id) + '" ';
          slideHtml += 'data-correct="' + (item.correct ? 'true' : 'false') + '" ';
          slideHtml += 'ondragstart="CourseApp.handleDragStart(event)" ';
          slideHtml += 'ondragend="CourseApp.handleDragEnd(event)" ';
          slideHtml += 'onclick="CourseApp.handleItemClick(event, \'' + item.id + '\', \'' + slide.id + '\')">';
          slideHtml += '<span class="draggable-item-text">' + escapeHtml(item.text) + '</span>';
          slideHtml += '</div>';
        });
        slideHtml += '</div></div>';
        
        // GRAN CAJA RECEPTORA ABAJO
        slideHtml += '<div class="dragdrop-objective-container mb-3">';
        slideHtml += '<div class="dragdrop-objective-header">';
        slideHtml += '<span class="objective-icon">🎯</span>';
        slideHtml += '<h4 class="objective-title">' + escapeHtml(objective) + '</h4>';
        slideHtml += '</div>';
        slideHtml += '<div class="drop-zone" ';
        slideHtml += 'id="drop-zone-' + slide.id + '" ';
        slideHtml += 'ondragover="CourseApp.handleDragOver(event)" ';
        slideHtml += 'ondragleave="CourseApp.handleDragLeave(event)" ';
        slideHtml += 'ondrop="CourseApp.handleDrop(event, \'' + slide.id + '\')" ';
        slideHtml += 'onclick="CourseApp.handleDropZoneClick(event, \'' + slide.id + '\')">';
        slideHtml += '<div class="drop-items" id="drop-items-' + slide.id + '"></div>';
        slideHtml += '<div class="drop-zone-placeholder">Arrastra o selecciona aquí</div>';
        slideHtml += '</div>';
        slideHtml += '</div>';
        
        // Botón verificar
        slideHtml += '<div class="flex justify-center mb-4">';
        slideHtml += '<button type="button" class="btn btn-primary px-6 py-2 rounded-lg" onclick="CourseApp.checkDragDropAnswer(\'' + slide.id + '\')">';
        slideHtml += 'Verificar Respuestas</button>';
        slideHtml += '</div>';
        
        // Explicación (oculta inicialmente)
        if (content?.explanation) {
          slideHtml += '<div id="dragdrop-explanation-' + slide.id + '" class="alert alert-info border-0 mt-4 d-none">';
          slideHtml += '<div class="d-flex">';
          slideHtml += '<i class="bi bi-lightbulb-fill fs-4 me-3" style="color: #0dcaf0;"></i>';
          slideHtml += '<div>';
          slideHtml += '<h6 class="fw-bold mb-2" style="color: #055160;">Explicación</h6>';
          slideHtml += '<p class="mb-0" style="color: var(--text-secondary);">' + escapeHtml(content.explanation) + '</p>';
          slideHtml += '</div>';
          slideHtml += '</div>';
          slideHtml += '</div>';
        }
        
        slideHtml += '</div>'; // Cierre slide-content
        
        // Modal de feedback correcto
        slideHtml += '<div class="modal fade" id="dragdrop-modal-correct-' + slide.id + '" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">';
        slideHtml += '<div class="modal-dialog modal-dialog-centered">';
        slideHtml += '<div class="modal-content border-0 shadow-lg">';
        slideHtml += '<div class="modal-body text-center p-5">';
        slideHtml += '<div class="mb-4"><i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i></div>';
        slideHtml += '<h3 class="fw-bold text-success mb-3">¡Correcto!</h3>';
        slideHtml += '<p class="text-muted mb-4">' + escapeHtml(content?.feedbackCorrect || 'Has clasificado correctamente todos los elementos.') + '</p>';
        slideHtml += '<button type="button" class="btn btn-success btn-lg px-5 rounded-pill" onclick="CourseApp.closeDragDropModal(\'' + slide.id + '\', \'correct\')">Continuar</button>';
        slideHtml += '</div></div></div></div>';
        
        // Modal de feedback incorrecto
        slideHtml += '<div class="modal fade" id="dragdrop-modal-incorrect-' + slide.id + '" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">';
        slideHtml += '<div class="modal-dialog modal-dialog-centered">';
        slideHtml += '<div class="modal-content border-0 shadow-lg">';
        slideHtml += '<div class="modal-body text-center p-5">';
        slideHtml += '<div class="mb-4"><i class="bi bi-x-circle-fill text-danger" style="font-size: 5rem;"></i></div>';
        slideHtml += '<h3 class="fw-bold text-danger mb-3">Incorrecto</h3>';
        slideHtml += '<p class="text-muted mb-4">' + escapeHtml(content?.feedbackIncorrect || 'Algunos elementos no están en la categoría correcta. Revisa y vuelve a intentarlo.') + '</p>';
        slideHtml += '<button type="button" class="btn btn-danger btn-lg px-5 rounded-pill" onclick="CourseApp.closeDragDropModal(\'' + slide.id + '\', \'incorrect\')">Intentar de nuevo</button>';
        slideHtml += '</div></div></div></div>';
        break;
        
      case 'infoCards':
        slideHtml += '<div class="slide-content">';
        
        // Audio player
        slideHtml += renderAudioPlayer(content, slide);
        
        // Renderizar convertedDescription si existe
        if (content?.convertedDescription) {
          slideHtml += content.convertedDescription;
        }
        
        var cards = content?.cards || [];
        
        // Grid de tarjetas
        slideHtml += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem;">';
        cards.forEach(function(card, index) {
          var cardId = 'card-' + slide.id + '-' + index;
          var bgColor = card.bgColor || '#e8f3f8';
          var iconColor = card.iconColor || '#7fb3c4';
          
          slideHtml += '<div style="background: ' + bgColor + '; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); cursor: pointer; transition: all 0.3s ease;" ';
          slideHtml += 'onclick="CourseApp.openInfoCardModal(\'' + slide.id + '\', ' + index + ')" ';
          slideHtml += 'onmouseover="this.style.transform=\'translateY(-5px)\'; this.style.boxShadow=\'0 8px 30px rgba(0, 0, 0, 0.12)\';" ';
          slideHtml += 'onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 4px 20px rgba(0, 0, 0, 0.08)\';">';
          
          if (card.icon) {
            slideHtml += '<div style="text-align: center; margin-bottom: 1rem; font-size: 3rem;">' + escapeHtml(card.icon) + '</div>';
          }
          
          slideHtml += '<h4 style="text-align: center; margin-bottom: 0.5rem; color: ' + iconColor + '; font-size: 1.3rem; font-weight: 700;">' + escapeHtml(card.title) + '</h4>';
          
          if (card.subtitle) {
            slideHtml += '<p style="text-align: center; margin: 0; color: #718096; font-size: 0.95rem;">' + escapeHtml(card.subtitle) + '</p>';
          }
          
          slideHtml += '<div style="text-align: center; margin-top: 1rem;">';
          slideHtml += '<span style="color: ' + iconColor + '; font-size: 1.2rem;">ℹ️</span>';
          slideHtml += '</div>';
          
          slideHtml += '</div>';
        });
        slideHtml += '</div>';
        
        slideHtml += '</div>'; // Cierre slide-content
        
        // Modales para cada tarjeta
        cards.forEach(function(card, index) {
          var modalId = 'infocard-modal-' + slide.id + '-' + index;
          
          slideHtml += '<div class="modal fade" id="' + modalId + '" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">';
          slideHtml += '<div class="modal-dialog modal-dialog-centered modal-xl">';
          slideHtml += '<div class="modal-content border-0 shadow-lg">';
          
          // Header del modal
          slideHtml += '<div class="modal-header border-0 pb-0">';
          slideHtml += '<h5 class="modal-title fw-bold" style="color: var(--slide-title-color);">' + escapeHtml(card.title) + '</h5>';
          slideHtml += '<button type="button" class="btn-close" onclick="CourseApp.closeInfoCardModal(\'' + slide.id + '\', ' + index + ')"></button>';
          slideHtml += '</div>';
          
          // Body del modal
          slideHtml += '<div class="modal-body p-4">';
          
          if (card.icon) {
            slideHtml += '<div class="text-center mb-4" style="font-size: 4rem;">' + escapeHtml(card.icon) + '</div>';
          }
          
          if (card.modalContent) {
            slideHtml += '<div class="prose max-w-none">' + card.modalContent + '</div>';
          }
          
          slideHtml += '</div>';
          
          // Footer del modal
          slideHtml += '<div class="modal-footer border-0">';
          slideHtml += '<button type="button" class="btn btn-primary px-4 rounded-pill" onclick="CourseApp.closeInfoCardModal(\'' + slide.id + '\', ' + index + ')">Cerrar</button>';
          slideHtml += '</div>';
          
          slideHtml += '</div></div></div>';
        });
        
        break;
        
        // Modal de feedback correcto
        slideHtml += '<div id="quiz-modal-correct-' + slide.id + '" class="quiz-modal fixed inset-0 bg-black/50 hidden items-center justify-center z-50" style="display: none;">';
        slideHtml += '<div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform scale-95 opacity-0 transition-all duration-300" id="quiz-modal-content-correct-' + slide.id + '">';
        slideHtml += '<div class="text-6xl mb-4">✅</div>';
        slideHtml += '<h3 class="text-2xl font-bold text-green-600 mb-2">¡Correcto!</h3>';
        slideHtml += '<p class="text-gray-600 mb-6">' + escapeHtml(content?.feedbackCorrect || 'Has seleccionado la respuesta correcta.') + '</p>';
        slideHtml += '<button onclick="CourseApp.closeQuizModal(\'' + slide.id + '\', \'correct\')" class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all">Continuar</button>';
        slideHtml += '</div></div>';
        
        // Modal de feedback incorrecto
        slideHtml += '<div id="quiz-modal-incorrect-' + slide.id + '" class="quiz-modal fixed inset-0 bg-black/50 hidden items-center justify-center z-50" style="display: none;">';
        slideHtml += '<div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform scale-95 opacity-0 transition-all duration-300" id="quiz-modal-content-incorrect-' + slide.id + '">';
        slideHtml += '<div class="text-6xl mb-4">❌</div>';
        slideHtml += '<h3 class="text-2xl font-bold text-red-600 mb-2">Incorrecto</h3>';
        slideHtml += '<p class="text-gray-600 mb-6">' + escapeHtml(content?.feedbackIncorrect || 'Intenta nuevamente. Revisa la pregunta y las opciones.') + '</p>';
        slideHtml += '<button onclick="CourseApp.closeQuizModal(\'' + slide.id + '\', \'incorrect\')" class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all">Intentar de nuevo</button>';
        slideHtml += '</div></div>';
        break;
        
      default:
        slideHtml += '<div class="p-8 bg-white"><div class="unknown-slide"><p class="text-gray-600">Unknown slide type: ' + escapeHtml(slide.type) + '</p></div></div>';
    }
    
    slideHtml += '</div>';
    
    container.innerHTML = slideHtml;
    
    // Si es un quiz, manejar el estado
    if (slide.type === 'quiz') {
      setTimeout(function() {
        var quizState = quizAnswers[slide.id];
        if (quizState && quizState.answered) {
          // Restaurar estado del quiz
          var quizId = 'quiz-' + slide.id;
          var radio = document.getElementById(quizId + '-' + quizState.selectedIndex);
          if (radio) {
            radio.checked = true;
            window.CourseApp.restoreQuizState(slide.id, quizState);
          }
        } else {
          // Bloquear botón siguiente
          var btnNext = document.getElementById('btn-next');
          if (btnNext) {
            btnNext.disabled = true;
            btnNext.style.opacity = '0.5';
            btnNext.style.cursor = 'not-allowed';
            btnNext.style.pointerEvents = 'none';
          }
        }
      }, 200);
    }
    
    // Si es un dragdrop, manejar el estado
    if (slide.type === 'dragdrop') {
      setTimeout(function() {
        var dragDropState = quizAnswers[slide.id];
        if (!dragDropState || !dragDropState.answered) {
          // Bloquear botón siguiente
          var btnNext = document.getElementById('btn-next');
          if (btnNext) {
            btnNext.disabled = true;
            btnNext.style.opacity = '0.5';
            btnNext.style.cursor = 'not-allowed';
            btnNext.style.pointerEvents = 'none';
          }
        }
      }, 200);
    }
    
    // Load blocks if needed
    if (slide.type === 'block' && content?.blockId) {
      var blockContainer = container.querySelector('.block-slide[data-block-id="' + content.blockId + '"]');
      if (blockContainer) {
        loadBlock(content.blockId, blockContainer, content.propsId, content.props);
      }
    }
    
    // Update progress
    updateProgress();
  }
  
  // Add slide navigation controls
  function addSlideNavigation(container, slides) {
    var navHtml = '<div class="slide-navigation fixed bottom-4 left-0 right-0 flex justify-center z-10">';
    navHtml += '<div class="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 flex gap-2 items-center">';
    
    // Previous button
    if (currentSlideIndex > 0) {
      navHtml += '<button onclick="CourseApp.previousSlide()" class="px-4 py-2 bg-white/80 hover:bg-white rounded-lg text-gray-800 font-medium">Previous</button>';
    }
    
    // Slide dots
    slides.forEach(function(_, index) {
      var isActive = index === currentSlideIndex;
      navHtml += '<button onclick="CourseApp.goToSlide(' + index + ')" class="rounded-full transition-all ' + 
        (isActive ? 'bg-white w-6 h-2' : 'bg-white/50 hover:bg-white/70 w-2 h-2') + 
        ' h-2"></button>';
    });
    
    // Next button
    if (currentSlideIndex < slides.length - 1) {
      navHtml += '<button onclick="CourseApp.nextSlide()" class="px-4 py-2 bg-white/80 hover:bg-white rounded-lg text-gray-800 font-medium">Next</button>';
    }
    // Si es la última slide, no mostrar botón aquí - la navegación personalizada de course.html lo maneja
    
    navHtml += '</div></div>';
    container.insertAdjacentHTML('beforeend', navHtml);
  }
  
  // Render page-based course
  function renderPageCourse(plan, container) {
    var html = '<div class="page-course flex h-full">';
    html += '<div class="navigation-panel w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4">';
    html += '<h2 class="text-xl font-bold mb-4">Course Navigation</h2>';
    html += '<div class="navigation-tree">' + renderNavigationTree(plan, container) + '</div>';
    html += '</div>';
    html += '<div class="content-panel flex-1 overflow-y-auto p-8">';
    html += '<div id="page-content">Select a page to begin.</div>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
    
    // Auto-select first page
    if (plan.length > 0) {
      selectPage(plan[0].id, container);
    }
  }
  
  // Render navigation tree
  function renderNavigationTree(plan, container) {
    var html = '<ul class="space-y-1">';
    plan.forEach(function(node) {
      html += '<li>';
      html += '<button onclick="CourseApp.selectPage(\'' + node.id + '\')" class="w-full text-left p-2 hover:bg-gray-200 rounded ' + 
        (currentPageId === node.id ? 'bg-blue-100' : '') + '">';
      html += escapeHtml(node.title);
      html += '</button>';
      if (node.children && node.children.length > 0) {
        html += '<ul class="ml-4 mt-1">';
        node.children.forEach(function(child) {
          html += '<li>';
          html += '<button onclick="CourseApp.selectPage(\'' + child.id + '\')" class="w-full text-left p-2 hover:bg-gray-200 rounded text-sm ' + 
            (currentPageId === child.id ? 'bg-blue-100' : '') + '">';
          html += escapeHtml(child.title);
          html += '</button>';
          html += '</li>';
        });
        html += '</ul>';
      }
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }
  
  // Select and render a page
  function selectPage(pageId, container) {
    currentPageId = pageId;
    visitedPages.add(pageId);
    
    // Find page in plan
    var page = findPageInPlan(courseData.courseData.plan, pageId);
    if (!page) return;
    
    var contentDiv = container.querySelector('#page-content');
    if (!contentDiv) return;
    
    var pageHtml = '<div class="page-content">';
    if (page.title) {
      pageHtml += '<h1 class="text-3xl font-bold mb-6">' + escapeHtml(page.title) + '</h1>';
    }
    if (page.content) {
      pageHtml += '<div class="prose max-w-none">' + tiptapToHtml(page.content) + '</div>';
    } else {
      pageHtml += '<p class="text-gray-600">No content available for this page.</p>';
    }
    pageHtml += '</div>';
    
    contentDiv.innerHTML = pageHtml;
    
    // Update navigation highlight
    updateNavigationHighlight();
    
    // Update progress
    updateProgress();
    
    // NO completar automáticamente - solo con el botón del modal
  }
  
  // Find page in plan hierarchy
  function findPageInPlan(plan, pageId) {
    for (var i = 0; i < plan.length; i++) {
      if (plan[i].id === pageId) {
        return plan[i];
      }
      if (plan[i].children && plan[i].children.length > 0) {
        var found = findPageInPlan(plan[i].children, pageId);
        if (found) return found;
      }
    }
    return null;
  }
  
  // Update navigation highlight
  function updateNavigationHighlight() {
    var buttons = document.querySelectorAll('.navigation-tree button');
    buttons.forEach(function(btn) {
      var pageId = btn.getAttribute('onclick')?.match(/selectPage('([^']+)')/)?.[1];
      if (pageId === currentPageId) {
        btn.classList.add('bg-blue-100');
      } else {
        btn.classList.remove('bg-blue-100');
      }
    });
  }
  
  // Load block using mexty-block.js
  function loadBlock(blockId, container, propsId, props) {
    if (!window.mexty || !container) {
      console.warn('⚠️ mexty-block.js not available or container not found');
      return;
    }
    
    try {
      var blockProps = {};
      if (propsId) {
        // Props ID will be handled by mexty-block.js via URL parameter
        blockProps.propsId = propsId;
      } else if (props) {
        // Direct props object
        blockProps = typeof props === 'string' ? JSON.parse(props) : props;
      }
      
      window.mexty.loadBlock(blockId, container, blockProps, {
        onLoad: function() {
          console.log('✅ Block loaded:', blockId);
        },
        onError: function(error) {
          console.error('❌ Failed to load block:', error);
          container.innerHTML = '<div class="p-8 text-center text-red-600">Failed to load block: ' + escapeHtml(error.message || 'Unknown error') + '</div>';
        }
      });
    } catch (error) {
      console.error('❌ Error loading block:', error);
      container.innerHTML = '<div class="p-8 text-center text-red-600">Error loading block.</div>';
    }
  }
  
  // Update progress tracking
  function updateProgress() {
    var progress = 0;
    if (courseData.courseData.navigationMode === 'slides') {
      // Calcular porcentaje basado en la slide actual vs total de slides
      progress = totalSlides > 0 ? ((currentSlideIndex + 1) / totalSlides) * 100 : 0;
      console.log('📊 [DEBUG] Progreso:', {
        slideActual: currentSlideIndex + 1,
        totalSlides: totalSlides,
        porcentaje: Math.round(progress) + '%',
        scoreRaw: Math.round(progress)
      });
    } else {
      // Para modo páginas, usar el conteo de páginas visitadas
      progress = totalPages > 0 ? (visitedPages.size / totalPages) * 100 : 0;
      console.log('📊 [DEBUG] Progreso:', {
        paginasVisitadas: visitedPages.size,
        totalPaginas: totalPages,
        porcentaje: Math.round(progress) + '%',
        scoreRaw: Math.round(progress)
      });
    }
    
    // Actualizar score.raw con el porcentaje de avance (NO es una nota, es progreso)
    setValue('cmi.core.score.raw', Math.round(progress).toString());
    commit();
  }
  
  // Guardar interacciones en cmi.suspend_data
  function saveInteractions() {
    var interactionsData = {
      quizAnswers: quizAnswers
    };
    var jsonData = JSON.stringify(interactionsData);
    setValue('cmi.suspend_data', jsonData);
    commit();
    console.log('💾 [SCORM] Interacciones guardadas:', interactionsData);
  }
  
  // Cargar interacciones desde cmi.suspend_data
  function loadInteractions() {
    var savedData = getValue('cmi.suspend_data');
    if (savedData && savedData !== '') {
      try {
        var interactionsData = JSON.parse(savedData);
        if (interactionsData.quizAnswers) {
          quizAnswers = interactionsData.quizAnswers;
          console.log('📚 [SCORM] Interacciones cargadas:', interactionsData);
        }
      } catch (e) {
        console.error('❌ Error al parsear suspend_data:', e);
      }
    }
  }
  
  // Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  function completeCourse(data) {
    if (isCompleted) return;
    
    isCompleted = true;
    console.log('🎯 [SCORM 1.2] COMPLETE COURSE', data);
    
    // Update session time
    updateSessionTime();
    
    // Update SCORM 1.2 data with proper completion and scoring
    console.log('📊 [SCORM 1.2] Sending course completion data to LMS...');
    setValue('cmi.core.lesson_status', 'completed');
    
    // Al finalizar, establecer score.raw en 100 (curso completado)
    setValue('cmi.core.score.raw', '100');
    setValue('cmi.core.score.min', '0');
    setValue('cmi.core.score.max', '100');
    setValue('cmi.core.exit', 'normal');
    
    // Commit the data to LMS
    if (commit()) {
      console.log('✅ [SCORM 1.2] SCORM course completion data sent to LMS successfully');
    } else {
      console.error('❌ [SCORM 1.2] Failed to send SCORM course completion data to LMS');
    }
  }
  
  // Event listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Handle page unload
    window.addEventListener('beforeunload', terminate);
    window.addEventListener('unload', terminate);
  });
  
  // Public API
  window.CourseApp = {
    init: function(data) {
      courseData = data;
      
      console.log('🚀 [SCORM 1.2] Initializing CourseApp for:', data);
      
      // Initialize SCORM 1.2
      if (initScorm()) {
        console.log('✅ [SCORM 1.2] SCORM initialized successfully');
      } else {
        console.warn('⚠️ [SCORM 1.2] SCORM initialization failed, continuing without LMS integration');
      }
      
      // Hide loading and show main content
      document.getElementById('loading').style.display = 'none';
      document.getElementById('main-content').style.display = 'flex';
      
      // Load the course
      loadCourse();
    },
    
    // Slide navigation methods
    nextSlide: function() {
      if (courseData.courseData.navigationMode === 'slides' && allSlides.length > 0) {
        if (currentSlideIndex < allSlides.length - 1) {
          currentSlideIndex++;
          // Guardar posición actual en SCORM
          setValue('cmi.core.lesson_location', currentSlideIndex.toString());
          commit();
          var container = document.getElementById('course-content');
          if (container) {
            renderSlide(allSlides[currentSlideIndex], container, allSlides);
            addSlideNavigation(container, allSlides);
          }
        }
      }
    },
    
    previousSlide: function() {
      if (courseData.courseData.navigationMode === 'slides' && allSlides.length > 0) {
        if (currentSlideIndex > 0) {
          currentSlideIndex--;
          // Guardar posición actual en SCORM
          setValue('cmi.core.lesson_location', currentSlideIndex.toString());
          commit();
          var container = document.getElementById('course-content');
          if (container) {
            renderSlide(allSlides[currentSlideIndex], container, allSlides);
            addSlideNavigation(container, allSlides);
          }
        }
      }
    },
    
    goToSlide: function(index) {
      if (courseData.courseData.navigationMode === 'slides' && allSlides.length > 0) {
        if (index >= 0 && index < allSlides.length) {
          currentSlideIndex = index;
          // Guardar posición actual en SCORM
          setValue('cmi.core.lesson_location', currentSlideIndex.toString());
          commit();
          var container = document.getElementById('course-content');
          if (container) {
            renderSlide(allSlides[currentSlideIndex], container, allSlides);
            addSlideNavigation(container, allSlides);
          }
        }
      }
    },
    
    // Page navigation method
    selectPage: function(pageId) {
      if (courseData.courseData.navigationMode === 'pages') {
        var container = document.getElementById('course-content');
        if (container) {
          selectPage(pageId, container);
          // Re-render navigation to update highlights
          var navTree = container.querySelector('.navigation-tree');
          if (navTree) {
            navTree.innerHTML = renderNavigationTree(courseData.courseData.plan, container);
          }
        }
      }
    },
    
    completeCourse: function() {
      completeCourse();
    },
    
    // Quiz functions
    handleQuizAnswer: function(radioInput, slideId) {
      var isCorrect = radioInput.getAttribute('data-correct') === 'true';
      var quizId = radioInput.name;
      var selectedIndex = parseInt(radioInput.value);
      
      // Guardar respuesta
      quizAnswers[slideId] = {
        answered: true,
        correct: isCorrect,
        selectedIndex: selectedIndex
      };
      
      // Guardar en SCORM suspend_data
      saveInteractions();
      
      // Deshabilitar todas las opciones del quiz
      var allRadios = document.querySelectorAll('input[name="' + quizId + '"]');
      allRadios.forEach(function(radio) {
        radio.disabled = true;
        var optionCard = radio.closest('.quiz-option-wrapper');
        if (optionCard) {
          optionCard.classList.add('disabled');
        }
      });
      
      // Marcar la opción seleccionada con clases CSS
      var selectedWrapper = radioInput.closest('.quiz-option-wrapper');
      if (selectedWrapper) {
        if (isCorrect) {
          selectedWrapper.classList.add('correct');
          var checkIcon = selectedWrapper.querySelector('.quiz-check-icon');
          if (checkIcon) {
            checkIcon.className = 'bi bi-check-circle-fill text-success ms-2';
          }
        } else {
          selectedWrapper.classList.add('incorrect');
          var checkIcon = selectedWrapper.querySelector('.quiz-check-icon');
          if (checkIcon) {
            checkIcon.className = 'bi bi-x-circle-fill text-danger ms-2';
          }
        }
      }
      
      // Mostrar explicación si existe
      var explanationDiv = document.getElementById('quiz-explanation-' + slideId);
      if (explanationDiv) {
        explanationDiv.classList.remove('d-none');
      }
      
      // Habilitar el botón siguiente
      var btnNext = document.getElementById('btn-next');
      if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
        btnNext.style.cursor = 'pointer';
        btnNext.style.pointerEvents = 'auto';
      }
      
      // Mostrar modal de feedback con Bootstrap
      setTimeout(function() {
        var modalId = isCorrect ? 'quiz-modal-correct-' + slideId : 'quiz-modal-incorrect-' + slideId;
        var modalElement = document.getElementById(modalId);
        
        if (modalElement && typeof bootstrap !== 'undefined') {
          var modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      }, 300);
    },
    
    getQuizAnswer: function(slideId) {
      return quizAnswers[slideId] || null;
    },
    
    restoreQuizState: function(slideId, state) {
      var quizId = 'quiz-' + slideId;
      var allRadios = document.querySelectorAll('input[name="' + quizId + '"]');
      
      allRadios.forEach(function(radio, index) {
        radio.disabled = true;
        var optionWrapper = radio.closest('.quiz-option-wrapper');
        if (optionWrapper) {
          optionWrapper.classList.add('disabled');
          
          if (index === state.selectedIndex) {
            if (state.correct) {
              optionWrapper.classList.add('correct');
              var checkIcon = optionWrapper.querySelector('.quiz-check-icon');
              if (checkIcon) {
                checkIcon.className = 'bi bi-check-circle-fill text-success ms-2';
              }
            } else {
              optionWrapper.classList.add('incorrect');
              var checkIcon = optionWrapper.querySelector('.quiz-check-icon');
              if (checkIcon) {
                checkIcon.className = 'bi bi-x-circle-fill text-danger ms-2';
              }
            }
          }
        }
      });
      
      // Mostrar explicación
      var explanationDiv = document.getElementById('quiz-explanation-' + slideId);
      if (explanationDiv) {
        explanationDiv.classList.remove('d-none');
      }
      
      // Habilitar botón siguiente
      var btnNext = document.getElementById('btn-next');
      if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
        btnNext.style.cursor = 'pointer';
        btnNext.style.pointerEvents = 'auto';
      }
    },
    
    closeQuizModal: function(slideId, type) {
      var modalId = 'quiz-modal-' + type + '-' + slideId;
      var modalElement = document.getElementById(modalId);
      
      if (modalElement && typeof bootstrap !== 'undefined') {
        var modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
        
        // Si es incorrecto, rehabilitar el quiz
        if (type === 'incorrect') {
          // Limpiar respuesta guardada
          delete quizAnswers[slideId];
          
          setTimeout(function() {
            var quizId = 'quiz-' + slideId;
            var allRadios = document.querySelectorAll('input[name="' + quizId + '"]');
            allRadios.forEach(function(radio) {
              radio.disabled = false;
              radio.checked = false;
              var optionWrapper = radio.closest('.quiz-option-wrapper');
              if (optionWrapper) {
                optionWrapper.classList.remove('disabled', 'correct', 'incorrect');
                var checkIcon = optionWrapper.querySelector('.quiz-check-icon');
                if (checkIcon) {
                  checkIcon.className = 'bi bi-circle quiz-check-icon ms-2';
                }
              }
            });
            
            // Deshabilitar botón siguiente nuevamente
            var btnNext = document.getElementById('btn-next');
            if (btnNext) {
              btnNext.disabled = true;
              btnNext.style.opacity = '0.5';
              btnNext.style.cursor = 'not-allowed';
            }
            
            // Ocultar explicación
            var explanationDiv = document.getElementById('quiz-explanation-' + slideId);
            if (explanationDiv) {
              explanationDiv.classList.add('d-none');
            }
          }, 300);
        }
      }
    },
    
    // Drag & Drop functions
    draggedElement: null,
    selectedItem: null,
    
    handleDragStart: function(event) {
      this.draggedElement = event.target;
      event.target.style.opacity = '0.5';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', event.target.innerHTML);
    },
    
    handleDragEnd: function(event) {
      event.target.style.opacity = '1';
    },
    
    handleDragOver: function(event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.dataTransfer.dropEffect = 'move';
      
      // Resaltar zona de drop
      var dropZone = event.currentTarget;
      if (dropZone.classList.contains('drop-zone')) {
        dropZone.classList.add('drop-zone-hover');
      }
      
      return false;
    },
    
    handleDragLeave: function(event) {
      var dropZone = event.currentTarget;
      if (dropZone.classList.contains('drop-zone')) {
        dropZone.classList.remove('drop-zone-hover');
      }
    },
    
    handleDrop: function(event, slideId) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      
      var dropZone = event.currentTarget;
      dropZone.classList.remove('drop-zone-hover');
      
      if (this.draggedElement) {
        // Mover el elemento a la zona de drop
        var dropItems = dropZone.querySelector('.drop-items');
        if (dropItems) {
          dropItems.appendChild(this.draggedElement);
          this.draggedElement.classList.remove('item-selected');
          
          // Ocultar placeholder
          var placeholder = dropZone.querySelector('.drop-zone-placeholder');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
        }
      }
      
      return false;
    },
    
    // Nuevos handlers para click/tap (mobile-first)
    handleItemClick: function(event, itemId, slideId) {
      var item = event.currentTarget;
      
      // Si el item ya está asignado a una categoría, no hacer nada
      if (item.closest('.drop-zone')) {
        return;
      }
      
      // Remover selección previa
      var allItems = document.querySelectorAll('.draggable-item');
      allItems.forEach(function(el) {
        el.classList.remove('item-selected');
      });
      
      // Seleccionar este item
      item.classList.add('item-selected');
      this.selectedItem = item;
    },
    
    handleDropZoneClick: function(event, slideId) {
      // Si no hay item seleccionado, no hacer nada
      if (!this.selectedItem) {
        return;
      }
      
      // Prevenir que se active si se hace click en un item dentro de la zona
      if (event.target.classList.contains('draggable-item') || 
          event.target.closest('.draggable-item')) {
        return;
      }
      
      var dropZone = document.getElementById('drop-zone-' + slideId);
      var dropItems = document.getElementById('drop-items-' + slideId);
      
      if (dropItems && this.selectedItem) {
        // Mover el item a la zona objetivo
        dropItems.appendChild(this.selectedItem);
        this.selectedItem.classList.remove('item-selected');
        
        // Ocultar placeholder
        var placeholder = dropZone.querySelector('.drop-zone-placeholder');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
        
        this.selectedItem = null;
      }
    },
    
    checkDragDropAnswer: function(slideId) {
      var slide = allSlides.find(function(s) { return s.id === slideId; });
      if (!slide || !slide.content) return;
      
      var items = slide.content.items || [];
      var requiredCount = slide.content.requiredCount || 3;
      var dropZone = document.getElementById('drop-items-' + slideId);
      var itemsInDropZone = dropZone ? dropZone.querySelectorAll('.draggable-item') : [];
      
      var allCorrect = true;
      var correctCount = 0;
      var incorrectCount = 0;
      
      // Verificar items en la caja
      itemsInDropZone.forEach(function(element) {
        var isCorrect = element.getAttribute('data-correct') === 'true';
        element.classList.remove('border-green-500', 'border-red-500', 'bg-green-50', 'bg-red-50');
        
        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
          allCorrect = false;
        }
      });
      
      // Verificar que tenga exactamente el número requerido y todos correctos
      if (itemsInDropZone.length !== requiredCount || incorrectCount > 0 || correctCount !== requiredCount) {
        allCorrect = false;
      }
      
      // Marcar visualmente
      itemsInDropZone.forEach(function(element) {
        var isCorrect = element.getAttribute('data-correct') === 'true';
        if (allCorrect) {
          element.classList.add('border-green-500', 'bg-green-50');
        } else {
          if (isCorrect) {
            element.classList.add('border-green-500', 'bg-green-50');
          } else {
            element.classList.add('border-red-500', 'bg-red-50');
          }
        }
      });
      
      // Deshabilitar drag después de verificar
      var draggableItems = document.querySelectorAll('.draggable-item');
      draggableItems.forEach(function(item) {
        item.setAttribute('draggable', 'false');
        item.style.cursor = 'default';
      });
      
      // Guardar respuesta
      quizAnswers[slideId] = {
        answered: true,
        correct: allCorrect
      };
      
      // Guardar en SCORM suspend_data
      saveInteractions();
      
      // Mostrar explicación
      var explanationDiv = document.getElementById('dragdrop-explanation-' + slideId);
      if (explanationDiv) {
        explanationDiv.classList.remove('d-none');
      }
      
      // Habilitar botón siguiente
      var btnNext = document.getElementById('btn-next');
      if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
        btnNext.style.cursor = 'pointer';
        btnNext.style.pointerEvents = 'auto';
      }
      
      // Mostrar modal de feedback
      setTimeout(function() {
        var modalId = allCorrect ? 'dragdrop-modal-correct-' + slideId : 'dragdrop-modal-incorrect-' + slideId;
        var modalElement = document.getElementById(modalId);
        
        console.log('Mostrando modal:', modalId, 'Elemento:', modalElement, 'Bootstrap:', typeof bootstrap);
        
        if (modalElement) {
          if (typeof bootstrap !== 'undefined') {
            var modal = new bootstrap.Modal(modalElement);
            modal.show();
          } else {
            console.error('Bootstrap no está disponible');
          }
        } else {
          console.error('No se encontró el modal:', modalId);
        }
      }, 300);
    },
    
    closeDragDropModal: function(slideId, type) {
      var modalId = 'dragdrop-modal-' + type + '-' + slideId;
      var modalElement = document.getElementById(modalId);
      
      if (modalElement && typeof bootstrap !== 'undefined') {
        var modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
        
        // Si es incorrecto, reiniciar el drag & drop
        if (type === 'incorrect') {
          delete quizAnswers[slideId];
          
          setTimeout(function() {
            // Mover todos los items de vuelta al contenedor original
            var slide = allSlides.find(function(s) { return s.id === slideId; });
            if (slide && slide.content && slide.content.items) {
              var itemsContainer = document.getElementById('items-container-' + slideId);
              var dropZone = document.getElementById('drop-zone-' + slideId);
              if (itemsContainer) {
                slide.content.items.forEach(function(item) {
                  var element = document.querySelector('[data-id="' + item.id + '"]');
                  if (element) {
                    element.classList.remove('border-green-500', 'border-red-500', 'bg-green-50', 'bg-red-50');
                    element.setAttribute('draggable', 'true');
                    element.style.cursor = 'move';
                    itemsContainer.appendChild(element);
                  }
                });
                
                // Mostrar el placeholder de nuevo
                if (dropZone) {
                  var placeholder = dropZone.querySelector('.drop-zone-placeholder');
                  if (placeholder) {
                    placeholder.style.display = 'block';
                  }
                }
              }
            }
            
            // Deshabilitar botón siguiente
            var btnNext = document.getElementById('btn-next');
            if (btnNext) {
              btnNext.disabled = true;
              btnNext.style.opacity = '0.5';
              btnNext.style.cursor = 'not-allowed';
            }
            
            // Ocultar explicación
            var explanationDiv = document.getElementById('dragdrop-explanation-' + slideId);
            if (explanationDiv) {
              explanationDiv.classList.add('d-none');
            }
          }, 300);
        }
      }
    },
    
    // InfoCards Modal functions
    openInfoCardModal: function(slideId, cardIndex) {
      var modalId = 'infocard-modal-' + slideId + '-' + cardIndex;
      var modalElement = document.getElementById(modalId);
      
      console.log('Abriendo modal de info card:', modalId, 'Elemento:', modalElement);
      
      if (modalElement) {
        if (typeof bootstrap !== 'undefined') {
          var modal = new bootstrap.Modal(modalElement);
          modal.show();
        } else {
          console.error('Bootstrap no está disponible');
        }
      } else {
        console.error('No se encontró el modal:', modalId);
      }
    },
    
    closeInfoCardModal: function(slideId, cardIndex) {
      var modalId = 'infocard-modal-' + slideId + '-' + cardIndex;
      var modalElement = document.getElementById(modalId);
      
      if (modalElement && typeof bootstrap !== 'undefined') {
        var modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    },
    
    // Expose SCORM functions directly for use in course.html
    setValue: setValue,
    getValue: getValue,
    commit: commit,
    
    // Expose SCORM functions for debugging
    scorm: {
      getValue: getValue,
      setValue: setValue,
      commit: commit,
      terminate: terminate,
      api: scormAPI
    }
  };
})();
