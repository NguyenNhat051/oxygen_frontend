import React from 'react';
import {Circles} from 'react-loader-spinner';

function Spinner({ message }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full mt-20">
      <Circles
        type="Circles"
        color="gray"
        height={50}
        width={200}
        className="m-5"
      />

      <p className="mt-5 text-lg font-bold text-center px-2 dark: text-slate-50">{message}</p>
    </div>
  );
}

export default Spinner;