import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const TIMEOUT_NOTIFICATION = 4000;

const refs = {
  searchField: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchField.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const valueInput = evt.target.value.trim();
  if (valueInput.length === 0) {
    Notify.info('Please entering some symbol for searching', {
      timeout: TIMEOUT_NOTIFICATION,
    });
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    refs.searchField.removeEventListener('input', evt);
    return;
  }

  fetchCountries(valueInput)
    .then(createdCountryList)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name', {
        timeout: TIMEOUT_NOTIFICATION,
      });
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    });
}

function createdCountryList(countries) {
  const numberCountriesFound = countries.length;

  const markupCountriesList = countries
    .map(
      ({ flags, name }) =>
        `<li class="country"><img src="${flags.svg}"
      alt="Flag of ${name.official}" width="50"/>
      <h1>${name.official}</h1></li>`
    )
    .join('');
  refs.countryList.innerHTML = markupCountriesList;

  if (numberCountriesFound === 1) {
    const bigRenderCountry = document.querySelector('.country');
    bigRenderCountry.classList.add('big');

    const markupInfoAboutCountry = countries
      .map(
        ({ capital, population, languages }) =>
          `<p class='country__title'><span>Capital:</span> ${capital}</p>
         <p class='country__info'><span>Population:</span> ${population}</p>
         <p class ='country__info'><span>Languages: </span>${Object.values(
           languages
         )}</p>`
      )
      .join('');
    refs.countryInfo.innerHTML = markupInfoAboutCountry;
    return;
  }

  if (numberCountriesFound > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.', {
      timeout: TIMEOUT_NOTIFICATION,
    });
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }

  refs.countryInfo.innerHTML = '';
}
