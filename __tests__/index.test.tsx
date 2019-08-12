import React from 'react'
import Home from '../pages'
import {render} from '@testing-library/react'

describe('', () => {
  test('should render element', () => {
    const {queryByText} = render(<Home />)

    expect(queryByText('Reddit clone!')).toBeTruthy();
  })
})
