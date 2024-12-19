import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../store/authSlice';

const AuthRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessed, setIsProcessed] = useState(false); // 처리 상태 확인

  useEffect(() => {
    if (isProcessed) return; // 이미 처리되었으면 실행하지 않음

    const processTokens = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access');
      const refreshToken = urlParams.get('refresh');
      const memberId = urlParams.get('memberId');

      console.log(accessToken);
      console.log(refreshToken);
      console.log(memberId);

      if (accessToken && refreshToken) {
        console.log('왜 없는데');
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('memberId', memberId);
        dispatch(setTokens({ accessToken, refreshToken }));
        navigate('/', { replace: true });
      } else {
        console.error('토큰 값이 없습니다.');
      }

      setIsProcessed(true); // 처리 완료 상태로 변경
    };

    processTokens();
  }, [dispatch, navigate, isProcessed]);

  return <div>로그인 처리 중...</div>;
};

export default AuthRedirect;
