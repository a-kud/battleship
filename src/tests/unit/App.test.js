import React from 'react'
import App from '../../App'
import { shallow } from 'enzyme'

test('contains welcome header', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.text()).toContain('Welcome to Battleship')
})
