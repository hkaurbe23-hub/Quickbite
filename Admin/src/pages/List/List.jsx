import React, { useEffect, useState } from 'react';
import './list.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import URl from "../../config";   // ✅ Correct import

const List = () => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${URl}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error fetching food list");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${URl}/api/food/remove`, { id: foodId });

    if (response.data.success) {
      toast.success(response.data.message);
      fetchList();  // refresh list
    } else {
      toast.error("Error removing item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>List of All Foods</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${URl}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p className='cursor' onClick={() => removeFood(item._id)}>X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
