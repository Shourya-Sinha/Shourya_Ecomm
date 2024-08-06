import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ myblogs }) => {
  //console.log("admin blogs in blogCard", myblogs);

  const placeholderImage = 'https://via.placeholder.com/300x200';

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
    return description;
  };

  return (
    <>
      {Array.isArray(myblogs) &&
        myblogs.map((blog) => (
          <div className="col-3" key={blog._id}>
          <div className="blog-card" >
            <div className="card-image">
              <img
                className="img-fluid w-100"
                src={blog.images.length > 0 ? blog.images[0].url : placeholderImage}
                style={{height:'200px',width:'200px',objectFit:'contain'}}
                //src="https://ik.imagekit.io/p66ljstle/images/blog-1.jpg?updatedAt=1710580551414"
                alt={blog.title || "Blog Image"}
              />
            </div>
            <div className="blog-content">
            <p className="date">{formatDate(blog.createdAt)}</p>
            <h5 className="title">{blog.title}</h5>
            <p className="desc">{truncateDescription(blog.description, 50)}</p>
            <div className="d-flex justify-content-between align-items-center">
            {/* <Link to={`/blog/${blog._id}`}  className="button">
                Read More
              </Link> */}
              <Link to={{
                    pathname: `/blog/${blog._id}`,
                    state: { blog }
                  }} className="button">
                    Read More
                  </Link>
              <p className="mb-0" style={{fontFamily:'Roboto',fontSize:'10px'}}>Written By: {blog.author}</p>
            </div>
             
            </div>
          </div>
          </div>
        ))}
    </>
  );
};

export default BlogCard;
