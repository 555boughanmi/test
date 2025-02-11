/*
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, DropdownButton, Row, Col, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import folderImage from './fsi.PNG';

const SearchForm = () => {
  const [idfsi, setIdfsi] = useState([]);
  const [mois, setMois] = useState(Object.fromEntries([...Array(12).keys()].map((m) => [m + 1, false])));
  const [results, setResults] = useState([]);
  const [technologies, setTechnologies] = useState({
    VDSL: false, SDSL: false, ADSL: false, FTTH: false, 'LS-FO': false,
  });
  const [selectedColumns, setSelectedColumns] = useState({
    KPI3_11: false, KPI2_1: false, KPI2_2: false, KPI2_3: false, KPI2_4: false,
    KPI2_5: false, KPI2_6: false,
  });
  const [users, setUsers] = useState([]);
  const [columnSelection, setColumnSelection] = useState('both'); // 'pro', 'res', 'both'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4972/listfsi');
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs FSI :', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChangeTechnologies = useCallback((e) => {
    const { name, checked } = e.target;
    setTechnologies((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleChangeMois = useCallback((e) => {
    const { name, checked } = e.target;
    setMois((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleChangeIdfsi = useCallback((e) => {
    const { name, checked } = e.target;
    setIdfsi((prev) => (checked ? [...prev, name] : prev.filter((id) => id !== name)));
  }, []);

  const handleCheckboxChange = useCallback((columnName) => {
    setSelectedColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }));
  }, []);

  const handleColumnSelection = useCallback((selection) => {
    setColumnSelection(selection);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const selectedTechnologies = Object.keys(technologies).filter((tech) => technologies[tech]);
    const selectedMois = Object.keys(mois).filter((moi) => mois[moi]);

    try {
      const response = await axios.post('http://localhost:4972/search2', {
        idfsi: idfsi.join(','),
        mois: selectedMois.join(','),
        technologies: selectedTechnologies.join(','),
      });
      setResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  }, [idfsi, mois, technologies]);

  const handleReset = useCallback(() => {
    setIdfsi(Object.fromEntries(Object.keys(idfsi).map((key) => [key, false])));
    setMois(Object.fromEntries(Object.keys(mois).map((key) => [key, false])));
    setTechnologies(Object.fromEntries(Object.keys(technologies).map((key) => [key, false])));
    setSelectedColumns(Object.fromEntries(Object.keys(selectedColumns).map((key) => [key, false])));
    setColumnSelection('both');
    setResults([]);
  }, [idfsi, mois, technologies, selectedColumns]);

  return (
    <div>
      <p> </p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>FSI</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez FSI">
                  <Col sm="10">
                    {users.map((user) => (
                      <Form.Check
                        key={user.id}
                        type="checkbox"
                        name={String(user.id)}
                        label={user.id}
                        checked={idfsi.includes(String(user.id))}
                        onChange={handleChangeIdfsi}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les FSI à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>Mois:</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez Mois">
                  <Col sm="10">
                    {[...Array(12).keys()].map((month) => (
                      <Form.Check
                        key={month + 1}
                        type="checkbox"
                        name={(month + 1).toString()}
                        label={new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2000, month))}
                        checked={mois[month + 1]}
                        onChange={handleChangeMois}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les mois à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>Technologie:</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez Technologie">
                  <Col sm="10">
                    {Object.keys(technologies).map((tech) => (
                      <Form.Check
                        key={tech}
                        type="checkbox"
                        name={tech}
                        label={tech}
                        checked={technologies[tech]}
                        onChange={handleChangeTechnologies}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les technologies à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>KPI:</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez KPI">
                  <Col sm="10">
                    {Object.keys(selectedColumns).map((column) => (
                      <Form.Check
                        key={column}
                        type="checkbox"
                        name={column}
                        label={column}
                        checked={selectedColumns[column]}
                        onChange={() => handleCheckboxChange(column)}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les KPI à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button type="submit" variant="warning">Rechercher</Button>
            <Button variant="secondary" onClick={handleReset}>Réinitialiser</Button>
          </Col>
          <Col>
            <Col className="text-end" sm="10">
              <Button variant={columnSelection === 'pro' ? 'warning' : 'secondary'} onClick={() => handleColumnSelection('pro')}>Pro</Button>
              <Button variant={columnSelection === 'res' ? 'warning' : 'secondary'} onClick={() => handleColumnSelection('res')}>Res</Button>
              <Button variant={columnSelection === 'both' ? 'warning' : 'secondary'} onClick={() => handleColumnSelection('both')}>Les deux</Button>
            </Col>
          </Col>
        </Row>
      </Form>
      {results.length > 0 && (
        <div>
          <p></p>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>FSI</th>
                <th>Mois</th>
                <th>Technologie</th>
                {Object.keys(selectedColumns).filter((column) => selectedColumns[column]).map((column) => (
                  <React.Fragment key={column}>
                    {columnSelection === 'both' && <th colSpan={2}>{column}</th>}
                    {columnSelection === 'pro' && <th>{column} Pro</th>}
                    {columnSelection === 'res' && <th>{column} Res</th>}
                  </React.Fragment>
                ))}
              </tr>
              {columnSelection === 'both' && (
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  {Object.keys(selectedColumns).filter((column) => selectedColumns[column]).map((column) => (
                    <React.Fragment key={column}>
                      <th>Pro</th>
                      <th>Res</th>
                    </React.Fragment>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  <td>{row.idfsi}</td>
                  <td>{row.Mois}</td>
                  <td>{row.Technologie}</td>
                  {Object.keys(selectedColumns).filter((column) => selectedColumns[column]).map((column) => (
                    <React.Fragment key={column}>
                      {columnSelection === 'both' && (
                        <>
                          <td>{row[column + "_Pro"]}</td>
                          <td>{row[column + "_Res"]}</td>
                        </>
                      )}
                      {columnSelection === 'pro' && <td>{row[column + "_Pro"]}</td>}
                      {columnSelection === 'res' && <td>{row[column + "_Res"]}</td>}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SearchForm;*/

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, DropdownButton, Row, Col, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import folderImage from './fsi.PNG';

