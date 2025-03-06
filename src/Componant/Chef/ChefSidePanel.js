import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHouse, faUser, faTableCellsLarge, faBurger , faClockRotateLeft} from '@fortawesome/free-solid-svg-icons';

// import styles from '../../css/ChefDashboard.module.css';
import styles from '../../css/SidePanel.module.css';

<i class="fa-solid fa-clock-rotate-left"></i>
const ChefSidePanel = ({ isChefDashboard,isChefMenu,isChefCategory,isChefVariant,isChefProfile,isHistory,  isOpen }) => { // Accept isActive prop
    const handleLinkClick = (path) => {
        window.location.href = path; // Redirect and refresh the page
    };
    return (
        <div className={`${styles.a_drawer} ${isOpen ? styles.open : ''}`} id="a_drawer">
             <div className="list-group list-group-flush">
                <div className={styles.a_logo}><h2>logo</h2></div>
                <Link  onClick={() => handleLinkClick('/chef_board')} className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isChefDashboard ? styles.db_activenav : ''}`}>
                    <FontAwesomeIcon icon={faHouse} className="mr-2" /> Dashboard
                </Link>
                <Link   onClick={() => handleLinkClick('/chef_menu')}className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isChefMenu ? styles.db_activenav : ''}`}>
                    <FontAwesomeIcon icon={faBell} className="mr-2" /> Menu
                </Link>
                <Link  onClick={() => handleLinkClick('/chef_category')} className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isChefCategory ? styles.db_activenav : ''}`}>
                <FontAwesomeIcon icon={faTableCellsLarge} className="mr-2"  /> Category
                </Link>
                <Link   onClick={() => handleLinkClick('/chef_variant')} className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isChefVariant ? styles.db_activenav : ''}`}>
                <FontAwesomeIcon icon={faBurger} className="mr-2"/> Variant
                </Link>
                <Link   onClick={() => handleLinkClick('/history')} className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isHistory ? styles.db_activenav : ''}`}>
                <FontAwesomeIcon icon={faClockRotateLeft} className="mr-2"/> History
                </Link>
                <Link  onClick={() => handleLinkClick('/chefProfile')} className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isChefProfile ? styles.db_activenav : ''}`}>
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                </Link>
            </div>
        </div>
    );
};

export default ChefSidePanel;