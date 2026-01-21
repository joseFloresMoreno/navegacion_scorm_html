
/*
SCORM 1.2 API Shim for standalone testing - ONLY loads if no real LMS API is present
*/
(function() {
  'use strict';
  
  // Check extensively for any existing SCORM API
  function findExistingAPI() {
    // Check current window for SCORM 1.2
    if (window.API) {
      return true;
    }
    
    // Check parent windows
    let parentWindow = window.parent;
    let searchDepth = 0;
    
    while (parentWindow && parentWindow !== window && searchDepth < 10) {
      if (parentWindow.API) {
        return true;
      }
      try {
        parentWindow = parentWindow.parent;
      } catch (e) {
        break;
      }
      searchDepth++;
    }
    
    // Check top window
    try {
      if (window.top && window.top !== window && window.top.API) {
        return true;
      }
    } catch (e) {
      // Cross-origin access denied
    }
    
    // Check for Moodle-specific locations
    try {
      if (window.parent && window.parent.frames) {
        const frameNames = ['scorm_object', 'scorm_api', 'API', 'api'];
        for (let i = 0; i < frameNames.length; i++) {
          const frame = window.parent.frames[frameNames[i]];
          if (frame && frame.API) {
            return true;
          }
        }
      }
    } catch (e) {
      // Frame access error
    }
    
    return false;
  }
  
  // Only create shim if NO real SCORM API exists anywhere
  if (findExistingAPI()) {
    console.log('✅ [SCORM 1.2 Shim] Real SCORM API detected - skipping shim creation');
    return;
  }
  
  console.log('⚠️ [SCORM 1.2 Shim] No SCORM API found anywhere - creating minimal shim for testing');
  
  const Scorm12ApiShim = {
    data: {},
    initialized: false,
    terminated: false,
    
    LMSInitialize: function(param) {
      if (this.initialized) {
        this.setError('101');
        return 'false';
      }
      this.initialized = true;
      this.terminated = false;
      this.setError('0');
      this.loadFromStorage();
      return 'true';
    },
    
    LMSFinish: function(param) {
      if (!this.initialized || this.terminated) {
        this.setError('301');
        return 'false';
      }
      this.saveToStorage();
      this.terminated = true;
      this.initialized = false;
      this.setError('0');
      return 'true';
    },
    
    LMSGetValue: function(element) {
      if (!this.initialized || this.terminated) {
        this.setError('301');
        return '';
      }
      
      const value = this.data[element] || this.getDefaultValue(element);
      this.setError('0');
      return value;
    },
    
    LMSSetValue: function(element, value) {
      if (!this.initialized || this.terminated) {
        this.setError('301');
        return 'false';
      }
      
      this.data[element] = value;
      this.setError('0');
      return 'true';
    },
    
    LMSCommit: function(param) {
      if (!this.initialized || this.terminated) {
        this.setError('301');
        return 'false';
      }
      
      this.saveToStorage();
      this.setError('0');
      return 'true';
    },
    
    LMSGetLastError: function() {
      return this.lastError || '0';
    },
    
    LMSGetErrorString: function(errorCode) {
      const errors = {
        '0': 'No error',
        '101': 'General exception',
        '301': 'Not initialized'
      };
      return errors[errorCode] || 'Unknown error';
    },
    
    LMSGetDiagnostic: function(errorCode) {
      return this.LMSGetErrorString(errorCode);
    },
    
    setError: function(errorCode) {
      this.lastError = errorCode;
    },
    
    getDefaultValue: function(element) {
      const defaults = {
        'cmi.core.lesson_status': 'not attempted',
        'cmi.core.student_id': 'test_student',
        'cmi.core.student_name': 'Test Student',
        'cmi.core.lesson_location': '',
        'cmi.core.score.raw': '',
        'cmi.core.score.min': '',
        'cmi.core.score.max': '',
        'cmi.core.session_time': '0000:00:00.00'
      };
      return defaults[element] || '';
    },
    
    loadFromStorage: function() {
      try {
        const savedData = sessionStorage.getItem('scorm12_test_data');
        if (savedData) {
          this.data = JSON.parse(savedData);
        }
      } catch (error) {
        console.warn('[SCORM 1.2 Shim] Could not load SCORM data from sessionStorage:', error);
      }
    },
    
    saveToStorage: function() {
      try {
        sessionStorage.setItem('scorm12_test_data', JSON.stringify(this.data));
      } catch (error) {
        console.warn('[SCORM 1.2 Shim] Could not save SCORM data to sessionStorage:', error);
      }
    }
  };
  
  // Only set global API if none exists
  window.API = Scorm12ApiShim;
  
  console.log('📝 [SCORM 1.2 Shim] SCORM 1.2 API Shim created for testing only');
})();
