const CabinSelection = ({ voyage, onSelect }) => {
  if (!voyage || !voyage.cabins) {
    return (
      <div className="cabin-selection">
        <h3>Select Your Cabin</h3>
        <p style={{ color: "#888" }}>Please select a voyage first to see cabin options.</p>
      </div>
    );
  }

  return (
    <div className="cabin-selection">
      <h3>Select Your Cabin</h3>
      <div className="cabin-options">
        {voyage.cabins.map(cabin => (
          <div 
            key={cabin.type} 
            className="cabin-card"
            onClick={() => onSelect(cabin.type)}
          >
            <h4>{cabin.type}</h4>
            <p>${cabin.price} per person</p>
            <p>{cabin.available} cabins remaining</p>
            <button className="select-cabin">Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CabinSelection;
