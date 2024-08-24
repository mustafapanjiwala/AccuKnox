import React, { useState, useEffect } from "react";
import AddWidgetSidebar from "./AddWidgetSidebar";
import widgetsData from "../widget.json";
import {
  BarChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  Rectangle,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { addWidgetData } from "../redux/categorySlice";

const Dashboard = () => {
  const categories = widgetsData.categories;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({});
  const [tempSelectedWidgets, setTempSelectedWidgets] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const selectedWidgets = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  // Sync tempSelectedWidgets with selectedWidgets on load
  useEffect(() => {
    setTempSelectedWidgets(selectedWidgets);
    setVisibleWidgets(selectedWidgets);
  }, [selectedWidgets]);

  const handleWidgetChange = ({ categoryId, widgetId }) => {
    const categoryWidgets = tempSelectedWidgets[categoryId] || {};
    const updatedCategoryWidgets = {
      ...categoryWidgets,
      [widgetId]: !categoryWidgets[widgetId],
    };

    setTempSelectedWidgets({
      ...tempSelectedWidgets,
      [categoryId]: updatedCategoryWidgets,
    });
  };

  const handleSaveSidebar = () => {
    Object.keys(tempSelectedWidgets).forEach((categoryId) => {
      dispatch(
        addWidgetData({
          selectedWidgets: categoryId,
          data: tempSelectedWidgets[categoryId],
        })
      );
    });
    setVisibleWidgets(tempSelectedWidgets);
    setIsSidebarOpen(false);
  };

  const onCancelClick = ({ categoryId, widgetId }) => {
    const updatedCategoryWidgets = {
      ...tempSelectedWidgets[categoryId],
      [widgetId]: false, // Set the widget to false to "remove" it
    };

    setTempSelectedWidgets((prevWidgets) => ({
      ...prevWidgets,
      [categoryId]: updatedCategoryWidgets,
    }));

    setVisibleWidgets((prevWidgets) => ({
      ...prevWidgets,
      [categoryId]: updatedCategoryWidgets,
    }));
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
        {categories.map((category) => (
          <div key={category.id} className="w-full bg-white rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">{category.name}</h2>
            <div className="flex gap-4">
              {filteredWidgets(category.widgets)
                .filter(
                  (widget) => visibleWidgets[category.id]?.[widget.id] ?? false
                )
                .map((widget) => (
                  <div
                    key={widget.id}
                    className="w-1/4 p-6 flex flex-col justify-center items-center bg-gray-300 border border-gray-200 rounded-lg shadow"
                  >
                    <button
                      className="h-5 w-5 bg-red-400"
                      onClick={() => {
                        onCancelClick({
                          categoryId: category.id,
                          widgetId: widget.id,
                        });
                      }}
                    >
                      X
                    </button>
                    <h5 className="mb-2 font-bold tracking-tight text-gray-900">
                      {widget.name}
                    </h5>
                    {category.type === "pie" ? (
                      <div className="w-full h-full">
                        <PieChart width={400} height={400}>
                          <Pie
                            dataKey="value"
                            isAnimationActive={true}
                            data={widget.chartData}
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          />
                          <Tooltip />
                        </PieChart>
                      </div>
                    ) : category.type === "bar" ? (
                      <div className="w-full h-full">
                        <BarChart
                          width={350}
                          height={300}
                          data={widget.chartData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="value"
                            fill="#8884d8"
                            activeBar={<Rectangle fill="pink" stroke="blue" />}
                          />
                        </BarChart>
                      </div>
                    ) : category.type === "line" ? (
                      <div className="w-full h-full">
                        <LineChart
                          width={350}
                          height={300}
                          data={widget.chartData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </div>
                    ) : null}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </main>
      {isSidebarOpen && (
        <AddWidgetSidebar
          onClose={() => setIsSidebarOpen(false)}
          onSave={handleSaveSidebar}
          handleWidgetChange={handleWidgetChange}
          selectedWidgets={tempSelectedWidgets}
        />
      )}
    </div>
  );
};

export default Dashboard;
