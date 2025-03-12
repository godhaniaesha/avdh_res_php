import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from "../../css/CustomerList.module.css"; // Import CSS styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Navbar from "./Navbar"; // Import Navbar component
import SidePanel from "./SidePanel"; // Import SidePanel component
import styl from "../../css/BillPayment.module.css";

import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

function Cust_history(props) {
  const [customers, setCustomers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();
  const [history, setHistory] = useState([])

  const token = localStorage.getItem("authToken");

  const loggedInUserId = localStorage.getItem("userId");
  console.log("loggedInUserId", loggedInUserId);

  // Fetch user details from the API using the logged-in user ID
  //  useEffect(() => {
  //    fetch(`http://localhost:8000/api/getUser/${loggedInUserId}`)
  //      .then((response) => {
  //        if (!response.ok) {
  //          throw new Error('Network response was not ok');
  //        }
  //        return response.json();
  //      })
  //      .then((userData) => {
  //        console.log("userData", userData.user.firstName);
  //      })
  //      .catch((error) => console.error("Error fetching user data:", error));
  //  }, [loggedInUserId]);

  // Effect to fetch customer data on component mount
  //  useEffect(() => {
  //    fetchCustomers(); // Call fetchCustomers function to get customer data
  //  }, []);

  // Effect to sort customers whenever the sort option changes
  //  useEffect(() => {
  //    if (sortOption) {
  //      sortCustomers(sortOption);
  //    }
  //  }, [sortOption]); // Sort when sortOption changes

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


  const fetchHistory = () => {
    axios.post("http://localhost/avadh_api/Accountant/history/history.php", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.orders)
          setHistory(response.data.orders)
        } else {
          console.error("Expected an array of dishes but received:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  };

  useEffect(() => {
    fetchHistory();
  }, [])

  // Function to sort customers based on selected option
  const sortHistory = (option) => {
    setHistory((prevHistory) => {
      const sortedHistory = [...prevHistory].sort((a, b) => {
        let comparison = 0;
        switch (option) {
          case "OrderID_A": // Order ID A-Z
            comparison = String(a.id).localeCompare(String(b.id));
            break;
          case "OrderID_Z": // Order ID Z-A
            comparison = String(b.id).localeCompare(String(a.id));
            break;

          case "Date_A": // Date (Oldest First)
            comparison = new Date(a.createdAt) - new Date(b.createdAt);
            break;
          case "Date_Z": // Date (Newest First)
            comparison = new Date(b.createdAt) - new Date(a.createdAt);
            break;
          case "Customer_A": // Customer Name A-Z
            comparison = a.username.localeCompare(b.username);
            break;
          case "Customer_Z": // Customer Name Z-A
            comparison = b.username.localeCompare(a.username);
            break;
          case "Amount_A": // Amount Ascending
            comparison = a.totalAmount - b.totalAmount;
            break;
          case "Amount_Z": // Amount Descending
            comparison = b.totalAmount - a.totalAmount;
            break;
          case "Status_A": // Paid first
            comparison = a.paymentStatus === "Paid" ? -1 : 1;
            break;
          case "Status_Z": // Unpaid first
            comparison = a.paymentStatus === "Paid" ? 1 : -1;
            break;
          default:
            break;
        }
        return comparison;
      });

      return sortedHistory;
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
      <SidePanel isOpen={isSidebarOpen} isCustHistory={true} />
      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={`${styles.m_chef_list}`}>
            <div className={styles.m_chef}>
              <span>History</span>
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
                onChange={(e) => {
                  setSortOption(e.target.value);
                  sortHistory(e.target.value);
                }}
              >
                <option value="" disabled>Sort by</option>
                <option value="OrderID_A">Order ID (A-Z)</option>
                <option value="OrderID_Z">Order ID (Z-A)</option>
                <option value="Date_A">Date (Oldest First)</option>
                <option value="Date_Z">Date (Newest First)</option>
                <option value="Customer_A">Customer Name (A-Z)</option>
                <option value="Customer_Z">Customer Name (Z-A)</option>
                <option value="Amount_A">Amount (Low to High)</option>
                <option value="Amount_Z">Amount (High to Low)</option>
                <option value="Status_A">Status (Paid)</option>
                <option value="Status_Z">Status (Unpaid)</option>
              </select>
              {/* <Link to={"/addcustomer"}>
                  <button>
                    <i className="fa-solid fa-plus" id={styles.aesh_icon}></i>Add
                    New
                  </button>
                </Link> */}
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
                <td>Order ID</td>
                <td>Date</td>
                <td>Customer Name</td>
                <td>Amount</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? ( // Use filtered customers for rendering
                history.map((history) => (
                  <tr align="center" className={styles.m_img} key={history.id}>
                    <td align="center">{history.id}</td>
                    <td align="center">{new Date(history.createdAt).toLocaleDateString("en-GB")}</td>
                    <td align="center">{history.username}</td>
                    <td align="center">₹ {history.totalAmount}</td>
                    <td align="center" className={history.paymentStatus === "Paid" ? "text-success" : "text-danger"}>{history.paymentStatus}</td>
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

export default Cust_history;