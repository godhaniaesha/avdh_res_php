import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "../../css/SuperAdmin.module.css";


function SuperNavbar({ adminName, toggleDrawer, showSearch }) {
  const loggedInUserName = localStorage.getItem("firstName");
  console.log("loggedInUserId",loggedInUserName);

  return (
    <nav
      className={`navbar navbar-light bg-light shadow fixed-top ${styles.a_navbar}`}
    >
      <div className="d-flex align-items-center ms-2">
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
            />
          </div>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div
          className={`${styles.a_profile} d-flex align-items-center justify-content-end float-end me-3`}
        >
          <i className={`fa-solid fa-bell ${styles["fa-bell"]} position-relative`}>
            <span className="position-absolute translate-middle p-2 rounded-circle">
              {/* <!-- <span class="visually-hidden">New alerts</span> --> */}
            </span>
          </i>
          <div
            className={`${styles.a_pro} d-flex align-items-center align-content-center`}
          >
            <img src={require("../../Image/Ellipse 717.png")} alt="" />
            <div className={`${styles.b_name} dropdown show`}>
              <a
                className="btn dropdown-toggle"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span id="accountant_name">{loggedInUserName || "admin"}</span> {/* Default text if name is empty */}
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
  );
}

export default SuperNavbar;