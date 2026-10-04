import "../../css/BottomCard.css";
import { PiCaretRightBold } from "react-icons/pi";

function BottomCard({
  icon,
  title,
  value,
  subtitle,
  arrow = false,
  onClick,
  buttonText,
}) {
  return (
    <div className="bottom-card" onClick={onClick}>

      <div className="bottom-left">
        <div className="bottom-icon">
          {icon}
        </div>

        <div>

          <h3>{title}</h3>

          {value && <h2>{value}</h2>}

          {subtitle && <p>{subtitle}</p>}

        </div>
      </div>

      {arrow && (
        <PiCaretRightBold className="bottom-arrow" />
      )}

      {buttonText && (
        <button
          className="bottom-card-button"
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
export default BottomCard;