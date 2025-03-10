import { ChevronDown, Filter, X } from "lucide-react";
import { useState } from "react";
import {
  categories,
  Category,
  FilterState,
  ReadingTime,
  readingTimes,
} from "../types";

const DropdownFilter = ({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterState) => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTime, setSelectedTime] = useState<ReadingTime | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleCategoryChange = (category: Category) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    onFilterChange({ category: newCategory, length: selectedTime });
  };

  const handleTimeChange = (time: ReadingTime) => {
    const newTime = selectedTime === time ? null : time;
    setSelectedTime(newTime);
    onFilterChange({ category: selectedCategory, length: newTime });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTime(null);
    onFilterChange({ category: null, length: null });
  };

  const activeFiltersCount = [selectedCategory, selectedTime].filter(
    Boolean
  ).length;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center px-0 py-2 text-black hover:text-primary transition-colors">
        <Filter className="mr-2" size={18} />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform ${
            isHovered ? "rotate-180" : ""
          }`}
        />
      </button>

      {isHovered && (
        <div className="absolute right-0 mt-1 z-40 w-64 bg-white shadow-lg rounded-lg border border-neutral-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                Filters
              </h3>
              {(selectedCategory || selectedTime) && (
                <button
                  onClick={clearFilters}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">
                Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categories).map(([category, categoryLabel]) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category as Category)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        selectedCategory === category
                          ? "bg-green-500 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }
                    `}
                  >
                    {categoryLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Time Filter */}
            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-2">
                Reading Time
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(readingTimes).map(([time, timeLabel]) => (
                  <button
                    key={time}
                    onClick={() => handleTimeChange(time as ReadingTime)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        selectedTime === time
                          ? "bg-green-500 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }
                    `}
                  >
                    {timeLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
