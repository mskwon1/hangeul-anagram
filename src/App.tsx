import {
  KeyboardEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import './App.css';
import hangul from 'hangul-js';

type wordType = { word: string; disassembled: string[] };

const QueryResultList = memo((props: { query: string }) => {
  const { query } = props;
  const [words, setWords] = useState<wordType[]>([]);

  useEffect(() => {
    import('./assets/words.json').then(({ default: words }) =>
      setWords(words as unknown as wordType[])
    );
  }, []);

  const queryResult = useMemo(() => {
    if (words.length === 0 || query.length === 0) {
      return [];
    }

    const target = hangul.disassemble(query).sort();

    return words.filter(({ disassembled }) => {
      return disassembled.join('') === target.join('');
    });
  }, [query, words]);

  if (query === '') {
    return null;
  }

  if (words === null) {
    return <div>단어 로딩중...</div>;
  }

  if (queryResult.length === 0) {
    return <div>결과가 없습니다.</div>;
  }

  return (
    <ul>
      {queryResult.map(({ word }) => {
        return <li key={word}>{word}</li>;
      })}
    </ul>
  );
});

function App() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const onClickFind = useCallback(() => {
    setQuery(input);
  }, [input]);

  const onEnterPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === 'Enter') {
        setQuery(input);
      }
    },
    [input]
  );

  return (
    <>
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onEnterPress}
        />
        <button type="button" onClick={onClickFind}>
          찾기
        </button>
      </div>
      <QueryResultList query={query} />
    </>
  );
}

export default App;
