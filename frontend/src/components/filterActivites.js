import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterSidebar = ({ setFilteredData, activitiesData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedEventType, setSelectedEventType] = useState({
    Event: false,
    Workshop: false,
    Course: false,
  });
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [price, setPrice] = useState({
    Free: false,
    Paid: false,
  });
  const [days, setDays] = useState(0);

  const applyFilters = () => {
    let filtered = [...activitiesData];

    if (days > 0) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(days));

      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      });
    } else {
      filtered = filtered.filter((activity) => {
        const activityDate = new Date(activity.date);
        const selectedDateStr = startDate.toISOString().split("T")[0];
        const activityDateStr = activityDate.toISOString().split("T")[0];
        return activityDateStr === selectedDateStr;
      });
    }

    const activeEventTypes = Object.entries(selectedEventType)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);

    if (activeEventTypes.length > 0) {
      filtered = filtered.filter((activity) =>
        activeEventTypes.includes(activity.activityType)
      );
    }

    if (selectedLocation.length > 0) {
      filtered = filtered.filter((activity) =>
        selectedLocation.includes(activity.location)
      );
    }

    if (price.Free || price.Paid) {
      filtered = filtered.filter((activity) => {
        if (price.Free && activity.price === "Free") return true;
        if (price.Paid && activity.price !== "Free") return true;
        return false;
      });
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(activitiesData);
  }, [activitiesData, setFilteredData]);

  const clearFilters = () => {
    setStartDate(new Date());
    setSelectedEventType({ Event: false, Workshop: false, Course: false });
    setSelectedLocation([]);
    setPrice({ Free: false, Paid: false });
    setDays(0);
    setFilteredData(activitiesData);
  };

  const locations = ["Egypt", "Germany", "USA", "UK", "UAE", "online"];

  return (
    <div className="w-full bg-white border rounded-lg p-6 shadow-md relative mt-4">
      <h2 className="text-lg font-semibold mb-6">Filter Activities</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          inline
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Date Range</label>
        <div className="flex items-center gap-2">
          <span className="text-xs">Coming in</span>
          <input
            type="number"
            min="0"
            max="365"
            value={days}
            onChange={(e) =>
              setDays(Math.min(365, Math.max(0, parseInt(e.target.value) || 0)))
            }
            className="w-16 border rounded-lg p-2 text-center bg-[#E9ECE7]"
          />
          <span className="text-sm">Days</span>
        </div>
        <input
          type="range"
          min="0"
          max="365"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="w-full mt-2 bg-main"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Activity Type</label>
        <div className="space-y-2">
          {Object.keys(selectedEventType).map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedEventType[type]}
                onChange={() =>
                  setSelectedEventType((prev) => ({
                    ...prev,
                    [type]: !prev[type],
                  }))
                }
                className="border rounded accent-main"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Location</label>
        <div className="space-y-2">
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedLocation.includes(location)}
                onChange={() =>
                  setSelectedLocation((prev) =>
                    prev.includes(location)
                      ? prev.filter((item) => item !== location)
                      : [...prev, location]
                  )
                }
                className="border rounded accent-main"
              />
              {location}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={price.Free}
              onChange={() =>
                setPrice((prev) => ({ ...prev, Free: !prev.Free }))
              }
              className="border rounded accent-main"
            />
            Free
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={price.Paid}
              onChange={() =>
                setPrice((prev) => ({ ...prev, Paid: !prev.Paid }))
              }
              className="border rounded accent-main"
            />
            Paid
          </label>
        </div>
      </div>

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
