import { motion } from 'motion/react';
import clsx from 'clsx';
import useLocalStorage from '../../util/localStorage';
import closeButton from '../../assets/banner/close-button.svg';
import scottyDog from '../../assets/banner/scotty-dog.svg';
import css from './ReviewSystemBanner.module.css';

export default function Banner() {
    const [closed, setIsClosed] = useLocalStorage('');
    const closeBanner = () => {
        setIsClosed('true');
    };

    return (
        <motion.div
            className={css['welcome-banner-container']}
            animate={{ height: closed === null ? 'auto' : 0 }}
            initial={{ height: closed === null ? 'auto' : 0 }}
        >
            <div className={css['welcome-banner']}>
                <div className={css['welcome-banner__spacer']} />
                <div className={clsx(css['welcome-banner__text'], css['welcome-banner-padding'])}>
                    <span className={css['welcome-banner__text--long']}>
                        <img src={scottyDog} alt="" />
                        <span></span>
                    </span>
                    <span className={css['welcome-banner__text--short']}>Leave a review!</span>
                </div>
                <div
                    className={clsx(
                        css['welcome-banner__close'],
                        css['welcome-banner-padding'],
                        css['welcome-banner-padding--button'],
                    )}
                >
                    <button type="button" aria-label="close-banner" onClick={closeBanner}>
                        <img src={closeButton} alt="" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
