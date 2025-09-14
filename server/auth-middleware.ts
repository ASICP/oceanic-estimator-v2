import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Extend the Request type to include user information
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    isAuthenticated?: boolean;
    csrfToken?: string;
  }
}

interface AuthRequest extends Request {
  userId?: string;
  csrfToken?: string;
}

// Simple in-memory user store for demo purposes
// In production, this would be stored in a database
const users = new Map<string, { id: string; username: string; passwordHash: string; }>();

// Default admin user - in production, this should be created through a proper registration process
const initializeAdminUser = async () => {
  if (!users.has('admin')) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    users.set('admin', {
      id: 'admin',
      username: 'admin',
      passwordHash
    });
  }
};

// Initialize admin user on startup
initializeAdminUser();

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return jwt.sign(
    { type: 'csrf', timestamp: Date.now() },
    process.env.SESSION_SECRET!,
    { expiresIn: '1h' }
  );
};

// Validate CSRF token
export const validateCSRFToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
    return decoded.type === 'csrf';
  } catch {
    return false;
  }
};

// Authentication middleware for GitHub routes
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check if user is authenticated via session
  if (req.session?.isAuthenticated && req.session?.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // Check for API token in headers (alternative auth method)
  const apiToken = req.headers.authorization?.replace('Bearer ', '');
  if (apiToken) {
    try {
      const decoded = jwt.verify(apiToken, process.env.SESSION_SECRET!) as any;
      if (decoded.userId && users.has(decoded.userId)) {
        req.userId = decoded.userId;
        return next();
      }
    } catch (error) {
      // Invalid token, continue to unauthorized response
    }
  }

  return res.status(401).json({ 
    error: 'Authentication required',
    message: 'You must be logged in to access GitHub integration features.'
  });
};

// CSRF protection middleware for state-changing operations
export const requireCSRF = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Only check CSRF for POST, PUT, DELETE requests
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'] as string || req.body.csrfToken;
  
  if (!csrfToken || !validateCSRFToken(csrfToken)) {
    return res.status(403).json({ 
      error: 'CSRF token missing or invalid',
      message: 'Request rejected for security reasons.'
    });
  }

  req.csrfToken = csrfToken;
  next();
};

// Login endpoint handler
export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Username and password are required.'
      });
    }

    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect.'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect.'
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    // Generate CSRF token
    const csrfToken = generateCSRFToken();
    req.session.csrfToken = csrfToken;

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username },
      csrfToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred during login.'
    });
  }
};

// Logout endpoint handler
export const logoutHandler = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Logout failed',
        message: 'An error occurred during logout.'
      });
    }
    
    res.clearCookie('sessionId');
    res.json({ message: 'Logout successful' });
  });
};

// Get current user info
export const getCurrentUser = (req: AuthRequest, res: Response) => {
  if (!req.session?.isAuthenticated || !req.session?.userId) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      message: 'User is not logged in.'
    });
  }

  const user = users.get(req.session.userId);
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found',
      message: 'Authenticated user not found.'
    });
  }

  res.json({
    user: { id: user.id, username: user.username },
    csrfToken: req.session.csrfToken || generateCSRFToken()
  });
};

// Generate API token for programmatic access
export const generateApiToken = (req: AuthRequest, res: Response) => {
  if (!req.session?.isAuthenticated || !req.session?.userId) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      message: 'User is not logged in.'
    });
  }

  try {
    const token = jwt.sign(
      { userId: req.session.userId, type: 'api' },
      process.env.SESSION_SECRET!,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'API token generated successfully',
      token,
      expiresIn: '30 days'
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ 
      error: 'Token generation failed',
      message: 'An error occurred while generating the API token.'
    });
  }
};