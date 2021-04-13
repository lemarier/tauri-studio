import React, {FC} from 'react';

import '../assets/main.css';
import {ManagedContext} from '../lib/context';

const Noop: FC = ({children}) => <>{children}</>;

function MyApp({Component, pageProps}) {
  return (
    <>
      <ManagedContext>
        <Component {...pageProps} />
      </ManagedContext>
    </>
  );
}

export default MyApp;
