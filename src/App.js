import React, { useEffect, useState } from 'react'
import './App.css'
import Tmdb from './Tmdb'
import MovieRow from './components/Movie'
import FeaturedMovie from './components/Featured'
import Header from './components/Header'
import FavoriteIcon from '@material-ui/icons/Favorite'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList()
      setMovieList(list)

      // Pegando o Featured
      let originals = list.filter((i) => i.slug === 'originals')
      let randomChosen = Math.floor(
        Math.random() * originals[0].items.results.length - 1
      )
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')

      setFeaturedData(chosenInfo)
    }

    loadAll()
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com
        <span role="img" aria-label="coração">
          <FavoriteIcon style={{ fontSize: 20 }} />
        </span>
        por FullDevStack
        <br />
        Direitos de imagem para Netflix
        <br />
        Dados pegos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
            alt="Carregando"
          />
        </div>
      )}
    </div>
  )
}
