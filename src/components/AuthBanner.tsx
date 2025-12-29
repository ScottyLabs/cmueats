import { useLayoutEffect, useState } from 'react';
import css from './AuthBanner.module.css';
import XIcon from '../assets/control_buttons/x.svg?react';

export default function AuthBanner() {
    const [shouldDisplay, setShouldDisplay] = useState(false);
    useLayoutEffect(() => {
        if (new URL(window.location.href).searchParams.get('AUTH_FAILED') !== null) {
            setShouldDisplay(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);
    return (
        shouldDisplay && (
            <div className={css.banner}>
                Failed to log in! Did you use your CMU email?
                <button onClick={() => setShouldDisplay(false)}>
                    <XIcon />
                </button>
            </div>
        )
    );
}
