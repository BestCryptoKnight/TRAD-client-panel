// eslint-disable-next-line import/prefer-default-export
export const usdConverter = number => {
  const numberToUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
  const moneyFormat = value => {
    // eslint-disable-next-line no-nested-ternary
    return `${Math.abs(Number(value)) / 1.0e6}M`;
  };

  return number >= 1000000
    ? `$ ${parseFloat(moneyFormat(number)).toPrecision(4)} M`
    : numberToUSD.format(number);
};
