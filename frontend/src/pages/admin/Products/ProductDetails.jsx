import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Breadcrumb, Card, Spin, Image, Descriptions, Tag,
    Button, Table, Space,
    Tooltip,
    Switch
} from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { getProductDetail } from '../../../services/admin/apiProduct';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import EditVariantModal from './components/EditVariantModal';
import AddProductVarientModal from './components/AddProductVarientModal';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetails = () => {
    const { produtSlug } = useParams();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);

    const id = produtSlug?.split('-').pop();

    useEffect(() => { fetchProductDetails(id) }, [id]);

    const fetchProductDetails = async (id) => {
        try {
            const res = await getProductDetail(id);
            setProduct(res || {});
        } catch (error) {
            message.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (record) => {
        setSelectedVariant(record);
        setIsEditModalVisible(true);
    };

    const handleModalClose = () => {
        setIsEditModalVisible(false);
        setSelectedVariant(null);
    };

    const handleSaveVariant = (updatedVariant) => {
        // Handle saving logic here (API call or local update)
        // console.log('Updated Variant:', updatedVariant);
        handleModalClose();
        fetchProductDetails(id);
        // message.success("Variant updated successfully!");
    };

    if (loading) return <Spin size="large" fullscreen />;

    const {
        name,
        description,
        categoryId,
        subCategoryId,
        images,
        status,
        tags,
        details = {},
        info = {},
        variants = []
    } = product;

    const variantColumns = [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'image',
            render: (imgs) =>
                <Image width={50} height={50} src={`${BASE_URL}/${imgs?.[0]}`} style={{ objectFit: 'cover' }} />,
        },
        {
            title: 'Variant Name',
            dataIndex: 'name',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (val) => `₹${val}`,
        },
        {
            title: 'Original Price',
            dataIndex: 'originalPrice',
            render: (val) => `₹${val}`,
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: (_, record) => (
                <Switch defaultChecked={record?.status === "active"} onChange={(checked) => alert("wroking")} />
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit"><Button type="primary" icon={<FaEdit />} onClick={() => handleEdit(record)}></Button></Tooltip>
                    <Tooltip title="Delete"><Button type="primary" danger icon={<FaTrash />} onClick={() => alert("Working")}></Button></Tooltip>
                    {/* <Tooltip title="Edit"><Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}></Button></Tooltip>
                    <Tooltip title="Delete"><Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}></Button></Tooltip> */}
                </Space>
            )
        }
    ];

    return (
        <>
            <div className="p-4">
                <div className="lg:px-10 px-5 my-8">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        className="mb-4"
                    >
                        Back
                    </Button>

                    <Card title={`Product: ${name}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <Image
                                    src={images?.length ? `${BASE_URL}/${images[0]}` : '/logo.png'}
                                    alt="Product"
                                    className="rounded-lg"
                                    width="100%"
                                    height={300}
                                    style={{ objectFit: 'contain' }}
                                />
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {images?.slice(1).map((img, i) => (
                                        <Image
                                            key={i}
                                            src={`${BASE_URL}/${img}`}
                                            alt={`Gallery ${i + 1}`}
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Descriptions bordered column={1}>
                                    <Descriptions.Item label="Name">{name}</Descriptions.Item>
                                    <Descriptions.Item label="Category">{categoryId?.name}</Descriptions.Item>
                                    <Descriptions.Item label="Subcategory">{subCategoryId?.name}</Descriptions.Item>
                                    <Descriptions.Item label="Description">{description}</Descriptions.Item>
                                    <Descriptions.Item label="Tags">{tags?.join(', ') || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>

                        <Descriptions bordered title="Product Details" column={2}>
                            <Descriptions.Item label="Nutrient Value">{details.nutrientValue || '-'}</Descriptions.Item>
                            <Descriptions.Item label="About">{details.about || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Details">{details.description || '-'}</Descriptions.Item>
                        </Descriptions>

                        <div className='h-[25px]'></div>
                        <Descriptions bordered title="Additional Info" column={2} className="mt-4">
                            <Descriptions.Item label="Shelf Life">{info.shelfLife || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Return Policy">{info.returnPolicy || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Storage Tips">{info.storageTips || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Country of Origin">{info.country || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Customer Care">{info.help || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Disclaimer">{info.disclaimer || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Seller">{info.seller || '-'}</Descriptions.Item>
                            <Descriptions.Item label="FSSAI">{info.fssai || '-'}</Descriptions.Item>
                        </Descriptions>

                        <div className='h-[25px]'></div>

                        <Card title="Variants" className="mt-8" extra={<Button type="primary" onClick={() => setIsAddModalOpen(true)}>Add Variant</Button>}>
                            <Table
                                dataSource={variants}
                                columns={variantColumns}
                                rowKey="_id"
                                pagination={false}
                                scroll={{ x: true }}
                            />
                        </Card>
                    </Card>
                </div>
            </div>

            <AddProductVarientModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchProductDetails(id);
                    setIsAddModalOpen(false);
                }}
                productId={id}
            />

            <EditVariantModal
                visible={isEditModalVisible}
                variant={selectedVariant}
                onClose={handleModalClose}
                onSave={handleSaveVariant}
                productId={id}
                fetchProductDetails={fetchProductDetails}
            />
        </>
    );
};

export default ProductDetails;
