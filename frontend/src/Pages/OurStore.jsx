import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../Components/BreadCrumb.jsx";

import Meta from "../Components/Meta.jsx";
import ProductCard from "../Components/ProductCard.jsx";
import Color from "../Components/Color.jsx";
import { useSelector } from "react-redux";
import axios from "axios";
import { Base_Url2 } from "../Feature/Product/ProductSlice.jsx";
const OurStore = () => {

  const products = useSelector((state)=> state.product.products)
  const [ grid, setGrid ] = useState(4);
  const [category,setCategory]= useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [priceRange, setPriceRange] = useState({ from: '', to: '' });

  
  //console.log('category',category);

  const handleResetCategory = () => {
    setSelectedCategory(null);
  };

  const getAllproductCategory=async()=>{
    const token = localStorage.getItem('uoi-did');
    if(!token){
      throw new Error('User Not LoggedIn');
    }
    try {
      const response = await axios.get(`${Base_Url2}/category/getAllCategory`,{
        headers:{
          'Authorization': `Bearer ${token}`,
        }
      });
      //console.log('reponse scategory',response.data);
      setCategory(response.data.getCategory);
    } catch (error) {
      console.log('reponse scategory',error);
    }
  }
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(()=>{
    getAllproductCategory();
  },[]);

  // const filteredProducts = selectedCategory 
  // ? products.filter(prod => prod.category._id === selectedCategory._id) 
  // : products;

  const sortProducts = (products) => {
    switch (sortOption) {
      case "price-ascending":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-descending":
        return [...products].sort((a, b) => b.price - a.price);
      case "title-ascending":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case "title-descending":
        return [...products].sort((a, b) => b.title.localeCompare(a.title));
      case "created-ascending":
        return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "created-descending":
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "best-selling":
        return [...products].sort((a, b) => b.sold - a.sold);
      default:
        return products;
    }
  };

  //const sortedProducts = sortProducts(filteredProducts);

  const handlePriceChange = (e) => {
    const { id, value } = e.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [id]: value,
    }));
  };
  const filterByPrice = (products) => {
    const fromPrice = priceRange.from ? parseFloat(priceRange.from) : 0;
    const toPrice = priceRange.to ? parseFloat(priceRange.to) : Infinity;
  
    return products.filter((prod) => prod.price >= fromPrice && prod.price <= toPrice);
  };
  const filteredProducts = filterByPrice(
    selectedCategory
      ? products.filter((prod) => prod.category._id === selectedCategory._id)
      : products
  );
  
  const sortedProducts = sortProducts(filteredProducts);
      

  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <div className="store-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="filter-card mb-3">
                <h3 className="filter-title">Shop By Categories</h3>
                <div>
                  <ul className="ps-0">
                  {category.length > 0 ? (
                      <>
                        <li 
                          onClick={handleResetCategory}
                          style={{ cursor: 'pointer', color: selectedCategory === null ? 'blue' : 'black' }}
                        >
                          Reset Category
                        </li>
                        {category.map((category) => (
                          <li 
                            key={category._id} 
                            onClick={() => handleCategoryClick(category)}
                            style={{ cursor: 'pointer', color: selectedCategory?._id === category._id ? 'blue' : 'black' }}
                          >
                            {category.title}
                          </li>
                        ))}
                      </>
                    ) : (
                      <p>No categories found</p>
                    )}
                  </ul>
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Filter By</h3>
                <div>
                  <h5 className="sub-title"> Availability</h5>
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={""}
                        id=""
                      />
                      <label className="form-check-label" htmlFor="">
                        In Stock (2)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={""}
                        id=""
                      />
                      <label className="form-check-label" htmlFor="">
                        Out Of Stock (0)
                      </label>
                    </div>
                  </div>
                  <h5 className="sub-title"> Price</h5>
                  <div className="d-flex align-items-center gap-10">
                    <div className="form-floating">
                    <input
              type="number"
              className="form-control"
              style={{ height: "35px" }}
              id="from"
              value={priceRange.from}
              onChange={handlePriceChange}
            />
                      <label htmlFor="floatingInput">From</label>
                    </div>
                    <div className="form-floating">
                    <input
              type="number"
              className="form-control"
              style={{ height: "35px" }}
              id="to"
              value={priceRange.to}
              onChange={handlePriceChange}
            />
                      <label htmlFor="floatingInput">To</label>
                    </div>
                  </div>
                  <h5 className="sub-title">Colors</h5>
                  <div>
                   <Color />
                  </div>
                  <h5 className="sub-title">Size</h5>
                  <div className="ps-0">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={""}
                        id="color-1"
                      />
                      <label className="form-check-label" htmlFor="color-1">
                        S (2)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={""}
                        id="color-2"
                      />
                      <label className="form-check-label" htmlFor="color-2">
                        M (2)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Product Tags</h3>
                <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    HeadPhone
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Laptop
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Tv
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Mobile
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Speaker
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Mouse
                  </span>
                  <span className="badge bg-light text-secondary rounded-3 py-2 px-3">
                    Charger
                  </span>
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Random Products</h3>
                <div>
                  <div className="random-products mb-3 d-flex">
                    <div className="w-50">
                      <img
                        src="https://ik.imagekit.io/p66ljstle/images/watch.jpg?updatedAt=1710580566989"
                        className="img-fluid"
                        alt="watches"
                      />
                    </div>
                    <div className="w-50">
                      <h5>
                        Kids Watch bulk 10 pack multi colored for students
                      </h5>
                      <ReactStars
                        count={5}
                        size={25}
                        value={3}
                        edit={false}
                        activeColor={"#ffd700"}
                      />
                      <b>$ 300.70</b>
                    </div>
                  </div>
                  <div className="random-products d-flex">
                    <div className="w-50">
                      <img
                        src="https://ik.imagekit.io/p66ljstle/images/speaker.jpg?updatedAt=1710580563249"
                        className="img-fluid"
                        alt="watches"
                      />
                    </div>
                    <div className="w-50">
                      <h5>
                        Kids Watch bulk 10 pack multi colored for students
                      </h5>
                      <ReactStars
                        count={5}
                        size={25}
                        value={3}
                        edit={false}
                        activeColor={"#ffd700"}
                      />
                      <b>$ 300.70</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="filter-sort-grid mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-10">
                    <p className="mb-0" style={{ width: "100px" }}>
                      Sort By:{" "}
                    </p>
                    <select name="" className="form-control form-select" onChange={handleSortChange} value={sortOption}>
                    {/* <option value={"featured"}>Featured</option>
            <option value={"normal"}>Normal</option>
            <option value={"hot"}>Hot</option> */}
            <option value={"best-selling"}>Best Selling</option>
            <option value={"title-ascending"}>Alphabetically, A-Z</option>
            <option value={"title-descending"}>Alphabetically, Z-A</option>
            <option value={"price-ascending"}>Price, low to high</option>
            <option value={"price-descending"}>Price, high to low</option>
            <option value={"created-ascending"}>Date, old to new</option>
            <option value={"created-descending"}>Date, new to old</option>
                    </select>
                  </div>
                  <div className="d-flex align-items-center gap-10">
                    <p className="totalproducts mb-0 ">21 Products</p>
                    <div className="d-flex gap-10 align-items-center grid">
                      <img
                        onClick={() => {
                          setGrid(3);
                        }}
                        src="https://ik.imagekit.io/p66ljstle/images/gr4.svg?updatedAt=1710580558595"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                      <img
                        onClick={() => {
                          setGrid(4);
                        }}
                        src="https://ik.imagekit.io/p66ljstle/images/gr3.svg?updatedAt=1710580558524"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                      <img
                        onClick={() => {
                          setGrid(6);
                        }}
                        src="https://ik.imagekit.io/p66ljstle/images/gr2.svg?updatedAt=1710580558535"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                      <img
                        onClick={() => {
                          setGrid(12);
                        }}
                        src="https://ik.imagekit.io/p66ljstle/images/gr.svg?updatedAt=1710580555473"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="products-list pb-5">
                <div className="d-flex gap-10 flex-wrap">
                  <ProductCard grid={grid} products={sortedProducts} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurStore;
