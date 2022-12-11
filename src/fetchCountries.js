const endPoint = 'https://restcountries.com/v3.1/name/';
const filter =
  '?fields=name,capital,languages,flag,flags,coatOfArms,population';

export function fetchCountries(countryName) {
  return fetch(`${endPoint}${countryName}${filter}`).then(response => {
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
