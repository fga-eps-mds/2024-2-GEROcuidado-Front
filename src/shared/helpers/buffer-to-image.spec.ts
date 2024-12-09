import {
  bufferToBase64,
  getImageUri,
  isBase64,
  isBase64Image,
} from './buffer-to-image';

describe('Buffer to image', () => {
  describe('bufferToBase64', () => {
    it('should be bufferToBase64 a image', async () => {
      const str = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
      const buff = Buffer.from(str, 'utf-8');
      const image = bufferToBase64(buff);
      expect(image).toBeDefined();
      expect(image).toEqual(str);
    });

    it('should getImageUri', async () => {
      const str = '/9j/4AAQSkZJRgABAQAAAQABAAD';
      const buff = Buffer.from(str, 'utf-8');
      const image = getImageUri(buff);
      expect(image).toEqual('data:image/png;base64,' + str);
    });

    it('should be bufferToBase64 a empty if null', async () => {
      const str = 'null';
      const buff = Buffer.from(str, 'utf-8');
      const image = bufferToBase64(buff);
      expect(image).toBeDefined();
      expect(image).toEqual('');
    });

    it('should be bufferToBase64 a empty if not image', async () => {
      const str = '';
      const buff = Buffer.from(str, 'utf-8');
      const image = bufferToBase64(buff);
      expect(image).toBeDefined();
      expect(image).toEqual('');
    });
  });

  describe('isBase64', () => {
    it('should be false', async () => {
      const isValid = isBase64(null);
      expect(isValid).toBeFalsy();
    });

    it('should be true', async () => {
      const str = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
      const isValid = isBase64(str);
      expect(isValid).toBeTruthy();
    });
  });

  describe('isBase64Image', () => {
    it('should be false', async () => {
      const isValid = isBase64Image('');
      expect(isValid).toBeFalsy();
    });

    it('should be true', async () => {
      const str = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
      const isValid = isBase64Image(str);
      expect(isValid).toBeTruthy();
    });
  });
});
