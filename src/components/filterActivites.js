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
  // Helper function to normalize date string
  const normalizeDate = (dateString) => {
    try {
      // Handle date string that might be missing zero-padding
      const [year, month, day] = dateString.split("-");
      const normalizedMonth = month.padStart(2, "0");
      const normalizedDay = day.padStart(2, "0");
      return `${year}-${normalizedMonth}-${normalizedDay}`;
    } catch (error) {
      console.error("Error normalizing date:", error);
      return dateString;
    }
  };
  const applyFilters = () => {
    let filtered = [...activitiesData];
    // Date filtering
    filtered = filtered.filter((activity) => {
      try {
        // Normalize the activity date
        const normalizedActivityDate = normalizeDate(activity.date);
        const activityDate = new Date(normalizedActivityDate);
        if (days > 0) {
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + days);
          // Set hours to ensure full day comparison
          const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
          const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
          return activityDate >= startOfDay && activityDate <= endOfDay;
        } else {
          // For single day selection
          const selectedDateStr = startDate.toISOString().split("T")[0];
          const activityDateStr = activityDate.toISOString().split("T")[0];
          return activityDateStr === selectedDateStr;
        }
      } catch (error) {
        console.error("Error comparing dates:", error);
        return false;
      }
    });
    // Activity Type filtering
    const activeEventTypes = Object.entries(selectedEventType)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
    if (activeEventTypes.length > 0) {
      filtered = filtered.filter((activity) =>
        activeEventTypes.includes(activity.activityType)
      );
    }
    // Location filtering
    if (selectedLocation.length > 0) {
      filtered = filtered.filter((activity) =>
        selectedLocation.includes(activity.location?.toLowerCase())
      );
    }
    // Price filtering
    if (price.Free || price.Paid) {
      filtered = filtered.filter((activity) => {
        const activityPrice = activity.price?.toLowerCase();
        if (price.Free && (activityPrice === "free" || activityPrice === "0"))
          return true;
        if (price.Paid && activityPrice !== "free" && activityPrice !== "0")
          return true;
        return false;
      });
    }
    setFilteredData(filtered);
  };
  // Apply filters whenever any filter value changes
  useEffect(() => {
    applyFilters();
  }, [startDate, selectedEventType, selectedLocation, price, days]);
  const clearFilters = () => {
    setStartDate(new Date());
    setSelectedLocation([]);
    setPrice({ Free: false, Paid: false });
    setDays(0);
    setFilteredData(activitiesData);
  };
  const locations = ["egypt", "germany", "usa", "uk", "uae", "online"];
  return (
    <div className="w-[100%] bg-white border rounded-lg p-6 shadow-md relative mt-4">
      <h2 className="text-lg font-semibold mb-6">Filter Activities</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setDays(0); // Reset days when selecting a specific date
          }}
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
            max="20"
            value={days}
            onChange={(e) => {
              const value = Math.min(
                20,
                Math.max(0, parseInt(e.target.value) || 0)
              );
              setDays(value);
            }}
            className="w-16 border rounded-lg p-2 text-center bg-[#E9ECE7]"
          />
          <span className="text-sm">Days</span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="w-full mt-2 bg-main"
        />
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
      </div>
    </div>
  );
};
export default FilterSidebar;
