import { Button } from '@mui/material';

function EateryCard({ onClear }: { onClear: () => unknown }) {
    return (
        <div className="error-container">
            <h3 className="error-container__title">No results found</h3>
            <p className="error-container__text">
                Try searching for a name (e.g. “Schatz”) or location (e.g. “Cohon”).
            </p>
            <Button onClick={onClear} className="error-container__error-button">
                Clear search
            </Button>
        </div>
    );
}

export default EateryCard;
