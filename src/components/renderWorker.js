/* eslint-disable no-restricted-globals */
self.onmessage = (event) => {
  const { canvas, position, previousPosition, radius } = event.data;
  console.log(event);

  if (!canvas) {
    console.error("Canvas is undefined or not passed correctly");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context from OffscreenCanvas");
    return;
  }

  // Clear the previous radius
  if (previousPosition) {
    const clearRadius = radius + 2;
    ctx.clearRect(
      previousPosition.x - clearRadius,
      previousPosition.y - clearRadius,
      clearRadius * 2,
      clearRadius * 2,
    );
  }

  // Draw the new radius
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
};
