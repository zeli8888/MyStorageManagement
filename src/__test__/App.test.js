test('Sanity check', () => {
  render(<div>test</div>);
  expect(screen.getByText('test')).toBeInTheDocument();
});
