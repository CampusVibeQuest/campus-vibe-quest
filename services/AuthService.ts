import { DataService } from './DataService';

interface User {
  uid: string;
  name: string;
  email: string;
  password: string;
  gender: string;
  interested_in: string;
  department: string;
  year: string;
  profile_pic: string;
  verified: boolean;
  paid: boolean;
  banned: boolean;
  my_posts: string[];
  matches: string[];
}

export class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const users = await DataService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user && !user.banned) {
        // Remove password from returned user object for security
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    // In a real app, this would clear server sessions
    // For now, we just return success
    return Promise.resolve();
  }

  static async getCurrentUser(): Promise<User | null> {
    // This would typically validate a session token
    // For now, we return null (not implemented)
    return null;
  }
}