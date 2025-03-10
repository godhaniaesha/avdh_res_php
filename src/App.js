
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AccountProfile from "./Componant/Accountant/AccountProfile";
import CustomerList from "./Componant/Accountant/CustomerList";
import BillPayment from "./Componant/Accountant/BillPayement";
import AddCustomer from "./Componant/Accountant/AddCustomer";
import CustomerDetail from "./Componant/Accountant/CustomerDetail";
import Login from "./Componant/Login/Login";
import ForgotPassword from "./Componant/Login/ForgotPas";
import VerifyOTP from "./Componant/Login/VerifyOTP";
import ChangePass from "./Componant/Login/ChangePass";
import SuperAdmin from "./Componant/Super_admin/SuperAdmin";
import SuperChef from "./Componant/Super_admin/SuperChef";
import WaiterList from "./Componant/Super_admin/WaiterList";
import AccountList from "./Componant/Super_admin/AccountList";
import SuperProfile from "./Componant/Super_admin/SuperProfile";
import AddChef from "./Componant/Super_admin/AddChef";
import EditChef from "./Componant/Super_admin/EditChef";
import EditWaiter from "./Componant/Super_admin/EditWaiter";
import AddWaiter from "./Componant/Super_admin/AddWaiter";
import AddAccountant from "./Componant/Super_admin/AddAccountant";
import EditAccountant from "./Componant/Super_admin/EditAccountant";
import SuperTable from "./Componant/Super_admin/SuperTable";
import AddTable from "./Componant/Super_admin/AddTable";
import ChefDashboard from "./Componant/Chef/ChefDashboard";
import ChefMenuList from "./Componant/Chef/ChefMenuList";
import ChefCategory from "./Componant/Chef/ChefCategory";
import ChefVariant from "./Componant/Chef/ChefVariant";
import ChefProfile from "./Componant/Chef/ChefProfile";
import AddDish from "./Componant/Chef/AddDish";
import EditDish from "./Componant/Chef/EditDish";
import AddCategory from "./Componant/Chef/AddCategory";
import EditCategory from "./Componant/Chef/EditCategory";
import AddVeriant from "./Componant/Chef/AddVeriant";
import EditVeriant from "./Componant/Chef/EditVeriant";
import WaiterDashboaed from "./Componant/Waiter/WaiterDashboaed";
import WaiterMenu from "./Componant/Waiter/WaiterMenu";
import WaiterOrder from "./Componant/Waiter/WaiterOrder";
import WaiterProfile from "./Componant/Waiter/WaiterProfile";
import QuantityUpdater from "./Componant/Waiter/QuantityUpdater";
import SelectTable from "./Componant/Waiter/SelectTable";
import EditTable from "./Componant/Super_admin/EditTable";
import History from "./Componant/Chef/History";
import Cust_history from "./Componant/Accountant/Cust_history";


function App() {
  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/accountant" element={<BillPayment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpass" element={<ForgotPassword />} />
          <Route path="/changepass" element={<ChangePass />} />
          <Route path="/verifyotp" element={<VerifyOTP />} />
          <Route path="/customer" element={<CustomerList />} />
          <Route path="/addcustomer" element={<AddCustomer />} />
          <Route path="/custdetail/:id" element={<CustomerDetail />} />
          <Route path="/account" element={<AccountProfile />} />
          <Route path="/custhistory" element={<Cust_history />} />


          {/* superadmin  */}
          <Route path="/superadmin" element={<SuperAdmin></SuperAdmin>}></Route>
          <Route path="/supertable" element={<SuperTable></SuperTable>}></Route>
          <Route path="/superChef" element={<SuperChef></SuperChef>}></Route>
          <Route path="/superWaiter" element={<WaiterList></WaiterList>}></Route>
          <Route path="/superaccountlist" element={<AccountList></AccountList>}></Route>
          <Route path="/superprofile" element={<SuperProfile></SuperProfile>}></Route>
          <Route path="/addchef" element={<AddChef></AddChef>}></Route>
          <Route path="/editchef" element={<EditChef></EditChef>}></Route>
          <Route path="/addwaiter" element={<AddWaiter></AddWaiter>}></Route>
          <Route path="/editwaiter" element={<EditWaiter></EditWaiter>}></Route>
          <Route path="/addaccount" element={<AddAccountant></AddAccountant>}></Route>
          <Route path="/editaccount" element={<EditAccountant></EditAccountant>}></Route>
          {/* <Route path="/supertable" element={<SuperTable></SuperTable>}></Route> */}
          <Route path="/addtable" element={<AddTable></AddTable>}></Route>
          <Route path="/edittable" element={<EditTable></EditTable>} />
          <Route path="/editaccount" element={<EditAccountant></EditAccountant>}></Route>

          {/* Chef */}
          <Route path="/chef_board" element={<ChefDashboard />} />
          <Route path="/chef_menu" element={<ChefMenuList />} />
          <Route path="/chef_category" element={<ChefCategory />} />
          <Route path="/chef_variant" element={<ChefVariant />} />
          <Route path="/chefProfile" element={<ChefProfile />} />
          <Route path="/addDiah" element={<AddDish />} />
          <Route path="/editDish" element={<EditDish />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/editCategory" element={<EditCategory />} />
          <Route path="/addVariant" element={<AddVeriant />} />
          <Route path="/editVariant/:id" element={<EditVeriant />} />
          <Route path="/history" element={<History />} />

          {/* Waiter */}
          <Route path="/Waiter_Dashboard" element={<WaiterDashboaed />} />
          <Route path="/Select_Table" element={<SelectTable />} />
          <Route path="/Waiter_menu" element={<WaiterMenu />} />
          <Route path="/Waiter_order" element={<WaiterOrder />} />
          <Route path="/waiter_profile" element={<WaiterProfile />} />
          <Route path="/QuantityUpdater" element={<QuantityUpdater />} />
          

        </Routes>
      </Router>
    </>
  );
}

export default App;
