import "../../css/GenreCard.css";
import { Link } from "react-router-dom";

function GenreCard({ icon, count, genre }) {

    return (
        <Link
            to={`/genre/${genre}`}
            className="genre-link"
        >

            <div className="genre-card">
                <div className="genre-icon">
                    {icon}
                </div>
                <h2>{count}</h2>
                <p>{genre}</p>
            </div>
        </Link>
    );
}
export default GenreCard;