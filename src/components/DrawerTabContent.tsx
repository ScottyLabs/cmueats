import './DrawerTabContent.css';

function DrawerTabContent() {
    return (
        <div className="drawer-tab-content">
            {Array(36)
                .fill(null)
                .map(() => (
                    <div style={{ marginTop: '20px' }}>lorem</div>
                ))}
        </div>
    );
}

export default DrawerTabContent;
