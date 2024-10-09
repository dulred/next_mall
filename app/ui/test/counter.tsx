'use client'
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { increment, decrement, incrementByAmount } from '@/app/lib/slices/counterSlice';
const Counter: React.FC = () => {

  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
    </div>
  );
};

export default Counter;
