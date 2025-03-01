
const SearchBar = () => {
  return (
    <div className="flex-1 flex justify-center">
        <input type="text" placeholder="Find your article..."
            className="w-2/3 p-2 rounded-lg border border-gray-600 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    </div>
  )
}

export default SearchBar