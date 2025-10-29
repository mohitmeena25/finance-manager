import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { Plus } from "lucide-react";
import CategoryList from "../components/CategoryList";
import { axiosConfig } from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import {toast} from "react-hot-toast"
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

function Category() {
  useUser()

  const [loading,setLoading]=useState(false)
  const [categoryData, setCategoryData]=useState([])
  const [openAddCategoryModal,setOpenAddCategoryModal]=useState()
  const [openEditCategoryModal,setOpenEditCategoryModal]=useState()
  const [selectedCategory,setSelectedCategory]=useState()

  const fetchCategoryDetails =async()=>{
    if(loading) return
    setLoading(true)
    try{
        const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES)
        if(response.status === 200){
          setCategoryData(response.data)
        }
    }catch(error){
      console.error("Something went wrong. Please try again ",error);
      toast.error(error.message)
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchCategoryDetails()
  },[])

  const handleAddCategory = async(category)=>{
    const {name, type, icon}=category
    if(!name.trim()){
      toast.error("Category Name is required")
      return
    }

    const isDuplicate = categoryData.some((category)=>{
      return category.name.toLowerCase()==name.trim().toLowerCase()
    })

    if(isDuplicate){
      toast.error("Category Name already exists")
      return
    }

    try{
        const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type , icon})
        if(response.status===201){
          toast.success("Category added successfully")
          setOpenAddCategoryModal(false)
          fetchCategoryDetails();
        }
    }catch(error){
      console.log("Error adding category ",error);
      toast.error(error.response?.data?.message || "Failed to add category")
      setOpenAddCategoryModal(false)
      fetchCategoryDetails()
    }
  }

  const handleEditCategory =(categoryToEdit)=>{
    setSelectedCategory(categoryToEdit)
    setOpenEditCategoryModal(true)
  }

  const handleUpdateCategory = async (updatedCategory)=>{
    const {id, name, type, icon} = updatedCategory
    if(!name.trim()){
      toast.error("Category Name is required")
      return
    }
    if(!id){
      toast.error("Category Id is missing for update")
      return
    }
    try{
      await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id),
      {name, type, icon}
    )
    setOpenEditCategoryModal(false)
    setSelectedCategory(null)
    toast.success("Category Updated successfully")
    fetchCategoryDetails()

    }catch(error){
      console.log("Error updating the category ",error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to update the category")
    }
  }

  return (
      <Dashboard activeMenu="Category">
        
          <div className="my-5 mx-auto">
            {/* Add button to add category */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-semobold">All Categories</h2>
                <button
                onClick={()=>setOpenAddCategoryModal(true)}
                 className="cursor-pointer add-btn flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded">
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
            {/* Category list */}
              <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />
            {/* Adding category modal */}
              <Modal title="Add Category"
              isOpen={openAddCategoryModal}
              onClose={()=>setOpenAddCategoryModal(false)}
              >
                <AddCategoryForm onAddCategory={handleAddCategory} />
              </Modal>
            {/* Updating category modal */}
            <Modal
            isOpen={openEditCategoryModal}
            onClose={()=>{
              setOpenEditCategoryModal(false)
              setSelectedCategory(null)
            }}
            title="Update Category"
            >
              <AddCategoryForm 
                initialCategoryData={selectedCategory}
                onAddCategory={handleUpdateCategory}
                isEditing={true}
               />
            </Modal>
          </div>

      </Dashboard>
  );
}

export default Category;
