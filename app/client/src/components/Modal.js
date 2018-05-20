import React from 'react'

const Modal = ({loading, children}) => (
  <div className={`modal ${loading ? 'modal-loading' : ''}`}>
    {children}
  </div>
)

export default Modal 
