import React, { useState, useEffect } from 'react';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../css/ChefCategory.module.css';
import style from "../../css/BillPayment.module.css";

function ChefCategory(props) {
    const [categories, setCategories] = useState([]);  // State to store fetched categories
    const [catIdToDelete, setCatIdToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false);
    const [sortOrder, setSortOrder] = useState(""); // New state for sort order
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term

    // Fetch categories from the API when the component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    // Function to fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/allCategory");  // Corrected the URL
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            setCategories(data.category);  // Assuming 'category' is the array in the response
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const toggleNotifications = () => {
        const panel = document.getElementById("notification-panel");
        panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
    };

    // Function to delete a category by its ID
    const deleteCatById = async (catId) => {
        const deleteUrl = `http://localhost:8000/api/deleteCategory/${catId}`;  // Corrected the URL
        try {
            const response = await fetch(deleteUrl, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete category");
            console.log("Category deleted successfully");
            fetchCategories();  // Refetch categories after deletion
            closeDeleteModal();  // Close the modal after successful deletion
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    // Open modal to confirm deletion of a category
    const openDeleteModal = (catId) => {
        setCatIdToDelete(catId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCatIdToDelete(null);
    };

    // Navigate to the edit category page
    const openEditCategory = (catId) => {
        localStorage.setItem('ecatId', catId);
        navigate(`/editCategory`);
    };

    // ... existing code ...
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
                    // Remove the 'show' class directly
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
    // ... existing code ...


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

    // New function to handle sort order change
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Function to get sorted categories based on sortOrder
    const getSortedCategories = () => {
        if (sortOrder === "A") {
            return [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName));
        } else if (sortOrder === "B") {
            return [...categories].sort((a, b) => b.categoryName.localeCompare(a.categoryName));
        }
        return categories; // Return unsorted categories if no sort order is selected
    };

    // Function to filter categories based on search term
    const getFilteredCategories = () => {
        return getSortedCategories().filter(cat => 
            cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <section id={styles.a_selectTable}>
            <ChefNavbar toggleDrawer={toggleDrawer} toggleNotifications={toggleNotifications} showSearch={false}/>
            <ChefSidePanel isOpen={isSidebarOpen} isChefDashboard={false} isChefMenu={false} isChefCategory={true} isChefVariant={false} isChefProfile={false} />
            <div id={styles['a_main-content']}>
                <div className={styles['db_content-container']}>
                    <div className={`container-fluid ${styles.a_main}`}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div style={{ fontSize: '30px', fontWeight: '600' }}>Category List</div>
                            <div className={`d-flex justify-content-between align-items-center ${styles.v_new_addz}`}>
                                <div className={`${styles.a_search} ${styles.v_search} m-0`}>
                                    <input 
                                        type="search" 
                                        placeholder="Search..." 
                                        className={styles['search-input']} 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                                    />
                                </div>
                                <div>
                                    <select className={styles.v_search1} value={sortOrder} onChange={handleSortChange}>
                                        <option value="">Sort by</option>
                                        <option value="A">A-Z</option>
                                        <option value="B">Z-A</option>
                                    </select>
                                </div>
                                <div>
                                    <Link to={'/addCategory'}>
                                        <button type="button" className={`btn border text-white me-3 ${styles.v_btn_size2}`} style={{ backgroundColor: '#4B6C52' }}>
                                            <FontAwesomeIcon icon={faPlus} className="text-white me-2" /> Add New
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {
                            <div className={styles.m_table} style={{ padding: '30px 10px', borderRadius: '5px' }}>
                                <table border="0" width="100%" data-bs-spy="scroll">
                                    <thead>
                                        <tr align="center" bgcolor="#F3F3F3" color='#212529' className={styles.m_table_heading}>
                                            <th className='fw-light'>Image</th>
                                            <th className='fw-normal'>Category</th>
                                            <th className='fw-normal'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getFilteredCategories().map(cat => (  // Use filtered categories here
                                            <tr key={cat._id} align="center">
                                                <td className="text-center">
                                                    <img
                                                        src={`http://localhost:8000/${cat.categoryImage}`}
                                                        className={styles.v_menu_rowmar}
                                                        alt="Category"
                                                    />
                                                </td>
                                                <td className="text-center">{cat.categoryName}</td>
                                                <td className="text-center">
                                                    <div className={styles.m_table_icon}>
                                                        <div className={styles.m_pencile}>
                                                            <button onClick={() => openEditCategory(cat._id)} className={`${styles['edit-butdish']} ${styles.v_btn_edit}`}>
                                                                <i className="fa-solid fa-pencil"></i>
                                                            </button>
                                                        </div>
                                                        <div className={styles.m_trash}>
                                                            <button onClick={() => openDeleteModal(cat._id)} className={`${styles['delete-button']} ${styles.v_btn_edit}`}>
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div>
                    <div className="modal-backdrop fade show"></div>  {/* Modal backdrop */}
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
                                        <div className="d-flex justify-content-center align-items-center my-3">
                                            <button type="button" data-bs-dismiss="modal" className="btn b_button btn border-secondary border mx-3" onClick={closeDeleteModal}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn border text-white mx-3" style={{ backgroundColor: "#4b6c52" }} onClick={() => deleteCatById(catIdToDelete)}>
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
                        stylee={{ border: "none", backgroundColor: "#f6f6f6" }}
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
        </section>
    );
}

export default ChefCategory;       