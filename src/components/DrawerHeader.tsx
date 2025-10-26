import { useContext } from 'react';
import { X } from 'lucide-react';
import { highlightColors } from '../constants/colors';
import { DrawerContext } from '../contexts/DrawerContext';
import css from './DrawerHeader.module.css';

function DrawerHeader() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    const { name, statusMsg: status, location: physicalLocation } = location ?? {};

    return (
        <div className={css['drawer-header-container']}>
            <div className={css['header']}>
                <h3 className={css['drawer-loction-text']}>{name}</h3>
                <button type="button" onClick={() => drawerContext.setIsDrawerActive(false)}>
                    close
                    <X size={15} />
                </button>
            </div>
            <div
                className={css['status-text']}
                style={{ '--status-color': highlightColors[location?.locationState ?? 0] }}
            >
                {status}
            </div>
            <div>{physicalLocation}</div>
        </div>
    );
}

export default DrawerHeader;
