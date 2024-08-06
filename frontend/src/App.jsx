import './App.css'
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import Layout from './Components/Layout.jsx';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import OurStore from './Pages/OurStore.jsx';
import Blog from './Pages/Blog.jsx';
import CompareProduct from './Pages/CompareProduct.jsx';
import Wishlist from './Pages/Wishlist.jsx';
import Login from './Pages/Login.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import Signup from './Pages/Signup.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import SingleBlog from './Pages/SingleBlog.jsx';
import TermsCondition from './Pages/TermsCondition.jsx';
import Refund from './Pages/Refund.jsx';
import ShippingPolicy from './Pages/ShippingPolicy.jsx';
import Policy from './Pages/Policy.jsx';
import Singlrroduct from './Pages/Singlrroduct.jsx';
import Cart from './Pages/Cart.jsx';
import Checkout from './Pages/Checkout.jsx';
import Shipping from './Pages/Shipping.jsx';
import Payment from './Pages/Payment.jsx';
import AddressAdd from './Pages/AddressAdd.jsx';
import ViewAddress from './Pages/ViewAddress.jsx';
import ProfileLayout from './Pages/Profile/ProfileLayout.jsx';
import DetailsPage from './Pages/Profile/DetailsPage.jsx';
import MyOrder from './Pages/Profile/MyOrder.jsx';
import Statics from './Pages/Profile/Statics.jsx';

function App() {

  return (
    <>
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='store' element={<OurStore />} />
        <Route path='product/:id' element={<Singlrroduct />} />
        <Route path='blogs' element={<Blog />} />
        <Route path='blog/:id' element={<SingleBlog />} />
        <Route path='compare-product' element={<CompareProduct />} />
        <Route path='wishlist' element={<Wishlist />} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        <Route path='cart' element={<Cart />} />
        <Route path='checkout' element={<Checkout />} />
        <Route path='address' element={<AddressAdd />} />
        <Route path='viewAddress' element={<ViewAddress />} />
        <Route path='ship' element={<Shipping />} />
        <Route path='payment' element={<Payment />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route path='policy' element={<Policy />} />
        <Route path='condition' element={<TermsCondition />} />
        <Route path='refund' element={<Refund />} />
        <Route path='shiping' element={<ShippingPolicy />} />
       </Route>
       <Route path='/profile' element={<ProfileLayout />}>
         <Route path='detail' element={<DetailsPage />} />
         <Route path='myOrder' element={<MyOrder />} />
         <Route path='statics' element={<Statics />} />
       </Route>
    </Routes>
   </BrowserRouter>
    </>
  )
}

export default App
