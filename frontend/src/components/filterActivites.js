import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const FilterSidebar = ({ setFilteredData, activitiesData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [text, setText] = useState("");
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
        // For single day selection
        const selectedDateStr = startDate.toISOString().split("T")[0];
        const activityDateStr = activityDate.toISOString().split("T")[0];
        return activityDateStr === selectedDateStr;
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
        selectedLocation.some((location) =>
          activity?.location.toLowerCase().includes(location.toLowerCase())
        )
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
  const clearFilters = () => {
    setStartDate(new Date());
    setSelectedLocation([]);
    setPrice({ Free: false, Paid: false });
    setDays(0);
    setFilteredData(activitiesData);
  };
  const locations = ["egypt", "germany", "usa", "uk", "uae", "online"];
  return (
    <div className="w-[100%] transform-x-[-80px] bg-white border rounded-lg p-6 shadow-md relative mt-4">
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
          className="max-w-20"
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Location</label>
        <div className=" flex">
          <input type="text" className="" />
        </div>
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
              {}
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
      <div className=" text-center mt-4">
        <button onClick={clearFilters} className="text-sm text-main underline">
          Clear Filters
        </button>
      </div>
      <div className=" text-center mt-4">
        <button
          onClick={applyFilters}
          className="text-sm bg-main text-white w-full rounded-xl capitalize  py-2"
        >
          apply
        </button>
      </div>
    </div>
  );
};
export default FilterSidebar;
