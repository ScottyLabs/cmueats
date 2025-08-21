import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import IS_MIKU_DAY from '../util/constants';
import mikuChibiUrl from '../assets/miku/miku-chibi.svg';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            {IS_MIKU_DAY && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <img src={mikuChibiUrl} alt="Miku is confused too!" style={{ width: '60px', height: '60px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                        Even Miku can&apos;t find this page! 🎵
                    </p>
                </div>
            )}
            <h2 className="error-container__title">Oops!</h2>
            <p className="error-container__text">We couldn&apos;t find the page you are looking for.</p>
            {IS_MIKU_DAY && (
                <p className="error-container__text" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                    🎤 &quot;In a world of code and routes, some paths lead to 404...&quot; - Hatsune Miku (probably)
                </p>
            )}
            <Button
                onClick={() => {
                    navigate('/');
                }}
                className="error-container__error-button"
            >
                Home page
            </Button>
        </div>
    );
}

export default NotFoundPage;
