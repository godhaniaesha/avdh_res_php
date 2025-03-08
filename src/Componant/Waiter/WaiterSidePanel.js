import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import styles from "../../css/WaiterDashboaed.module.css";
import styles from "../../css/SidePanel.module.css";

const WaiterSidePanel = ({
  iswaiterdashboard,
  iswaitermenu,
  iswaiterorder,
  iswaiterprofile,
  isOpen  
}) => {
  const navClass = iswaiterdashboard ? styles.db_activenav : "";
  const navmenuClass = iswaitermenu ? styles.db_activenav : "";
  const navorderClass = iswaiterorder ? styles.db_activenav : "";
  const navprofileClass = iswaiterprofile ? styles.db_activenav : "";
  const handleLinkClick = (path) => {
    window.location.href = path; // Redirect and refresh the page
  };

  return (
    <div className={`${styles.a_drawer} ${isOpen ? styles.open : ''}`} id="a_drawer">
      <div className="list-group list-group-flush">
        <div className={styles.a_logo}>
          <h2>logo</h2>
        </div>

        <Link
          to={"/Waiter_Dashboard"}
          onClick={() => handleLinkClick('/Waiter_Dashboard')}
          className={`list-group-item list-group-item-action ${styles.db_list_group} ${navClass}`}
        >
          <i className="fa-solid fa-house me-2"></i>
          Dashboard
        </Link>

        <Link
          to={"/Waiter_menu"}
          onClick={() => handleLinkClick('/Waiter_menu')}
          className={`list-group-item list-group-item-action ${styles.db_list_group} ${navmenuClass}`}
        >
          <i class="fa-solid fa-bell-concierge me-2"></i>
          Menu
        </Link>

        <Link
          to={"/Waiter_order"}
          onClick={() => handleLinkClick('/Waiter_order')}
          className={`list-group-item list-group-item-action ${styles.db_list_group} ${navorderClass}`}
        >
          <i class="fa-solid fa-receipt me-2"></i>
          Order Status
        </Link>

        <Link
          to={"/waiter_profile"}
          onClick={() => handleLinkClick('/waiter_profile')}
          className={`list-group-item list-group-item-action ${styles.db_list_group} ${navprofileClass}`}
        >
          <i class="fa-solid fa-user me-2"></i>
          Profile
        </Link>
      </div>
    </div>
  );
};

export default WaiterSidePanel;
