import React, { useState } from "react";
import CategoryList from "./components/CategoryList";
import "./App.css";
import { categories } from "./data/items";
import axios from "axios";

interface SelectedItem {
  category: string;
  item: string;
}

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [mealPlan, setMealPlan] = useState<string>("");

  const handleSelectItem = (category: string, item: string) => {
    const existingItemIndex = selectedItems.findIndex(
      (selected) => selected.category === category && selected.item === item
    );

    if (existingItemIndex >= 0) {
      setSelectedItems(
        selectedItems.filter((_, index) => index !== existingItemIndex)
      );
    } else {
      setSelectedItems([...selectedItems, { category, item }]);
    }
  };

  const handleSubmit = async () => {
    const response = categories
      .map((category) => {
        const items = selectedItems
          .filter((selected) => selected.category === category.name)
          .map((selected) => selected.item);

        return {
          name: category.name,
          items: items.length > 0 ? items : undefined,
        };
      })
      .filter((category) => category.items);
    const jsonString = JSON.stringify(response, null, 2);

    try {
      const result = await axios.post(
        "http://localhost:4000/ingredients",
        jsonString,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMealPlan(`Here's your meal plan:\n\n${result.data.recipe}`);
    } catch (error) {
      console.error("Error posting data:", error);
      setMealPlan("Error retrieving meal plan. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>MealGenie</h1>
      <h4>Select Ingridents in your Pantry</h4>
      <CategoryList
        onSelectItem={handleSelectItem}
        selectedItems={selectedItems}
      />
      <button
        className="submit-button"
        onClick={handleSubmit}
      >
        Submit Ingridents
      </button>

      {/* Meal Plan Section */}
      {mealPlan && (
        <div className="section">
          <h2>Meal Plan</h2>
          <pre>{mealPlan}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
