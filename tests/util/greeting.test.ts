import getGreeting from '../../src/util/greeting';
test('non-empty greeting for all hours', () => {
	for (
		let i = 0;
		i < 100;
		i++ // let the rng do its thing
	)
		for (let hr = 0; hr < 24; hr++)
			expect(getGreeting(hr).length > 0).toBe(true);

	expect(() => getGreeting(-1)).toThrow();
	expect(() => getGreeting(24)).toThrow();
});
