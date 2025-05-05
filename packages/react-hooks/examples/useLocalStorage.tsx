import { ChangeEvent } from 'react';
import { useLocalStorage } from '@hooks/storage';
const LocalStorageExample = () => {
  const [name, setName, removeName] = useLocalStorage<string>('user-name', '');

  const [preferences, setPreferences, removePreferences] = useLocalStorage<{
    darkMode: boolean;
    fontSize: number;
  }>('user-preferences', {
    darkMode: false,
    fontSize: 16,
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const toggleDarkMode = () => {
    setPreferences((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const increaseFontSize = () => {
    setPreferences((prev) => ({
      ...prev,
      fontSize: prev.fontSize + 1,
    }));
  };

  const decreaseFontSize = () => {
    setPreferences((prev) => ({
      ...prev,
      fontSize: Math.max(8, prev.fontSize - 1),
    }));
  };

  const handleReset = () => {
    removeName();
    removePreferences();
  };

  return (
    <div
      style={{
        fontSize: preferences.fontSize,
        backgroundColor: preferences.darkMode ? '#222' : '#fff',
        color: preferences.darkMode ? '#fff' : '#222',
        padding: '20px',
      }}
    >
      <h1>useLocalStorage Example</h1>

      <div>
        <label htmlFor="nameInput">
          Name:
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
          />
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Preferences</h2>
        <button onClick={toggleDarkMode}>
          Toggle {preferences.darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <div style={{ marginTop: '10px' }}>
          <button onClick={decreaseFontSize}>A-</button>
          <span style={{ margin: '0 10px' }}>
            Font Size: {preferences.fontSize}px
          </span>
          <button onClick={increaseFontSize}>A+</button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleReset}>Reset All Settings</button>
      </div>

      <pre style={{ marginTop: '20px' }}>
        {JSON.stringify({ name, preferences }, null, 2)}
      </pre>
    </div>
  );
};

export default LocalStorageExample;
