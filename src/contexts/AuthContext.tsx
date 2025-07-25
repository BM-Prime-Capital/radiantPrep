'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthState, ChildInformation, ParentUser, UserRole, Subject, Grade, AssessmentResult } from '@/lib/types';

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


  // Ajoutez ce useEffect juste après les autres useEffect existants
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Ne réagir qu'aux changements de authState
      if (event.key === 'authState') {
        try {
          if (event.newValue) {
            const newAuthState = JSON.parse(event.newValue) as AuthState;
            setAuthState(newAuthState);
          } else {
            // Si authState a été supprimé, réinitialiser
            setAuthState(initialState);
          }
        } catch (error) {
          console.error("Failed to parse updated auth state", error);
        }
      }
    };

    // Écouter les changements de localStorage depuis d'autres onglets
    window.addEventListener('storage', handleStorageChange);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Pas de dépendances pour que cela ne s'exécute qu'une fois



  useEffect(() => {
    try {
      const storedAuthState = localStorage.getItem('authState');
      if (storedAuthState) {
        const parsedState: AuthState = JSON.parse(storedAuthState);
        // Validate parsed state structure if necessary
        if (parsedState.isAuthenticated && parsedState.user && parsedState.role) {
            setAuthState({...parsedState, isLoading: false });
        } else {
            setAuthState({...initialState, isLoading: false });
        }
      } else {
        setAuthState({...initialState, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to parse auth state from localStorage", error);
      setAuthState({...initialState, isLoading: false });
      localStorage.removeItem('authState'); // Clear corrupted state
    }
  }, []);

  const persistAuthState = useCallback((state: AuthState) => {
    try {
      localStorage.setItem('authState', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to persist auth state to localStorage", error);
    }
  }, []);

  const loginParent = (user: ParentUser, childInfo?: ChildInformation) => {
    // In a real app, parent would be authenticated via Firebase.
    // Child info might be linked or added here.
    const newState: AuthState = {
      isAuthenticated: true,
      user: childInfo || user, // If childInfo is provided, it implies parent just registered child
      role: childInfo ? 'CHILD' : 'PARENT', // If childInfo, means code generated, simulate child login
      isLoading: false,
    };
    setAuthState(newState);
    persistAuthState(newState);
  };
const loginChild = (childInfo: ChildInformation) => {
  const newState: AuthState = {
    isAuthenticated: true,
    user: childInfo,
    role: 'CHILD', // Doit être en MAJUSCULES
    isLoading: false,
  };
  
  console.log('Setting auth state:', newState);
  setAuthState(newState);
  
  // Persistez immédiatement et forcez le stockage
  localStorage.setItem('authState', JSON.stringify(newState));
  localStorage.setItem('lastLogin', Date.now().toString());
};

  const logout = useCallback(async () => {
    try {
      // Appel à l'API de logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Nettoyage local quoi qu'il arrive
      const newState: AuthState = {...initialState, isLoading: false};
      setAuthState(newState);
      setAssessmentResultState(null);
      localStorage.removeItem('authState');
      localStorage.removeItem('assessmentResult');

      // Redirection vers la page d'accueil
      if (typeof window !== 'undefined') {
  // Déclencher en différé pour éviter les conflits d'import SSR
  setTimeout(() => {
    window.location.href = '/';
  }, 50);
}
    }
  }, []);
  
  const updateChildInfo = (info: Partial<ChildInformation>) => {
    setAuthState(prevState => {
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

  useEffect(() => {
    const storedResult = localStorage.getItem('assessmentResult');
    if (storedResult) {
      try {
        setAssessmentResultState(JSON.parse(storedResult));
      } catch (e) {
        localStorage.removeItem('assessmentResult');
      }
    }
  }, []);


  return (
    <AuthContext.Provider value={{ ...authState, loginParent, loginChild, logout, updateChildInfo, assessmentResult, setAssessmentResult }}>
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
