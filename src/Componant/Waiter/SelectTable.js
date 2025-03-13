import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import WaiterNavbar from './WaiterNavbar';
import WaiterSidePanel from './WaiterSidePanel';
import styles from "../../css/SelectTable.module.css";
import styl from "../../css/BillPayment.module.css"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SelectTable(props) {
    const [tables, setTables] = useState([]);
    const [chosenTable, setChosenTable] = useState('');
    const [guestCount, setGuestCount] = useState(1);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    let token
    useEffect(() => {
    token = localStorage.getItem("authToken");
        fetchTablesFromApi();
    }, []);

    const fetchTablesFromApi = async () => {
        // try {
            const response = await axios.post("http://localhost/avadh_api/super_admin/tables/view_tables.php", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

            // if (!response.ok) {
            //     throw new Error('Failed to fetch tables');
            // }
            console.log('tables', response.data.tables );
            // const data = await response.json();
            // console.log("Fetched data:", data);

            // if (data && Array.isArray(data.tables)) {
                const tableElements = response.data.tables.map(table => ({
                    id: table.id,
                    number: table.tableName,
                    selected: false,
                    count: table.tableGuest,
                    guestCount: 1,
                    status: table.status // Assuming your API returns a status field
                }));

                setTables(tableElements);
            // } else {
            //     console.error("Error: API response is not in the expected format", data);
            //     alert('Unexpected data format received from the API.');
            // }
        // } catch (error) {
        //     console.error('Error fetching tables:', error);
        //     alert('Failed to load table data. Please try again later.');
        // }
    };

    const handleTableClick = (tableId) => {
        // alert('');
        const newTable = tables.find(table => table.id === tableId);
        if (newTable.status === false) {
            return; // Do nothing if the table status is true (disabled)
        }
        if (chosenTable === newTable.number) {
            return; // If the table is already selected, do nothing
        }
        const previousChosenTable = tables.find(table => table.selected);
        if (previousChosenTable) {
            previousChosenTable.selected = false;
        }
        console.log('SSS',newTable);
        newTable.selected = true;
        setChosenTable(newTable.id);
        setGuestCount(newTable.guestCount);

        setTables([...tables]); // Trigger re-render with updated table data
    };

    const handleContinue = async () => {
        if (!chosenTable) {
            alert('Please select a table first.');
            return;
        }

        const selectedTable = tables.find(table => table.id === chosenTable);
        console.log('selectedTable',selectedTable);
        var name = selectedTable.number.split(" ");
        console.log(name[1]);
        const formData = new FormData();
        formData.append("table_id", selectedTable.id);
        formData.append("tableName", parseInt(name[1]));
        formData.append("tableGuest", selectedTable.count);
        formData.append("status", true);
        // console.log('datattta',data);
        try {
            await axios.post(`http://localhost/avadh_api/super_admin/tables/update_tables.php`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
            });

            localStorage.setItem('bookTable', JSON.stringify(selectedTable));
            localStorage.setItem("tableId", selectedTable.id);
            navigate('/waiter_menu');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };


    const toggleNotifications = () => {
        const panel = document.getElementById("notification-panel");
        panel.style.display =
            panel.style.display === "none" || panel.style.display === ""
                ? "block"
                : "none";
    };

    const handleGuestCountChange = (tableId, increment) => {
        setTables(tables.map(table => {
            if (table.id === tableId) {
                const newGuestCount = increment ? Math.min(table.guestCount + 1, table.count) : Math.max(1, table.guestCount - 1);
                return { ...table, guestCount: newGuestCount };
            }
            return table;
        }));
        // setGuestCount(guestCount);
    };

    
    let count =0;
    return (
        <section id={styles.a_selectTable}>
            <WaiterNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
            <WaiterSidePanel isOpen={isSidebarOpen} iswaiterdashboard={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <h3 className={styles.a_title}>Select Table</h3>

                    {/* Tables Container */}
                    <div className={`${styles.a_tables} row row-cols`}>
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                className={`${styles.a_stable} position-relative col ${table.selected ? styles.chosen : ''}`}
                                id={table.id}
                                onClick={() => handleTableClick(table.id)}
                                style={{
                                    fontSize: '20px',
                                    backgroundColor: table.status == 'true' ? '#4B6C52' : '', // Change background color if status is true
                                    pointerEvents: table.status == 'true' ? 'none' : 'auto' // Disable click if status is true
                                }}
                            >
                                {/* Table number display */}
                                <p className={`${styles.a_tNo} position-absolute top-50% text-transfrom`}>{table.tableName}</p>
                                <img src={require('../../Image/table-big.png')} alt="Table" />

                                {/* Guest Count Control */}
                    
                                <div className={`${styles.a_counter}`} >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGuestCountChange(table.id, false);
                                        }}
                                    >
                                        −
                                    </button>
                                    <span>{table.guestCount}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGuestCountChange(table.id, true);
                                        }}
                                        disabled={table.tableGuest>= table.count}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Continue Button Section */}
                    <div className={styles.a_continue}>
                        {console.log('tabllllll',chosenTable)}
                        <div className={`${styles.a_tbl_gst} d-flex align-items-center justify-content-between`}>
                            <h5>
                                <i className="fa-solid fa-bell-concierge mr-2 p-2"></i>TABLE :
                                <span className="p-1" id="chooes_table">{chosenTable}</span>
                            </h5>
                            <h5>
                                <i className="fa-solid fa-user mr-2-group p-2"></i>GUEST :
                                <span className="p-1" id="member">{tables.find(table => table.number === chosenTable) ? guestCount  : 1}</span>
                            </h5>
                        </div>
                        <button type="button" className="btn w-100" onClick={handleContinue}>Continue</button>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            
        </section>
    );
}

export default SelectTable;
