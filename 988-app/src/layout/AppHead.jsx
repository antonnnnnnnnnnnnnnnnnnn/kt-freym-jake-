import React, { useState, useEffect } from 'react';

function AppHead() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorySearch, setCategorySearch] = useState('');
  const [flagSearch, setFlagSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=sexist&amount=10');
        const data = await response.json();
        const processedData = processData(data);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(joke => {
    const categoryMatch = !categorySearch || joke.category.toLowerCase().includes(categorySearch.toLowerCase());
    const flagMatch = !flagSearch || Object.keys(joke.flags).some(flag => joke.flags[flag] && flag.includes(flagSearch.toLowerCase()));
    return categoryMatch && flagMatch;
  });

  function processData(data) {
    return data.jokes.map(joke => ({
      category: joke.category,
      setup: joke.setup,
      joke: joke.joke,
      delivery: joke.delivery,
      flags: {
        nsfw: joke.flags.nsfw,
        religious: joke.flags.religious,
        political: joke.flags.political,
        racist: joke.flags.racist,
        sexist: joke.flags.sexist,
        explicit: joke.flags.explicit,
      },
    }));
  }

  return (
    <div>
      <div className='input'>
        <input className='validate ' type="text" placeholder="Поиск по категории" value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} />
      <input className='validate' type="text" placeholder="Поиск по флагу" value={flagSearch} onChange={(e) => setFlagSearch(e.target.value)} />
      </div>
      {isLoading ? (
        <div>Загрузка данных...</div>
      ) : filteredData.length === 0 ?(
        <div>С таким параметром нет шуток. Обновите страницу!!!</div>
      ) : (
        <div className='conteiner'>
          {filteredData.map(joke => (
            <div className="block all" key={joke.id}>
              <br />
              <br />
              <div className='item'>
              <h5>{joke.category}</h5>
              <p>{joke.joke}</p>
              <p>{joke.setup}</p>
              <p>{joke.delivery}</p>
              </div>
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export {AppHead};