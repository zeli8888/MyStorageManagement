import '@testing-library/jest-dom/vitest'
import HomeComponent from '../../component/HomeComponent'
import { describe } from 'vitest'
import { render } from '@testing-library/react';

describe('HomeComponent', () => {
    it('renders without crashing', () => {
        const { container } = render(<HomeComponent />)
        expect(container).toBeInTheDocument()
    })
})