

/*import React, { useState } from 'react';
import axios from 'axios';
import Nav1 from './compont/nav1';
import Nav2 from './compont/nav2';
import { BrowserRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Inscrption from './compont/inscrption';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFSI, setIsFSI] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nouvelle_cle, setNouvelle_cle] = useState(null);
  const handleLogin = async () => {
    try {
      let url = '';
      if (isAdmin) {
        url = 'http://localhost:4972/loginadministrateur';
      } else if (isFSI) {
        url = 'http://localhost:4972/loginfsi';
      } else {
        setMessage("Veuillez sélectionner un type d'utilisateur.");
        return;
      }
      
      const response = await axios.post(url, { email, password });
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.Id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('nouvelle_cle', response.data.nouvelle_cle);
        setNouvelle_cle(response.data.nouvelle_cle);
        setUserId(response.data.Id);
       // setMessage('Connexion réussie');
        setIsLoggedIn(true);
      } else {
        setMessage('Réponse invalide du serveur');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('nouvelle_cle');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
   // setMessage('Déconnexion réussie');
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="d-flex justify-content-center align-items-center vh-100" bg="dark" data-bs-theme="dark">
          <Alert variant="light">
            <Alert.Heading>Authentification</Alert.Heading>
            <hr />
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Adresse e-mail</Form.Label>
                <Form.Control type="email" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                  Nous ne partagerons jamais votre e-mail avec personne d'autre.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check 
                  type="radio" 
                  label="Administrateur"
                  checked={isAdmin}
                  onChange={() => {
                    setIsAdmin(true);
                    setIsFSI(false);
                  }}
                />
                <Form.Check 
                  type="radio" 
                  label="FSI" 
                  checked={isFSI}
                  onChange={() => {
                    setIsFSI(true);
                    setIsAdmin(false);
                  }}
                />
              </Form.Group>
              <Button  
              variant="primary"  onClick={handleLogin}> Se connecter </Button>             

            </Form>
            <hr />

            <Inscrption />

            </Alert>

          <p>{message}</p>
        </div>
      ) : (
        <div>
        <BrowserRouter>
  {isAdmin ? <Nav1 userId={userId} handleLogout={handleLogout} /> : <Nav2 userId={userId} handleLogout={handleLogout} />}
</BrowserRouter>

      </div>
      )}
    </div>
  );
}

export default App;*/
/*
import React, { useState } from 'react';
import axios from 'axios';
import Nav1 from './compont/nav1';
import Nav2 from './compont/nav2';
import { BrowserRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Inscrption from './compont/inscrption';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFSI, setIsFSI] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nouvelle_cle, setNouvelle_cle] = useState(null);
  const handleLogin = async () => {
    try {
      let url = '';
      if (isAdmin) {
        url = 'http://localhost:4972/loginadministrateur';
      } else if (isFSI) {
        url = 'http://localhost:4972/loginfsi';
      } else {
        setMessage("Veuillez sélectionner un type d'utilisateur.");
        return;
      }
      
      const response = await axios.post(url, { email, password });
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.Id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('nouvelle_cle', response.data.nouvelle_cle);
        setNouvelle_cle(response.data.nouvelle_cle);
        setUserId(response.data.Id);
       // setMessage('Connexion réussie');
        setIsLoggedIn(true);
      } else {
        setMessage('Réponse invalide du serveur');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('nouvelle_cle');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
   // setMessage('Déconnexion réussie');
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="d-flex justify-content-center align-items-center vh-100" bg="dark" data-bs-theme="dark">
          <Alert variant="light">
            <Alert.Heading>Authentification</Alert.Heading>
            <hr />
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Adresse e-mail</Form.Label>
                <Form.Control type="email" placeholder="Entrez votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                  Nous ne partagerons jamais votre e-mail avec personne d'autre.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check 
                  type="radio" 
                  label="Administrateur"
                  checked={isAdmin}
                  onChange={() => {
                    setIsAdmin(true);
                    setIsFSI(false);
                  }}
                />
                <Form.Check 
                  type="radio" 
                  label="FSI" 
                  checked={isFSI}
                  onChange={() => {
                    setIsFSI(true);
                    setIsAdmin(false);
                  }}
                />
              </Form.Group>
              <Button  
              variant="primary"  onClick={handleLogin}> Se connecter </Button>             

            </Form>
            <hr />

            <Inscrption />

            </Alert>

          <p>{message}</p>
        </div>
      ) : (
        <div>
        <BrowserRouter>
  {isAdmin ? <Nav1 userId={userId} handleLogout={handleLogout} /> : <Nav2 nouvelle_cle={nouvelle_cle} userId={userId} handleLogout={handleLogout} />}
</BrowserRouter>

      </div>
      )}
    </div>
  );
}

export default App;*/

import React, { useState } from 'react';
import axios from 'axios';
import Nav1 from './compont/nav1';
import Nav2 from './compont/nav2';
import Nav3 from './compont/nav3';
import { BrowserRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Inscription  from './compont/inscrption';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [type, setType] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4972/loginadministrateur', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.Id);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('type', response.data.type);

        setUsername(response.data.username);
        setUserId(response.data.Id);
        setType(response.data.type);
        setIsLoggedIn(true);
      } else {
        setMessage('Réponse invalide du serveur');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setUsername('');
    setUserId(null);
    setType('');
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="d-flex justify-content-center align-items-center vh-100" bg="dark" data-bs-theme="dark">
          <Alert variant="light">
            <Alert.Heading>Welcome back!</Alert.Heading>
            <hr />
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
            </Form>
            <hr />
            <Inscription />
          </Alert>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <BrowserRouter>
            {type === 'admin' && <Nav1 userId={userId} handleLogout={handleLogout} />}
            {type === 'FSI' && <Nav2 username={username} userId={userId} handleLogout={handleLogout} />}
            {type === 'sous-admin' && <Nav3 userId={userId} handleLogout={handleLogout} />}
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;