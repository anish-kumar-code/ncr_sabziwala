import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, message, Select, Row, Col } from 'antd';
import { deleteProductVarientImage, updateProductVarient } from '../../../../services/admin/apiProductVariant';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditVariantModal = ({ visible, onClose, onSave, variant,fetchProductDetails, productId }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Only set form values once the modal is mounted and visible
    useEffect(() => {
        if (visible && variant) {
            form.setFieldsValue({
                name: variant.name,
                unit: variant.unit,
                price: variant.price,
                originalPrice: variant.originalPrice,
                discount: variant.discount,
            });

            const files = variant.images?.map((img, idx) => ({
                uid: `${idx}`,
                name: `Image-${idx + 1}`,
                url: `${BASE_URL}/${img}`,
                status: 'done',
            })) || [];

            setFileList(files);
        }
    }, [visible, variant, form, BASE_URL]);

    const handlePriceChange = () => {
        const original = form.getFieldValue('originalPrice');
        const price = form.getFieldValue('price');
        if (original && price >= 0) {
            const discount = Math.round(((original - price) / original) * 100);
            form.setFieldsValue({ discount: discount > 0 ? discount : 0 });
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('name', values.name);
            formData.append('unit', values.unit);
            formData.append('price', values.price);
            formData.append('originalPrice', values.originalPrice);
            formData.append('discount', values.discount);

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });

            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            await updateProductVarient(productId, variant._id, formData);
            message.success('Variant updated successfully!');
            onSave(values);
            onClose();
        } catch (err) {
            console.error('Update failed', err);
            message.error('Failed to update variant');
        }
    };

    const handleRemoveImage = (file) => {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: 'Are you sure you want to delete this image?',
                icon: <ExclamationCircleOutlined />,
                content: 'This action cannot be undone.',
                okText: 'Yes, delete it',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        // Convert full URL to the relative image path stored in DB
                        const imageUrl = file.url || '';
                        const imagePath = imageUrl.replace(`${BASE_URL}/`, '').replace(/\//g, '\\'); // Replace forward slash to match DB
                        console.log(imagePath)
                        await deleteProductVarientImage(productId, variant._id, imagePath);

                        setFileList(prev => prev.filter(img => img.uid !== file.uid));
                        message.success('Image deleted');
                    } catch (err) {
                        console.error(err);
                        message.error('Failed to delete image');
                    }
                },
                onCancel() {
                    reject(); // Don't remove if cancelled
                },
            });
        });
    };

    return (
        <Modal
            title="Edit Product Variant"
            open={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Update"
            cancelText="Cancel"
            forceRender
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Variant Name" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
                    <Select>
                        <Option value="kg">kg</Option>
                        <Option value="g">g</Option>
                        <Option value="ltr">ltr</Option>
                        <Option value="ml">ml</Option>
                        <Option value="pcs">pcs</Option>
                    </Select>
                </Form.Item>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Original Price" name="originalPrice" rules={[{ required: true }]}>
                            <InputNumber min={0} onChange={handlePriceChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Selling Price" name="price" rules={[{ required: true }]}>
                            <InputNumber min={0} onChange={handlePriceChange} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Discount (%)" name="discount">
                            <InputNumber disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Images">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        onRemove={handleRemoveImage}
                        beforeUpload={() => false}
                        multiple
                    >
                        {fileList.length < 5 && '+ Upload'}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditVariantModal;
