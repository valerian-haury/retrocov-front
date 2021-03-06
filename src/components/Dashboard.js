import React, {Component} from 'react';

import {
    useParams
} from "react-router-dom";
import {Button, Card, Container, Navbar, Spinner} from "react-bootstrap";
import {readByUrlName, getAllRestaurants} from "../api/Restaurant";

import '../styles/general.css'

import QRCode from "qrcode.react";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            address: '',
            urlName: this.props.restaurantUrlName,
            restaurants: [],
            loading: false
        }
    }

    _downloadQR = () => {
        const canvas = document.getElementById("qrcode");
        const pngUrl = canvas.toDataURL("image/png");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = this.state.urlName + "qrcode";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    componentDidMount() {
        this.setState({loading: true})

        if (sessionStorage.getItem('restaurant') !== this.state.urlName) {
            window.location.pathname = '/' + sessionStorage.getItem('restaurant') + '/dashboard'
        } else {
            this._getData()
        }
    }

    _getData = async () => {
        const restaurant = await readByUrlName(this.state.urlName)
        await this.setState({name: restaurant.name, address: restaurant.address})
        //admin only
        const restaurants = await getAllRestaurants();
        await this.setState({restaurants: restaurants});

        this.setState({loading: false})
    }

    render() {
        if (this.state.loading) {
            return (
                <Container style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    display: 'flex',
                    marginTop: 20
                }}>
                    <Spinner animation="border" role="status" style={{color: '#0098ff'}}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Container>
            )
        } else {
            return (
                <Container className="login-container">
                    <Navbar>
                        <Navbar.Brand href="#">
                            <img
                                src="/RetroCov_Logo.png"
                                width="125"
                                height="30"
                                className="d-inline-block align-top"
                                alt="React Bootstrap logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                <a href="/logout">Se déconnecter</a>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Navbar>
                    <Card className={"login-card text-center"}>
                        <Card.Body /*style={{paddingBottom: "0px"}}*/>
                            <Card.Title className={"mb-4"}><h3>{this.state.name}</h3></Card.Title>
                            <Card.Text>
                                <QRCode id="qrcode" value={"https://www.retrocov.ch/" + this.state.urlName}/>
                                <br/>
                                <Button className="mt-2" variant="primary"  style={{backgroundColor: "#1A98FF", borderColor: "#1A98FF"}}
                                        onClick={() => this._downloadQR()}>
                                    Télécharger le QR Code
                                </Button>
                            </Card.Text>
                            <Card.Text>
                                <small className="text-muted">Pour demander un export de la liste de vos clients,  envoyer un mail à <a href="mailto:infos@retrocov.ch">infos@retrocov.ch</a></small>
                            </Card.Text>
                            {/*<Card.Footer className="text-muted card-foot">validé par <a
                                href={"https://www.infomaniak.com"} className="infomaniak-link">Infomaniak</a></Card.Footer>*/}
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
    }
}

export default () => {
    const {restaurant} = useParams();
    return (
        <Dashboard restaurantUrlName={restaurant}/>
    )
}
