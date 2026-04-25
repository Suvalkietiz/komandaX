import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {}); //warningai ignoruojami švaresnis testų output
});

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}

if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}