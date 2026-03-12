// Reusable Loading Spinner
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text font-[Inter]">Loading...</p>
    </div>
  );
};

export default Spinner;