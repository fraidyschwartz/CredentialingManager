import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class Doctors extends React.Component {
    constructor() {
        super();
        this.state = {
            doctor: {
                doctorId: 0,
                name: "",
                credentials: "",
                ssn: "",
                status: "",
                facility: "",
                department: "",
                notes: ""
            }, 
            doctors: [],
            facilities: [],
            departments: [],
            showModal: false,
            selectedRow: null,
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.deleteDoctor = this.deleteDoctor.bind(this);
    }

    async componentDidMount() {
        let doctors = await axios.get('/api/doctors/alldoctors');
        let facilities = await axios.get('api/doctors/allfacilities');
        let departments = await axios.get('api/doctors/alldepartments');
        this.setState({doctors: doctors.data});
        this.setState({facilities: facilities.data});
        this.setState({departments: departments.data});
    }

    createDoctorRow(doctor)
    {
        return(
            <tr key={doctor.doctorId} className={this.state.selectedRow === doctor.doctorId ? "rowSelected" : null} onClick={this.selectRow.bind(this, doctor.doctorId)}>
                <td className="hidden">{doctor.doctorId}</td>
                <td className="link"><Link to={`/DoctorDetails/${doctor.doctorId}`}>{doctor.name}, {doctor.credentials}</Link></td>
                <td>{doctor.facility}</td>
                <td>{doctor.department}</td>
                <td>{doctor.status}</td>
                <td>{doctor.notes}</td>
            </tr>
        )
    }
    
    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    async createDoctor(e) {
        e.preventDefault();
        await axios.post('/api/doctors/newdoctor', this.state.doctor);
        let doctors = await axios.get('/api/doctors/alldoctors');
        this.setState({doctors: doctors.data});
        this.setState({showModal: false});
    }

    async selectRow(doctorId) {
        event.preventDefault();
        if(this.state.selectedRow === doctorId)
        {
            return this.setState({selectedRow: null});
        }
        
        this.setState({selectedRow: doctorId});
    }

    async deleteDoctor() {
        event.preventDefault();
        let doctorId = this.state.selectedRow;
        await axios.post('/api/doctors/deletedoctor', {doctorId: doctorId});
        this.setState({selectedRow: null});
        let doctors = await axios.get('/api/doctors/alldoctors');
        this.setState({doctors: doctors.data});
    }

    changeHandler(e) {
        let doctor = this.state.doctor;
        doctor[e.target.name] = e.target.value;
        this.setState({doctor});
    }

    render() {
        return (
            <div>
                <h3 className="header">Doctors</h3>               
                <hr/>
                <div className="btn-group pull-right">
                    <button className="btn" onClick={this.open}>New</button>
                    <button className="btn" disabled={this.state.selectedRow === null ? true : false} onClick={this.deleteDoctor}>Delete</button>
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn"
                        table="doctorsTable"
                        filename="doctorsTable"
                        sheet="doctorsTable"
                        buttonText="Export to Excel"/>
                </div>
                <Table id='doctorsTable'>
                    <thead>
                        <tr className="header">
                            <th className="hidden">DoctorId</th>
                            <th>Name</th>
                            <th>Facility</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th className="hidden">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.doctors.length === 0 ? <tr><td className="noDataRow" colSpan={"100%"}>No Data Available</td></tr> :
                            this.state.doctors.map(d => this.createDoctorRow(d))}
                    </tbody>
                </Table>

                <Modal show={this.state.showModal} onHide={this.close}>
                    <Form onSubmit={(e) => this.createDoctor(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Doctor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <FormGroup>
                                <ControlLabel>Name</ControlLabel>
                                <FormControl name="name" required="required" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Credentials</ControlLabel>
                                <FormControl name="credentials" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>SSN</ControlLabel>
                                <FormControl name="ssn" onChange={(e) => this.changeHandler(e)} type="text"></FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Facility</ControlLabel>
                                <FormControl name="facility" componentClass="select" onChange={(e) => this.changeHandler(e)} >
                                    <option value="null">Please Select...</option>                                     
                                    {this.state.facilities.map(f => <option key={f.facilityId} value={f.facilityId}>{f.facility}</option>)}
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Department</ControlLabel>                                  
                                <FormControl name="department" componentClass="select" onChange={(e) => this.changeHandler(e)} >
                                    <option value="null">Please Select...</option>   
                                    {this.state.departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.department}</option>)}                                    
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Status</ControlLabel>
                                <FormControl name="status" componentClass="select" onChange={(e) => this.changeHandler(e)} >
                                    <option value="null">Please Select...</option>   
                                    <option value="1">Active</option> 
                                    <option value="0">InActive</option> 
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Notes</ControlLabel>
                                <FormControl name="notes" componentClass="textarea" onChange={(e) => this.changeHandler(e)} ></FormControl>
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