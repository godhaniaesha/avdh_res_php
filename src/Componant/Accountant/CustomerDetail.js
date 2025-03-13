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
import axios from 'axios';

function CustomerDetail() {
    const { id } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
   const [dishes , setDishes]= useState([]);

    useEffect(() => {
        // Fetch customer data
        let cd = "";
        // fetch(`http://localhost:8000/api/getUser/${id}`)
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         setCustomerData(data.user);
        //         console.log("cust", data.user)
        //         cd = data.user.email;
        //         // Fetch orders only after customer data is successfully retrieved
        //         return fetch(`http://localhost:8000/api/allOrders`);
        //     })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(allOrders => {
        //         console.log("allOrders", allOrders);
        //         console.log("1111userEmail")
        //         if (allOrders && allOrders.orders) {
        //             console.log("33333333333")
        //             // console.log("userEmail", allOrders.orders[5].email);
        //             // const userEmail = orders.user.email; // Get the email from the customer orders
        //             const ord = allOrders.orders;
        //             console.log(customerData)


        //             const filteredOrders = ord.filter(order => order?.email === cd);

        //             console.log("filteredOrders", filteredOrders);
        //             setOrders(filteredOrders);
        //         }
        //     })
        //     .catch(error => {
        //         console.log("2222userEmail")
        //         console.error("Error fetching data:", error);
        //         setError("Could not fetch data.");
        //     });
        fetchDish()
    }, [id]);
    useEffect(()=>{
        fetchOrders();

    },[dishes])
    const fetchOrders= async()=>{
        // try {
            var formdata = new FormData();
            formdata.append('user_id', id);
            var response = await axios.post('http://localhost/avadh_api/Accountant/customer/customer_detail.php',formdata,{
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              });
              console.log(response.data);
              var data = response.data.order_data.map(item => {
                var order = dishes.filter(dish => dish.id === item.dish_id);
                console.log(order);
                var dish = order?.[0]?.dishName;
                return {...item, dishName:  dish};
              })
                setOrders( data );
                setCustomerData(response.data.data);
        // } catch (error) {
        //     alert('Something went wrong ! Try again');
        // }
    }
    const fetchDish  = async()=>{
        try {
            const response = await axios.post("http://localhost/avadh_api/chef/dish/view_dish.php", {});
            // if (!response.ok) throw new Error("Failed to fetch dishes");
            // const data = await response.json();
            // console.log("Fetched dishes data:", data);
            // if (Array.isArray(data.dish)) {
            console.log("Dishes fetched",response.data.data)
            setDishes(response?.data?.data);
            // } else {
            // console.error("Fetched dishes data is not an array:", data.dish);
            // setDishes([]);
            // }
          } catch (error) {
            console.error("Error fetching dishes:", error);
          }
    }
    // Render error message if there's an error
    if (error) {
        return <div>{error}</div>;
    }

    // If customer data is not yet loaded, show loading message
    // if (!customerData) {
    //     return <div>Loading...</div>;
    // }

      
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
                                                    {/* <div className={styles.m_city_state_country}>
                                                        <div>
                                                            <span>City<span className={styles.m_city}>:</span><span className="text-dark">{customerData.city}</span></span>
                                                        </div>
                                                        <div>
                                                            <span>State<span className={styles.m_state}>:</span><span className="text-dark">{customerData.state}</span></span>
                                                        </div>
                                                        <div>
                                                            <span>Country<span className={styles.m_country}>:</span><span className="text-dark">{customerData.country}</span></span>
                                                        </div>
                                                    </div> */}
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
                                                        <tr key={order.id} align="center">
                                                            <td align="center">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td align="center">#{order.id}</td>
                                                            <td align="center" style={{ whiteSpace: 'nowrap' }}>
                                                               {order.dishName}
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

            
            </div>
        </div>
    );
}

export default CustomerDetail;




