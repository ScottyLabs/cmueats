import { motion } from 'motion/react';
import useLocalStorage from '../../util/localStorage';
import closeButton from '../../assets/banner/close-button.svg';
import scottyDog from '../../assets/banner/scotty-dog.svg';
import css from './NovaBanner.module.css';
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
                        <img src={scottyDog} alt="" />
                        <span>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSd6mXSOzxxUctc0EeQBTanqebc31xmBnKb_cFRosqHjtmuemg/viewform"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Register
                            </a>{' '}
                            for Nova, ScottyLabs&apos; GenAI Hackathon by Nov. 1st!
                        </span>
                    </span>
                    <span className={css['welcome-banner__text--short']}>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSd6mXSOzxxUctc0EeQBTanqebc31xmBnKb_cFRosqHjtmuemg/viewform"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Register
                        </a>{' '}
                        for Nova by Nov. 1st!
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
                        <img src={closeButton} alt="" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
