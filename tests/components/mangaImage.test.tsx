import React from 'react'
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react'
import MangaImage from '../../components/mangaImage/MangaImage.component'
describe('MangaImage Component', () => {
  it('should in ideal case show image on passed imageLink props', async done => {
    const { getByTestId, findByTestId } = render(
      <MangaImage
        imageLink={
          'https://mangatx.com/wp-content/uploads/WP-manga/data/manga_5d8f4b9dee659/510370694f609a81e800c2c9581feeec/001.jpg'
        }
      />
    )
    expect(
      await waitFor(() => getByTestId('fallbackImage'))
    ).toBeInTheDocument()
    expect(
      await waitFor(() => getByTestId('mangaImage'), { timeout: 500 })
    ).toBeInTheDocument()
    done()
  })
})

export {}
