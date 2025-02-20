import React from 'react'

interface IProps {
  content: {
    content: string
    author: {
      name: string
      designation: string
    }
  }
}

function Testimonial(props: Readonly<IProps>){
  return (
    <div className="mi-testimonial-slideritem">
      <div className="mi-testimonial">
        <div className="mi-testimonial-content">
          <p>
            {props.content.content}
          </p>
        </div>
        <div className="mi-testimonial-author">
          <h5>{props.content.author.name}</h5>
          <h6>{props.content.author.designation}</h6>
        </div>
      </div>
    </div>
  )
}

export default Testimonial;