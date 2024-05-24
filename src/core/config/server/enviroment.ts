// export const enivroment = '.env.develop';
export const enivroment = process.env.NODE_ENV === 'production' ? '.env' : '.env.develop';
