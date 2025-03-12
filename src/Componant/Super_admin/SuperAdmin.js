import React, { useEffect, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from "../../css/SuperAdmin.module.css"; // Ensure you have a corresponding CSS file
import SuperNavbar from "./SuperNavbar";
import SuperSidePanel from "./SuperSidePanel";
import ChangePasswordModal from "./ChangePasswordModal"; // Import the modal component
import Button from "react-bootstrap/Button";
import style from "../../css/BillPayment.module.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const SuperAdmin = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);

  // Define data first
  const [counts, setCounts] = useState({
    chefs: 0,
    waiters: 0,
    accountants: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
        const token = localStorage.getItem("authToken");
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            // Fetch all counts in parallel
            const [chefResponse, waiterResponse, accountantResponse] = await Promise.all([
                axios.post('http://localhost/avadh_api/super_admin/chef/view_chef.php', {}, { headers }),
                axios.post('http://localhost/avadh_api/super_admin/waiter/view_waiter.php', {}, { headers }),
                axios.post('http://localhost/avadh_api/super_admin/accountant/view_accountant.php', {}, { headers })
            ]);
            
            
            // Count the length of data arrays from each response
            setCounts({
                chefs: chefResponse.data.chefs ? chefResponse.data.chefs.length : 0,
                waiters: waiterResponse.data.data ? waiterResponse.data.data.length : 0,
                accountants: accountantResponse.data.data ? accountantResponse.data.data.length : 0
            });
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    fetchCounts();
}, []);

  const data = [
    { name: "Chefs", value: counts.chefs, color: "#62b2fc" }, // Blue
    { name: "Waiter", value: counts.waiters, color: "#9bdfc4" }, // Green
    { name: "Accountant", value: counts.accountants, color: "#f99bab" }, // Pink
  ];

  // Then calculate total using data
  const total = data.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {
    // Initialize chart
    const ctx = document.getElementById("myLineChart").getContext("2d");
    const myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "June",
          "July",
          "Aug",
          "Sept",
        ],
        datasets: [
          {
            label: "Monthly Data",
            data: [10, 30, 45, 60, 65, 70, 85, 100, 150],
            backgroundColor: "rgba(76, 93, 81, 0.1)",
            borderColor: "rgba(76, 93, 81, 1)",
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 150,
            ticks: {
              stepSize: 30,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Cleanup chart on component unmount
    return () => {
      myLineChart.destroy();
    };
  }, []);
  const toggleDrawer = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Check if Bootstrap's Modal is available
    if (window.bootstrap && window.bootstrap.Modal) {
      const logoutModal = document.getElementById("logoutModal");
      const modal = new window.bootstrap.Modal(logoutModal);
      modal.hide(); // Close the modal
    } else {
      console.error("Bootstrap Modal is not available");
    }

    // Remove the authToken from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId"); // Clear the userId if needed

    // Redirect to login page
    navigate("/login", { replace: true });

    window.history.pushState(null, "", window.location.href);
  };

  // Function to open the Change Password Modal
  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };
  const handlePasswordChange = async () => {
    // Validation checks
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    const token = localStorage.getItem("authToken");
    
    try {
      const formData = new FormData();
      formData.append('oldPassword', oldPassword);
      formData.append('newPassword', newPassword);
      formData.append('confirmPassword', confirmPassword);

      const response = await axios.post(
        'http://localhost/avadh_api/super_admin/profile/change_password.php',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      let responseData;
      if (typeof response.data === 'string') {
        try {
          const cleanJson = response.data.replace(/^\d+/, '');
          responseData = JSON.parse(cleanJson);
        } catch (e) {
          console.error('Error parsing response:', e);
          responseData = { success: false, message: 'Invalid response format' };
        }
      } else {
        responseData = response.data;
      }

      if (responseData.success === true) {
        alert(responseData.message || 'Password changed successfully');
        
        // Updated modal closing logic
        try {
          const changePasswordModal = document.getElementById("changepassModal");
          if (changePasswordModal) {
            const modalInstance = bootstrap.Modal.getInstance(changePasswordModal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        } catch (error) {
          console.error("Error closing modal:", error);
        }
        
        // Clear the password fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(responseData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error("Error changing password:", error);
      
      if (error.response) {
        try {
          let errorData;
          if (typeof error.response.data === 'string') {
            const cleanJson = error.response.data.replace(/^\d+/, '');
            errorData = JSON.parse(cleanJson);
          } else {
            errorData = error.response.data;
          }
          alert(errorData.message || 'Server error');
        } catch (e) {
          alert('Error processing server response');
        }
      } else if (error.request) {
        alert('No response from server. Please check your connection.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };
  return (
    <section id="a_selectTable">
      <SuperNavbar toggleDrawer={toggleDrawer} /> {/* Pass showSearch prop */}
      <SuperSidePanel isOpen={isSidebarOpen} issuper={true} />
      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.aesh_conf}`}>
          <div>
            <div className="row p-0 m-0">
              {/* Adjusted column classes for responsive design */}
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12 p-sm-3 p-0 d-flex justify-content-between align-items-center">
                <div className={styles.b_dashboard}>
                  <div className={styles.b_icon}>
                    <div className={styles.b_img1}>
                      <img
                        className={styles.b_img2}
                        src={require("../../Image/totalorder.png")}
                        alt="Total Order"
                      />
                    </div>
                  </div>
                  <div className={styles.b_text}>
                    <h1>100</h1>
                    <p>Total Order</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12 p-sm-3 p-0 d-flex justify-content-between align-items-center">
                <div className={styles.b_dashboard}>
                  <div className={styles.b_icon}>
                    <div className={styles.b_img1}>
                      <img
                        className={styles.b_img2}
                        src={require("../../Image/totalrevenue.png")}
                        alt="Total Revenue"
                      />
                    </div>
                  </div>
                  <div className={styles.b_text}>
                    <h1>128</h1>
                    <p>Total Revenue</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12 p-sm-3 p-0 d-flex justify-content-between align-items-center">
                <div className={styles.b_dashboard}>
                  <div className={styles.b_icon}>
                    <div className={styles.b_img1}>
                      <img
                        className={styles.b_img2}
                        src={require("../../Image/Group.png")}
                        alt="Total Chef"
                      />
                    </div>
                  </div>
                  <div className="b_text">
                  <h1>{counts.chefs}</h1>
                    <p>Total Chef</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-6 col-12 p-sm-3 p-0 d-flex justify-content-between align-items-center">
                <div className={styles.b_dashboard}>
                  <div className={styles.b_icon}>
                    <div className={styles.b_img1}>
                      <img
                        className={styles.b_img2}
                        src={require("../../Image/Group 84.png")}
                        alt="Total Waiter"
                      />
                    </div>
                  </div>
                  <div className="b_text">
                  <h1>{counts.waiters}</h1>
                    <p>Total Waiter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.b_chart}>
          <div className={styles.b_chart1}>
            <div>
              <h3>Monthly Order</h3>
              <div className="row justify-content-center">
                <div className="col-md-12 p-0" id="chartContainer">
                  <div
                    className="canvas_height"
                    style={{ height: "50vh", maxHeight: "50vh", width: "100%" }}
                  >
                    <canvas id="myLineChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.b_order_form} ${styles.orderfrom_all}`}>
            <div>
              <h3>Staff</h3>
            </div>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className={`${styles.x_dchart}`}
            >
              <div style={{ position: "relative" }}>
                {/* Increased Chart Size */}
                <PieChart width={350} height={350}>
                  <Pie
                    data={data}
                    cx={175} // Centering X
                    cy={175} // Centering Y
                    innerRadius={90} // Increased Inner Radius
                    outerRadius={130} // Increased Outer Radius
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>

                {/* Centered Total Value */}
                <h2
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {total}
                </h2>
              </div>

              {/* Legend */}
              <div
                style={{ marginLeft: "20px" }}
                className={`${styles.x_dotc} `}
              >
                {data.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                    className="justify-content-between"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      {" "}
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: entry.color,
                          borderRadius: "50%",
                          marginRight: "5px",
                        }}
                      ></div>
                      <span>{entry.name}</span>
                    </div>

                    <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`modal fade ${style.m_model_ChangePassword}`}
          id="changepassModal" // Ensure this ID matches
          tabIndex="-1"
          aria-labelledby="changepassModalLabel"
          aria-hidden="true"
        >
          <div
            className={`modal-dialog modal-dialog-centered ${style.m_model}`}
          >
            <div
              className={`modal-content ${style.m_change_pass}`}
              style={{ border: "none", backgroundColor: "#f6f6f6" }}
            >
              <div className={`modal-body ${style.m_change_pass_text}`}>
                <span>Change Password</span>
              </div>
              <div className={style.m_new}>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className={style.m_new}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className={style.m_confirm}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className={style.m_btn_cancel_change}>
                <div className={style.m_btn_cancel}>
                  <button data-bs-dismiss="modal">Cancel</button>
                </div>
                <div className={style.m_btn_change}>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#changepassModal"
                    onClick={handlePasswordChange}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Modal */}
        <div
          className={`modal ${styles.m_model_logout} fade`}
          id="logoutModal"
          tabIndex="-1"
          aria-labelledby="logoutModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`${styles.m_model_con} modal-content`}
              style={{ border: "none", backgroundColor: "#f6f6f6" }}
            >
              <div className={styles.m_log}>
                <div className={styles.m_logout}>
                  <span>Logout</span>
                </div>
                <div className={styles.m_text}>
                  <span>Are You Sure You Want To Logout?</span>
                </div>
                <div className={styles.m_btn_cancel_yes}>
                  <div className={styles.m_btn_cancel_logout}>
                    <button id="cancelBtn" data-bs-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                  <div className={styles.m_btn_yes}>
                    {/* <button id="yesBtn">Yes</button> */}
                    <button
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#logoutModal"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperAdmin;
