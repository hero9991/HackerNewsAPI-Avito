import './App.css';
import { Route } from 'react-router-dom';
import MainContainer from './components/Main/MainContainer';
import NewsContainer from './components/News/NewsContainer';

function App() {
  return (
    <div className="App">
        <Route path='/HackerNewsAPI-Avito' render={() => <MainContainer />}/>
        <Route path='/News/:id?' render={() => <NewsContainer />}/>
    </div>
  );
}

export default App;
