import { useContext } from 'react';
import { DrawerContext } from '../pages/ListPage';
import './DrawerHeader.css';

function DrawerHeader() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    const name = location?.name;
    const status = location?.statusMsg;
    const physicalLocation = location?.location;

    return (
        <div className="drawer-header">
            <div>
                <span>{name}</span>
                <button onClick={() => drawerContext.setIsDrawerActive(false)}>close</button>
            </div>
            <div>{status}</div>
            <div>{physicalLocation}</div>
        </div>
    );
}

export default DrawerHeader;
