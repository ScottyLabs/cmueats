import { Button } from '@mui/material';
import IS_MIKU_DAY from '../util/constants';
import mikuChibiUrl from '../assets/miku/miku-chibi.svg';

function EateryCard({ onClear }: { onClear: () => unknown }) {
    return (
        <div className="error-container">
            {IS_MIKU_DAY && (
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <img src={mikuChibiUrl} alt="Miku helps with search!" style={{ width: '50px', height: '50px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '5px' }}>
                        🎵 &quot;Let&apos;s try a different search rhythm!&quot; 🎵
                    </p>
                </div>
            )}
            <h2 className="error-container__title">No results found</h2>
            <p className="error-container__text">
                Try searching for a name (e.g. "Schatz") or location (e.g. "Cohon").
            </p>
            {IS_MIKU_DAY && (
                <p className="error-container__text" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                    🎤 Miku tip: Be like a synthesizer - try different parameters for better results!
                </p>
            )}
            <Button onClick={onClear} className="error-container__error-button">
                Clear search
            </Button>
        </div>
    );
}

export default EateryCard;
