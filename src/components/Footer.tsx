import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import env from '../env';
import css from './Footer.module.css';
import SponsorCarousel from './SponsorCarousel';
import { useThemeContext } from '../ThemeProvider';
import footerMikuUrl from '../assets/miku/miku2.png';

function getPittsburghTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
    };
    return now.toLocaleString('en-US', options);
}
export default function Footer({}: { now: DateTime }) {
    const [emails, setEmails] = useState<{ name: string; email: string }[]>([]);
    const { theme } = useThemeContext();

    // Fetch emails on mount
    useEffect(() => {
        async function fetchEmails() {
            try {
                const res = await fetch(`${env.VITE_API_URL}/api/emails`);
                const json = await res.json();
                setEmails(json);
            } catch (err) {
                console.error('Failed to fetch emails:', err);
            }
        }
        fetchEmails();
    }, []);
    return (
        <footer className={css.footer}>
            <div className={css['footer__text-section']}>
                {theme === 'miku' ? (
                    <p>
                        Blue hair, blue tie, hiding in your wifi
                        <br />
                        All times are displayed in Pittsburgh local time ({getPittsburghTime()}).
                    </p>
                ) : (
                    <>
                        <p>All times are displayed in Pittsburgh local time ({getPittsburghTime()}).</p>
                        <p>
                            If you encounter any problems, please fill out our{' '}
                            <a href="https://forms.gle/7JxgdgDhWMznQJdk9" style={{ color: 'white' }}>
                                feedback form
                            </a>{' '}
                            (the fastest way to reach us!).
                        </p>
                        <p>
                            Otherwise, reach out to{' '}
                            {emails.length > 0 ? (
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
