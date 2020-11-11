import React, { useEffect, useState } from 'react';
import { GoAlert } from 'react-icons/go'
import { useFormik } from 'formik';
import { getJokes, category as Category, flag as Flag, requestOptions } from "sv443-joke-api";
import { Error, JokeObject, FormValues, AVAILABLE, capitalize } from './extras';
import './style/App.css';

function App() {
  const [joke, setJoke] = useState<JokeObject>({
    type: '',
    content: '',
    category: ''
  })
  const [error, setError] = useState<Error>({
    error: false,
    internalError: false,
    code: 0,
    message: '',
    causedBy: [''],
    additionalInfo: '',
    timestamp: 0
  })
  const formik = useFormik<FormValues>({
    initialValues: {
      searchString: '',
      categoryArray: new Set(),
      flagArray: new Set()
    },
    onSubmit: (values) => {
      loadJokes()
    }
  })

  const updateCheckboxValues = (_type: 'category' | 'flag', value: Flag | Category) => {
    console.log('CAAA')
    let type = _type + 'Array' as 'categoryArray' | 'flagArray'
    let n = new Set(Array.from(formik.values[type])) // copying the set
    // @ts-ignore
    if (formik.values[type].has(value)) {
      n.delete(value);
    } else {
      n.add(value);
    }

    formik.setValues({
      ...formik.values,
      [type]: n
    })
    console.log({ type, n, values: formik.values })
  }

  const getFlags = (joke: { flags: { [s: string]: boolean } }) => {
    return Object.entries(joke.flags)
      .filter(([_, v]) => v)
      .map(([key, _]) => key)
      .map(capitalize)
      .map(v => v === 'Nsfw' ? 'NSFW' : v)
  }

  const loadJokes = () => {
    const v = formik.values
    let options: requestOptions = {
      idRange: {
        to: 257
      }
    }
    if (v.searchString !== '') options.searchString = v.searchString
    options.flags = Array.from(v.flagArray)
    if (v.categoryArray.size !== 0) options.categories = Array.from(v.categoryArray)

    console.log(options);

    getJokes(options).then(res => res.json())
      .then(jokeData => {
        console.log(jokeData)
        if (!jokeData.error) {
          setJoke({
            type: jokeData.type,
            content: jokeData.joke,
            setup: jokeData.setup,
            delivery: jokeData.delivery,
            category: jokeData.category as Category,
            flags: getFlags(jokeData)
          })
          setError({
            ...error,
            error: false
          })
        } else {
          setError(jokeData)
        }
      });
  }

  useEffect(() => {
    console.log('aaaa');
    loadJokes()
  }, [])

  return (
    <div className="app-container">

      <div className="joke-container">
        <div className="joke">
          {
            joke.type === 'single' ?
              <h2 className="joke--text">{joke.content}</h2>
              : <div>
                <h2 className="joke--text">{joke.setup}</h2>
                <h2 className="joke--text">{joke.delivery}</h2>
              </div>
          }

          <div className="joke--tags-container">
            <span className="joke--tag">{joke.category}</span>
            {joke.flags?.map(flag =>
              <span className="joke--tag" key="flag">{flag}</span>
            )}
          </div>
        </div>
      </div>

      <div className={['error', error.error ? 'error-show' : "error-hide"].join(' ')}>
        <GoAlert className="alert-icon" /> {error.message}
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="options-container">
          <div className="oppp-1">
            <div className="option" id="search">
              <input type="text" placeholder="Search" name="searchString" onChange={formik.handleChange} />
            </div>

            {/* TK Dynamically generate these options from one code */}

            {['category', 'flag'].map(type => {
              return (<div key={type} className="option">
                {/* @ts-ignore */}
                {AVAILABLE[type].map(item => {
                  return (
                    <span key={item.toLowerCase()}>
                      <input
                        type="checkbox"
                        name={type}
                        value={item}
                        // @ts-ignore
                        checked={formik.values[type + 'Array'].has(item)}
                        id={item.toLowerCase()}
                        onChange={(ev: any) => {
                          console.log('SS')
                          // @ts-ignore
                          updateCheckboxValues.call(ev, type, item)
                        }}
                      />
                      <label htmlFor={item.toLowerCase()}>{item}</label>
                    </span>
                  )
                })}
              </div>
              )
            })}
          </div>
          <button type="submit" className="submit-button">
            Get Another Joke
            </button>
        </div>
      </form>
    </div>
  );
}

export default App;
