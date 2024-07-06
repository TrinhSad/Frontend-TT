import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const GoogleLoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            // console.log('urlParams:', urlParams.get("accessToken"));
            const accessToken = urlParams.get('accessToken');
            const refreshToken = urlParams.get('refreshToken');

            Cookies.set('accessToken', accessToken, { expires: 7, path: '/' });
            Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
            
            navigate('/home');
        };

        fetchUserData();
    }, [navigate]);

    return <div>Logging in...</div>;
};

export default GoogleLoginSuccess;
