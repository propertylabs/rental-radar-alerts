import CityStep from './steps/CityStep.js';

const [searchCriteria, setSearchCriteria] = useState({
  city: null,
  postcodes: [],
  propertyTypes: [],
  minBedrooms: 1,
  maxBedrooms: 5,
  minPrice: 0,
  maxPrice: 3000,
});

const renderStep = () => {
  switch(step) {
    case 1:
      return <CityStep 
        value={searchCriteria.city}
        onChange={(city) => setSearchCriteria({...searchCriteria, city})}
        onNext={() => setStep(2)}
      />;
    case 2:
      return <PostcodesStep 
        values={searchCriteria.postcodes}
        city={searchCriteria.city}
        onChange={(postcodes) => setSearchCriteria({...searchCriteria, postcodes})}
        onNext={() => setStep(3)}
      />;
    // ... rest of the steps
  };
}; 