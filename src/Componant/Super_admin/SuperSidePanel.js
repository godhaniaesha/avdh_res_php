import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
// import styles from '../../css/SuperAdmin.module.css';
import logo from '../../Image/image.png';


import styles from '../../css/SidePanel.module.css';
import { Link } from 'react-router-dom'; // Add this import
import { MdDeck } from "react-icons/md";


const SuperSidePanel = ({ issuper, isChef, isWaiter, isAccountant, isProfile , isTable ,isOpen}) => {
    return (
        <div  className={`${styles.a_drawer} ${isOpen ? styles.open : ''}`}  id="a_drawer">
            <div className="list-group list-group-flush">
                <div className={styles.a_logo}>
                    <h2>Logo</h2>
                    {/* <img src={} alt="" /> */}
                    {/* <img src={require('../../Image/image.png')} /> */}
                    {/* <img src={logo} alt="Logo" /> */}
                </div>
                <Link to="/superadmin" className={`list-group-item list-group-item-action ${styles.db_list_group} ${issuper ? styles.db_activenav : ''}`}>
                <i className="fa-solid fa-house me-2"></i>
                Dashboard
                </Link>
                <Link to="/superChef" className={`list-group-item list-group-item-action ${styles.db_list_group} ${isChef ? styles.db_activenav : ''}`}>
                <i className="fa-solid fa-utensils me-2"></i>
                Chef
                </Link>
                <Link to="/superWaiter" className={`list-group-item list-group-item-action ${styles.db_list_group} ${isWaiter ? styles.db_activenav : ''}`}>
                <i className="fa-solid fa-bell-concierge me-2"></i>
                Waiter
                </Link>
                <Link to="/superaccountlist" className={`list-group-item list-group-item-action ${styles.db_list_group} ${isAccountant ? styles.db_activenav : ''}`}>
                <i className="fa-solid fa-receipt me-2"></i>
                        Accountant
                </Link>
                <Link to="/supertable" className={`list-group-item list-group-item-action ${styles.db_list_group} ${isTable ? styles.db_activenav : ''}`}>
                <MdDeck className="me-2" />
                        Tables
                </Link>
                <Link to="/superprofile" className={`list-group-item list-group-item-action ${styles.db_list_group} ${isProfile ? styles.db_activenav : ''}`}>
                <i className="fa-solid fa-user me-2"></i>
                Profile
                </Link>
            </div>
        </div>
    );
};

export default SuperSidePanel;