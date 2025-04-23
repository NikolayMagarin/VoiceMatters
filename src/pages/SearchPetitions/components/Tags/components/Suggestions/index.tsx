import styles from './Suggestions.module.css';

interface Props {
  values: { id: string; name: string }[];
  onChoose: (value: { id: string; name: string }) => void;
}

function Suggestions({ values, onChoose }: Props) {
  return (
    <div className={styles.container}>
      {values.map((value, i) => (
        <div key={i} className={styles.option} onClick={() => onChoose(value)}>
          {value.name}
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
