import React from 'react'
import constructionimg from "../assets/construction.png"

const Underconstruction = () => {
  return (
    <div>
      <img 
          src={constructionimg}
          alt="Isometric Background"
          className=" inset-0 w-full h-300px object-cover object-top pointer-events-none z-0 brightness-100 dark:brightness-150 contrast-105 transition-all duration-300 "
        />
    </div>
  )
}

export default Underconstruction
