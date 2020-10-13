import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
);

const Statistic = ({ category, value }) => (
  <tr>
    <td>{category}</td>
    <td>{value} {category === "positive" ? "%" : ""} </td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good * 100) / all;
  if (!all) {
      return <p>No feedback given</p>;
  }
  return (
      <table>
        <tbody>
          <Statistic category="good" value={good} />
          <Statistic category="neutral" value={neutral} />
          <Statistic category="bad" value={bad} />
          <Statistic category="all" value={all} />
          <Statistic category="average" value={average} />
          <Statistic category="positive" value={positive} />
        </tbody>
      </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={ () => setGood(good + 1)} text="good" />
      <Button handleClick={ () => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={ () => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
