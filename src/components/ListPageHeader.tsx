import { useMemo } from 'react';
import { $api, login, logout } from '../api';
import css from './ListPageHeader.module.css';
import { getGreetings } from '../util/greeting';

export default function ListPageHeader() {
    const { data: userLoggedInData, isLoading } = $api.useQuery('get', '/whoami');
    const { mobileGreeting, desktopGreeting } = useMemo(() => getGreetings(new Date().getHours()), []);
    return (
        <header className="list-header">
            <h3 className="list-header__greeting list-header__greeting--desktop">{desktopGreeting}</h3>
            <h3 className="list-header__greeting list-header__greeting--mobile">{mobileGreeting}</h3>
            {isLoading ? (
                'loading'
            ) : userLoggedInData !== undefined && userLoggedInData.user !== null ? (
                <button onClick={logout}>sign out (sub:{userLoggedInData.user?.email})</button>
            ) : (
                <button onClick={login}>sign in</button>
            )}
        </header>
    );
}
