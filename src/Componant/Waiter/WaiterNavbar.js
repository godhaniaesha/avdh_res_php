import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from "../../css/WaiterDashboaed.module.css";
import axios, { Axios } from "axios";
import styl from "../../css/BillPayment.module.css";
import { useNavigate } from "react-router-dom";

const WaiterNavbar = ({ toggleDrawer, toggleNotifications, waiterName, showSearch, setSearchQuery }) => {
  const [loggedInUserName, setloggedInUserName] = useState('');
  const [userData, setUserData] = useState();
  const nevigate = useNavigate();
  console.log("loggedInUserId", loggedInUserName);
  var token;
  useEffect(() => {
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    dropdownElementList.forEach((dropdownToggleEl) => {
      new bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);
  useEffect(() => {
    // const loggedInUser = localStorage.getItem("userId");
    token = localStorage.getItem("authToken");
    // axios.post('')
    // const response = axios.post("http://localhost/avadh_api/chef/category/view_category.php", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // console.log('profile',response);
    // setWaiterName(matchingWaiter.firstName);

    getUser();
    // console.log(token1);
    // setToken(token1);
  }, []);
  const getUser = async () => {
    const token = localStorage.getItem('authToken');
    console.log("Token:", token);

    // const response = await axios.post("http://localhost/avadh_api/waiter/profile/change_profile.php",{},{
    //   // headers: {
    //   //   Authorization: `Bearer ${token}`,
    //   //   "Content-Type": "application/json",
    //   // },
    // });
    const response = await axios.post(
      "http://localhost/avadh_api/waiter/profile/change_profile.php",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    console.log("profile", response.data.user);
    setUserData(response.data.user)
    setloggedInUserName(response.data.user.firstName)
  }

  const [dropdown,setDropDown] = useState(false);
  const handleDropdownClick = ()=>{
    setDropDown(!dropdown);
  }

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
              {userData?.image ? <img src={`http://localhost/avadh_api/images/${userData?.image}`} alt={userData?.image} style={{width:"36px", height:"36px",borderRadius:"50%"}} ></img>
                :
                <img src={require("../../Image/Ellipse 717.png")} alt="" />
              }
              {/* <img src={require("../../Image/Ellipse 717.png")} alt="" /> */}
              <div className={`${styles.b_name} dropdown show`}>
                <a
                  className="btn dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={handleDropdownClick}
                >
                  <span id="accountant_name">{loggedInUserName}</span>
                </a>
                <div
                  className={`${styles.m_active} dropdown-menu ${styles["dropdown-menu"]}`}
                  aria-labelledby="dropdownMenuLink"
                  style={{ display: dropdown ? 'block' : 'none' }}
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
