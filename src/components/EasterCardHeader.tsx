import css from './EateryCardHeader.module.css';
import easterEggUrl from '../assets/easter/easter-egg.svg';

function EasterCardHeader({ statusText }: { statusText: string }) {
    // Random pastel colors for Easter eggs
    const easterColors = [
        'var(--easter-pink)',
        'var(--easter-yellow)',
        'var(--easter-lavender)',
        'var(--easter-mint)',
        'var(--easter-peach)',
    ];
    const randomColor = easterColors[Math.floor(Math.random() * easterColors.length)];

    return (
        <div
            style={
                {
                    '--status-color': randomColor,
                } as React.CSSProperties
            }
        >
            <div className={css['card-header-container']}>
                <img src={easterEggUrl} alt="" style={{ width: '16px', height: '16px' }} />
                <div className={css['time-container']}>
                    <span className={css['card-header-relative-time-text']} style={{ color: randomColor }}>
                        {statusText}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default EasterCardHeader;
