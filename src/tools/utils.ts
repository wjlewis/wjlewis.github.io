// Restrict the input value to the interval defined by the provided endpoints.
export const clamp = (min: number, max: number, x: number): number => {
  if (x < min) return min;
  else if (x > max) return max;
  else return x;
};
