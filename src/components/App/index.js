import styles from './styles.module.css';
import { Dropdown } from '../Dropdown';

function App() {
  console.log(process.env);
  return (
    <div className={styles.App}>
      <Dropdown />
    </div>
  );
}

export default App;
