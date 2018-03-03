import data from '../data'

export const handleSearch = e => {
  return dispatch => {
    const { value } = e.target
    let results

    if (value !== '') {
      results = data
        .filter(item => {
          return item.name
            .toLowerCase()
            .startsWith(
              value.toLowerCase()
            )
        })
    } else {
      results = []
    }

    dispatch({
      type: 'SEARCH_INPUT_CHANGE',
      value,
      results
    })
  }
}
