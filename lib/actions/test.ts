'use server';

const Test = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  return await res.json();
};

export { Test };
