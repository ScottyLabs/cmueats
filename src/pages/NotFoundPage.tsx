import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <h3 className="error-container__title">Oops!</h3>
            <p className="error-container__text">We couldn’t find the page you are looking for.</p>
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
