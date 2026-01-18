import { motion } from 'motion/react';
import useLocalStorage from '../../util/localStorage';
import CloseButton from '../../assets/banner/close-button.svg?react';
import TH26 from '../../assets/banner/TH26.svg?react';
import css from './THBanner.module.css';
import clsx from 'clsx';

export default function Banner() {
    const [closed, setIsClosed] = useLocalStorage('welcome-banner-closed');
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
                        <TH26 />
                        <span>
                            <a href="https://register.tartanhacks.com/" target="_blank" rel="noreferrer">
                                Register
                            </a>{' '}
                            for TartanHack, CMU&apos;s largest Hackathon by ScottyLabs by Feb. 1st!
                        </span>
                    </span>
                    <span className={css['welcome-banner__text--short']}>
                        <a href="https://register.tartanhacks.com/" target="_blank" rel="noreferrer">
                            Register
                        </a>{' '}
                        for TartanHack by Feb. 1st!
                    </span>
                </div>
                <div
                    className={clsx(
                        css['welcome-banner__close'],
                        css['welcome-banner-padding'],
                        css['welcome-banner-padding--button'],
                    )}
                >
                    <button type="button" aria-label="close-banner" onClick={closeBanner}>
                        <CloseButton />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
