import styles from './Suggestions.module.css';

interface Props {
  values: string[];
  onChoose: (value: string) => void;
}

function Suggestions({ values, onChoose }: Props) {
  return (
    <div className={styles.container}>
      {values.map((value, i) => (
        <div key={i} className={styles.option} onClick={() => onChoose(value)}>
          {value}
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
