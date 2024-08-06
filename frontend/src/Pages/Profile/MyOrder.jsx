import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../Feature/Product/ProductSlice';
import { FolderViewOutlined } from '@ant-design/icons';

const MyOrder = () => {
    const orders = useSelector((state) => state.product.orderUserHistory);
     const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getAllOrders());
    },[dispatch]);
    //console.log('orders in page ',orders);
    const groupedOrders = groupOrdersById(orders);
  return (
    <>
    
<table className="table">
      <thead className="thead-dark">
        <tr>
            <th scope="col">SNo.</th>
          <th scope="col">Order ID</th>
          <th scope="col">Payment Method</th>
          <th scope="col">Amount</th>
          <th scope="col">Status</th>
          <th scope="col">Created Date</th>
          <th scope="col">Order Status</th>
          <th scope="col">Products</th>
          <th scope="col">View</th>
        </tr>
      </thead>
      <tbody>
        {groupedOrders.length > 0 ? (
          groupedOrders.map((order,index) => (
            <tr key={order._id} scope="row">
                <td scope="row">{index+1}</td>
              <td scope="row">{order._id}</td>
              <td scope="row">{order.paymentIntent.method}</td>
              <td scope="row">{order.paymentIntent.amount}</td>
              <td scope="row">{order.paymentIntent.status}</td>
              <td scope="row">{new Date(order.paymentIntent.created).toLocaleString()}</td>
              <td scope="row">{order.orderStatus}</td>
              <td>
                <ul>
                  {order.products.map((productItem, index) => (
                    <li key={index}>
                      {productItem.product.title} - {productItem.count} pcs
                    </li>
                  ))}
                </ul>
              </td>
              <td><FolderViewOutlined className='fs-5' /> </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No orders found</td>
          </tr>
        )}
      </tbody>
    </table>

    </>
  )
}
const groupOrdersById = (orders) => {
    const groupedOrders = {};
  
    orders.forEach(order => {
      const orderId = order._id; // Use order._id as a unique identifier
  
      if (!groupedOrders[orderId]) {
        groupedOrders[orderId] = {
          ...order,
          products: []
        };
      }
      groupedOrders[orderId].products = [
        ...groupedOrders[orderId].products,
        ...order.products
      ];
    });
  
    return Object.values(groupedOrders);
  };

export default MyOrder;