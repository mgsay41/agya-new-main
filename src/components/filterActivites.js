import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// The Filter Sidebar component
const FilterSidebar = ({ setFilteredData, activitiesData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedEventType, setSelectedEventType] = useState({
    online: false,
    offline: false,
    all: false,
  });
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [price, setPrice] = useState({
    free: false,
    paid: false,
    all: false,
  });
  const [rangeValue, setRangeValue] = useState(0); // Range slider value
  const [days, setDays] = useState(0); // State for number of days

  const handleRangeChange = (e) => {
    setRangeValue(e.target.value);
    setDays(e.target.value); // Update days based on slider
  };

  const applyFilters = () => {
    const filteredActivities = activitiesData.filter((activity) => {
      // Filter by event type
      if (selectedEventType.all) return true;
      if (selectedEventType.online && activity.eventType === "Online")
        return true;
      if (selectedEventType.offline && activity.eventType === "Offline")
        return true;

      // Filter by location
      if (
        selectedLocation.length > 0 &&
        !selectedLocation.includes(activity.location)
      )
        return false;

      // Filter by price
      if (price.free && activity.price !== "Free") return false;
      if (price.paid && activity.price !== "Paid") return false;

      // Filter by date range
      const activityDate = new Date(activity.date);
      if (activityDate < startDate || activityDate > endDate) return false;

      return true;
    });

    setFilteredData(filteredActivities);
  };

  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedEventType({
      online: false,
      offline: false,
      all: false,
    });
    setSelectedLocation([]);
    setPrice({
      free: false,
      paid: false,
      all: false,
    });

    // Reset to all data when filters are cleared
    setFilteredData(activitiesData);
  };

  return (
    <div className="w-full bg-white border rounded-lg p-6 shadow-md relative mt-4">
      <h2 className="text-lg font-semibold mb-6">Filter Activities</h2>

      {/* Calendar Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Calendar</label>
        <div className="mt-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            inline // This displays the calendar inline.
          />
        </div>
      </div>

      {/* Date Range Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Date Range</label>
        <div className="flex items-center gap-2">
          <span className=" text-xs">Coming in</span>
          <input
            type="number"
            min="0"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-16 border rounded-lg p-2 text-center bg-[#E9ECE7]"
          />
          <span className=" text-sm">Days</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={rangeValue}
          onChange={handleRangeChange}
          className="w-full mt-2 bg-main "
        />
      </div>

      {/* Event Type Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Virtual Event</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedEventType.online}
              onChange={() =>
                setSelectedEventType({
                  ...selectedEventType,
                  online: !selectedEventType.online,
                })
              }
              className="border rounded accent-main"
            />
            Online
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedEventType.offline}
              onChange={() =>
                setSelectedEventType({
                  ...selectedEventType,
                  offline: !selectedEventType.offline,
                })
              }
              className="border rounded accent-main"
            />
            Offline
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedEventType.all}
              onChange={() =>
                setSelectedEventType({
                  ...selectedEventType,
                  all: !selectedEventType.all,
                })
              }
              className="border rounded accent-main"
            />
            All Types
          </label>
        </div>
      </div>

      {/* Location Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Location</label>
        <div className="space-y-2">
          {["Egypt", "Germany", "USA", "UK", "UAE"].map((location) => (
            <label className="flex items-center gap-2" key={location}>
              <input
                type="checkbox"
                checked={selectedLocation.includes(location)}
                onChange={() => {
                  setSelectedLocation((prev) =>
                    prev.includes(location)
                      ? prev.filter((item) => item !== location)
                      : [...prev, location]
                  );
                }}
                className="border rounded accent-main"
              />
              {location}
            </label>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={price.free}
              onChange={() => setPrice({ ...price, free: !price.free })}
              className="border rounded accent-main"
            />
            Free
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={price.paid}
              onChange={() => setPrice({ ...price, paid: !price.paid })}
              className="border rounded accent-main"
            />
            Paid
          </label>
        </div>
      </div>

      {/* Apply & Clear Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={clearFilters} className="text-sm text-main underline">
          Clear Filters
        </button>
        <button
          onClick={applyFilters}
          className="bg-main text-white px-4 py-2 rounded-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