const SearchForm = () => {
  const [idfsi, setIdfsi] = useState([]);
  const [mois, setMois] = useState(Object.fromEntries([...Array(12).keys()].map((m) => [m + 1, false])));
  const [results, setResults] = useState([]);
  const [technologies, setTechnologies] = useState({
    VDSL: false, SDSL: false, ADSL: false, FTTH: false, 'LS-FO': false,
  });
  const [selectedColumns, setSelectedColumns] = useState({
    KPI3_11: false, KPI2_1: false, KPI2_2: false, KPI2_3: false, KPI2_4: false,
    KPI2_5: false, KPI2_6: false,
  });
  const [users, setUsers] = useState([]);
  const [columnSelection, setColumnSelection] = useState('both'); // 'pro', 'res', 'both'
  const [error, setError] = useState(null); // Pour afficher les erreurs

  // Récupérer les utilisateurs FSI
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4972/listfsi');
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs FSI :', error);
        setError('Erreur lors de la récupération des utilisateurs FSI.');
      }
    };
    fetchUsers();
  }, []);

  // Gestion des changements de technologies
  const handleChangeTechnologies = useCallback((e) => {
    const { name, checked } = e.target;
    setTechnologies((prev) => ({ ...prev, [name]: checked }));
  }, []);

  // Gestion des changements de mois
  const handleChangeMois = useCallback((e) => {
    const { name, checked } = e.target;
    setMois((prev) => ({ ...prev, [name]: checked }));
  }, []);

  // Gestion des changements de FSI
  const handleChangeIdfsi = useCallback((e) => {
    const { name, checked } = e.target;
    setIdfsi((prev) => (checked ? [...prev, name] : prev.filter((id) => id !== name)));
  }, []);

  // Gestion des changements de colonnes sélectionnées
  const handleCheckboxChange = useCallback((columnName) => {
    setSelectedColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }));
  }, []);

  // Gestion de la sélection des colonnes (Pro, Res, Les deux)
  const handleColumnSelection = useCallback((selection) => {
    setColumnSelection(selection);
  }, []);

  // Soumission du formulaire
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const selectedTechnologies = Object.keys(technologies).filter((tech) => technologies[tech]);
      const selectedMois = Object.keys(mois).filter((moi) => mois[moi]);

      try {
        const response = await axios.post('http://localhost:4972/search2', {
          idfsi: idfsi.join(','),
          mois: selectedMois.join(','),
          technologies: selectedTechnologies.join(','),
        });
        setResults(response.data);
        setError(null); // Réinitialiser l'erreur en cas de succès
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setError('Erreur lors de la recherche. Veuillez réessayer.');
      }
    },
    [idfsi, mois, technologies]
  );

  // Réinitialisation du formulaire
  const handleReset = useCallback(() => {
    setIdfsi([]); // Réinitialiser à un tableau vide
    setMois(Object.fromEntries(Object.keys(mois).map((key) => [key, false])));
    setTechnologies(Object.fromEntries(Object.keys(technologies).map((key) => [key, false])));
    setSelectedColumns(Object.fromEntries(Object.keys(selectedColumns).map((key) => [key, false])));
    setColumnSelection('both');
    setResults([]);
    setError(null); // Réinitialiser l'erreur
  }, [mois, technologies, selectedColumns]);

  return (
    <div>
      <p> </p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>FSI</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez FSI">
                  <Col sm="10">
                    {users.map((user) => (
                      <Form.Check
                        key={user.id}
                        type="checkbox"
                        name={String(user.id)}
                        label={user.id}
                        checked={idfsi.includes(String(user.id))}
                        onChange={handleChangeIdfsi}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les FSI à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>Mois:</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez Mois">
                  <Col sm="10">
                    {[...Array(12).keys()].map((month) => (
                      <Form.Check
                        key={month + 1}
                        type="checkbox"
                        name={(month + 1).toString()}
                        label={new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2000, month))}
                        checked={mois[month + 1]}
                        onChange={handleChangeMois}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les mois à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>Technologie:</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez Technologie">
                  <Col sm="10">
                    {Object.keys(technologies).map((tech) => (
                      <Form.Check
                        key={tech}
                        type="checkbox"
                        name={tech}
                        label={tech}
                        checked={technologies[tech]}
                        onChange={handleChangeTechnologies}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les technologies à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img src={folderImage} alt="Folder" style={{ maxHeight: '150px' }} />
              <Card.ImgOverlay>
                <Card.Title>KPI:</Card.Title>
                <DropdownButton variant="dark" title="Sélectionnez KPI">
                  <Col sm="10">
                    {Object.keys(selectedColumns).map((column) => (
                      <Form.Check
                        key={column}
                        type="checkbox"
                        name={column}
                        label={column}
                        checked={selectedColumns[column]}
                        onChange={() => handleCheckboxChange(column)}
                      />
                    ))}
                  </Col>
                </DropdownButton>
                <Card.Text>Sélectionnez les KPI à afficher.</Card.Text>
              </Card.ImgOverlay>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button type="submit" variant="warning">Rechercher</Button>
            <Button variant="secondary" onClick={handleReset}>Réinitialiser</Button>
          </Col>
          <Col>
            <Col className="text-end" sm="10">
              <Button variant={columnSelection === 'pro' ? 'warning' : 'secondary'} onClick={() => handleColumnSelection('pro')}>Pro</Button>
              <Button variant={columnSelection === 'res' ? 'warning' : 'secondary'} onClick={() => handleColumnSelection('res')}>Res</Button>
              <Button variant={columnSelection === 'both' ? 'warning' : 'secondary'} onClick={() => handleColumnSelection('both')}>Les deux</Button>
            </Col>
          </Col>
        </Row>
      </Form>

      {error && <div className="text-danger mb-3">{error}</div>}

      {results.length > 0 && (
        <div>
          <p></p>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>FSI</th>
                <th>Mois</th>
                <th>Technologie</th>
                {Object.keys(selectedColumns).filter((column) => selectedColumns[column]).map((column) => (
                  <React.Fragment key={column}>
                    {columnSelection === 'both' && <th colSpan={2}>{column}</th>}
                    {columnSelection === 'pro' && <th>{column} Pro</th>}
                    {columnSelection === 'res' && <th>{column} Res</th>}
                  </React.Fragment>
                ))}
              </tr>
              {columnSelection === 'both' && (
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  {Object.keys(selectedColumns).filter((column) => selectedColumns[column]).map((column) => (
                    <React.Fragment key={column}>
                      <th>Pro</th>
                      <th>Res</th>
                    </React.Fragment>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={`${row.idfsi}-${row.Mois}-${row.Technologie}-${index}`}>
                  <td>{row.idfsi}</td>
                  <td>{row.Mois}</td>
                  <td>{row.Technologie}</td>
                  {Object.keys(selectedColumns).filter((column) => selectedColumns[column]).map((column) => (
                    <React.Fragment key={column}>
                      {columnSelection === 'both' && (
                        <>
                          <td>{row[column + "_Pro"]}</td>
                          <td>{row[column + "_Res"]}</td>
                        </>
                      )}
                      {columnSelection === 'pro' && <td>{row[column + "_Pro"]}</td>}
                      {columnSelection === 'res' && <td>{row[column + "_Res"]}</td>}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SearchForm;



