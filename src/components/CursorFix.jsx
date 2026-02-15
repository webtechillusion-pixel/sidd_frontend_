import { useEffect } from 'react';

const CursorFix = () => {
  useEffect(() => {
    // Force cursor to be visible and working
    const fixCursor = () => {
      // Remove any cursor blocking styles
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      
      // Add global cursor fix styles
      const existingStyle = document.getElementById('cursor-fix-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'cursor-fix-styles';
      style.textContent = `
        * {
          cursor: auto !important;
          pointer-events: auto !important;
        }
        
        button, 
        a, 
        [role="button"], 
        [onclick],
        .cursor-pointer {
          cursor: pointer !important;
        }
        
        input, 
        textarea, 
        [contenteditable] {
          cursor: text !important;
        }
        
        .cursor-not-allowed {
          cursor: not-allowed !important;
        }
        
        .cursor-wait {
          cursor: wait !important;
        }
        
        .cursor-move {
          cursor: move !important;
        }
        
        .cursor-grab {
          cursor: grab !important;
        }
        
        .cursor-grabbing {
          cursor: grabbing !important;
        }
      `;
      
      document.head.appendChild(style);
      
      // Force repaint
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    };
    
    // Apply fix immediately
    fixCursor();
    
    // Apply fix after a short delay to ensure it overrides other styles
    const timeout = setTimeout(fixCursor, 100);
    
    // Apply fix on window focus (in case something else interferes)
    const handleFocus = () => fixCursor();
    window.addEventListener('focus', handleFocus);
    
    // Cleanup
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('focus', handleFocus);
      const style = document.getElementById('cursor-fix-styles');
      if (style) {
        style.remove();
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default CursorFix;