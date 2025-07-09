import { Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { changeOrderStatus, getAllOrder } from '../../../services/vendor/apiOrder';
import NewOrder from './components/newOrder';
import AllOrdersTable from './components/AllOrdersTable';
import { useNavigate } from 'react-router';

const { TabPane } = Tabs;

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new');

    const navigate = useNavigate()

    useEffect(() => {
        fetchOrderList(activeTab);
    }, [activeTab]);

    const fetchOrderList = async (type = 'all') => {
        setLoading(true);
        try {
            const res = await getAllOrder(type);
            setOrders(res.orders);
        } catch (error) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = (orderId) => {
        navigate(`${orderId}`)
    }

    const handleStatusChange = async (newStatus, orderId, time) => {
        setLoading(true);
        try {
            const payload = { status: newStatus };
            if ((newStatus === 'preparing' || newStatus === 'delay') && time) {
                payload.preparationTime = time;
            }
            const res = await changeOrderStatus(orderId, payload);
            message.success(`Order marked as ${res.order.orderStatus}`);
            fetchOrderList(activeTab); // refetch current tab's data
        } catch (error) {
            message.error('Failed to update order status');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Tabs defaultActiveKey="new" onChange={handleTabChange}>
            <TabPane tab="New Orders" key="new">
                <NewOrder
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            </TabPane>
            <TabPane tab="Processing Orders" key="ready">
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            </TabPane>
            <TabPane tab="All Orders" key="all">
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            </TabPane>
        </Tabs>
    );
}

export default Order;
