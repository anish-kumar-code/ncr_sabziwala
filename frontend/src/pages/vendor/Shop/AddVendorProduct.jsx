import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Row, Col, Avatar, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { addProduct } from '../../../services/vendor/apiProduct';
import { useParams } from 'react-router';
import { getAllCategory, getAllSubCategory } from '../../../services/vendor/apiCategory';

const { Option } = Select;

const AddVendorProduct = () => {
    const [form] = Form.useForm();
    const [primaryImageList, setPrimaryImageList] = useState([]);
    const [galleryImageList, setGalleryImageList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

    const { shopId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cat, subCat] = await Promise.all([
                    getAllCategory(),
                    getAllSubCategory()
                ]);
                setCategories(cat || []);
                setSubCategories(subCat || []);
                console.log(subCat)
            } catch (error) {
                message.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handlePriceChange = () => {
        const { mrp, sellingPrice } = form.getFieldsValue();
        if (mrp && sellingPrice) {
            const discount = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100));
            form.setFieldsValue({ discount });
        }
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("shopId", shopId);
            formData.append("mrp", values.mrp);
            formData.append("sellingPrice", values.sellingPrice);
            formData.append("discount", values.discount || 0);
            formData.append("unitOfMeasurement", values.unitOfMeasurement);
            formData.append("sellingUnit", values.sellingUnit);
            formData.append("serviceId", "67ecc79a20a93fc0b92a8b1b"); // Fixed serviceId for Grocery
            formData.append("type", "veg"); // Fixed type for Veg
            formData.append("categoryId", values.category);
            formData.append("subCategoryId", values.subCategory);
            formData.append("shortDescription", values.shortDescription);
            formData.append("longDescription", values.longDescription);

            if (primaryImageList.length > 0) {
                formData.append("primary_image", primaryImageList[0].originFileObj);
            }

            galleryImageList.forEach(file => {
                formData.append("gallery_image", file.originFileObj);
            });

            await addProduct(formData);
            message.success("Product added successfully!");
            form.resetFields();
            setPrimaryImageList([]);
            setGalleryImageList([]);
        } catch (error) {
            console.error(error);
            message.error("Failed to add product.");
        }
    };

    const getFileList = setter => e => {
        const files = Array.isArray(e) ? e : e?.fileList || [];
        setter(files);
        return files;
    };

    return (
        <div className="lg:px-10 px-5 py-6">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    {[
                        { name: 'name', label: 'Product Name' },
                    ].map(({ name, label }) => (
                        <Col span={24} key={name}>
                            <Form.Item name={name} label={label} rules={[{ required: true }]}>
                                <Input placeholder={`Enter ${label.toLowerCase()}`} />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                <Row gutter={16}>
                    {[
                        { name: 'mrp', label: 'MRP (₹)' },
                        { name: 'sellingPrice', label: 'Selling Price (₹)' }
                    ].map(({ name, label }) => (
                        <Col span={8} key={name}>
                            <Form.Item name={name} label={label} rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} onChange={handlePriceChange} />
                            </Form.Item>
                        </Col>
                    ))}
                    <Col span={8}>
                        <Form.Item name="discount" label="Discount (%)">
                            <InputNumber min={0} max={100} style={{ width: '100%' }} readOnly />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {[
                        { name: 'unitOfMeasurement', label: 'Unit of Measurement', placeholder: 'e.g., grams' },
                        { name: 'sellingUnit', label: 'Selling Unit', placeholder: 'e.g., 1 pack' }
                    ].map(({ name, label, placeholder }) => (
                        <Col span={12} key={name}>
                            <Form.Item name={name} label={label} rules={[{ required: true }]}>
                                <Input placeholder={placeholder} />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select category"
                                onChange={value => {
                                    setSelectedCategory(value);
                                    const subCats = subCategories.filter(sub => sub.cat_id === value);
                                    setFilteredSubCategories(subCats);
                                    form.setFieldsValue({ subCategory: undefined });
                                }}
                            >
                                {categories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="subCategory" label="Sub-Category" rules={[{ required: true }]}>
                            <Select placeholder="Select sub-category" disabled={!selectedCategory}>
                                {filteredSubCategories.map(sub => (
                                    <Option key={sub._id} value={sub._id}>{sub.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item name="longDescription" label="Long Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="primary_image" label="Primary Image" valuePropName="fileList" getValueFromEvent={getFileList(setPrimaryImageList)} rules={[{ required: true }]}>
                            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1} showUploadList={false}>
                                {primaryImageList.length > 0 ? (
                                    <Avatar src={URL.createObjectURL(primaryImageList[0].originFileObj)} size={100} shape="square" />
                                ) : (
                                    <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item name="gallery_image" label="Gallery Images" valuePropName="fileList" getValueFromEvent={getFileList(setGalleryImageList)}>
                            <Upload.Dragger listType="picture" beforeUpload={() => false} multiple onRemove={file => {
                                setGalleryImageList(list => list.filter(item => item.uid !== file.uid));
                                return true;
                            }}>
                                <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                <p className="ant-upload-text">Click or drag to upload</p>
                                <p className="ant-upload-hint">Supports multiple uploads.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddVendorProduct;
