import { useEffect, useRef, useState } from 'react';
import css from './SelectLocation.module.css';
import { SortDesc } from 'lucide-react';

export type SelectSort = 'time' | 'stars-desc-open' | 'stars-asc' | 'stars-desc';

type SelectSortProps = {
    sortOption: SelectSort;
    setSortOption: React.Dispatch<SelectSort>;
};

const sortOptionLabels: Record<SelectSort, string> = {
    time: 'Sort by Opening',
    'stars-desc-open': 'Sort by Highest Rating (Open Only)',
    'stars-desc': 'Sort by Highest Rating (All)',
    'stars-asc': 'Sort by Lowest Rating (All)',
};

function SelectSortControl({ sortOption, setSortOption }: SelectSortProps) {
    const [isOpen, setIsOpen] = useState(false);
    const controlRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (controlRef.current !== null && !controlRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        window.addEventListener('mousedown', handlePointerDown);
        return () => window.removeEventListener('mousedown', handlePointerDown);
    }, []);

    return (
        <div className={css.control} ref={controlRef}>
            <button
                type="button"
                className={css.triggerButton}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Sort results"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <SortDesc size={22} />
            </button>

            {isOpen ? (
                <div className={css.dropdown} role="listbox" aria-label="Sort results">
                    {(Object.keys(sortOptionLabels) as SelectSort[]).map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`${css.dropdownItem} ${sortOption === option ? css.dropdownItemActive : ''}`}
                            onClick={() => {
                                setSortOption(option);
                                setIsOpen(false);
                            }}
                            role="option"
                            aria-selected={sortOption === option}
                        >
                            {sortOptionLabels[option]}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default SelectSortControl;