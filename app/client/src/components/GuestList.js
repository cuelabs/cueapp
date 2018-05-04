import React from 'react'

const GuestList = ({users}) => (
  <div className='view'>
    <h3 className='host-view-page-title'>Guest List</h3>
    <ul className='host-view-page-list'>
      {
        users.map(item => (
          <li key={item.id}>
            <div className='guest-photo'
              style={{backgroundImage: `url(${item.img})`}} />
            <p>{item.name}</p>
          </li>
        ))
      }
    </ul>
  </div>
)

export default GuestList
