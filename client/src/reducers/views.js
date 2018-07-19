const initialState = {
  hostView: 0,
  homeView: 'HOME',
}

const views = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_HOST_VIEW':
      return {
        ...state,
        hostView: action.num
      }
    case 'CHANGE_HOME_VIEW':
      return {
        ...state,
        homeView: action.view
      }
    default: 
      return state
  }
}

export default views