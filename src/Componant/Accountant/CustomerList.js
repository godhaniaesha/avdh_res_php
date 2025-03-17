import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from "../../css/CustomerList.module.css"; // Import CSS styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Navbar from "./Navbar"; // Import Navbar component
import SidePanel from "./SidePanel"; // Import SidePanel component
import styl from "../../css/BillPayment.module.css";

import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

function CustomerList(props) {
  const [customers, setCustomers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
    fetchOrders();
  }, []);
  useEffect(() => {
    fetchCustomers();
  },[orders]);
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
  const fetchCustomers = async () => {
    // fetch("http://localhost:8000/api/allUsers")
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log("Fetched data:", data.users); // Log the fetched data for debugging

    //     // Check if data.users is an array before filtering
    //     if (Array.isArray(data.users)) {
    //       // Filter customers with role "Customer"
    //       const customerData = data.users.filter(customer => customer.role === "Customer");
    //       console.log("Filtered customer data:", customerData); // Log filtered data
    //       setCustomers(customerData); // Set the filtered customer data
    //       console.log('customeData', customerData);

    //     } else {
    //       console.error("Expected an array but received:", data.users);
    //       setCustomers([]); // Set to empty array if data.users is not an array
    //     }
    //   })
    //   .catch((error) => console.error("Error fetching customers:", error));

    var response = await axios.post('http://localhost/avadh_api/Accountant/customer/view_customer.php',{},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
    console.log('response123', response.data.data);
    var data = response.data.data.map(item => {
      var sum = 0;
      var order = orders.filter(order => order.orderDetails.userId === parseInt(item.id));
      console.log('hey',order);
      order.forEach(o => sum += o.orderDetails.totalAmount);
      return {...item, billingAmount: sum };
    }
    )
    console.log('response', orders);

    setCustomers(data); // Set the filtered customer data
  };
  const fetchOrders = async () => {
    // try {
      const response = await axios.post("http://localhost/avadh_api/Accountant/history/history.php", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // if (!response.ok) throw new Error("Network response was not ok");
      // const data = await response.json();
      console.log('heyeyeye',response.data.orders);
      setOrders(response.data.orders);
    // } catch (error) {
    //   console.error("Error fetching orders:", error);
    // }
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
          comparison = b.billingAmount - a.billingAmount; // Assuming billAmount is a number
          break;
        case "CustomerSince_A": // Customer Since Ascending
          comparison = new Date(a.createdAt) - new Date(b.createdAt); // Assuming date is in a valid format
          break;
        case "CustomerSince_Z": // Customer Since Descending
          comparison = new Date(b.createdAt) - new Date(a.createdAt); // Assuming date is in a valid format
          break;
        default:
          break;
      }
      return comparison; // Return the comparison result
    });
    setCustomers(sortedCustomers); // Update state with sorted customers
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
                filteredCustomers.map((customer) => {
                  return (
                  <tr align="center" className={styles.m_img} key={customer.id}>
                    <td align="center">{customer.firstName} {customer.lastName}</td>
                    <td align="center">{customer.phone}</td>
                    <td align="center">{customer.email}</td>
                    <td align="center">{customer.billingAmount}</td>
                    <td align="center">{customer.createdAt.slice(0,10)}</td>
                    <td>
                      <div className={styles.m_table_icon}>
                        <Link to={`/custdetail/${customer.id}`}>
                          <button>
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan="6" align="center">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
 
    </section>
  );
}

export default CustomerList;


