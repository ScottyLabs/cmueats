import { useLayoutEffect, useState } from 'react';
import css from './AuthBanner.module.css';
import XIcon from '../../assets/control_buttons/x.svg?react';

/** Used for notifying the user if there was a problem signing in */
export default function AuthBanner() {
    const [shouldDisplay, setShouldDisplay] = useState(false);
    useLayoutEffect(() => {
        if (new URL(window.location.href).searchParams.get('AUTH_FAILED') !== null) {
            setShouldDisplay(true);
            window.history.replaceState({}, document.title, window.location.pathname); // strip query param
        }
    }, []);
    return (
        shouldDisplay && (
            <div className={css.banner}>
                Failed to log in! Did you use your CMU email?
                <button onClick={() => setShouldDisplay(false)} type="button">
                    <XIcon />
                </button>
            </div>
        )
    );
}
