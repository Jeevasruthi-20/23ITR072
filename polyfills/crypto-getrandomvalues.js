import crypto from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  if (crypto.webcrypto && typeof crypto.webcrypto.getRandomValues === 'function') {
    globalThis.crypto = crypto.webcrypto;
  } else {
    globalThis.crypto = {
      getRandomValues(arr) {
        if (!(arr instanceof Uint8Array)) {
          throw new TypeError('Expected Uint8Array');
        }
        crypto.randomFillSync(arr);
        return arr;
      },
    };
  }
}
