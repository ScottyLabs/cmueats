import React, { useEffect, useRef } from 'react';
import './SearchBar.css';

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

            if (event.key === 'Escape' && document.activeElement === inputRef.current) {
                inputRef.current?.blur();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="locations-search-wrapper">
            <input
                ref={inputRef}
                className="locations-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
            />
            <div className="locations-search-hint">
                Type <kbd>/</kbd> to search
            </div>
        </div>
    );
}

export default SearchBar;
