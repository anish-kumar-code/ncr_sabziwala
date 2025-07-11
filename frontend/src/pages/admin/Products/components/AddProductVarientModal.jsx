import React, { useEffect, useState } from 'react';
import {
    Modal, Form, Input, InputNumber, Upload, message, Select, Row, Col
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProductDetail } from '@services/apiProduct';
import { addProductVarient } from '../../../../services/admin/apiProductVariant';
const { Option } = Select;

const AddProductVarientModal = ({ open, onClose, onSuccess, productId }) => {
    const [form] = Form.useForm();
    const [productInfo, setProductInfo] = useState(null);
    const [fileList, setFileList] = useState([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (productId && open) {
            getProductDetail(productId)
                .then(data => setProductInfo(data))
                .catch(() => message.error("Failed to fetch product details"));
        }
    }, [productId, open]);

    const handlePriceChange = () => {
        const originalPrice = form.getFieldValue('originalPrice');
        const price = form.getFieldValue('price');
        if (originalPrice && price) {
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            form.setFieldsValue({ discount: discount > 0 ? discount : 0 });
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("name", values.name);
            formData.append("unit", values.unit);
            formData.append("price", values.price);
            formData.append("originalPrice", values.originalPrice);
            formData.append("discount", values.discount);

            fileList.forEach((file) => {
                formData.append("images", file.originFileObj || file); // handle manually uploaded or default
            });

            await addProductVarient(productId, formData);

            message.success('Variant added successfully!');
            form.resetFields();
            setFileList([]);
            onSuccess(); // Refresh variant list
        } catch (error) {
            console.error('Submit failed:', error);
            message.error('Failed to add variant');
        }
    };

    return (
        <Modal
            title="Add New Product Variant"
            open={open}
            onCancel={() => {
                form.resetFields();
                setFileList([]);
                onClose();
            }}
            onOk={handleSubmit}
            okText="Save"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                {/* Product Info */}
                <Form.Item label="Product Name">
                    <Input value={productInfo?.name || ''} disabled />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Category">
                            <Input value={productInfo?.categoryId?.name || ''} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Subcategory">
                            <Input value={productInfo?.subCategoryId?.name || ''} disabled />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Variant Fields */}
                <Form.Item
                    label="Variant Name"
                    name="name"
                    rules={[{ required: true, message: 'Enter variant name' }]}
                >
                    <Input placeholder="e.g. 500g, 1kg" />
                </Form.Item>

                <Form.Item
                    label="Unit"
                    name="unit"
                    rules={[{ required: true, message: 'Enter unit' }]}
                >
                    <Select placeholder="Select unit">
                        <Option value="kg">kg</Option>
                        <Option value="g">g</Option>
                        <Option value="ltr">ltr</Option>
                        <Option value="ml">ml</Option>
                        <Option value="pcs">pcs</Option>
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Original Price"
                            name="originalPrice"
                            rules={[{ required: true, message: 'Enter original price' }]}
                        >
                            <InputNumber
                                min={0}
                                onChange={handlePriceChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Selling Price"
                            name="price"
                            rules={[{ required: true, message: 'Enter selling price' }]}
                        >
                            <InputNumber
                                min={0}
                                onChange={handlePriceChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Discount (%)" name="discount">
                            <InputNumber disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Images */}
                <Form.Item label="Upload Images">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false} // prevent auto upload
                        multiple
                    >
                        {fileList.length < 5 && '+ Upload'}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddProductVarientModal;
