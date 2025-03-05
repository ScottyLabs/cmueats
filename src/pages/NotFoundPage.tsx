import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<Box textAlign="center" mt={12} mb={12}>
			<h2 className="error-container__title">Oops!</h2>
			<p className="error-container__text">
				We couldn’t find the page you are looking for.
			</p>
			<Button
				onClick={() => {
					navigate('/');
				}}
				className="error-container__error-button"
			>
				Home page
			</Button>
		</Box>
	);
}

export default NotFoundPage;
