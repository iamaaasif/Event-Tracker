export default function NavBar() {
  return (
    <div className="navbar">
      <div className="leftNavBar">
        <div className="branding">
          <div className="brandName">
            <h2>Event Tracker</h2>
          </div>
        </div>
      </div>
      <div className="rightNavBar">
        <button>
          <p> Add New Event</p>
        </button>
      </div>
    </div>
  );
}
