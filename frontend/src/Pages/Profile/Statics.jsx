import React from 'react'
import { Pie } from '@ant-design/charts';
import { Column } from '@ant-design/charts';
import { Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useSelector } from 'react-redux';

const Statics = () => {
    const orderStats = useSelector((state)=> state.product.categoryTotals);
    //console.log('order status page statics', orderStats)
    const hasData = orderStats && Object.keys(orderStats).length > 0;

  // Convert categoryTotals object to an array if data exists
  const data = hasData ? Object.keys(orderStats).map(key => ({
    type: key,
    value: orderStats[key],
   })) : []; // Default to an empty array if no dat

      const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        label: {
          // Use a valid type or omit it
          offset: '-30%',
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        interactions: [{ type: 'element-active' }],
      };
      
    const dataa = hasData ? Object.keys(orderStats).map(key => ({
        type: key,  // Use the key as the type/category
        sales: orderStats[key],
      })) : []; 
      //console.log('dataa sales value',dataa.orderStats,)
    
    //   const configg = {
    //     data: dataa,
    //     xField: 'type',
    //     yField: 'sales',
    //     label: {
    //       // Use a valid position or omit the position property
    //       style: {
    //         fill: '#FFFFFF',
    //         opacity: 0.6,
    //       },
    //     },
    //     meta: {
    //         type: { alias: 'Category' },
    //         sales: { alias: 'Sales' },
    //     },
    //   };
    const configg = {
        data: dataa,
        xField: 'type',
        yField: 'sales',
        label: {
          //position: 'middle', // Make sure this is a valid position for Column chart
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        meta: {
          type: { alias: 'Category' },
          sales: { alias: 'sales' },
        },
        xAxis: {
          title: {
            text: 'Category', // Label for x-axis
          },
        },
        yAxis: {
          title: {
            text: 'sales', // Label for y-axis
          },
        },
        tooltip: {
          showMarkers: false,
        },
      };
  return (
    <>
     <Layout>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <h1>Statistics Dashboard</h1>
      </Header>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-8">
              <Column {...configg} />
            </div>
            <div className="col-4">
              {hasData ? (
                <Pie {...config} />
              ) : (
                <p>No data available</p> // Placeholder message when there's no data
              )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
    
    
    </>
  )
}

export default Statics;