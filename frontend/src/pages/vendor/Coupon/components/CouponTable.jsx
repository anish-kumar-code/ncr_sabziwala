import { Avatar, Button, Space, Spin, Switch, Table } from 'antd'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { updateStatus } from '../../../../services/vendor/apiCoupon';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoryTable = ({ searchText, data, onEdit, onDelete, loading }) => {

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            align: "center"
        },
        {
            title: 'Discount value',
            dataIndex: 'discountValue',
            key: 'discountValue',
            align: "center"
        },
        {
            title: 'minimum orderAmount',
            dataIndex: 'minOrderAmount',
            key: 'minOrderAmount',
            align: "center"
        },
        {
            title: 'Use Limit',
            dataIndex: 'usageLimit',
            key: 'usageLimit',
            align: "center"
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: (_, record) => (
                <Switch defaultChecked={record?.status === "active"} onChange={(checked) => updateStatus(record._id, checked)} />
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}>Edit</Button>
                    <Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}>Delete</Button>
                </Space>
            )
        }
    ];

    const filtredData = data.filter((item) => item?.code?.toLowerCase().includes(searchText.toLowerCase()))

    return <Table
        // dataSource={dataSource.filter(item => item.categoryName.toLowerCase().includes(searchText.toLowerCase()))}
        dataSource={filtredData}
        columns={columns}
        rowKey={"_id"}
        scroll={{ x: true }}
        bordered={false}
        size='small'
        loading={loading}
    />;
}

export default CategoryTable
