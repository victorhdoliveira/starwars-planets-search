const requestAPI = async () => {
  const response = await fetch('https://swapi.dev/api/planets');
  const planetsData = await response.json();
  planetsData.results.forEach((data) => delete data.residents);
  return planetsData;
};

export default requestAPI;
