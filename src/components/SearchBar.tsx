import React, { useEffect, useRef } from 'react';
import './SearchBar.css';

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<string>;
};

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
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
        <div className="Locations-search-wrapper">
            <input
                ref={inputRef}
                className="Locations-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
            />
            <div className="Locations-search-hint">
                Type <kbd>/</kbd> to search
            </div>
        </div>
    );
};

export default SearchBar;
