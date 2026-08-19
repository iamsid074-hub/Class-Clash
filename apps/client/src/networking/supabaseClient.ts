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
   * Local fallback helper to create & persist session
   */
  private static createLocalSession(email: string, displayName?: string): UserProfile {
    const mockId = `racer_${Date.now()}`;
    const profile: UserProfile = {
      id: mockId,
      email,
      displayName: displayName || email.split('@')[0].toUpperCase(),
      racerTag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
      avatar: 'avatar_cyber',
      matchesPlayed: 14,
      leaderboardPoints: 85,
      winRate: 68,
      isVerified: true,
    };
    localStorage.setItem('class_clash_session', JSON.stringify(profile));
    return profile;
  }

  /**
   * Register a new racer with Email, Password, & Username
   */
  public static async signUp(email: string, pass: string, displayName: string) {
    if (!isSupabaseConfigured) {
      const profile = this.createLocalSession(email, displayName);
      return { data: { user: { id: profile.id, email } }, error: null, profile };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            display_name: displayName,
            racer_tag: `#CC-RACER-${Math.floor(Math.random() * 899 + 100)}`,
          },
        },
      });

      if (error) return { data: null, error, profile: null };

      const profile: UserProfile = {
        id: data.user?.id || `racer_${Date.now()}`,
        email,
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
    } catch (fetchErr) {
      console.warn('Supabase fetch failed, falling back to local session:', fetchErr);
      const profile = this.createLocalSession(email, displayName);
      return { data: { user: { id: profile.id, email } }, error: null, profile };
    }
  }

  /**
   * Sign In existing racer
   */
  public static async signIn(email: string, pass: string) {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('class_clash_session');
      if (saved) {
        try {
          const profile = JSON.parse(saved);
          return { data: { user: { id: profile.id, email } }, error: null, profile };
        } catch (e) {
          // ignore
        }
      }
      const profile = this.createLocalSession(email);
      return { data: { user: { id: profile.id, email } }, error: null, profile };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) return { data: null, error, profile: null };

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const profile: UserProfile = profileData || {
        id: data.user.id,
        email: data.user.email || email,
        displayName: data.user.user_metadata?.display_name || email.split('@')[0],
        racerTag: data.user.user_metadata?.racer_tag || '#CC-RACER-948',
        avatar: 'avatar_cyber',
        matchesPlayed: 14,
        leaderboardPoints: 85,
        winRate: 68,
        isVerified: true,
      };

      localStorage.setItem('class_clash_session', JSON.stringify(profile));
      return { data, error: null, profile };
    } catch (fetchErr) {
      console.warn('Supabase fetch failed, falling back to local session:', fetchErr);
      const profile = this.createLocalSession(email);
      return { data: { user: { id: profile.id, email } }, error: null, profile };
    }
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
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileData) return profileData;
      }
    }
    return null;
  }
}
