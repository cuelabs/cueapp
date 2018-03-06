import React from 'react'

const Button = ({
  home,
  create,
  children
}) => (
  <button
    className={
      `${home ? 'btn-home' : ''}
      ${create ? 'btn-create' : ''}`
    }
    type={create ? 'submit' : 'button'}>
    {children}
  </button>
)

export default Button
