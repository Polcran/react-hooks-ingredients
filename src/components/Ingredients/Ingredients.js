import React, { useReducer, useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ingredient => ingredient.id !== action.id);
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.errorMessage
      };
    case 'CLEAR':
      return {
        ...curHttpState,
        error: null
      };
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filterIngredientsHandler = useCallback((filterList, filter) => {
    const filterIngredients = filterList.filter(
      list => list.title.toLowerCase().indexOf(filter.toLowerCase())  !== -1 || filter === ''
    );
    // setUserIngredients(filterIngredients);
    dispatch({type: 'SET', ingredients: filterIngredients})
  }, [])

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'});
    // setIsLoading(true);
    fetch('https://react-hooks-30b35.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      dispatchHttp({type: 'RESPONSE'});
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: data.name, ...ingredient }
      // ]);
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...ingredient }
      })
    })
  };

  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type: 'SEND'})
    fetch(`https://react-hooks-30b35.firebaseio.com/ingredients/${ingredientId}.jsn`, {
      method: 'DELETE'
    })
    .then(() => {
      dispatchHttp({type: 'RESPONSE'});
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({type: 'DELETE', id: ingredientId})
    })
    .catch(error => {
      dispatchHttp({
        type: 'ERROR',
        errorMessage: 'Something went wrong!'
      });
    })
  };

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />

      <section>
        <Search
          onFilterValue={filterIngredientsHandler}
        />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
