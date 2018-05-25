import React from 'react'

const Button = ({
  home,
  create,
  children,
  join,
  handler,
  small,
  submit
}) => (
  <button
    onClick={() => handler ? handler() : null}
    className={
      `${home ? 'btn-home' : ''}
      ${create ? 'btn-create' : ''}
      ${join ? 'btn-join' : ''}
      ${small ? 'btn-small' : ''}
      ${submit ? 'btn-submit' : ''}`
    }
    type={(create || submit) ? 'submit' : 'button'}>
    {children}
  </button>
)

export default Button
