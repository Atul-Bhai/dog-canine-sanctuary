import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DogCard({ name, breed, age, image, description }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleAdoptClick = () => {
    navigate(`/adoption?dog=${encodeURIComponent(name)}`);
  };

  return (
    <article className="dog-card">
      <div className="dog-card-media">
        <img src={image} alt={name} />

        <button
          type="button"
          onClick={() => setLiked(!liked)}
          aria-label={`Favorite ${name}`}
          className="dog-card-fav"
        >
          {liked ? "💖" : "🤍"}
        </button>

        <span className="dog-card-badge">Available for Adoption</span>
      </div>

      <div className="dog-card-body">
        <h3 className="dog-card-title">{name}</h3>

        <div className="dog-card-tags">
          <span className="dog-tag-breed">🐕 {breed}</span>
          <span className="dog-tag-age">🎂 {age}</span>
        </div>

        <p className="dog-card-desc">{description}</p>

        <button
          type="button"
          onClick={handleAdoptClick}
          className="dog-card-btn"
        >
          Meet {name} ❤️
        </button>
      </div>
    </article>
  );
}

export default DogCard;