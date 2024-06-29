import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./categories.css";
import { BASE_URL } from "../../utils/config";

const CategoryCard = () => {
    const [categories, setCategories] = useState([]);
    // const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/category`);
                setCategories(res.data.categories);

            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, []);

    const handleCategoryClick = (categoryId) => {
        localStorage.setItem("categoryId", categoryId);
        window.location.href = `/category/${categoryId}`;
    };

    return (
        <div className="categories__container">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div
                        key={category._id}
                        className="categories-item d-flex flex-column justify-content-between"
                        onClick={() => handleCategoryClick(category._id)}
                    >
                        <div className="categories__content">
                            <img
                                className="categories__img  w-50"
                                src={category.imagePath}
                                alt={category.categoryName}
                            />
                            <h5 className="category_Name">
                                <Link to={`/category/${category._id}`}>{category.categoryName}</Link>
                            </h5>

                        </div>
                    </div>
                ))
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default CategoryCard;
