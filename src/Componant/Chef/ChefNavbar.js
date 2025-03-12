import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import styles from "../../css/WaiterDashboaed.module.css";
import style from "../../css/BillPayment.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChefNavbar({ chefName, toggleDrawer, showSearch }) {

  const navigate = useNavigate();

  const [loggedInUserName, setloggedInUserName] = useState('');
  const [userData, setUserData] = useState();

  const [dropdown, setDropDown] = useState(false);
  const handleDropdownClick = () => {
    setDropDown(!dropdown);
  }
  const token = localStorage.getItem('authToken');

  const getUser = async () => {
    const response = await axios.post(
      "http://localhost/avadh_api/chef/profile/change_profile.php",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    setUserData(response.data.user)
    setloggedInUserName(response.data.user.firstName)
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
    navigate('/login');

  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <nav className={`navbar navbar-light bg-light shadow fixed-top ${styles.a_navbar}`}>
        <div className="d-flex align-items-center ms-2">
          <button className="navbar-toggler" type="button" onClick={toggleDrawer}>
            <span className="navbar-toggler-icon"></span>
          </button>
          {showSearch && (
            <div className={styles.a_search}>
              <input type="search" placeholder="Search..." className="search-input" />
            </div>
          )}
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-end float-end me-3">
            <div className={`dropdown ${styles.a_profile}`}>
              <i className={`fa-solid fa-bell ${styles["fa-bell"]} position-relative`}>
                <span className="position-absolute translate-middle p-2 rounded-circle">
                  {/* <!-- <span className="visually-hidden">New alerts</span> --> */}
                </span>
              </i>
            </div>
            <div className={`$styles['a_pro'] d-flex align-items-center align-content-center`}>
              <img src={`http://localhost/avadh_api/images/${userData?.image}`} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
              <div className={`${styles.b_name} dropdown show`} onClick={handleDropdownClick} >
                <a
                  className="btn dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span id="accountant_name">{userData?.firstName}</span>
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

      {/* Logout Modal */}
      <div
        className={`modal fade ${style.m_model_logout}`}
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className={`modal-content ${style.m_model_con}`}
            style={{ border: "none", backgroundColor: "#f6f6f6" }}
          >
            <div className={style.m_log}>
              <div className={style.m_logout}>
                <span>Logout</span>
              </div>
              <div className={style.m_text}>
                <span>Are You Sure You Want To Logout?</span>
              </div>
              <div className={style.m_btn_cancel_yes}>
                <div className={style.m_btn_cancel_logout}>
                  <button data-bs-dismiss="modal">Cancel</button>
                </div>
                <div className={style.m_btn_yes}>
                  {/* <button onClick={handleLogout}>Logout</button> */}
                  <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>


  );
}

export default ChefNavbar;