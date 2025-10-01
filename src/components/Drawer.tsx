import { useContext } from 'react';
import './Drawer.css';
import DrawerContext from '../contexts/DrawerContext';

function Drawer() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    const name = location?.name;
    // const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location?;

    if (!drawerContext.isDrawerActive) return null;

    return (
        <div className="drawer-box">
            <button
                type="button"
                onClick={() => {
                    drawerContext.setIsDrawerActive(false);
                    drawerContext.setDrawerLocation(null);
                }}
            >
                Close
            </button>
            {name}
            <div className="drawer-in" />
        </div>
    );
}

export default Drawer;
