import { useUser } from "@clerk/clerk-react"; // Import changed: UserButton ki jagah useUser hook lagaya
import { useLocation, useNavigate } from "react-router-dom";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 11 12 3l9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M7 6h14M7 12h14M7 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser(); // User ka dynamic state aur image access karne ke liye

  const active = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="bottom-nav">
      <button className={active("/home")} onClick={() => navigate("/home")}>
        <HomeIcon />
        <span>Home</span>
      </button>

      <button className={active("/orders")} onClick={() => navigate("/orders")}>
        <OrdersIcon />
        <span>Orders</span>
      </button>

      <button className={active("/schedule")} onClick={() => navigate("/schedule")}>
        <ScheduleIcon />
        <span>Schedule</span>
      </button>

      {/* Profile Button: Ab click par dropdown nahi, balki seedhe navigation kaam karegi */}
      <button 
        className={`profile-button ${active("/profile")}`}
        onClick={() => navigate("/profile")}
      >
        <div className="clerk-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              style={{ 
                width: "28px", 
                height: "28px", 
                borderRadius: "50%",
                objectFit: "cover",
                border: location.pathname === "/profile" ? "2px solid #18A7FF" : "1px solid #30363d"
              }}
            />
          ) : (
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#21262d",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              border: "1px solid #30363d"
            }}>
              {user?.firstName?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <span>Profile</span>
      </button>
    </nav>
  );
}

export default BottomNav;