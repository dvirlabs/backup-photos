import React, { useState, useEffect } from 'react';
import '../style/Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_photos');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <img src={image.url} alt={image.name} />
          <div className="image-info">
            <p>{image.name}</p>
            <p>Size: {Math.round(image.size / 1024)} KB</p>
            <p>Modified: {new Date(image.last_modified).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;