import React, { useEffect, useState } from 'react';
import { GoAlert } from 'react-icons/go'
import { useFormik } from 'formik';
import { getJokes, category as Category, flag as Flag, requestOptions } from "sv443-joke-api";
import './style/App.css';

const AVAILABLE_CATEGORIES: Category[] = ["Programming", "Miscellaneous", "Dark", "Pun", "Spooky", "Christmas"]
const AVAILABLE_FLAGS = ["NSFW", "Religious", "Political", "Sexist"]

type SinglePartJoke = {
  content: string,
  category: Category | ''
}
type FormValues = {
  // TK convert it to Category
  categories: Set<Category>,
  // TK convert it to Flag
  flags: Set<Flag>,
  searchString: string
}

type Error = {
  error: Boolean,
  internalError: Boolean,
  code: number,
  message: string,
  causedBy: string[],
  additionalInfo: string,
  timestamp: number
}

// TK Make it work.
function App() {
  const [joke, setJoke] = useState<SinglePartJoke>({
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
      categories: new Set(),
      flags: new Set()
    },
    onSubmit: (values) => {
      loadJoke()
    }
  })

  const updateCheckboxValues = (type: 'categories' | 'flags', value: Flag | Category) => {
    let n = new Set(Array.from(formik.values[type]))
    //@ts-ignore
    if (formik.values[type].has(value)) {
      n.delete(value);
    } else {
      n.add(value);
    }

    formik.setValues({
      ...formik.values,
      [type]: n
    })
  }

  const loadJoke = () => {
    let v = formik.values
    let options: requestOptions = {
      idRange: {
        to: 257
      },
      jokeType: 'single'
    }
    if (v.searchString !== '') options.searchString = v.searchString
    if (v.flags.size !== 0) options.flags = Array.from(v.flags)
    if (v.categories.size !== 0) options.categories = Array.from(v.categories)

    console.log(options);

    getJokes(options).then(res => res.json()).then(d => {
      console.log(d)
      if (!d.error) {
        setJoke({
          content: d.joke,
          category: d.category as Category
        })
        setError({
          ...error,
          error: false
        })
      } else {
        setError(d)
      }
    });
  }

  useEffect(() => {
    console.log('aaaa');
    loadJoke()
  }, [])

  return (
    <div className="app-container">

      <div className="joke-container">
        <div className="joke">
          <h2 className="joke--text">{joke.content}</h2>

          <span className="joke--tag">{joke.category}</span>
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
            <div className="option">
              {AVAILABLE_CATEGORIES.map(category => {
                return (
                  <span key={category.toLowerCase()}>
                    <input
                      type="checkbox"
                      name="category"
                      value={category}
                      checked={formik.values.categories.has(category as Category)}
                      id={category.toLowerCase()}
                      onChange={(ev: any) => {
                        updateCheckboxValues.call(ev, 'categories', category)
                      }}
                    />
                    <label htmlFor={category.toLowerCase()}>{category}</label>
                  </span>
                )
              })}
            </div>
            <div className="option">
              {AVAILABLE_FLAGS.map(flag => {
                return (
                  <span key={flag.toLowerCase()}>
                    <input
                      type="checkbox"
                      name="flag"
                      value={flag}
                      checked={formik.values.flags.has(flag.toLowerCase() as Flag)}
                      id={flag.toLowerCase()}
                      onChange={(ev: any) => {
                        updateCheckboxValues.call(ev, 'flags', flag.toLowerCase() as Flag)
                      }}
                    />
                    <label htmlFor={flag.toLowerCase()}>{flag}</label>
                  </span>
                )
              })}
            </div>
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
