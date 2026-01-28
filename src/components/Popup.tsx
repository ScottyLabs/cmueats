/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createPortal } from 'react-dom';
import css from './Popup.module.css';

export default function Popup({
    children,
    closePopup,
    popupOpen,
}: {
    children: React.ReactNode;
    closePopup: () => void;
    popupOpen: boolean;
}) {
    if (!popupOpen) return undefined;
    return createPortal(
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={css['outer-container']}
            onClick={(ev) => {
                if (ev.defaultPrevented) return;
                closePopup();
                ev.preventDefault();
            }}
            // this doesn't do anything lmao
            onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === 'Escape') {
                    closePopup();
                }
            }}
        >
            <div className={css.popup} onClick={(ev) => ev.preventDefault()}>
                {children}
            </div>
        </div>,
        document.body,
    );
}
