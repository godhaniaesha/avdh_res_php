import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JavaScript bundle
import styles from '../../css/SidePanel.module.css'; // Import your CSS module
import { Link } from 'react-router-dom';

const SidePanel = ({ isCustomerPage, isProfilePage, isbill, isOpen, isCustHistory }) => {


    const handleLinkClick = (path) => {
        window.location.href = path; // Redirect and refresh the page
    };

    return (
        <div className={`${styles.a_drawer} ${isOpen ? styles.open : ''}`} id={styles.a_drawer}> {/* Use CSS module class for styling */}
            <div className="list-group"> {/* Corrected 'list-group-flus' to 'list-group' */}
                <div className={styles.a_logo}> {/* Use CSS module class for styling */}
                    <h2>Logo</h2>
                </div>
                <Link
                    className={`list-group-item list-group-item-action ${styles.db_list_group} ${isbill ? styles.db_activenav : ''}`}
                    onClick={() => handleLinkClick('/accountant')}
                >
                    <i className="fa-solid fa-house me-2"></i> Dashboard
                </Link>
                <Link
                    className={`list-group-item list-group-item-action ${styles.db_list_group} ${isCustomerPage ? styles.db_activenav : ''}`}
                    onClick={() => handleLinkClick('/customer')}
                >
                    <i className="fa-solid fa-user me-2"></i> Customer
                </Link>
                <Link className={`list-group-item list-group-item-action  ${styles.db_list_group} ${isCustHistory ? styles.db_activenav : ''}`}
                    onClick={() => handleLinkClick('/custhistory')}
                >
                    <i class="fa-solid fa-clock-rotate-left"></i> History
                </Link>
                <Link
                    className={`list-group-item list-group-item-action ${styles.db_list_group} ${isProfilePage ? styles.db_activenav : ''}`}
                    onClick={() => handleLinkClick('/account')}
                >
                    <i className="fa-solid fa-user me-2"></i> Profile
                </Link>
            </div>
        </div>
    );
};

export default SidePanel;
