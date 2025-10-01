import { useContext } from 'react';
import './Drawer.css';
import { DrawerContext } from '../pages/ListPage';

function Drawer() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    const name = location?.name;
    // const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location?;

    return (
        <>
            {drawerContext.isDrawerActive && (
                <div className="drawer-box">
                    <button onClick={() => drawerContext.setIsDrawerActive(false)}>close</button>
                    {name}
                    <div className="drawer-in"></div>
                </div>
            )}
        </>
    );
}

export default Drawer;
