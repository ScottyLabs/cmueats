import { useMemo } from 'react';
import { $api, login, logout } from '../api';
import css from './ListPageHeader.module.css';
import { getGreetings } from '../util/greeting';
import GoogleIcon from '../assets/google.svg?react';
import SignOut from '../assets/control_buttons/signOut.svg?react';

export default function ListPageHeader() {
    const { data: userLoggedInData, isLoading, error } = $api.useQuery('get', '/whoami');
    const { mobileGreeting, desktopGreeting } = useMemo(() => getGreetings(new Date().getHours()), []);
    // const []
    return (
        <header className={css['list-header']}>
            <h3 className={css['list-header__greeting']}>
                <span className={css['list-header__greeting--desktop']}>
                    {userLoggedInData?.user?.firstName && `Hi ${userLoggedInData.user.firstName}! `}
                    {desktopGreeting}
                </span>

                <span className={css['list-header__greeting--mobile']}>
                    {userLoggedInData?.user?.firstName && `Hi ${userLoggedInData.user.firstName}! `}
                    {mobileGreeting}
                </span>
            </h3>
            {error !== null ? (
                <button disabled type="button" className={css.button__error}>
                    Failed to fetch login info!
                </button>
            ) : isLoading ? (
                <button disabled type="button">
                    Loading login status...
                </button>
            ) : userLoggedInData !== undefined && userLoggedInData.user !== null ? (
                <button onClick={logout} type="button">
                    <SignOut />
                    Sign out ({userLoggedInData.user.email})
                </button>
            ) : (
                <button onClick={login} type="button">
                    <GoogleIcon />
                    Sign in with your CMU email
                </button>
            )}
        </header>
    );
}
