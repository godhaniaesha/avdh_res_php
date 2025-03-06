import React from "react";
import navbarmodule from "../../css/WaiterDashboaed.module.css";

function Navbar({ toggleDrawer, showSearch }) {
  const loggedInUserName = localStorage.getItem("firstName");
  console.log("loggedInUserId", loggedInUserName);
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
                {/* <!-- <span class="visually-hidden">New alerts</span> --> */}
              </span>
            </i>
            <div className="a_pro d-flex align-items-center align-content-center">
              <img src={require("../../Image/Ellipse 717.png")} alt="" />
              <div className={`${navbarmodule.b_name} dropdown show`}>
                <a
                  className="btn dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span >{loggedInUserName}</span>
                </a>
                <div
                  className={`${navbarmodule.m_active} dropdown-menu ${navbarmodule["dropdown-menu"]}`}
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
    </nav>
  );
}

export default Navbar;
