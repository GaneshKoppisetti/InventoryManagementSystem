import "./Loader.css";
const RouteLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="modern-loader"></div>
        <p className="loader-text">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default RouteLoader;