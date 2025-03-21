import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import { faL, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../../css/ChefVariant.module.css";
import style from "../../css/BillPayment.module.css";
import axios from 'axios';

function ChefVariant(props) {
    const [variants, setVariants] = useState([]); // State to hold variant data
    const [loading, setLoading] = useState(true); // State for loading status
    const [variantIdToDelete, setVariantIdToDelete] = useState(null); // State to hold the ID of the variant to delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to control modal visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [sortOption, setSortOption] = useState(""); // State for sort option
    
    const token = localStorage.getItem("authToken");

    // Empty dependency array means this effect runs once on mount


    const fetchVariants = async () => {
        const apiUrl = "http://localhost/avadh_api/chef/variant/view_variant.php"; // Ensure URL includes http://
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include the token in the headers
                }
            });
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) throw new Error("Failed to fetch data from the API");

            // Parse the JSON data from the response
            const data = await response.json();
            console.log("Fetched data:", data); // Log the fetched data for debugging

            setVariants(data.variants); // Assuming the response directly contains the variants array
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // Update loading state to indicate loading is complete
        }
    };

    const deleteVariantById = async (variantId) => {
        debugger
        const formData = new FormData();
        formData.append('var_id', variantId);
        if (!token) throw new Error("No authentication token found"); // Throw error if token is missing
        try {
            const response = await axios.post('http://localhost/avadh_api/chef/variant/delete_variant.php', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log("Variant deleted successfully");
                setVariants((prevVariants) => prevVariants.filter(variant => variant._id !== variantId)); // Update state
                setIsDeleteModalOpen(false);
                fetchVariants();
            } else {
                throw new Error("Failed to delete variant");
            }
        } catch (error) {
            console.error("Error deleting variant:", error);
        }
    };

    useEffect(() => {
        fetchVariants();
    }, []); 


    const handleEditClick = (variant) => {
        localStorage.setItem("variantId", JSON.stringify(variant._id));
        localStorage.setItem("variantData", JSON.stringify(variant));
    };

    const openDeleteModal = (variantId) => {
        setVariantIdToDelete(variantId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false); // Close modal
        setVariantIdToDelete(null); // Reset variant ID
    };

    const toggleNotifications = () => {
        const panel = document.getElementById("notification-panel");
        panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };
    // Function to sort variants based on selected option
    const sortVariants = (option) => {
        const sortedVariants = [...variants].sort((a, b) => {
            switch (option) {
                case 'A':
                    return a.dish.dishName.localeCompare(b.dish.dishName); // Sort by Dish Name A-Z
                case 'B':
                    return b.dish.dishName.localeCompare(a.dish.dishName); // Sort by Dish Name Z-A
                case 'E':
                    return a.category.categoryName.localeCompare(b.category.categoryName); // Sort by Category A-Z
                case 'F':
                    return b.category.categoryName.localeCompare(a.category.categoryName); // Sort by Category Z-A
                case 'C':
                    return a.price - b.price; // Sort by Price
                case 'D':
                    return a.variantName.localeCompare(b.variantName); // Sort by Variant Name A-Z
                default:
                    return 0; // No sorting
            }
        });
        setVariants(sortedVariants); // Update state with sorted variants
    };

    // Handle sort option change
    const handleSortChange = (event) => {
        const selectedOption = event.target.value;
        setSortOption(selectedOption); // Update sort option state
        sortVariants(selectedOption); // Sort variants based on selected option
    };

    // Function to filter variants based on search term (variant name only)
    const filteredVariants = variants.filter(variant =>
        variant.variantName.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by variant name
    );

    return (
        <section id={styles.a_selectTable}>
            <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
            <ChefSidePanel isOpen={isSidebarOpen} isChefVariant={true} />
            <div id={styles['a_main-content']}>
                <div className={styles['db_content-container']}>
                    <div className={`container-fluid ${styles.a_main}`}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div style={{ fontSize: '25px', fontWeight: '600' }}>Variant List</div>
                            <div className={`d-flex justify-content-between align-items-center ${styles.v_new_addz}`}>
                                <div className={`${styles.a_search} ${styles.v_search} m-0`}>
                                    <input
                                        type="search"
                                        placeholder="Search by Variant Name..."
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                                    />
                                </div>
                                <div>
                                    <select className={styles.v_search1} value={sortOption} onChange={handleSortChange}>
                                        <option value="" disabled>Sort by</option>
                                        <option value="A">Name A-Z</option>
                                        <option value="B">Name Z-A</option>
                                        <option value="E">Category A-Z</option>
                                        <option value="F">Category Z-A</option>
                                        <option value="C">Price</option>
                                        <option value="D">Variant Name</option>
                                    </select>
                                </div>
                                <div>
                                    <Link to={"/addVariant"}>
                                        <button
                                            type="button"
                                            className={`btn border text-white me-3 ${styles.v_btn_size2}`}
                                            style={{ backgroundColor: "#4B6C52" }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="text-white me-2" /> Add New
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.m_table} style={{ padding: '30px 10px', borderRadius: '5px' }}>
                        <table border="0" width="100%">
                            <thead>
                                <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading}>
                                    <th className='fw-normal'>Image</th>
                                    <th className='fw-normal'>Category</th>
                                    <th className='fw-normal'>Dish Name</th>
                                    <th className='fw-normal'>Variant Name</th>
                                    <th className='fw-normal'>Price</th>
                                    <th className='fw-normal'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                ) : (
                                    filteredVariants.length > 0 ? ( // Use filtered variants for display
                                        filteredVariants.map(variant => (
                                            <tr key={variant.id} align="center">
                                                <td className="text-center">
                                                    <img
                                                        src={`http://localhost/avadh_api/images//${variant.variantImage}`}
                                                        style={{ width: '60px' }}
                                                        alt="Variant"
                                                    />
                                                </td>
                                                <td className="text-center">{variant.category.categoryName}</td>
                                                <td className="text-center">{variant.dish.dishName}</td>
                                                <td className="text-center">{variant.variantName}</td>
                                                <td className="text-center">{variant.price}</td>
                                                <td className="text-center">
                                                    <div className={styles.m_table_icon}>
                                                        <div className={styles.m_pencile}>
                                                            <Link to={`/editVariant/${variant.id}`}>
                                                                <button className={`${styles['edit-butdish']} ${styles.v_btn_edit}`}>
                                                                    <i className="fa-solid fa-pencil"></i>
                                                                </button>
                                                            </Link>
                                                        </div>
                                                        <div className={styles.m_trash}>
                                                            <button onClick={() => openDeleteModal(variant.id)} className={`${styles['delete-button']} ${styles.v_btn_edit}`}>
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* <td className="text-center">
                                                    <button onClick={() => openDeleteModal(variant._id)} className={`${styles['delete-button']}`}>
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center">No variants available</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {isDeleteModalOpen && (
                        <div>
                            <div className="modal-backdrop fade show"></div>
                            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content" style={{ backgroundColor: "#F3F3F3", border: "none" }}>
                                        <div className="modal-body">
                                            <div className="text-center">
                                                <div className="m_delete" style={{ fontSize: "32px", fontWeight: 600, marginBottom: "25px" }}>
                                                    Delete
                                                </div>
                                                <div className="m_sure_delete" style={{ fontSize: "25px", fontWeight: 500, marginBottom: "45px" }}>
                                                    Are You Sure You Want To Delete?
                                                </div>
                                                {/* <div className="d-flex justify-content-center align-items-center my-3">
                                                    <button type="button" className="btn btn-secondary mx-3" onClick={closeDeleteModal}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn border text-white mx-3" style={{ backgroundColor: "#4b6c52" }} onClick={() => deleteVariantById(variantIdToDelete)}>
                                                        Yes
                                                    </button>
                                                </div> */}
                                                <div className="d-flex justify-content-center align-items-center my-3">
                                                    <button type="button" className="btn border-secondary border mx-3" onClick={closeDeleteModal}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn border text-white mx-3" style={{ backgroundColor: "#4b6c52" }} onClick={() => deleteVariantById(variantIdToDelete)}>
                                                        Yes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ChefVariant;
