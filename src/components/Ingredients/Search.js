import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onFilterValue} = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(filter, inputRef.current.value)
      if (filter === inputRef.current.value) {
        console.log(filter, inputRef.current.value)
        fetch('https://react-hooks-30b35.firebaseio.com/ingredients.json')
        .then(res => res.json())
        .then(data => {
          const loadedIngredients = []
          for (const key in data) {
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount
            })
          }
          onFilterValue(loadedIngredients, filter)
        })
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, onFilterValue, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={filter}
            onChange={event => setFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
