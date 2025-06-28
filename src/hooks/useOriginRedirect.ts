
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type OriginType = 'chat' | 'community' | null;

export const useOriginRedirect = () => {
  const navigate = useNavigate();

  const setOrigin = (origin: OriginType) => {
    if (origin) {
      localStorage.setItem('login_origin', origin);
    } else {
      localStorage.removeItem('login_origin');
    }
  };

  const getOrigin = (): OriginType => {
    return localStorage.getItem('login_origin') as OriginType;
  };

  const clearOrigin = () => {
    localStorage.removeItem('login_origin');
  };

  const redirectAfterLogin = () => {
    const origin = getOrigin();
    
    if (origin === 'chat') {
      clearOrigin();
      navigate('/', { state: { openChat: true } });
    } else if (origin === 'community') {
      clearOrigin();
      navigate('/comunidade');
    } else {
      navigate('/comunidade');
    }
  };

  return {
    setOrigin,
    getOrigin,
    clearOrigin,
    redirectAfterLogin
  };
};
