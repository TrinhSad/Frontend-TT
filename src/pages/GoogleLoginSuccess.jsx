import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../utils/config';

const GoogleLoginSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/auth/success`, { withCredentials: true });
                const { user, token } = response.data;

                Cookies.set('userId', user._id, { expires: 7, path: '/' });
                Cookies.set('accessToken', token.accessToken, { expires: 7, path: '/' });
                Cookies.set('refreshToken', token.refreshToken, { expires: 7, path: '/' });

                navigate('/home');
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    return <div>Logging in...</div>;
};

export default GoogleLoginSuccess;
