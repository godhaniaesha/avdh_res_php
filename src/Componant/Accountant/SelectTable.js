import React, { useEffect, useRef, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';
// import '../../Css/account_profile.css'; // Import your CSS file
// import '../../JS/account_profile'
import styl from "../../css/BillPayment.module.css"; 
import { useNavigate } from "react-router-dom";

const SelectTable = () => {
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false); // State for Change Password modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for Logout modal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown menu
    const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownMenu = dropdownRef.current;
      const toggleButton = document.getElementById("dropdownMenuLink");

      // Check if the click is outside the dropdown and the toggle button
      if (
        dropdownMenu &&
        !dropdownMenu.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Ensure dropdownRef is included in the dependency array

  useEffect(() => {
    // Get the value of loggedInUser from local storage
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Make an API call to http://localhost:209/SuperAdmin
    fetch("http://localhost:209/SuperAdmin")
      .then((response) => response.json())
      .then((data) => {
        // Find the matching admin email in the API response
        const matchingadmin = data.find(
          (admin) => admin.email === loggedInUser
        );

        // If a match is found, store the admin ID in local storage
        if (matchingadmin) {
          localStorage.setItem("loginadminId", matchingadmin.id);
          document.getElementById("accountant_name").textContent =
            matchingadmin.firstName;
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const toggleDrawer = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDrawerprofile = () => {
    setIsDropdownOpen((prev) => !prev);
    const drawer = document.getElementById("dropdownMenuLink");
    drawer.classList.toggle("open");

    const dropdownMenu = document.querySelector(".m_active.dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.toggle("show", drawer.classList.contains("open"));
    }
  };

  const profilesave = () => {
    // Implement your save logic here
    document.getElementById("imgModal").style.display = "block";
  };
    

  return (
    <>
      <h1>jsfaj</h1>
      <div id="a_selectTable">
        <nav className="navbar navbar-light bg-light shadow fixed-top a_navbar">
          <div className="d-flex align-items-center ms-2">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleDrawer}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="a_search">
              <input
                type="search"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="a_profile d-flex align-items-center justify-content-end float-end me-3">
              <i className="fa-solid fa-bell position-relative">
                <span className="position-absolute translate-middle p-2 rounded-circle"></span>
              </i>
              <div className="a_pro d-flex align-items-center align-content-center">
                <img src={require("../../Image/Ellipse 717.png")} alt="" />
                <div className="b_name dropdown a_profile ">
                  <a
                    className="btn dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={toggleDrawerprofile}
                  >
                    <span id="accountant_name"></span>
                  </a>
                  <div
                    className={`m_active dropdown-menu ${isDropdownOpen ? "show" : ""
                      }`}
                    aria-labelledby="dropdownMenuLink"
                    ref={dropdownRef} // Attach ref to the dropdown
                  >
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        setIsChangePassModalOpen(true); // Open Change Password modal
                        setIsDropdownOpen(false); // Close dropdown
                      }}
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
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        setIsLogoutModalOpen(true); // Open Logout modal
                        setIsDropdownOpen(false); // Close dropdown
                      }}
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
        <div className="a_drawer" id="a_drawer">
          <div className="list-group list-group-flush">
            <div className="a_logo">
              <h2>logo</h2>
            </div>
            <a
              href="Billpayment.html"
              className="list-group-item list-group-item-action"
            >
              <i className="fa-solid fa-house mr-2"></i> Dashboard
            </a>
            <a
              href="Customer-list.html"
              className="list-group-item list-group-item-action"
            >
              <i className="fa-solid fa-user mr-2s"></i> Customer
            </a>
            <a
              href="account_profile.html"
              className="list-group-item list-group-item-action"
            >
              <i className="fa-solid fa-user mr-2"></i> Profile
            </a>
          </div>
        </div>
        <div id="a_main-content">
          <div className="container-fluid a_main">
            <div className="m_add">
              <span>Profile</span>
            </div>
          </div>
          <form action="" id="add_chef_form" className="m_add_chef">
            <div className="row d-flex m_add_input m_chef_details">
              <div className="col-xs-12 col-md-6 m_add_input_pad">
                <div className="input-group m_add_input_mar">
                  <input
                    type="text"
                    className="form-control"
                    id="First_Name"
                    placeholder="First Name"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m_add_input_pad">
                <div className="input-group m_add_input_mar">
                  <input
                    type="text"
                    className="form-control"
                    id="Last_name"
                    placeholder="Last Name"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m_add_input_pad">
                <div className="input-group m_add_input_mar">
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    placeholder="Email"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m_add_input_pad">
                <div className="input-group m_add_input_mar">
                  <input
                    type="tel"
                    className="form-control"
                    id="Phone"
                    maxLength="10"
                    placeholder="Phone"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m_add_input_pad">
                <div className="w-100 m_add_input_mar" style={{ padding: 0 }}>
                  <select
                    className="form-control"
                    aria-label="Dish Category"
                    id="profession"
                  >
                    <option value="" disabled selected>
                      Profession
                    </option>
                    <option value="Accoutant">Accoutant</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Chef">Chef</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-xs-12 col-md-6 m_add_input_pad">
                <div className="w-100 m_add_input_mar">
                  <input
                    className="form-control m_add_file"
                    id="image"
                    placeholder="image"
                    type="file"
                    style={{ lineHeight: "1.1" }}
                  />
                </div>
              </div>
            </div>
            <div className="m_btn_clear_save">
              <div className="m_btn_save">
                <button
                  type="button"
                  onClick={profilesave}
                  data-toggle="modal"
                  data-target="#imgModal"
                >
                  <i className="fa-regular fa-floppy-disk"></i>Save Change
                </button>
              </div>
            </div>
          </form>

          {/* Backdrop for Change Password Modal */}
          {isChangePassModalOpen && (
            <div
              className="modal-backdrop fade show"
              onClick={() => setIsChangePassModalOpen(false)}
            ></div>
          )}
   {/* Change Password Modal */}
            

          {/* Backdrop for Logout Modal */}
          {isLogoutModalOpen && (
            <div
              className="modal-backdrop fade show"
              onClick={() => setIsLogoutModalOpen(false)}
            ></div>
          )}

        

          {/* Add Successfully Modal */}
          <div
            className="m_add_successfully modal fade"
            id="imgModal"
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="m_model modal-dialog modal-dialog-centered">
              <div
                className="modal-content m_save"
                style={{ border: "none", backgroundColor: "#f6f6f6" }}
              >
                <div className="modal-body m_save_text">
                  <span>Add Successfully!</span>
                </div>
                <div className="m_save_img">
                  <img src="image/right.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectTable;
