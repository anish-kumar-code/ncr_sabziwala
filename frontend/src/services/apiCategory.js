import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllCategory = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/category/list')
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching category list');
    }
}

export const getAllSubCategory = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/subcategory/list')
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        message.error('Error fetching subcategory list');
    }
}

export const getSubCategory = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/subcategory/${id}`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching subcategory');
    }
}

export const addCategory = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/admin/category/create', formData, { headers: { "Content-Type": "multipart/form-data" } });
        // console.log(response)
        return response;
    } catch (error) {
        message.error('Error adding category');
    }
}

export const updateStatus = async (id, status) => {
    status = status ? "active" : "inactive"
    try {
        const response = await axiosInstance.patch(`/api/admin/category/${id}`, { status });
        message.success('category status update');
        return response;
    } catch (error) {
        message.error('Error updating category status');
    }
}

export const updateCategory = async (id, formData) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/category/update/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
        return response;
    } catch (error) {
        message.error('Error updating category');
    }
}

export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/category/delete/${id}`);
        return response;
    } catch (error) {
        message.error('Error deleteing category');
    }
}

