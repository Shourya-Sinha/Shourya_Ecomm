import { Search } from "@mui/icons-material";
import {
  ArrowsClockwise,
  Heart,
  ShoppingBag,
  User,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { LogoutUser } from "../Feature/Auth/AuthSlice";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space } from "antd";
//import { getUserCartData } from "../Feature/Product/ProductSlice";

const Header = () => {
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const NoofProductinCart = useSelector(
    (state) => state.product.cartData.products.length
  );
  const NoofwishlistItem = useSelector(
    (state) => state.product.wishListItem.length
  );
  const CrtPrice = useSelector(
    (state) => state.product.cartData.cartTotal || 0
  );
  //console.log("no of product in cart", NoofwishlistItem);
  const newCartPrice = CrtPrice.toFixed(2);

  const handleLogout = () => {
    dispatch(LogoutUser());
  };
  const compareMultiProduct = useSelector((state) => state.product.compareMultiProduct);
  const moofProduct = compareMultiProduct.length
  //console.log("no of product in wishlist", moofProduct);

  // useEffect(() => {
  //   dispatch(getUserCartData());
  // }, [dispatch]);

  const items = [
    {
      key: "1",
      label: <p>Authentication</p>,
    },
    {
      key: "2",
      label: (
        <Link to={"/login"} className="mb-0">
          Login
        </Link>
      ),
      icon: <LoginOutlined />,
      disabled: isAuthenticated,
    },
    {
      key: "3",
      label: (
        <a className="mb-0" onClick={() => handleLogout()}>
          Logout
        </a>
      ),
      icon: <LogoutOutlined />,
      disabled: !isAuthenticated,
    },
    {
      key: "4",
      label: <Link to={'/profile'} className="mb-0">Profile</Link>,
      icon: <UserOutlined />,
      disabled: !isAuthenticated,
    },
  ];
  return (
    <>
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-6">
              <p className="text-white mb-0">
                Free Shipping Over $100 & Free Returns
              </p>
            </div>
            <div className="col-6">
              <p className="text-end text-white mb-0">
                Hotline:{" "}
                <a className="text-white" href="tel:+91 7856341289">
                  +91 7856341289{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-2">
              <h2>
                <Link className="text-white">EShopee</Link>{" "}
              </h2>
            </div>
            <div className="col-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="Search Product Here..."
                  aria-label="Search Product Here..."
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-3" id="basic-addon2">
                  <Search className="fs-6" />
                </span>
              </div>
            </div>
            <div className="col-5">
              <div className="header-upper-links d-flex align-items-center justify-content-between">
                <div>
                  <Link
                    to={"/compare-product"}
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <ArrowsClockwise size={32} color="white" />
                    
                    {/* <img src="../assets/images/compare.svg" alt="" /> */}
                    <p className="text-white mb-0">
                      Compare
                      <br /> Products
                    </p>
                    <Badge
                        count={show ? moofProduct : 0}
                        showZero
                        color="#febd69"
                      />
                  </Link>
                </div>
                <div>
                  <Link
                    to={"/wishlist"}
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <div className="d-flex">
                      <Heart size={32} color="white" />

                      <Badge
                        count={show ? NoofwishlistItem : 0}
                        showZero
                        color="#febd69"
                      />
                    </div>
                    {/* <img src="" alt="" /> */}
                  </Link>
                </div>

                <Dropdown
                  menu={{
                    items,
                  }}
                >
                  <a
                    className="text-decoration-none"
                    style={{ color: "white" }}
                    onClick={(e) => e.preventDefault()}
                  >
                    <Space>
                      <User size={32} color="white" />
                      {isAuthenticated ? (
                        <div className="d-flex flex-column">
                          <p className="mb-0">Hello,</p>{" "}
                          <p className="mb-0">{user.username}</p>{" "}
                        </div>
                      ) : (
                        <p>Login </p>
                      )}

                      {/* <DownOutlined /> */}
                    </Space>
                  </a>
                </Dropdown>

                <div>
                  <Link
                    to={"/cart"}
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <ShoppingBag size={32} color="white" />
                    {/* <img src="" alt="" /> */}
                    <div className="d-flex flex-column">
                      <span className="badge bg-white text-dark">
                        {NoofProductinCart ? NoofProductinCart : 0}{" "}
                      </span>
                      <p className="mb-0">
                        ${newCartPrice ? newCartPrice : 0.0}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <header className="header-bottom py-2\1">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center gap-30">
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 align-items-center d-flex"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="me-5 d-inline-block">
                        {" "}
                        Address Manage
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <Link className="dropdown-item text-white" to={"address"}>
                          Add Address
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="viewAddress">
                          Manage Address
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="/profile">
                         Profile
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="menu-links">
                  <div className="d-flex align-items-center gap-15">
                    <NavLink to={"/"}>Home</NavLink>
                    <NavLink to={"/store"}>Our Store</NavLink>
                    <NavLink to={"/blogs"}>Blogs</NavLink>
                    <NavLink to={"/contact"}>Contact</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
