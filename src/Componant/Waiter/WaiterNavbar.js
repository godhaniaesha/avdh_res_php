import React from "react";
import styles from "../../css/WaiterDashboaed.module.css";

const WaiterNavbar = ({ toggleDrawer, toggleNotifications, waiterName, showSearch, setSearchQuery }) => {
  const loggedInUserName = localStorage.getItem("firstName");
  console.log("loggedInUserId", loggedInUserName);

  return (
    <>
      <nav
        className={`navbar navbar-light bg-light shadow fixed-top ${styles.a_navbar}`}
      >
        <div className="d-flex align-items-center ms-2" >
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleDrawer}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {showSearch && (
            <div className={styles.a_search}>
              <input
                type="search"
                placeholder="Search..."
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div
            className={`${styles.a_profile} d-flex align-items-center justify-content-end float-end me-3`}
          >
            <i class={`fa-solid fa-bell ${styles["fa-bell"]} position-relative`}>
              <span class="position-absolute translate-middle p-2 rounded-circle">
                {/* <!-- <span class="visually-hidden">New alerts</span> --> */}
              </span>
            </i>
            <div className="a_pro d-flex align-items-center align-content-center">
              <img src={require("../../Image/Ellipse 717.png")} alt="" />
              <div className={`${styles.b_name} dropdown show`}>
                <a
                  className="btn dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span id="accountant_name">{loggedInUserName}</span>
                </a>
                <div
                  className={`${styles.m_active} dropdown-menu ${styles["dropdown-menu"]}`}
                  aria-labelledby="dropdownMenuLink"
                >
                  <a
                    className="dropdown-item"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#changepassModal"
                  >
                    <img
                      src={require("../../Image/SvgjsSvg1001.png")}
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "cover",
                      }}
                    />{" "}
                    Change Password
                  </a>

                  <a
                    className="dropdown-item"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                  >
                    <img
                      src={require("../../Image/logout.png")}
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "cover",
                      }}
                    />{" "}
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={styles["a_notification-panel"]}
        id={styles["notification-panel"]}
      >
        <div className={styles.a_header}>
          <h2>Notification</h2>
          <button className={styles["a_clear-all"]}>Clear All</button>
        </div>
        <div className={styles["a_notification-list"]}>
          <h4>Today</h4>
          <div className={styles["a_notification-item"]}>
            <div className={`${styles.a_icon} ${styles["a_special-discount"]}`}>
              <i className="fa-solid fa-percent"></i>
            </div>
            <div className={styles.a_text}>
              <h3>30% Special Discount!</h3>
              <p>Special promotion only valid today</p>
            </div>
          </div>
          <div className={styles["a_notification-item"]}>
            <div className={`${styles.a_icon} ${styles["a_preparing-order"]}`}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className={styles.a_text}>
              <h3>Your Order has been Preparing</h3>
            </div>
          </div>
          <div className={styles["a_notification-item"]}>
            <div className={`${styles.a_icon} ${styles["a_Cancelled-order"]}`}>
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
            <div className={styles.a_text}>
              <h3>Your Order has been Cancelled</h3>
            </div>
          </div>
        </div>
        <div className={styles.a_footer}>
          <h4>Yesterday</h4>
        </div>
        <button className={styles["a_view-all"]}>View All</button>
      </div>
    </>
  );
};

export default WaiterNavbar;
