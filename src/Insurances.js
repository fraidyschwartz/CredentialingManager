import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl, Checkbox, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import swal from 'sweetalert2';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class Insurances extends React.Component {
    constructor() {
        super();
        this.state = {
            insurance: {
                insuranceId: 0,
                name: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                zip: 0,
                fax: "",
                email: "",
                groupContractNumber: 0,
                notes: "",
                necessaryDocs: ""
            }, 
            insurances: [],
            insuranceFacilities: [],
            facilities: [],
            showModal: false,
            selectedRow: null,
            show: false,
            alert: null,
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.deleteInsurance = this.deleteInsurance.bind(this);
    }

    async componentDidMount() {
        let insurances = await axios.get('/api/insurances/allinsurances');
        let facilities = await axios.get('api/doctors/allfacilities');
        this.setState({insurances: insurances.data});
        this.setState({facilities: facilities.data});
    }

    createInsuranceRow(insurance)
    {
        return(
            <tr key={insurance.insuranceId} className={this.state.selectedRow === insurance.insuranceId ? "rowSelected" : null} onClick={this.selectRow.bind(this, insurance.insuranceId)}>
                <td className="hidden">{insurance.insuranceId}</td>
                <td className="link"><Link to={`/InsuranceDetails/${insurance.insuranceId}`}>{insurance.name}</Link></td>
                <td>{insurance.address1}</td>
                <td>{insurance.address2}</td>
                <td>{insurance.city}</td>
                <td>{insurance.state}</td>
                <td>{insurance.zip}</td>
                <td>{insurance.fax}</td>
                <td>{insurance.email}</td>
                <td>{insurance.groupContractNumber}</td>
                <td>{insurance.notes}</td>
                <td>{insurance.necessaryDocs}</td>
            </tr>
        )
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    closeAlert() {
        console.log('change alert to null')
        this.setState({ alert: null, show: false });
    }

    async createInsurance(e) {
        e.preventDefault();
        await axios.post('/api/insurances/newinsurance', {insurance: this.state.insurance, insuranceFacilities: this.state.insuranceFacilities});
        let insurances = await axios.get('/api/insurances/allinsurances');
        this.setState({insurances: insurances.data, showModal: false});
    }

    async selectRow(insuranceId) {
        event.preventDefault();
        if(this.state.selectedRow === insuranceId)
        {
            return this.setState({selectedRow: null});
        }
        
        this.setState({selectedRow: insuranceId});
    }

    async deleteInsurance() {
        event.preventDefault();
        await this.setState({show: true});
        let alert = <SweetAlert
            show={this.state.show}
            title="Demo"
            html
            text="test"
            onConfirm={this.closeAlert}
        />
        return this.setState({alert: alert});

        // event.preventDefault();
        // let insuranceId = this.state.selectedRow;
        // await axios.post('/api/insurances/deleteinsurance', {insuranceId: insuranceId});
        // let insurances = await axios.get('/api/insurances/allinsurances');
        // this.setState({selectedRow: null, insurances: insurances.data});
    }

    changeHandler(e) {
        let insurance = this.state.insurance;
        insurance[e.target.name] = e.target.value;
        this.setState({insurance});
    }

    checkboxChanged(e) {
        let facilities = this.state.insuranceFacilities;

        if(e.target.checked) {
            facilities.push(+e.target.value);
        }
        else {
            let index = facilities.indexOf(+e.target.value);
            facilities.splice(index, 1);
        }
        
        this.setState({insuranceFacilities: facilities});
    }

    render() {
        // let alert;
        //     console.log(this.state.alert)
        // if(this.state.alert != null) {
        //     console.log('hi')
        //     alert = this.state.alert;
        // }
        // else {
        //     alert = null;
        // }
        return (
            <div>
                <h3 className="header">Insurances</h3>
                <hr/>
                <div className="btn-group pull-right">
                    <button className="btn" onClick={this.open}>New</button>
                    <button className="btn" disabled={this.state.selectedRow === null ? true : false} onClick={this.deleteInsurance}>Delete</button>
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn"
                        table="insuranceTable"
                        filename="insuranceTable"
                        sheet="insuranceTable"
                        buttonText="Export to Excel"/>
                </div>
                <Table id="insuranceTable">
                    <thead>
                        <tr className="header">
                            <th className="hidden">InsuranceId</th>
                            <th>Name</th>
                            <th>Address 1</th>
                            <th>Address 2</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Zip</th>
                            <th>Fax</th>
                            <th>Email</th>
                            <th>Group Contract #</th>
                            <th className="hidden">Notes</th>
                            <th className="hidden">Necessary Docs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.insurances.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                            this.state.insurances.map(i => this.createInsuranceRow(i))}
                    </tbody>
                </Table>
                
                <SweetAlert
                    show={this.state.show}
                    title="Demo"
                    html
                    text="test"
                    onConfirm={this.closeAlert}
                />
                {/*{this.state.alert}*/}

                <Modal show={this.state.showModal} onHide={this.close}>
                    <Form onSubmit={(e) => this.createInsurance(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Insurance</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <FormGroup>
                                <ControlLabel>Name</ControlLabel>
                                <FormControl name="name"  required="required" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Address 1</ControlLabel>
                                <FormControl name="address1" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Address 2</ControlLabel>
                                <FormControl name="address2" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>City</ControlLabel>
                                <FormControl name="city" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>State</ControlLabel>
                                <FormControl name="state" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Zip</ControlLabel>
                                <FormControl name="zip" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Fax</ControlLabel>
                                <FormControl name="fax" onChange={(e) => this.changeHandler(e)} type="tel"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Email</ControlLabel>
                                <FormControl name="email" onChange={(e) => this.changeHandler(e)} type="email"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Group Contract #</ControlLabel>
                                <FormControl name="groupContractNumber" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Facility</ControlLabel>     
                                {this.state.facilities.map(f => <Checkbox key={f.facilityId} value={f.facilityId} onChange={(e) => this.checkboxChanged(e)}>{f.facility}</Checkbox>)}
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Notes</ControlLabel>
                                <FormControl name="notes" componentClass="textarea" onChange={(e) => this.changeHandler(e)} ></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Necessary Documents</ControlLabel>
                                <FormControl name="necessaryDocs" componentClass="textarea" onChange={(e) => this.changeHandler(e)} ></FormControl>
                            </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Save</Button>
                        <Button onClick={this.close}>Cancel</Button>
                    </Modal.Footer>
                        </Form>
                </Modal>

            </div>
        )
    }
}