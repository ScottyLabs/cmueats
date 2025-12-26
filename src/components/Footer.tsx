import { DateTime } from 'luxon';
import css from './Footer.module.css';
import SponsorCarousel from './SponsorCarousel';
import { useThemeContext } from '../ThemeProvider';
import footerMikuUrl from '../assets/miku/miku2.png';
import { $api } from '../api';
import { useCurrentTime } from '../contexts/NowContext';

export default function Footer() {
    const now = useCurrentTime();
    const { theme } = useThemeContext();
    const { data: emails } = $api.useQuery('get', '/api/emails');
    const nowString = now.toLocaleString({
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <footer className={css.footer}>
            <div className={css['footer__text-section']}>
                {theme === 'miku' ? (
                    <p>
                        Blue hair, blue tie, hiding in your wifi
                        <br />
                        All times are displayed in Pittsburgh local time ({nowString}).
                    </p>
                ) : (
                    <>
                        <p>All times are displayed in Pittsburgh local time ({nowString}).</p>
                        <p>
                            If you encounter any problems, please fill out our{' '}
                            <a href="https://forms.gle/7JxgdgDhWMznQJdk9" style={{ color: 'white' }}>
                                feedback form
                            </a>{' '}
                            (the fastest way to reach us!).
                        </p>
                        <p>
                            Otherwise, reach out to{' '}
                            {emails && emails.length > 0 ? (
                                emails.map((person, idx) => (
                                    <span key={person.email}>
                                        <a href={`mailto:${person.email}`} style={{ color: 'white' }}>
                                            {person.name}
                                        </a>
                                        {idx < emails.length - 2 ? ', ' : ''}
                                        {/* eslint-disable-next-line no-nested-ternary */}
                                        {idx === emails.length - 2 ? (emails.length > 2 ? ', or ' : ' or ') : ''}
                                    </span>
                                ))
                            ) : (
                                <span>
                                    <a href="mailto:hello@scottylabs.org" style={{ color: 'white' }}>
                                        ScottyLabs
                                    </a>
                                </span>
                            )}
                            .
                        </p>
                        <p>
                            To provide feedback on your dining experience, please contact{' '}
                            <a href="mailto:dining@andrew.cmu.edu" style={{ color: 'white' }}>
                                Dining Services
                            </a>{' '}
                            or take the{' '}
                            <a href="https://forms.gle/fTnWrS7jkTFRB14DA" style={{ color: 'white' }}>
                                dining survey
                            </a>
                            .
                        </p>
                        <p>
                            Made with ❤️ by the{' '}
                            <a href="https://scottylabs.org" style={{ color: 'white' }}>
                                ScottyLabs
                            </a>{' '}
                            Tech Committee (not the official{' '}
                            <a
                                href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Schedule"
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'white' }}
                            >
                                dining website
                            </a>
                            ).
                        </p>
                    </>
                )}
                <h4 className={css.footer__logo}>
                    <span>cmu</span>
                    <span>:eats</span>
                </h4>
            </div>
            <div className={css['sponsors-spacer']}>
                <SponsorCarousel darkMode openByDefault={false} />
            </div>
            {theme === 'miku' && <img src={footerMikuUrl} alt="miku!" className="footer__miku" />}
        </footer>
    );
}
