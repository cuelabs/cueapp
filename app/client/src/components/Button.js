import React from 'react'

const Button = ({
  home,
  create,
  children,
  join,
  handler
}) => (
  <button
    onClick={() => handler ? handler() : null}
    className={
      `${home ? 'btn-home' : ''}
      ${create ? 'btn-create' : ''}
      ${join ? 'btn-join' : ''}`
    }
    type={create ? 'submit' : 'button'}>
    {children}
  </button>
)

export default Button
