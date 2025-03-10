import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from "../../css/CustomerList.module.css"; // Import CSS styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Navbar from "./Navbar"; // Import Navbar component
import SidePanel from "./SidePanel"; // Import SidePanel component
import styl from "../../css/BillPayment.module.css";

import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation

function CustomerList(props) {
  const [customers, setCustomers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

  const loggedInUserId = localStorage.getItem("userId");
  console.log("loggedInUserId", loggedInUserId);

  // Fetch user details from the API using the logged-in user ID
  useEffect(() => {
    fetch(`http://localhost:8000/api/getUser/${loggedInUserId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((userData) => {
        console.log("userData", userData.user.firstName);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [loggedInUserId]);

  // Effect to fetch customer data on component mount
  useEffect(() => {
    fetchCustomers(); // Call fetchCustomers function to get customer data
  }, []);

  // Effect to sort customers whenever the sort option changes
  useEffect(() => {
    if (sortOption) {
      sortCustomers(sortOption);
    }
  }, [sortOption]); // Sort when sortOption changes

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Function to fetch customer data
  const fetchCustomers = () => {
    fetch("http://localhost:8000/api/allUsers")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data.users); // Log the fetched data for debugging

        // Check if data.users is an array before filtering
        if (Array.isArray(data.users)) {
          // Filter customers with role "Customer"
          const customerData = data.users.filter(customer => customer.role === "Customer");
          console.log("Filtered customer data:", customerData); // Log filtered data
          setCustomers(customerData); // Set the filtered customer data
          console.log('customeData', customerData);

        } else {
          console.error("Expected an array but received:", data.users);
          setCustomers([]); // Set to empty array if data.users is not an array
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));
  };

  // Function to sort customers based on selected option
  const sortCustomers = (option) => {
    const sortedCustomers = [...customers].sort((a, b) => {
      let comparison = 0;
      switch (option) {
        case "Name_A": // Name A-Z
          comparison = a.firstName.localeCompare(b.firstName);
          break;
        case "Name_Z": // Name Z-A
          comparison = b.firstName.localeCompare(a.firstName);
          break;
        case "Phone_A": // Phone A-Z
          comparison = a.phone.localeCompare(b.phone);
          break;
        case "Phone_Z": // Phone Z-A
          comparison = b.phone.localeCompare(a.phone);
          break;
        case "Email_A": // Email A-Z
          comparison = a.email.localeCompare(b.email);
          break;
        case "Email_Z": // Email Z-A
          comparison = b.email.localeCompare(a.email);
          break;
        case "OrderTotal_A": // Order Total Ascending
          comparison = a.billAmount - b.billAmount; // Assuming billAmount is a number
          break;
        case "OrderTotal_Z": // Order Total Descending
          comparison = b.billAmount - a.billAmount; // Assuming billAmount is a number
          break;
        case "CustomerSince_A": // Customer Since Ascending
          comparison = new Date(a.date) - new Date(b.date); // Assuming date is in a valid format
          break;
        case "CustomerSince_Z": // Customer Since Descending
          comparison = new Date(b.date) - new Date(a.date); // Assuming date is in a valid format
          break;
        default:
          break;
      }
      return comparison; // Return the comparison result
    });
    setCustomers(sortedCustomers); // Update state with sorted customers
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

        // Hide the modal after successful password change
        const changePasswordModal = document.getElementById('changepassModal');
        if (changePasswordModal) {
          changePasswordModal.classList.remove('show');
          changePasswordModal.style.display = 'none'; // Also set display to none

          // Remove the backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove(); // Remove the backdrop element
          }

          // Optionally, reset the modal content
          setNewPassword("");
          setConfirmPassword("");
        }

        return response.json();
      })
      .catch(error => {
        console.error("Error changing password:", error);
      });
  };
  const handleLogout = () => {
    if (window.bootstrap && window.bootstrap.Modal) {
      const logoutModal = document.getElementById('logoutModal');
      const modal = new window.bootstrap.Modal(logoutModal);
      modal.hide();
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");

    navigate("/login", { replace: true });

    window.history.pushState(null, '', window.location.href);
  };

  // Function to filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
  });

  return (
    <section id="a_selectTable">
      <Navbar toggleDrawer={toggleDrawer} showSearch={false} />
      <SidePanel isOpen={isSidebarOpen} isCustomerPage={true} />
      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={`${styles.m_chef_list}`}>
            <div className={styles.m_chef}>
              <span>Customer List</span>
            </div>
            <div className={`${styles.m_search} d-md-block d-flex flex-wrap`}>
              <input
                type="search"
                placeholder="Search..."
                className={`${styles["search-input"]} me-md-2 me-0`}
                value={searchQuery} // Bind search input to state
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
              <select
                className={`${styles.b_drop} me-md-2 me-0`}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)} // Update sort option
              >
                <option value="" disabled>Sort by</option>
                <option value="Name_A">Name A-Z</option>
                <option value="Name_Z">Name Z-A</option>
                <option value="Phone_A">Phone A-Z</option>
                <option value="Phone_Z">Phone Z-A</option>
                <option value="Email_A">Email A-Z</option>
                <option value="Email_Z">Email Z-A</option>
                <option value="OrderTotal_A">Order Total Ascending</option>
                <option value="OrderTotal_Z">Order Total Descending</option>
                <option value="CustomerSince_A">Customer Since Ascending</option>
                <option value="CustomerSince_Z">Customer Since Descending</option>
              </select>
              <Link to={"/addcustomer"}>
                <button>
                  <i className="fa-solid fa-plus" id={styles.aesh_icon}></i>Add
                  New
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`${styles.m_table}`}
          style={{
            padding: "30px 10px 300px 10px",
            borderRadius: "5px"
          }}
        >
          <table border="0" width="100%">
            <thead>
              <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading}>
                <td>Name</td>
                <td>Phone</td>
                <td>Email</td>
                <td>Order Total</td>
                <td>Customer Since</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? ( // Use filtered customers for rendering
                filteredCustomers.map((customer) => (
                  <tr align="center" className={styles.m_img} key={customer._id}>
                    <td align="center">{customer.firstName} {customer.lastName}</td>
                    <td align="center">{customer.phone}</td>
                    <td align="center">{customer.email}</td>
                    <td align="center">{customer.billAmount}</td>
                    <td align="center">{customer.date}</td>
                    <td>
                      <div className={styles.m_table_icon}>
                        <Link to={`/custdetail/${customer._id}`}>
                          <button>
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" align="center">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`modal fade ${styl.m_model_ChangePassword}`}
        id="changepassModal"
        tabIndex="-1"
        aria-labelledby="changepassModalLabel"
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered ${styl.m_model}`}>
          <div className={`modal-content ${styl.m_change_pass}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
            <div className={`modal-body ${styl.m_change_pass_text}`}>
              <span>Change Password</span>
            </div>
            <div className={styl.m_old}>
              <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            <div className={styl.m_new}>
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className={styl.m_confirm}>
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className={styl.m_btn_cancel_change}>
              <div className={styl.m_btn_cancel}>
                <button data-bs-dismiss="modal">Cancel</button>
              </div>
              <div className={styl.m_btn_change}>
                <button type="button" onClick={handlePasswordChange}>Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Logout Modal */}
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
    </section>
  );
}

export default CustomerList;


