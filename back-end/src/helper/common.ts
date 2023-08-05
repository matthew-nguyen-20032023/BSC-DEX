export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * @description fake price to that not too much higher or smaller than previous price
 * @param previousPrice
 * @param maxDeviationPercentage
 * @private
 */
export const getRandomPriceByRule = (
  previousPrice,
  maxDeviationPercentage
): number => {
  const deviation = (previousPrice * maxDeviationPercentage) / 100;
  const minPrice = previousPrice - deviation;
  const maxPrice = previousPrice + deviation;
  const result = Math.random() * (maxPrice - minPrice) + minPrice;
  return Number(result.toFixed(2));
};
