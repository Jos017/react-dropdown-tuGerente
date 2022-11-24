import styles from './styles.module.css';
import { Dropdown } from '../Dropdown';

function App() {
  return (
    <div className={styles.App}>
      <Dropdown queryLimit={20} searchBy="name" />
    </div>
  );
}

export default App;
