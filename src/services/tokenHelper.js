// JWT token helper functions
export const tokenHelper = {
  // Parse JWT token
  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired(token) { 
    if (!token) return true;
    
    try {
      const decoded = this.parseJwt(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Get user role from token
  getRoleFromToken(token) {
    try {
      const decoded = this.parseJwt(token);
      return decoded?.role || null;
    } catch (error) {
      return null;
    }
  },

  // Get user ID from token
  getUserIdFromToken(token) {
    try {
      const decoded = this.parseJwt(token);
      return decoded?.id || null;
    } catch (error) {
      return null;
    }
  },

  // Get token expiry time
  getTokenExpiry(token) {
    try {
      const decoded = this.parseJwt(token);
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  },

  // Validate token structure
  isValidToken(token) {
    if (!token || typeof token !== 'string') return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      const decoded = this.parseJwt(token);
      return decoded && typeof decoded === 'object';
    } catch (error) {
      return false;
    }
  }
};

export default tokenHelper;