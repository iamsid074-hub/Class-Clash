/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};

const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const isUrlValid =
  metaEnv.VITE_SUPABASE_URL &&
  !metaEnv.VITE_SUPABASE_URL.includes('your-supabase-project') &&
  !metaEnv.VITE_SUPABASE_URL.includes('placeholder');

const isKeyValid =
  metaEnv.VITE_SUPABASE_ANON_KEY &&
  !metaEnv.VITE_SUPABASE_ANON_KEY.includes('your-supabase-anon-key') &&
  !metaEnv.VITE_SUPABASE_ANON_KEY.includes('placeholder');

export const isSupabaseConfigured = Boolean(isUrlValid && isKeyValid);

export const supabase: SupabaseClient = createClient(
  isUrlValid ? metaEnv.VITE_SUPABASE_URL : 'https://placeholder.supabase.co',
  isKeyValid ? metaEnv.VITE_SUPABASE_ANON_KEY : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  racerTag: string;
  avatar: string;
  matchesPlayed: number;
  leaderboardPoints: number;
  winRate: number;
  isVerified: boolean;
}

export class SupabaseAuthService {
  /**
   * Helper to fetch all registered accounts from local storage
   */
  private static getLocalUsers(): Record<string, { pass: string; profile: UserProfile }> {
    try {
      const stored = localStorage.getItem('clasha_registered_users');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Register a new racer with Email, Password, & Username
   */
  public static async signUp(email: string, pass: string, displayName: string) {
    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      const users = this.getLocalUsers();
      if (users[cleanEmail]) {
        return { data: null, error: { message: 'ACCOUNT ALREADY EXISTS! PLEASE SIGN IN INSTEAD.' }, profile: null };
      }

      const mockId = `racer_${Date.now()}`;
      const profile: UserProfile = {
        id: mockId,
        email: cleanEmail,
        displayName: displayName || cleanEmail.split('@')[0].toUpperCase(),
        racerTag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
        avatar: 'avatar_cyber',
        matchesPlayed: 0,
        leaderboardPoints: 0,
        winRate: 0,
        isVerified: true,
      };

      users[cleanEmail] = { pass, profile };
      localStorage.setItem('clasha_registered_users', JSON.stringify(users));
      localStorage.setItem('class_clash_session', JSON.stringify(profile));
      return { data: { user: { id: mockId, email: cleanEmail } }, error: null, profile };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            display_name: displayName,
            racer_tag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
          },
        },
      });

      if (error) return { data: null, error: { message: error.message }, profile: null };

      const profile: UserProfile = {
        id: data.user?.id || `racer_${Date.now()}`,
        email: cleanEmail,
        displayName: displayName || 'RACER_ONE',
        racerTag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
        avatar: 'avatar_cyber',
        matchesPlayed: 0,
        leaderboardPoints: 0,
        winRate: 0,
        isVerified: true,
      };

      await supabase.from('profiles').upsert(profile);
      localStorage.setItem('class_clash_session', JSON.stringify(profile));
      return { data, error: null, profile };
    } catch (fetchErr: any) {
      return { data: null, error: { message: fetchErr.message || 'REGISTRATION FAILED' }, profile: null };
    }
  }

  /**
   * Sign In existing racer - STRICT CHECK: Account MUST be created first!
   */
  public static async signIn(email: string, pass: string) {
    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      const users = this.getLocalUsers();
      const account = users[cleanEmail];

      if (!account) {
        return {
          data: null,
          error: { message: 'No account found with this email. Please create an account first.' },
          profile: null,
        };
      }

      if (account.pass !== pass) {
        return {
          data: null,
          error: { message: 'Incorrect password. Please check your password and try again.' },
          profile: null,
        };
      }

      localStorage.setItem('class_clash_session', JSON.stringify(account.profile));
      return { data: { user: { id: account.profile.id, email: cleanEmail } }, error: null, profile: account.profile };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message.includes('Invalid') ? 'Account not found or incorrect password. Please create an account first.' : error.message },
          profile: null,
        };
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const profile: UserProfile = profileData || {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        displayName: data.user.user_metadata?.display_name || cleanEmail.split('@')[0],
        racerTag: data.user.user_metadata?.racer_tag || '#CC-RACER-948',
        avatar: 'avatar_cyber',
        matchesPlayed: 14,
        leaderboardPoints: 85,
        winRate: 68,
        isVerified: true,
      };

      localStorage.setItem('class_clash_session', JSON.stringify(profile));
      return { data, error: null, profile };
    } catch (fetchErr: any) {
      return {
        data: null,
        error: { message: 'AUTHENTICATION ERROR! PLEASE CHECK YOUR CREDENTIALS OR CREATE AN ACCOUNT.' },
        profile: null,
      };
    }
  }

  /**
   * Sign In with Google OAuth
   */
  public static async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      const mockProfile: UserProfile = {
        id: `google_user_${Date.now()}`,
        email: 'google.user@gmail.com',
        displayName: 'Google Racer',
        racerTag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
        avatar: 'avatar_cyber',
        matchesPlayed: 1,
        leaderboardPoints: 50,
        winRate: 100,
        isVerified: true,
      };
      localStorage.setItem('class_clash_session', JSON.stringify(mockProfile));
      return { data: null, error: null, profile: mockProfile };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      return { data: null, error: { message: error.message }, profile: null };
    }

    return { data, error: null, profile: null };
  }

  /**
   * Sign out current racer
   */
  public static async signOut() {
    localStorage.removeItem('class_clash_session');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  }

  /**
   * Restore existing session
   */
  public static async getSavedSession(): Promise<UserProfile | null> {
    const saved = localStorage.getItem('class_clash_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }

    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .single();

        const profile: UserProfile = profileData || {
          id: u.id,
          email: u.email || '',
          displayName: u.user_metadata?.full_name || u.user_metadata?.name || (u.email ? u.email.split('@')[0] : 'Google Racer'),
          racerTag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
          avatar: 'avatar_cyber',
          matchesPlayed: 0,
          leaderboardPoints: 0,
          winRate: 0,
          isVerified: true,
        };

        localStorage.setItem('class_clash_session', JSON.stringify(profile));
        return profile;
      }
    }
    return null;
  }
}
