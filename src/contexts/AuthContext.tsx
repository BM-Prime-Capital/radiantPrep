'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  AuthState,
  ChildInformation,
  ParentUser,
  UserRole,
  Subject,
  Grade,
  AssessmentResult,
} from '@/lib/types';

interface AuthContextType extends AuthState {
  loginParent: (user: ParentUser, childInfo?: ChildInformation) => void;
  loginChild: (childInfo: ChildInformation) => void;
  logout: () => void;
  updateChildInfo: (info: Partial<ChildInformation>) => void;
  setAssessmentResult: (result: AssessmentResult | null) => void;
  assessmentResult: AssessmentResult | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [assessmentResult, setAssessmentResultState] = useState<AssessmentResult | null>(null);

  // Synchronisation multi-onglets: réagir aux changements de localStorage.authState
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authState') {
        try {
          if (event.newValue) {
            const newAuthState = JSON.parse(event.newValue) as AuthState;
            setAuthState(newAuthState);
          } else {
            setAuthState(initialState);
          }
        } catch (error) {
          console.error('Failed to parse updated auth state', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialisation: vérifie la session serveur, puis fallback localStorage en cas d'erreur
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      // rester en isLoading:true tant que la vérif n'est pas finie
      setAuthState((s) => ({ ...s, isLoading: true }));

      try {
        const res = await fetch('/api/auth/check-session', {
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json();
        if (cancelled) return;

        if (!data?.valid) {
          // Session invalide -> purge côté client
          localStorage.removeItem('authState');
          setAuthState({ ...initialState, isLoading: false });
          return;
        }

        // Session valide -> source de vérité = serveur
        const newState: AuthState = {
          isAuthenticated: true,
          user: data.user ?? null,
          role: (data.role as UserRole) ?? null, // 'PARENT' | 'CHILD' | null
          isLoading: false,
        };
        setAuthState(newState);
        localStorage.setItem('authState', JSON.stringify(newState));
      } catch (e) {
        console.error('check-session failed', e);
        // Fallback: tenter localStorage proprement
        try {
          const stored = localStorage.getItem('authState');
          if (stored) {
            const parsed: AuthState = JSON.parse(stored);
            setAuthState({ ...parsed, isLoading: false });
          } else {
            setAuthState({ ...initialState, isLoading: false });
          }
        } catch {
          localStorage.removeItem('authState');
          setAuthState({ ...initialState, isLoading: false });
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistAuthState = useCallback((state: AuthState) => {
    try {
      localStorage.setItem('authState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist auth state to localStorage', error);
    }
  }, []);

  const loginParent = (user: ParentUser, childInfo?: ChildInformation) => {
    const newState: AuthState = {
      isAuthenticated: true,
      user: childInfo || user,
      role: (childInfo ? 'CHILD' : 'PARENT') as UserRole,
      isLoading: false,
    };
    setAuthState(newState);
    persistAuthState(newState);
  };

  const loginChild = async (childInfo: ChildInformation) => {
  // 1) créer la "session" côté serveur (cookie)
  try {
    await fetch('/api/auth/login-child', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(childInfo), // optionnel
    });
  } catch (e) {
    console.error('Failed to create child session', e);
  }

  // 2) ensuite seulement, mettre l’état client
  const newState: AuthState = {
    isAuthenticated: true,
    user: childInfo,
    role: 'CHILD',
    isLoading: false,
  };
  setAuthState(newState);
  localStorage.setItem('authState', JSON.stringify(newState));
  localStorage.setItem('lastLogin', Date.now().toString());
};


  // const loginChild = (childInfo: ChildInformation) => {
  //   const newState: AuthState = {
  //     isAuthenticated: true,
  //     user: childInfo,
  //     role: 'CHILD',
  //     isLoading: false,
  //   };

  //   console.log('Setting auth state:', newState);
  //   setAuthState(newState);

  //   // Persistance immédiate (garde lastLogin si tu t'en sers ailleurs)
  //   localStorage.setItem('authState', JSON.stringify(newState));
  //   localStorage.setItem('lastLogin', Date.now().toString());
  // };

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin', // ou 'include'
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      const newState: AuthState = { ...initialState, isLoading: false };
      setAuthState(newState);
      setAssessmentResultState(null);
      localStorage.removeItem('authState');
      localStorage.removeItem('assessmentResult');

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/';
        }, 50);
      }
    }
  }, []);

  const updateChildInfo = (info: Partial<ChildInformation>) => {
    setAuthState((prevState) => {
      if (prevState.role === 'CHILD' && prevState.user) {
        const updatedUser = { ...prevState.user, ...info } as ChildInformation;
        const newState = { ...prevState, user: updatedUser };
        persistAuthState(newState);
        return newState;
      }
      return prevState;
    });
  };

  const setAssessmentResult = (result: AssessmentResult | null) => {
    setAssessmentResultState(result);
    if (result) {
      localStorage.setItem('assessmentResult', JSON.stringify(result));
    } else {
      localStorage.removeItem('assessmentResult');
    }
  };

  // Récupération initiale du dernier assessmentResult stocké
  useEffect(() => {
    const storedResult = localStorage.getItem('assessmentResult');
    if (storedResult) {
      try {
        setAssessmentResultState(JSON.parse(storedResult));
      } catch {
        localStorage.removeItem('assessmentResult');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginParent,
        loginChild,
        logout,
        updateChildInfo,
        assessmentResult,
        setAssessmentResult,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
