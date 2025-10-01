import { useContext, useState } from 'react';
import './Drawer.css';
import { DrawerContext } from '../pages/ListPage';
import DrawerHeader from './DrawerHeader';
import DrawerTabNav from './DrawerTabNav';
import DrawerTabContent from './DrawerTabContent';

function Drawer() {
    const drawerContext = useContext(DrawerContext);
    const location = drawerContext.drawerLocation;
    const name = location?.name;
    // const { location: physicalLocation, name, url, todaysSoups = [], todaysSpecials = [], description } = location?;

    // on yelp, under their title is "rating (review number)", "location", "isOpen and hours"
    // their order is "add a review / add photos (button)", "menu", "location & hours", "review"
    // for reference <https://www.yelp.com/biz/paris-66-pittsburgh-2?hrid=ffQedKt12wIRLXZX8OTOqA>
    let [currTab, setCurrTab] = useState<'description' | 'menu' | 'hours' | 'reviews' | 'specials'>('description');

    return (
        <>
            {drawerContext.isDrawerActive && (
                <div className="drawer-box">
                    <DrawerHeader />
                    <DrawerTabNav />
                    <DrawerTabContent />
                </div>
            )}
        </>
    );
}

export default Drawer;
