import { Box } from '@mui/material';
import { ErrorButton, ErrorText, ErrorTitle } from '../style';

export default function EateryCard({ onClear }: $TSFixMe) {
	return (
		<Box textAlign="center" mt={6} mb={6}>
			<ErrorTitle variant="h2">No results found</ErrorTitle>
			<ErrorText>
				Try searching for a name (e.g. “Schatz”) or location (e.g.
				“Cohon”).
			</ErrorText>
			<ErrorButton onClick={onClear}>Clear search</ErrorButton>
		</Box>
	);
}
