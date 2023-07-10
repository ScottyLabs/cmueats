import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import React from 'react';
import { ErrorTitle, ErrorText, ErrorButton } from '../style';

function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<Box textAlign="center" mt={12} mb={12}>
			<ErrorTitle variant="h2">Oops!</ErrorTitle>
			<ErrorText>
				We couldn’t find the page you are looking for.
			</ErrorText>
			<ErrorButton
				onClick={() => {
					navigate('/');
				}}
			>
				Home page
			</ErrorButton>
		</Box>
	);
}

export default NotFoundPage;
