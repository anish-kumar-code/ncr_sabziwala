import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dataURLtoFile from '../../../../utils/fileConverter';
import { addBanner } from '../../../../services/admin/apiBanner';

const AddBannerModel = ({ isModalOpen, handleOk, handleCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const sectionOptions = [
        { value: 'section1', label: 'Section 1' },
        { value: 'section2', label: 'Section 2' },
    ];

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
            return false;
        }
        return false; // always false so we handle upload manually
    };

    const handleChange = (info) => {
        if (info.file) {
            const reader = new FileReader();
            reader.onload = () => setImageUrl(reader.result);
            reader.readAsDataURL(info.file);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onFinish = async (values) => {
        if (!imageUrl) {
            return message.error("Please upload a banner image.");
        }

        const file = dataURLtoFile(imageUrl, "banner.png");
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("section", values.chooeseSection);
        formData.append("serviceId", "67ecc79a20a93fc0b92a8b1b"); // Fixed serviceId for Grocery
        formData.append("image", file);

        try {
            setLoading(true);
            await addBanner(formData);
            message.success('Banner added successfully!');
            form.resetFields();
            setImageUrl(null);
            handleOk();
        } catch (error) {
            message.error("Failed to add banner.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add New Banner"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={form.submit} loading={loading}>Add Banner</Button>,
            ]}
        >
            <Form
                form={form}
                name="addBanner"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Banner Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input the banner title!' }]}
                >
                    <Input placeholder="Enter banner title" />
                </Form.Item>

                <Form.Item
                    label="Choose Section"
                    name="chooeseSection"
                    rules={[{ required: true, message: 'Please select a section!' }]}
                >
                    <Select
                        placeholder="Select section"
                        options={sectionOptions}
                    />
                </Form.Item>

                <Form.Item
                    label="Banner Image"
                    name="image"
                    rules={[{ required: true, message: 'Please select one image' }]}
                >
                    <Upload
                        name="image"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : uploadButton}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddBannerModel;
