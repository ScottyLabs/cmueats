import React, { useEffect, useRef } from 'react';
import css from './SearchBar.module.css';

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: React.Dispatch<string> }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement;

            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
            if (event.key === '/' && document.activeElement !== inputRef.current && !isTyping) {
                event.preventDefault();
                inputRef.current?.focus();
            }

            if (
                // `ctrl + meta + k` might be someone's shortcut
                event.metaKey !== event.ctrlKey &&
                event.key === 'k' &&
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
                placeholder=""
            />
            <div className={css['locations-search-hint']}>
                Type <kbd>/</kbd> to search
            </div>
        </div>
    );
}

export default SearchBar;
