import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MainPage } from '../components/mainPage'

describe('MainPage', () => {
  it('renders', () => {
    render(<MainPage />)
  })
  it('has a header', () => {
    const { getByTestId } = render(<MainPage />)
    expect(getByTestId('header')).toBeTruthy()
  })
  it('has a divider', () => {
    const { getByTestId } = render(<MainPage />)
    expect(getByTestId('divider')).toBeTruthy()
  })
  it('has a release selector', () => {
    const { getByTestId } = render(<MainPage />)
    expect(getByTestId('release-select')).toBeTruthy()
  })
  it('has a column filter selector', () => {
    const { getByTestId } = render(<MainPage />)
    expect(getByTestId('column-filter-select')).toBeTruthy()
  })
})
