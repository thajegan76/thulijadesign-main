import { Qualification } from './qualification';

describe('Qualification', () => {
  it('should create an instance', () => {
    expect(new Qualification(0, 0, "", "", 0)).toBeTruthy();
  });
});