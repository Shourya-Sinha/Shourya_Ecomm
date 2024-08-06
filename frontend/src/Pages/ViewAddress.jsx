import React, { useEffect, useState } from "react";
import Meta from "../Components/Meta";
import BreadCrumb from "../Components/BreadCrumb";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    changeDefaultAddress,
  deleteAddressUser,
  getUserAddress,
  updateUserAddress,
} from "../Feature/UserInfo/UserInfoSlice";
import NotificationComponent from "../Components/NotificationComponent";
import { Link } from "react-router-dom";
import { Button, Checkbox, Form, Input, Modal } from "antd";

const ViewAddress = () => {
  const dispatch = useDispatch();
  const allAddresses = useSelector((state) => state.userInfo.allAddress);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getUserAddress());
  }, [dispatch]);

  const handleDelete = (addressId) => {
    dispatch(deleteAddressUser(addressId));
  };

  const showEditModal = (address) => {
    setCurrentAddress(address);
    //console.log('address',address);
    form.setFieldsValue(address);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log("id in page", currentAddress._id);
    form
      .validateFields()
      .then((values) => {
        //console.log('form values:', values);  // Add this line to check form values
        dispatch(updateUserAddress(currentAddress._id, values));
        setIsModalOpen(false);
      })
      .catch((info) => {
        //console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDefaultChange = (addressId) => {
    dispatch(changeDefaultAddress(addressId));
    dispatch(getUserAddress())
  };

  return (
    <>
      <Meta title={"View All Address"} />
      <BreadCrumb title="View All Address" />

      <div className="checkout-wrapper home-wrapper-2 py-5">
        <div className="container mx-auto">
          <div className="row">
            <div className="col-12">
              <h4 className="form-title">View All Address</h4>
              <NotificationComponent />
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">SNo.</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone No.</th>
                    <th scope="col">Address.</th>
                    <th scope="col">State</th>
                    <th scope="col">City</th>
                    <th scope="col">Zip.</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>

                <tbody>
                  {allAddresses.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No Address Found
                      </td>
                    </tr>
                  ) : (
                    allAddresses.map((address, index) => (
                      <tr key={address._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{address.firstName + " " + address.lastName}</td>
                        <td>{address.email}</td>
                        <td>+91 {address.mobileNo}</td>
                        <td>{address.address}</td>
                        <td>{address.state}</td>
                        <td>{address.city}</td>
                        <td>{address.zipCode}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-15">
                            <EditOutlined
                              onClick={() => showEditModal(address)}
                              className="fs-5"
                              style={{ color: "#0d6efd" }}
                            />
                            <DeleteOutlined
                              onClick={() => handleDelete(address._id)}
                              className="fs-5"
                              style={{ color: "#C40C0C" }}
                            />
                            <Checkbox
                              checked={address.isDefault}
                              onChange={() => handleDefaultChange(address._id)}
                            >
                              Default
                            </Checkbox>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="mt-5 d-flex justify-content-center">
                <Link to={"/address"}>Add New Addres</Link>
              </div>
            </div>
          </div>
          <Modal
            title="Edit Address"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                Save
              </Button>,
            ]}
          >
            {/* <Form form={form} layout="vertical" name="edit_address">
              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="firstName" label="First Name">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="lastName" label="Last Name">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="mobileNo" label="Mobile No.">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="alternateNo" label="Alternate No.">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div>
                <Form.Item name="email" label="Email">
                  <Input />
                </Form.Item>
              </div>

              <div>
                <Form.Item name="address" label="Address">
                  <Input />
                </Form.Item>
              </div>
              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item
                    name="apartment"
                    label="Enter House No.,Apartments,suits,etc"
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="nearby" label="Nearby Loaction">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="country" label="Country">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="state" label="State">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="city" label="City">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="zipCode" label="Zip Code">
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form> */}
            <Form form={form} layout="vertical" name="edit_address">
              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="firstName" label="First Name">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="lastName" label="Last Name">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="mobileNo" label="Mobile No.">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="alternateNo" label="Alternate No.">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div>
                <Form.Item name="email" label="Email">
                  <Input />
                </Form.Item>
              </div>

              <div>
                <Form.Item name="address" label="Address">
                  <Input />
                </Form.Item>
              </div>
              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item
                    name="apartment"
                    label="Enter House No.,Apartments,suits,etc"
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="nearby" label="Nearby Location">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="country" label="Country">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="state" label="State">
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-10">
                <div className="flex-grow-1">
                  <Form.Item name="city" label="City">
                    <Input />
                  </Form.Item>
                </div>
                <div className="flex-grow-1">
                  <Form.Item name="zipCode" label="Zip Code">
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ViewAddress;
