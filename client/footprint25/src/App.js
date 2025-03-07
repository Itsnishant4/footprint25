import './App.css';
import Header from './components/header';
import Main from './components/main';
import S from './components/s';
import Secret from './components/secret';
import Add from './components/add';
import Namee from './components/nm';
function App() {
  const params = new URLSearchParams(window.location.search);
  const pg = params.get("pg");

  return (
    <div className="App">
      {pg === "name" && <Namee />}
      {!pg && (
        <>
          <Header />
          <Main />
        </>
      )}
      {pg === "s" && <Header />}
      {pg === "add" && <Header />}
      {pg === "add" && <Add />}
      {pg === "s" && <S />}
      {pg === "secret" && <Secret />}
    </div>
  );
}

export default App;
