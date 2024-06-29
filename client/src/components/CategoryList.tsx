import React from 'react';
import { categories } from '../data/items';
import './CategoryList.css';

interface CategoryListProps {
  onSelectItem: (category: string, item: string) => void;
  selectedItems: { category: string; item: string }[];
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelectItem, selectedItems }) => {
  const handleSelectItem = (category: string, item: string) => {
    onSelectItem(category, item);
  };

  return (
    <div className="category-list">
      {categories.map(category => (
        <div key={category.name} className="category-box">
          <h3 className="category-title">{category.name}</h3>
          <div className="category-items">
            {category.items.map(item => (
              <button
                key={item}
                className={`item-button ${
                  selectedItems.some(selected => selected.category === category.name && selected.item === item) ? 'selected' : ''
                }`}
                onClick={() => handleSelectItem(category.name, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
