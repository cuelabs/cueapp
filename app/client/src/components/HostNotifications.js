import React from 'react'

const HostNotifications = ({data}) => (
  <div className='view'>
    <h3 className='host-view-page-title'>Notifications</h3>
    <ul className='host-view-page-list'>
      {
        data.map(item => (
          <li key={item.id}
            style={{flexDirection: `${item.type === 'JOIN_REQUEST' ? 'column' : 'row'}`}}>
            <p style={{alignSelf: `${item.type === 'JOIN_REQUEST' ? 'flex-start' : 'center'}`}}>{item.message}</p>
            {
              item.type === 'JOIN_REQUEST'
              && (
                <div className='host-request-options'>
                  <button style={{padding: '2vh'}}>Accept</button>
                  <button style={{padding: '2vh'}}>Reject</button>
                </div>
              )
            }
          </li>
        )).reverse()
      }
    </ul>
  </div>
)

export default HostNotifications