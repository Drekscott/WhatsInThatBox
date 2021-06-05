import Container from '@material-ui/core/Container';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter as Router, Route, Switch, withRouter, Link } from "react-router-dom";
import QRCode from 'qrcode'




class BoxInfo extends React.Component {

  render() {
    const status = 'Next player: X';

    return (
            <Card elevate style={{width: "300px", height: "300px"}} variant="outlined" square>
            <CardContent>
            <Typography variant="h6" color="textPrimary" gutterBottom>
            {this.props.box.label}
            </Typography>
            <TextField InputProps={{readOnly: true,}} defaultValue={this.props.box.label} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Label" variant="outlined" />
            <TextField InputProps={{readOnly: true,}} defaultValue={this.props.box.movingDirections} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Moving Directions" variant="outlined" />
            <CardActions>
            <Link
                to={{
                    pathname: `box/${this.props.box.id}`,
                    state: {box: this.props.box} // your data array of objects
                }}
            >Edit Box</Link>
            </CardActions>
            </CardContent>
            </Card>
    );
  }
}
class BoxList extends React.Component {

    render(){
        return (
            <Grid container spacing={3}>
                {this.props.boxes.map((x) => { return <Grid item xs> <BoxInfo box={x} /> </Grid>;})}
            </Grid>
        );
    }
}


class Box extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
        qrCode: null,
        id: "",
        label: "",
        destination: "",
        movingDirections: "",
        description: ""
        };
        this.openQrCode = this.openQrCode.bind(this);
        this.insertBox = this.insertBox.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    componentDidMount(){
        QRCode.toDataURL(window.location.href)
        .then(url => {
            console.log(url)
            this.setState({qrCode:url});
        })
        .catch(err => {
            console.error(err)
        })
        console.log(this.props.location.state)
    }
    handleTextChange(e, label){
        switch (label) {
            case "label":
                this.setState({label: e.target.value});
                break;
            case "destination":
                this.setState({destination: e.target.value});
                break;
            case "movingDirections":
                this.setState({movingDirections: e.target.value});
                break;
            case "description":
                this.setState({description: e.target.value});
                break;
            default:
                break;
        }
    }
    insertBox(){
        fetch("https://whats-in-that-box.azurewebsites.net/api/InsertBox?", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: this.props.location.state.id,
            label: this.state.label,
            destination: this.state.destination,
            movingDirections : this.state.movingDirections,
            description: this.state.description
        })
        });
        this.props.history.goBack();
    }
    openQrCode(){
        var newTab = window.open();
        newTab.document.body.innerHTML = `<img src="${this.state.qrCode}" width="100px" height="100px">`;
    }
    render(){
        return(
            <Container fixed style={{margin: "0 auto"}}>
            <Paper style={{width: "50%", margin: "0 auto"}} variant="outlined" elevation={3}>
                <TextField onChange={(e) => this.handleTextChange(e, "label")} placeholder={this.props.location.state.box.label} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Label" variant="outlined" />
                <TextField onChange={(e) => this.handleTextChange(e, "movingDirections")} placeholder={this.props.location.state.box.movingDirections} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Moving Directions" variant="outlined" />
                <TextField onChange={(e) => this.handleTextChange(e, "description")} placeholder={this.props.location.state.box.description} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Description" variant="outlined" />
                <TextField onChange={(e) => this.handleTextChange(e, "destination")} placeholder={this.props.location.state.box.destination} style={{width: "100%"}} id="outlined-basic" label="Storage Area" variant="outlined" />
                <Button onClick={this.openQrCode}>Get QrCode</Button>
                <Button onClick={this.insertBox}>Save Box</Button>
            </Paper>
            <h1> Current Info </h1>
            <Paper style={{width: "50%", margin: "0 auto"}} variant="outlined" elevation={3}>
                <TextField InputProps={{readOnly: true,}} onChange={(e) => this.handleTextChange(e, "label")} defaultValue={this.props.location.state.box.label} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Label" variant="outlined" />
                <TextField InputProps={{readOnly: true,}} onChange={(e) => this.handleTextChange(e, "movingDirections")} defaultValue={this.props.location.state.box.movingDirections} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Moving Directions" variant="outlined" />
                <TextField InputProps={{readOnly: true,}} onChange={(e) => this.handleTextChange(e, "description")} defaultValue={this.props.location.state.box.description} style={{width: "100%", marginBottom:"25px"}} id="outlined-basic" label="Description" variant="outlined" />
                <TextField InputProps={{readOnly: true,}} onChange={(e) => this.handleTextChange(e, "destination")} defaultValue={this.props.location.state.box.destination} style={{width: "100%"}} id="outlined-basic" label="Storage Area" variant="outlined" />
            </Paper>
            </Container>
        )
    }
}

class Boxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      boxes: []
    };
    this.addBox = this.addBox.bind(this);
    this.insertBox = this.insertBox.bind(this);
  }
    addBox(){
        console.log(this.state.boxes)
        // let boxesCopy = [...this.state.boxes].push({
        //     id: uuidv4(),
        //     label: `New Box ${uuidv4()}`,
        //     destination: "",
        //     movingDirections : "",
        //     description: ""
        // })
        // this.setState({boxes: boxesCopy});
    }
    getBoxes(){
        fetch("https://whats-in-that-box.azurewebsites.net/api/getboxes")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
            return JSON.stringify(jsonData);
        })
        .then((jsonStr) => {
            this.setState({boxes: JSON.parse(jsonStr)});
        });
    }

    insertBox(){
        fetch("https://whats-in-that-box.azurewebsites.net/api/InsertBox?", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: uuidv4(),
            label: `New Box ${uuidv4()}`,
            destination: "",
            movingDirections : "",
            description: ""
        })
        }).then((response) => response).then((responseJson) => {
            this.getBoxes();
        });
    }
    //create function to get data and display
    componentDidMount(){
        this.getBoxes();
    }



  render() {
    return (
        <div>
            <BoxList boxes={this.state.boxes}/>
            <Fab onClick={this.insertBox} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>

    );
  }
}

// ========================================

ReactDOM.render(
<Router>
<Switch>
  <Route exact path="/" component={withRouter(Boxes)}/>
  <Route exact path="/box/:id" component={withRouter(Box)} />
  </Switch>
  </Router>,
  document.getElementById('root')
);
