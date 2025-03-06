import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from '../../css/SuperAdmin.module.css'; // Ensure you have a corresponding CSS file
import SuperNavbar from "./SuperNavbar";
import SuperSidePanel from "./SuperSidePanel";
import ChangePasswordModal from './ChangePasswordModal'; // Import the modal component
import Button from 'react-bootstrap/Button';
import style from "../../css/BillPayment.module.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



const SuperAdmin = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);

  // Define data first
  const data = [
    { name: "Chefs", value: 10, color: "#64B5F6" }, // Blue
    { name: "Waiter", value: 20, color: "#A5D6A7" }, // Green
    { name: "Accountant", value: 30, color: "#F48FB1" }, // Pink
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
    setIsSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    // Check if Bootstrap's Modal is available
    if (window.bootstrap && window.bootstrap.Modal) {
      const logoutModal = document.getElementById('logoutModal');
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

    window.history.pushState(null, '', window.location.href);
  };


  // const handlePasswordChange = () => {
  //   // Check if new password and confirm password match
  //   if (newPassword !== confirmPassword) {
  //     alert("Passwords do not match.");
  //     return;
  //   }

  //   // Make sure password is not empty
  //   if (!newPassword || !confirmPassword) {
  //     alert("Please enter a new password.");
  //     return;
  //   }

  //   const userId = localStorage.getItem("userId");

  //   if (!userId) {
  //     console.error("User ID is not available.");
  //     return;
  //   }

  //   const passwordData = {
  //     newPassword: newPassword, // Send new password
  //     confirmPassword: confirmPassword // Send confirm password
  //   };

  //   // Send the PUT request to update the password
  //   fetch(`http://localhost:8000/api/updateuser/${userId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(passwordData), // Send password data
  //   })
  //     .then(response => {
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       return response.json();
  //     })
  //     .then(data => {
  //       alert("Password changed successfully!");
  //       const changePasswordModal = document.getElementById('changepassModal');
  //       const modal = new window.bootstrap.Modal(changePasswordModal);
  //       modal.hide();
  //     })
  //     .catch(error => {
  //       alert("Failed to change password. Please try again.");
  //       console.error("Error changing password:", error);
  //     });
  // };

  // const handlePasswordChange = () => {
  //   // Validate password match
  //   if (newPassword !== confirmPassword) {
  //     alert("Passwords do not match.");
  //     return;
  //   }

  //   // Validate password not empty
  //   if (!newPassword || !confirmPassword) {
  //     alert("Please enter a new password.");
  //     return;
  //   }

  //   // Get user ID from local storage
  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     console.error("User ID is not available.");
  //     return;
  //   }

  //   // Prepare password data for API
  //   const passwordData = {
  //     newPassword: newPassword,
  //     confirmPassword: confirmPassword
  //   };

  //   // Send PUT request to update password
  //   fetch(`http://localhost:8000/api/updateuser/${userId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(passwordData),
  //   })
  //     .then(response => {
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       return response.json();
  //     })
  //     .then(data => {
  //       // Success handling
  //       alert("Password changed successfully!");

  //       // Reset password fields
  //       setNewPassword('');
  //       setConfirmPassword('');

  //       // Close the modal by calling onHide prop
  //       props.onHide();
  //     })
  //     .catch(error => {
  //       // Error handling
  //       alert("Failed to change password. Please try again.");
  //       console.error("Error changing password:", error);
  //     });
  // };

  // Function to open the Change Password Modal
  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };
  const handlePasswordChange = () => {
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Make sure password is not empty
    if (!newPassword || !confirmPassword) {
      alert("Please enter a new password.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const passwordData = {
      newPassword: newPassword, // Send new password
      confirmPassword: confirmPassword // Send confirm password
    };

    console.log(passwordData);


    // Send the PUT request to update the password
    fetch(`http://localhost:8000/api/updateuser/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        console.log(response);
        const changePasswordModal = document.getElementById('changepassModal');
        console.log(changePasswordModal);

        const modal = new window.bootstrap.Modal(changePasswordModal);
        console.log(modal);

        if (modal) {
          modal.hide();
        } else {
          const newModal = new window.bootstrap.Modal(changePasswordModal);
          newModal.hide();
        }
        setNewPassword("");
        setConfirmPassword("");
        return response.json();

      })
      .catch(error => {
        console.error("Error changing password:", error);
      });
  };
  return (
    <section id="a_selectTable">
      <SuperNavbar toggleDrawer={toggleDrawer} /> {/* Pass showSearch prop */}
      <SuperSidePanel isOpen={isSidebarOpen} issuper={true} />

      <div id={styles['a_main-content']}>
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
                    <h1>12</h1>
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
                    <h1>20</h1>
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
                  <div className="canvas_height" style={{ height: "50vh", maxHeight: "50vh", width: "100%" }}>
                    <canvas id="myLineChart" ></canvas>""
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.b_order_form} ${styles.orderfrom_all}`}>
            <div>
              <h3>Staff</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center" }} className={`${styles.x_dchart}`}>
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
      <div style={{ marginLeft: "20px" }} className={`${styles.x_dotc} `}>
        {data.map((entry, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
            className="justify-content-between"
          >
            <div className="d-flex align-items-center justify-content-center"> <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: entry.color,
                borderRadius: "50%",
                marginRight: "5px",
              }}
            ></div>
            <span>{entry.name}</span></div>
           
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <PieChart width={300} height={300}>
                <Pie
                  data={data}
                  cx={150}
                  cy={150}
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div style={{ marginLeft: "20px" }}>
                {data.map((entry, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: entry.color,
                        borderRadius: "50%",
                        marginRight: "5px",
                      }}
                    ></div>
                    <span>{entry.name}</span>
                    <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{entry.value}</span>
                  </div>
                ))}
                <h2 style={{ marginTop: "10px" }}>{total}</h2> 
              </div>
            </div> */}
            {/* <div>
              <div className={styles['b_Dine-in']}>
                <div className={styles.b_dine_in1}>
                  <img
                    className={styles.b_img}
                    src={require("../../Image/Icon_Order.png")}
                  />
                  <span>Dine-in</span>
                </div>
                <div className={styles['b_skill-bar']}>
                  <div className={styles['b_skill-level']} style={{ width: "85%" }}></div>
                </div>
                <span className={styles['skill-value']}>85%</span>
              </div>
            </div>
            <div>
              <div className={styles['b_Dine-in']}>
                <div className={styles.b_dine_in1}>
                  <img
                    className={styles.b_img}
                    src={require("../../Image/Icon_Order (1).png")}
                  />
                  <span>Takeaway</span>
                </div>
                <div className={styles['b_skill-bar']}>
                  <div className={styles['b_skill-level']} style={{ width: "40%" }}></div>
                </div>
                <span className={styles['skill-value']}>40%</span>
              </div>
            </div>
            <div>
              <div className={styles['b_Dine-in']}>
                <div className={styles.b_dine_in1}>
                  <img
                    className={styles.b_img}
                    src={require("../../Image/Icon_Order (2).png")}
                  />
                  <span className={styles['O_mr']}>Online</span>
                </div>
                <div className={styles['b_skill-bar']}>
                  <div className={styles['b_skill-level']} style={{ width: "30%" }}></div>
                </div>
                <span className={styles['skill-value']}>30%</span>
              </div>
            </div> */}
          </div>
          {/* b_order_form orderfrom_425 this class code added here */}
      
        </div>

        {/* Button to open Change Password Modal */}
        {/* <Button variant="primary" onClick={openChangePasswordModal}>
          Change Password
        </Button> */}
        {/* Change Password Modal */}
        <div
          className={`modal fade ${style.m_model_ChangePassword}`}
          id="changepassModal"  // Ensure this ID matches
          tabIndex="-1"
          aria-labelledby="changepassModalLabel"
          aria-hidden="true"
        >
          <div className={`modal-dialog modal-dialog-centered ${style.m_model}`}>
            <div className={`modal-content ${style.m_change_pass}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
              <div className={`modal-body ${style.m_change_pass_text}`}>
                <span>Change Password</span>
              </div>
              <div className={style.m_new}>
                <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              </div>
              <div className={style.m_new}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className={style.m_confirm}>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className={style.m_btn_cancel_change}>
                <div className={style.m_btn_cancel}>
                  <button data-bs-dismiss="modal">Cancel</button>
                </div>
                <div className={style.m_btn_change}>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#changepassModal" onClick={handlePasswordChange}>Change</button>
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
                    <button id="cancelBtn" data-bs-dismiss="modal">Cancel</button>
                  </div>
                  <div className={styles.m_btn_yes}>
                    {/* <button id="yesBtn">Yes</button> */}
                    <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
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