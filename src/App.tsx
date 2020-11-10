import React, { useEffect, useState } from 'react';
import { getJokes, category as Category, flag as Flag } from "sv443-joke-api";
import { useFormik } from 'formik';
import './style/App.css';

const AVAILABLE_CATEGORIES = ["Programming", "Miscellaneous", "Dark", "Pun", "Spooky", "Christmas"]
const AVAILABLE_FLAGS = ["NSFW", "Religious", "Political", "Sexist"]

type SinglePartJoke = {
  content: string,
  category: Category
}
type FormValues = {
  // TK convert it to Category
  categories: Set<string>,
  // TK convert it to Flag
  flags: Set<string>,
  searchString: string
}

// TK Make it work.
function App() {
  const [joke, setJoke] = useState<SinglePartJoke>({
    content: '',
    category: 'Programming'
  })
  const formik = useFormik<FormValues>({
    initialValues: {
      searchString: '',
      categories: new Set(),
      flags: new Set()
    },
    onSubmit: (values) => {
      console.log(values);
    }
  })

  // TK Make them one function
  const updateCategory = (event: any) => {
    let v = event.target.value,
      newCategories = new Set(Array.from(formik.values.categories))
    if (formik.values.categories.has(v)) {
      newCategories.delete(v);
    } else {
      newCategories.add(v);
    }

    formik.setValues({
      ...formik.values,
      categories: newCategories
    })
  }
  const updateFlag = (event: any) => {
    let v = event.target.value,
      newFlags = new Set(Array.from(formik.values.flags))
    if (formik.values.flags.has(v)) {
      newFlags.delete(v);
    } else {
      newFlags.add(v);
    }

    formik.setValues({
      ...formik.values,
      flags: newFlags
    })
  }

  useEffect(() => {
    // TK use the formik values as options
    getJokes({
      idRange: {
        to: 257
      },
      jokeType: 'single'
    }).then(res => res.json()).then(d => {
      console.log(d)
      if (!d.error) {
        setJoke({
          content: d.joke,
          category: d.category as Category
        })
      }
    });
  }, [])
  return (
    <div className="app-container">

      <div className="joke-container">
        <div className="joke">
          <h2 className="joke--text">{joke.content}</h2>
        </div>
      </div>
      <div className="options-container">
        <h2>Options</h2>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <h3>Category</h3>
            <div>
              {AVAILABLE_CATEGORIES.map(category => {
                return (
                  <div key={category.toLowerCase()}>
                    <input
                      type="checkbox"
                      name="category"
                      value={category}
                      checked={formik.values.categories.has(category)}
                      id={category.toLowerCase()}
                      onChange={updateCategory}
                    />
                    <label htmlFor={category.toLowerCase()}>{category}</label>
                  </div>
                )
              })}
            </div>
            <div>
              <h3>Flags</h3>
              <div>
                {AVAILABLE_FLAGS.map(flag => {
                  return (
                    <div key={flag.toLowerCase()}>
                      <input
                        type="checkbox"
                        name="flag"
                        value={flag}
                        checked={formik.values.flags.has(flag)}
                        id={flag.toLowerCase()}
                        onChange={updateFlag}
                      />
                      <label htmlFor={flag.toLowerCase()}>{flag}</label>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <button type="submit">
            Get Another Joke
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
