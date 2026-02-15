import{ useEffect, useState } from "react";
import "./Loader.css";

let externalSetVisible = null;

export const showLoader = () => {
  if (externalSetVisible) externalSetVisible(true);
};

export const hideLoader = () => {
  if (externalSetVisible) externalSetVisible(false);
};

const Loader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    externalSetVisible = setVisible;
    return () => {
      externalSetVisible = null;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="modern-loader"></div>
        <p className="loader-text">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loader;