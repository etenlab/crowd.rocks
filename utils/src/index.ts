export * from './langUtils/langUtils';
export * from './sortingFns/sortingFns';
export * from './types';
export * from './constants';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('dev only output');
  }
  return a + b;
};
