import React, { useEffect, useState } from "react";
import navbarmodule from "../../css/WaiterDashboaed.module.css";
import axios, { Axios } from "axios";
import styl from "../../css/BillPayment.module.css";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleDrawer, showSearch }) {
  const [loggedInUserName,setloggedInUserName] = useState('');
  const [userData, setUserData] = useState();
  const nevigate = useNavigate();
  console.log("loggedInUserId", loggedInUserName);


  const [dropdown,setDropDown] = useState(false);
  const handleDropdownClick = ()=>{
    setDropDown(!dropdown);
  }

  const token = localStorage.getItem('authToken');

  const getUser = async () => {
    const response = await axios.post(
      "http://localhost/avadh_api/Accountant/profile/change_profile.php",
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

  useEffect(() => {
    getUser();
  },[])

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
      className={`${navbarmodule.a_navbar} navbar navbar-light bg-light shadow fixed-top`}
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
        {/* {showSearch && (
          <div className={navbarmodule.a_search}>
            <input
              type="search"
              placeholder="Search..."
              className="search-input"
            />
          </div>
        )} */}
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center justify-content-end float-end me-3">
          <div
            className={`${navbarmodule.a_profile} d-flex align-items-center justify-content-end float-end me-3`}
          >
            <i class={`fa-solid fa-bell ${navbarmodule["fa-bell"]} position-relative`}>
              <span class="position-absolute translate-middle p-2 rounded-circle">
              </span>
            </i>
            <div className="a_pro d-flex align-items-center align-content-center">
              <img  src={`http://localhost/avadh_api/images/${userData?.image}`}  style={{width:"36px", height:"36px",borderRadius:"50%"}}  alt="" />
              <div className={`${navbarmodule.b_name} dropdown show`} onClick={handleDropdownClick}>
                <a
                  className="btn dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span >{userData?.firstName}</span>
                </a>
                <div
                  className={`${navbarmodule.m_active} dropdown-menu ${navbarmodule["dropdown-menu"]}`}
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
  );
}

export default Navbar;
