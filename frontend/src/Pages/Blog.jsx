import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import BlogCard from "../Components/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import { Base_Url2 } from "../Feature/Product/ProductSlice";
import axios from "axios";

const Blog = () => {
  const adminBlogs = useSelector((state)=> state.product.AllBlogs || []);
  const [allCategory,setAllCategory]= useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getAllBlogCategory=async()=>{
    try {
      const token = localStorage.getItem('uoi-did');
      if (!token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(`${Base_Url2}/blogCategory/getAllBlogCategory`,{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      //console.log('response',response.data.getCategory);
      setAllCategory(response.data.getCategory);
    } catch (error) {
      //console.log('response error',error);
    }
  }

  useEffect(()=>{
    getAllBlogCategory();
  },[adminBlogs])
  //console.log('response',allCategory);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredBlogs = selectedCategory 
    ? adminBlogs.filter(blog => blog.category._id === selectedCategory._id) 
    : adminBlogs;

    const handleResetCategory = () => {
      setSelectedCategory(null);
    };
  return (
    <>
      <Meta title={"Blogs"} />
      <BreadCrumb title="Blogs" />
      <div className="blog-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="filter-card mb-3">
                <h3 className="filter-title pt-3">Find By Categories</h3>
                <div>
                   <ul className="ps-0">
                    {allCategory.length > 0 ? (
                      <>
                        <li 
                          onClick={handleResetCategory}
                          style={{ cursor: 'pointer', color: selectedCategory === null ? 'blue' : 'black' }}
                        >
                          Reset Category
                        </li>
                        {allCategory.map((category) => (
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
            </div>
            <div className="col-9">
              <div className="row">
              <BlogCard myblogs={filteredBlogs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
