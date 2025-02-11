import kpiImage from './fsi.PNG';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const Home = () => {
  return (
    <div>
      <Row>
        <Col className="text-center">
          <div
            style={{
              color: 'black',
              fontSize: '30px',
              fontWeight: 'bold',
              pointerEvents: 'none',
            }}
          >
            Définitions des indicateurs administratifs de la QoS Internet
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Header
          style={{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          1. Indicateurs de mise en service
        </Card.Header>
        <Card>
        <Row className="align-items-center my-3">
  <Col className="text-left">
    <h4>La durée de ce processus est comptabilisée depuis l'instant où un ordre de service valide est reçu, jusqu’à l'instant où le service d’accès Internet est mis à disposition pour l'utilisation (prêt/éligible à l’utilisation).</h4>
  </Col>
  <Col className="text-end">
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={kpiImage}
        alt="Folder Image"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'black',
          fontSize: '30px',
          fontWeight: 'bold',
          pointerEvents: 'none',
        }}
      >
        KPI1_1
      </div>
    </div>
  </Col>
</Row>
</Card>
<Card>
<Row className="align-items-center my-3">
          <Col className="text-left">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI1_2
              </div>
            </div>
          </Col>
          <Col >
    <h4>
Le « délai de mise en service par l’opérateur » est l’agrégation de toutes les durées (périodes) 
élémentaires, dans le processus de mise en service d’un accès internet fixe, et qui sont 
imputées à l’opérateur. 
 
Le processus de mise en service d’un accès internet fixe est l’ensemble des activités qui 
incombent à l’opérateur ainsi qu’aux différents autres intervenants (ex. fournisseur de 
service). 
La durée de ce processus est comptabilisée depuis l'instant où un ordre de service valide est 
reçu, jusqu’à l'instant où le service d’accès Internet est mis à disposition pour l'utilisation 
(prêt/éligible à l’utilisation).  </h4>
  </Col>
          </Row>
          </Card>
        <Card>
        <Row className="align-items-center my-3">
        <Col className="text-left">
    <h4> La durée cumulée des indisponibilités et des interruptions réclamées pendant la période de 
collecte pour chaque accès. </h4>
  </Col>
          <Col className="text-end">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI1_3
              </div>
            </div>
          </Col>
          </Row>
          </Card>
      </Card>

      <Card>
        <Card.Header
          style={{
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}
        >
          2. Indicateurs de dérangement
        </Card.Header>
        <Card>
        <Row className="align-items-center my-3">
          <Col className="text-left">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI2_1
              </div>
            </div>
          </Col>
          <Col>
          <h4>
La durée depuis l'instant où un rapport de dérangement a été fait jusqu’à l’instant où le 
service a été restauré à son état normal. 
 
Un dérangement fait référence à un dysfonctionnement de l’accès fournis (pannes et 
problèmes d’ordre technique).   </h4>
  </Col>
       
          </Row>
          </Card>
        <Card>
        <Row className="align-items-center my-3">
        <Col className="text-left">
    <h4>Pourcentage des dérangements signalés relevés en moins de 24 heures. </h4>
  </Col>
          <Col className="text-end">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI2_2
              </div>
            </div>
          </Col>
          </Row>
          </Card>
        <Card>
        <Row className="align-items-center my-3">
          <Col className="text-left">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI2_3
              </div>
            </div>
          </Col>
          <Col>
          <h4 >Pourcentage des dérangements signalés relevés en moins de 48 heures. </h4>
          </Col>
          </Row>
          </Card>
        <Card>
        <Row className="align-items-center my-3">
        <Col className="text-left">

    <h4>Vitesse de relève de dérangements en moins de 72 heures  </h4>
  </Col>
          <Col className="text-end">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI2_4
              </div>
            </div>
          </Col>
          </Row>
          </Card>
        <Card>
        <Row className="align-items-center my-3">
          <Col className="text-left">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI2_5
              </div>
            </div>
          </Col>
          <Col>

<h4>Pourcentage des dérangements signalés relevés en moins de 72 heures.  </h4>
</Col>
          </Row>
          </Card>
        <Card>
        <Row className="align-items-center my-3">
        <Col className="text-left">
    <h4>Nombre total des dérangements signalés. </h4>
  </Col>
          <Col className="text-end">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={kpiImage}
                alt="Folder Image"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                KPI2_6
              </div>
            </div>
          </Col>
          </Row>
          </Card>
      </Card>
    </div>
  );
};

export default Home;



