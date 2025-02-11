// ExampleCarouselImage.js
import React from 'react';
import folderImage from './122.png'; // Importez votre image locale

const ExampleCarouselImage = ({ text }) => {
  return (
    <img src={folderImage} alt="Folder Image"  style={{ width: '1200px', height: '450px' }} /> // Utilisez l'URL importée de votre image locale
  );
};

export default ExampleCarouselImage;

