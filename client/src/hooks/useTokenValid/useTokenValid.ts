import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

type TokenDecodeType = {
    email: string,
    exp: number,
    iat: number,
    number: string,
    role: string,
    sub: number
};

const useTokenValid = (TokenCookie: string, deleteTokenCookie: () => void) => {
    const [Token, setToken] = useState<string>(TokenCookie);
    const [TokenDecode, setTokenDecode] = useState<TokenDecodeType | null>(null);
    const [Loading, setLoading] = useState<boolean>(true);
    const [MessageError, setMessageError] = useState<string>('');

    const checkTokenExpiration = (token: string) => {
        try {
            const decodedToken = jwtDecode<TokenDecodeType>(token);
            if (decodedToken.exp < Date.now() / 1000) {
                setToken('');
                deleteTokenCookie();
                setTokenDecode(null);
                setMessageError('Истёк срок действия сессии!!!');
            } else {
                setToken(TokenCookie);
                setTokenDecode(decodedToken);
                setMessageError('');
            }
        } catch (error) {
            setToken('');
            deleteTokenCookie();
            setTokenDecode(null);
            setMessageError('Ошибка валидации сессии!!!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (TokenCookie) {
            checkTokenExpiration(TokenCookie);
        } else {
            setLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TokenCookie]);

    useEffect(() => {
        const Interval = setInterval(() => {
            setLoading(true);
            if (TokenCookie) {
                checkTokenExpiration(TokenCookie);
            } else {
                setLoading(false);
            };
        }, 100000);
        return () => clearInterval(Interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TokenCookie]);

    return { Token, setToken, TokenDecode, setTokenDecode, Loading, setLoading, MessageError, setMessageError };
};

export default useTokenValid;