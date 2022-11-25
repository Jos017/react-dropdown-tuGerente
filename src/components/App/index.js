import styles from './styles.module.css';
import { Dropdown } from '../Dropdown';

function App() {
  return (
    <div className={styles.App}>
      <Dropdown queryLimit={20} />
    </div>
  );
}

export default App;
