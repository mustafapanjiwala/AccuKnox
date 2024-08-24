import React, { useState, useEffect } from "react";
import AddWidgetSidebar from "./AddWidgetSidebar";
import { useSelector, useDispatch } from "react-redux";
import { addWidgetData } from "../redux/categorySlice";
import widgetsData from "../widget.json";
import { BarGraph, LineGraph, PieGraph } from "./Charts";

const Dashboard = () => {
  const categories = widgetsData.categories;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedWidgets = useSelector((state) => state.categories);
  const [visibleWidgets, setVisibleWidgets] = useState({ ...selectedWidgets });
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setVisibleWidgets({ ...selectedWidgets });
  }, [selectedWidgets]);

  const handleSaveSidebar = (updatedWidgets) => {
    dispatch(addWidgetData(updatedWidgets));
    setIsSidebarOpen(false);
  };

  const onCancelClick = (categoryId, widgetId) => {
    setVisibleWidgets((prevWidgets) => {
      const updatedWidgets = { ...prevWidgets };
      if (updatedWidgets[categoryId]) {
        updatedWidgets[categoryId] = {
          ...updatedWidgets[categoryId],
          [widgetId]: false,
        };
      }
      dispatch(addWidgetData(updatedWidgets));
      return updatedWidgets;
    });
    setIsSidebarOpen(false);
  };

  const filteredWidgets = (widgets) => {
    return widgets.filter((widget) =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col">
      <header className="flex justify-between px-4 py-2 bg-gray-100">
        <h1 className="text-2xl font-bold">CNAPP Dashboard</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search anything"
            className="border rounded-md px-2 py-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md ml-2"
          >
            Add Widget
          </button>
        </div>
      </header>
      <main className="flex w-full flex-col gap-4 px-4 py-4">
        {categories.map((category) => {
          const visibleWidgetCount = category.widgets.filter(
            (widget) => visibleWidgets[category.id]?.[widget.id] ?? false
          ).length;
          return (
            <div key={category.id} className="w-full bg-white rounded-lg p-4">
              <h2 className="text-lg font-bold mb-2">{category.name}</h2>
              <div className="flex gap-4">
                {filteredWidgets(category.widgets)
                  .filter(
                    (widget) =>
                      visibleWidgets[category.id]?.[widget.id] ?? false
                  )
                  .map((widget) => (
                    <div
                      key={widget.id}
                      className="w-1/4 flex flex-col justify-center items-center bg-gray-300 border border-gray-200 rounded-lg shadow"
                    >
                      <div className="flex justify-end items-center w-full">
                        <button
                          className=" px-2 py-1 m-2 border-2 rounded-lg font-bold border-black-50"
                          onClick={() => onCancelClick(category.id, widget.id)}
                        >
                          X
                        </button>
                      </div>
                      <h5 className="text-xl font-bold tracking-tight text-gray-900">
                        {widget.name}
                      </h5>
                      {category.type === "pie" ? (
                        <PieGraph widget={widget} />
                      ) : category.type === "bar" ? (
                        <BarGraph widget={widget} />
                      ) : category.type === "line" ? (
                        <LineGraph widget={widget} />
                      ) : null}
                    </div>
                  ))}
                {console.log("hello", filteredWidgets(category.widgets))}
                {visibleWidgetCount < 3 && (
                  <div className="w-1/4 flex flex-col justify-center items-center bg-gray-300 border border-gray-200 rounded-lg shadow">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md ml-2"
                    >
                      + Add Widget
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-30 z-10"></div>

          {/* Sidebar */}
          <div className="fixed inset-y-0 right-0 z-20 ">
            <AddWidgetSidebar
              onClose={() => setIsSidebarOpen(false)}
              onSave={handleSaveSidebar}
              selectedWidgets={selectedWidgets}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
