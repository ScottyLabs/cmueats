import { useContext } from 'react';
import { DrawerContext } from '../contexts/DrawerContext';
import './DrawerHeader.css';

function DrawerHeader() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    const { name, statusMsg: status, location: physicalLocation } = location ?? {};

    return (
        <div className="drawer-header">
            <div>
                <span>{name}</span>
                <button type="button" onClick={() => drawerContext.setIsDrawerActive(false)}>
                    close
                </button>
            </div>
            <div>{status}</div>
            <div>{physicalLocation}</div>
        </div>
    );
}

export default DrawerHeader;
