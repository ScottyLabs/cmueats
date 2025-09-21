import React, { useEffect, useRef } from 'react';
import css from './SearchBar.module.css';

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: React.Dispatch<string> }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isDesktop = window.innerWidth >= 900;
    const isMac = navigator.platform.includes('Mac');

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (
                // `cmd/ctrl` + `k`
                ((((isMac && event.metaKey) || (!isMac && event.ctrlKey)) && event.key === 'k') ||
                    // only `/`
                    (!event.metaKey && !event.ctrlKey && event.key === '/') ||
                    // only 's`
                    (!event.metaKey && !event.ctrlKey && event.key === 's')) &&
                document.activeElement !== inputRef.current &&
                !isTyping
            ) {
                event.preventDefault();
                inputRef.current?.focus();
            }

            if (event.key === 'Escape' && document.activeElement === inputRef.current) {
                inputRef.current?.blur();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={css['locations-search-wrapper']}>
            <input
                ref={inputRef}
                className={css['locations-search']}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=" "
                // this needs to be nonempty for the :placeholder-shown css to work
            />
            <div className={css['locations-search-hint']}>
                {isDesktop ? (
                    <span>
                        Type <kbd>/</kbd> or{' '}
                        {isMac ? (
                            <kbd>
                                <span>⌘</span>
                                <span className={css.line} />
                                <span>K</span>
                            </kbd>
                        ) : (
                            <kbd>
                                <span>^</span>
                                <span className={css.line} />
                                <span>K</span>
                            </kbd>
                        )}{' '}
                        to search
                    </span>
                ) : (
                    <span>Search...</span>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
