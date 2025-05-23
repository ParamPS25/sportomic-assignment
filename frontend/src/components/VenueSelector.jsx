const VenueSelector = ({ venues, selectedVenue, setSelectedVenue, selectedDate, setSelectedDate }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 justify-center items-center">
      <select
        value={selectedVenue}
        onChange={e => setSelectedVenue(e.target.value)}
        className="border p-2 rounded-md w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a Venue</option>
        {venues?.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
        className="border p-2 rounded-md w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default VenueSelector;
