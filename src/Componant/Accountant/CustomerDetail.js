import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../css/CustomerDetail.module.css';
import Navbar from './Navbar';
import SidePanel from './SidePanel';
import { useNavigate, useParams } from 'react-router-dom';
import style from "../../css/BillPayment.module.css"
import styl from "../../css/BillPayment.module.css";

function CustomerDetail() {
    const { id } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false);
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

    useEffect(() => {
        // Fetch customer data
        let cd = "";
        fetch(`http://localhost:8000/api/getUser/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomerData(data.user);
                console.log("cust", data.user)
                cd = data.user.email;
                // Fetch orders only after customer data is successfully retrieved
                return fetch(`http://localhost:8000/api/allOrders`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(allOrders => {
                console.log("allOrders", allOrders);
                console.log("1111userEmail")
                if (allOrders && allOrders.orders) {
                    console.log("33333333333")
                    // console.log("userEmail", allOrders.orders[5].email);
                    // const userEmail = orders.user.email; // Get the email from the customer orders
                    const ord = allOrders.orders;
                    console.log(customerData)


                    const filteredOrders = ord.filter(order => order?.email === cd);

                    console.log("filteredOrders", filteredOrders);
                    setOrders(filteredOrders);
                }
            })
            .catch(error => {
                console.log("2222userEmail")
                console.error("Error fetching data:", error);
                setError("Could not fetch data.");
            });
    }, [id]);

    // Render error message if there's an error
    if (error) {
        return <div>{error}</div>;
    }

    // If customer data is not yet loaded, show loading message
    if (!customerData) {
        return <div>Loading...</div>;
    }

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
      
    return (
        <div id="a_selectTable">
            <Navbar showSearch={false} />
            <SidePanel isCustomerPage={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_customer}>
                        <div className={styles.m_customer_details}>
                            <span>Customer Details</span>
                        </div>
                        <div className="row m-0 p-0 w-100 flex-xl-nowrap flex-wrap">
                            <div className="col-xl-4 col-12 p-0">
                                <Nav variant="pills" className="flex-xl-column gap-xl-0 gap-2" id="pills-tab">
                                    {customerData ? (
                                        <Nav.Item key={customerData.id}>
                                            <Nav.Link className={styles.m_deta}>
                                                <div className={styles.m_name}>
                                                    <span >{customerData.firstName} {customerData.lastName}</span>
                                                </div>
                                                <div className={styles.m_details}>
                                                    <div className={styles.m_jay_mail}>
                                                        <span>Email<span className={styles.m_email}>:</span></span>
                                                        <span className={`${styles.m_jay} text-dark`}>{customerData.email}</span>
                                                    </div>
                                                    <div>
                                                        <span>Phone<span className={styles.m_phone}>:</span><span className="text-dark">{customerData.phone}</span></span>
                                                    </div>
                                                    <div className={styles.m_city_state_country}>
                                                        <div>
                                                            <span>City<span className={styles.m_city}>:</span><span className="text-dark">{customerData.city}</span></span>
                                                        </div>
                                                        <div>
                                                            <span>State<span className={styles.m_state}>:</span><span className="text-dark">{customerData.state}</span></span>
                                                        </div>
                                                        <div>
                                                            <span>Country<span className={styles.m_country}>:</span><span className="text-dark">{customerData.country}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    ) : (
                                        <div>No customer data available</div>
                                    )}
                                </Nav>
                            </div>

                            <div className="tab-content w-auto p-0" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel">
                                    <div className="col-12 col-xl-8 w-100 p-0">
                                        <div className={styles.m_table}>
                                            <table className="w-100">
                                                <thead>
                                                    <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading}>
                                                        <th className='text-nowrap'>Date</th>
                                                        <th className='text-nowrap'>Order ID</th>
                                                        <th className='text-nowrap'>Dish</th>
                                                        <th className='text-nowrap'>Amount</th>
                                                        <th className='text-nowrap'>Payment type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.length > 0 ? orders.map(order => (
                                                        <tr key={order._id} align="center">
                                                            <td align="center">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td align="center">#{order._id}</td>
                                                            <td align="center" style={{ whiteSpace: 'nowrap' }}>
                                                                {order.orderDish.map(dish => dish.dish.dishName).join(', ')}
                                                            </td>
                                                            <td align="center">₹{order.totalAmount}</td>
                                                            <td align="center">{order.paymentStatus}</td>
                                                        </tr>
                                                    )) : <tr><td colSpan="5">No orders available</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
            

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
            </div>
        </div>
    );
}

export default CustomerDetail;




