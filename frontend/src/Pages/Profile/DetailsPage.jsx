import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Base_Url2 } from '../../Feature/Product/ProductSlice';
import { Button, Form, Input, Modal } from 'antd';

const DetailsPage = () => {
    const user = useSelector((state)=> state.auth.isLoggedIn);
    const [myDetails, setMyDetails] = useState({});
    //console.log('mydetails',myDetails);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const placeholderImage = 'https://via.placeholder.com/200';
    //console.log('mydetails',myDetails);
    const handleGetMyDetails =async()=>{
        try {
            const token = localStorage.getItem('uoi-did');
            if (!token) {
                throw new Error("User not authenticated");
            }
            const response = await axios.get(`${Base_Url2}/auth/user/my-detail`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            //console.log('My details',response.data);
            setMyDetails(response.data.user);
        } catch (error) {
            //console.log('error in page ',error);
        }
    }
    //console.log('user in details page ',user);
    useEffect(()=>{
        handleGetMyDetails()
    },[user]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setMessage('You can only upload JPG/PNG files!');
                return;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                setMessage('Image must be smaller than 2MB!');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file); // Store the file itself, not the data URL
                setMessage('');
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!image) {
            setMessage('No image selected!');
            return;
        }

        const formData = new FormData();
        formData.append('images', image); // Match field name expected by backend

        setLoading(true);
        const token = localStorage.getItem('uoi-did');
        if (!token) {
            setMessage('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${Base_Url2}/auth/user/updateAuser`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response:', response);
            setMessage('Image uploaded successfully!');
            handleGetMyDetails();
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Error uploading image');
        } finally {
            setLoading(false);
        }
    };
    



  const handleFormSubmit =async (values)=>{
    //e.preventDefault();
    try {
        const token = localStorage.getItem('uoi-did');
        if(!token){
            throw new Error('User not authenticated');
        }
        const response = await axios.put(`${Base_Url2}/auth/user/updateAuser`,values,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log('updated user',response.data);
        setIsModalOpen(false);
        handleGetMyDetails();
    } catch (error) {
        console.log('Error in updating',error);
    }
  }
  const showModal = () => {
    setIsModalOpen(true);
};

const handleCancel = () => {
    setIsModalOpen(false);
};

    if (!user) {
        return <h1>Please login to view your details</h1>
    }
    
  return (
    <>
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4 ">
            <div className='d-flex justify-content-center align-items-center border-right mt-2 pt-5'>
            <img
            src={myDetails.image && myDetails.image.length > 0 ? myDetails.image[0].url : placeholderImage}
            //src={myDetails.image[0]?.url } onError={(e)=>{e.target.src="https://th.bing.com/th/id/OIP.2kuONkNHcwQ2y7DTyoiX8AHaHa?w=190&h=190&c=7&r=0&o=5&pid=1.7"; e.target.error=null}}
            alt="Profile"
            className="img-fluid rounded-circle"
            style={{ maxWidth: '200px' }}
          />
            </div>
         
          <div className='d-flex justify-content-center mt-2'>
          <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="fileInput" className="form-label">Upload Image</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                {image && (
                                    <div className="mb-3">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="img-fluid"
                                            style={{ maxHeight: '100px' }}
                                        />
                                    </div>
                                )}
                                {message && (
                                    <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                                        {message}
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Uploading...' : 'Upload'}
                                </button>
                            </form>
          </div>
         
        </div>
        <div className="col-md-8">
          <div className="p-4">
            <h2 className="mb-4">User Details</h2>
            <div className="mb-3 d-flex aslign-items-center" style={{fontFamily:'Roboto'}}>
              <h6 className="mb-1 ">Name - </h6>
              <p className='mb-0 px-1'>{`${myDetails.firstname || 'N/A'} ${myDetails.lastname || 'N/A'}`}</p>
            </div>
            <div className="mb-3 d-flex aslign-items-center" style={{fontFamily:'Roboto'}}>
              <h6 className="mb-1">Email - </h6>
              <p className='px-2'>{myDetails.email || 'N/A'}</p>
            </div>
            <div className="mb-3 d-flex aslign-items-center" style={{fontFamily:'Roboto'}}>
              <h6 className="mb-1">Phone Number - </h6>
              <p className='px-2'>{myDetails.phoneNo || 'N/A'}</p>
            </div>
            <div className="mb-3 d-flex aslign-items-center" style={{fontFamily:'Roboto'}}>
              <h6 className="mb-1">Address - </h6>
              <p className='px-2'>
                        {`${myDetails.address?.apartment || 'N/A'} ${myDetails.address?.address || 'N/A'}, ${myDetails.address?.city || 'N/A'}, ${myDetails.address?.state || 'N/A'}`}
                    </p>
            </div>
            <div className="mb-3 d-flex aslign-items-center" style={{fontFamily:'Roboto'}}>
              <div className='d-flex align-items-center'>
              <h6 className="mb-0 d-flex align-items-center">Are you Exposed Person <p className='mb-0' style={{fontSize:'8px'}}>(You are Blocked by Admin)</p> - </h6>
              </div>
              <p className='px-2 mb-0'>{myDetails.isBlocked ? 'Yes' : 'No'} </p>
            </div>
            <Button type="primary" onClick={showModal}>
                            Edit Details
                        </Button>
            {/* Add more user details as needed */}
            <Modal
                title="Edit User Details"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        //rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        //rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input type="email" />
                    </Form.Item> */}
                    <Form.Item
                        label="Phone Number"
                        name="phoneNo"
                        //rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* <Form.Item
                        label="Apartment"
                        name="apartment"
                    >
                        <Input />
                    </Form.Item> */}
                    {/* <Form.Item
                        label="Address"
                        name="address"
                    >
                        <Input />
                    </Form.Item> */}
                    {/* <Form.Item
                        label="City"
                        name="city"
                    >
                        <Input />
                    </Form.Item> */}
                    {/* <Form.Item
                        label="State"
                        name="state"
                    >
                        <Input />
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Details
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default DetailsPage