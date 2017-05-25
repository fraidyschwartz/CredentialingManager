import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class Doctors extends React.Component {
    constructor() {
        super();
        this.state = {
            doctor: {
                doctorId: 0,
                name: "",
                credentials: "",
                status: 1,
                facility: null,
                department: null,
                notes: ""
            }, 
            doctors: [],
            facilities: [],
            departments: [],
            showModal: false,
            selectedRow: null,
            alert: {
                show: false,
                type: null,
                title: '',
                text: '',
                onConfirm: null,
                confirmBtnText: 'OK',
                showCancel: false
            },
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.deleteDoctor = this.deleteDoctor.bind(this);
    }

    async componentDidMount() {
        let doctors = await axios.get('/api/doctors/alldoctors');
        let facilities = await axios.get('api/doctors/allfacilities');
        let departments = await axios.get('api/doctors/alldepartments');
        this.setState({doctors: doctors.data, facilities: facilities.data, departments: departments.data});
    }

    createDoctorRow(doctor)
    {
        return(
            <tr key={doctor.doctorId} className={this.state.selectedRow === doctor.doctorId ? "rowSelected" : null} onClick={this.selectRow.bind(this, doctor)}>
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
        this.setState({ showModal: true, doctor: {doctorId: 0} });
    }

    closeAlert() {
        this.setState({ alert: {show: false,
                                type: null,
                                title: '',
                                text: '',
                                onConfirm: null,
                                confirmBtnText: 'OK',
                                showCancel: false}});
    }

    async createDoctor(e) {
        e.preventDefault();
        await axios.post('/api/doctors/newdoctor', this.state.doctor);
        let doctors = await axios.get('/api/doctors/alldoctors');
        this.setState({doctors: doctors.data, showModal: false, alert: {show: true, type: "success", title: 'Doctor Created Successfully!', text: '', onConfirm: this.closeAlert, confirmBtnText: 'OK', showCancel: false}});
    }

    selectRow(doctor) {
        event.preventDefault();
        if(this.state.selectedRow === doctor.doctorId)
        {
            return this.setState({selectedRow: null});
        }
        this.setState({selectedRow: doctor.doctorId, doctor: doctor});
    }

    async deleteDoctor() {
        event.preventDefault();
        let doctorId = this.state.selectedRow;
        await axios.post('/api/doctors/deletedoctor', {doctorId: doctorId});
        this.setState({selectedRow: null});
        let doctors = await axios.get('/api/doctors/alldoctors');
        this.setState({doctors: doctors.data});
        this.closeAlert();
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
                    <button className="btn" disabled={this.state.selectedRow === null ? true : false} 
                        onClick={() => this.setState({alert: {show: true, type: "warning", title: 'Are you sure you want to delete this doctor?', text: this.state.doctor.name + ' will also be deleted from all associated insurances. Are you sure you want to continue?', onConfirm: this.deleteDoctor, confirmBtnText: 'Continue', showCancel: true}})}>
                        Delete
                    </button>
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
                
                <SweetAlert
                    show={this.state.alert.show}
                    title={this.state.alert.title}
                    html
                    text={this.state.alert.text}
                    type={this.state.alert.type}
                    onConfirm={this.state.alert.onConfirm}
                    showConfirmButton={true}
                    confirmButtonText={this.state.alert.confirmBtnText}
                    showCancelButton={this.state.alert.showCancel}
                    onCancel={this.closeAlert}
                />

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
                                    <option value="0">Inactive</option> 
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