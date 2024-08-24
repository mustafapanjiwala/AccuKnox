import React, { useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import widgetsData from "../widget.json";

const AddWidgetSidebar = ({ onClose, onSave, selectedWidgets }) => {
  const categories = widgetsData.categories;
  const [tempSelectedWidgets, setTempSelectedWidgets] =
    useState(selectedWidgets);

  const handleWidgetChange = ({ categoryId, widgetId }) => {
    setTempSelectedWidgets((prevWidgets) => {
      const categoryWidgets = prevWidgets[categoryId] || {};
      const updatedCategoryWidgets = {
        ...categoryWidgets,
        [widgetId]: !categoryWidgets[widgetId],
      };
      return { ...prevWidgets, [categoryId]: updatedCategoryWidgets };
    });
  };

  const handleSave = () => {
    onSave(tempSelectedWidgets);
  };

  return (
    <div className="fixed right-0 inset-y-0 flex flex-col ">
      <h2 className="text-xl font-bold p-3 text-white bg-blue-500 ">
        Add Widget
      </h2>
      <div className="bg-white p-4 shadow-lg h-full ">
        <h5>
          Personalise the dashboard by adding or removing the following widgets
        </h5>
        <TabGroup>
          <TabList className="flex space-x-1 border-b mb-4">
            {categories.map((category) => (
              <Tab
                key={category.id}
                className={({ selected }) =>
                  selected
                    ? "px-4 py-2 bg-blue-500 text-white"
                    : "px-4 py-2 text-gray-700"
                }
              >
                {category.name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {categories.map((category) => (
              <TabPanel key={category.id} className="p-2">
                {category.widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center mb-2 p-2 border-2 border-black"
                  >
                    <input
                      type="checkbox"
                      checked={
                        tempSelectedWidgets[category.id]?.[widget.id] || false
                      }
                      onChange={() =>
                        handleWidgetChange({
                          categoryId: category.id,
                          widgetId: widget.id,
                        })
                      }
                      className="mr-2"
                    />
                    <label>{widget.name}</label>
                  </div>
                ))}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose}></div>
    </div>
  );
};

export default AddWidgetSidebar;
