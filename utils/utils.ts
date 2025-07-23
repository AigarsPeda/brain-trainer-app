const calculateStars = (taskResults: number, usedStars: number): number => {
  if (taskResults === 0) {
    return 0;
  }

  const stars = Math.floor(taskResults / usedStars);

  return Math.max(0, Math.min(stars, 3));
};

export default calculateStars;
