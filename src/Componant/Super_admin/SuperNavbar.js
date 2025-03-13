import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import styles from "../../css/SuperAdmin.module.css";
import axios, { Axios } from "axios";
import styl from "../../css/BillPayment.module.css";
import { useNavigate } from "react-router-dom";


function SuperNavbar({ adminName, toggleDrawer, showSearch }) {
  const loggedInUserName = localStorage.getItem("firstName");
  const [dropdown, setDropDown] = useState(false);
  const nevigate = useNavigate();

  const handleDropdownClick = () => {
    setDropDown(!dropdown);
  };

  console.log("loggedInUserId",loggedInUserName);

  const handleLogout = async () => {
    if (window.bootstrap && window.bootstrap.Modal) {
      const logoutModal = document.getElementById('logoutModal');
      const modal = new window.bootstrap.Modal(logoutModal);
      modal.hide();
    }

    const response = await axios.post("http://localhost/avadh_api/logout.php")

    localStorage.removeItem('authToken'); 
    console.log(response);
    nevigate('/login');

  };

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
            <div className={`${styles.b_name} dropdown show`} onClick={handleDropdownClick}>
              <a
                className="btn dropdown-toggle"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span id="accountant_name">{loggedInUserName || "admin"}</span>
              </a>
              <div
                className={`${styles.m_active} dropdown-menu ${styles["dropdown-menu"]}`}
                style={{ display: dropdown ? 'block' : 'none' }}
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

      
      {/* {/ Logout Modal /} */}
      <div
          className={`modal fade ${styl.m_model_logout}`}
          id="logoutModal"
          tabIndex="-1"
          aria-labelledby="logoutModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${styl.m_model_con}`}
              style={{ border: "none", backgroundColor: "#f6f6f6" }}
            >
              <div className={styl.m_log}>
                <div className={styl.m_logout}>
                  <span>Logout</span>
                </div>
                <div className={styl.m_text}>
                  <span>Are You Sure You Want To Logout?</span>
                </div>
                <div className={styl.m_btn_cancel_yes}>
                  <div className={styl.m_btn_cancel_logout}>
                    <button data-bs-dismiss="modal">Cancel</button>
                  </div>
                  <div className={styl.m_btn_yes}>
                    <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </nav>
  );
}

export default SuperNavbar;