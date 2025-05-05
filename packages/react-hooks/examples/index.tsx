import { useState } from 'react';
import LocalStorageExample from './useLocalStorage';
import MediaQueriesExample from './useMediaQueries';

const Examples = () => {
  const [activeExample, setActiveExample] = useState<
    'localStorage' | 'mediaQueries'
  >('localStorage');

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>JS Toolkit Library React Hooks Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveExample('localStorage')}
          style={{
            fontWeight: activeExample === 'localStorage' ? 'bold' : 'normal',
            padding: '8px 16px',
            marginRight: '10px',
          }}
        >
          useLocalStorage
        </button>
        <button
          onClick={() => setActiveExample('mediaQueries')}
          style={{
            fontWeight: activeExample === 'mediaQueries' ? 'bold' : 'normal',
            padding: '8px 16px',
          }}
        >
          useMediaQueries
        </button>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '20px',
        }}
      >
        {activeExample === 'localStorage' ? (
          <LocalStorageExample />
        ) : (
          <MediaQueriesExample />
        )}
      </div>
    </div>
  );
};

export default Examples;

/*
To run this example:

1. Import the Examples component in your app
2. Mount it in your component tree

Example:
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import Examples from '@js-toolkit-library/react-hooks/examples';

ReactDOM.render(
  <React.StrictMode>
    <Examples />
  </React.StrictMode>,
  document.getElementById('root')
);
```
*/
