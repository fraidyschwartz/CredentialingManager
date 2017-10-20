import React from 'react';
import axios from 'axios';
import { Table, InputGroup, DropdownButton, FormControl, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import DoctorAddNewModal from './DoctorAddNewModal';
import SortableTable from './SortableTable';

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
            sortDir: null,
            sortBy: null,
            alert: {
                show: false,
                type: null,
                title: '',
                text: '',
                onConfirm: null,
                confirmBtnText: 'OK',
                showCancel: false
            },
            headers: [
                {columnName: 'doctorId', displayName: 'Doctor ID', hidden: true},
                {columnName: 'name', displayName: 'Name', hidden: false},
                {columnName: 'facility', displayName: 'Facility', hidden: false},
                {columnName: 'department', displayName: 'Department', hidden: false},
                {columnName: 'status', displayName: 'Status', hidden: false},
                {columnName: 'notes', displayName: 'Notes', hidden: true},
            ]
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.deleteDoctor = this.deleteDoctor.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.createDoctor = this.createDoctor.bind(this);
        this.sortColumn = this.sortColumn.bind(this);
        this.createDoctorRow = this.createDoctorRow.bind(this);
    }

    async componentWillMount() {
        let doctors = await axios.get('/api/doctors/alldoctors');
        let facilities = await axios.get('api/doctors/allfacilities');
        let departments = await axios.get('api/doctors/alldepartments');
        this.setState({ doctors: doctors.data, 
                        facilities: facilities.data, 
                        departments: departments.data});
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
        let newDoctor = await axios.post('/api/doctors/newdoctor', this.state.doctor);
        this.state.doctors.push(newDoctor.data);
        this.sortColumn(this.state.sortBy, true);  
        this.setState({ showModal: false, 
                        alert: {show: true, 
                                type: "success", 
                                title: 'Doctor Created Successfully!', 
                                text: '', 
                                onConfirm: this.closeAlert, 
                                confirmBtnText: 'OK', 
                                showCancel: false}});
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
    
    sortColumn(column, calledOnRefresh) {
        var sortDir = this.state.sortDir;
        var sortBy = column;
        if(sortBy === this.state.sortBy && !calledOnRefresh) {
            sortDir = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }
        else if(calledOnRefresh) {
            sortDir = this.state.sortDir;
        }
        else {
            sortDir = 'ASC';
        }

        var rows = this.state.doctors.slice();
        rows.sort((a,b) => {
            let valueA = a[sortBy] === null ? 0 : a[sortBy].toString().toLowerCase();
            let valueB = b[sortBy] === null ? 0 : b[sortBy].toString().toLowerCase();

            if(valueA === null){
                return 1;
            }
            else if(valueB === null){
                return -1;
            }
            else if(valueA === valueB){
                return 0;
            }
            else if(sortDir === 'ASC') {
                return valueA < valueB ? -1 : 1;
            }
            else if(sortDir === 'DESC') {
                return valueA < valueB ? 1 : -1;
            }
        })
        this.setState({sortBy, sortDir, doctors : rows});
    }

    render() {
        return (
            <div>
                <h3 className="header">Doctors</h3>               
                <hr/>

                {/*<div className="input-group">
                    <input id="search-global" type="text" className="form-control" placeholder="Search..."/>
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-default" name="dropdown-btn">
                            <span className="caret"></span>
                        </button>
                            <div>
                                <label>test</label>
                            </div>
                        {/*<DropdownButton id="dropdown-btn" title="">
                            <div className="dropdown-menu dropdown-menu-right">
                                <label>test</label>
                            </div>
                        </DropdownButton>
                    </div>
                </div>*/}

                <div className="btn-group pull-right">
                    <button className="btn" onClick={this.open}>New</button>
                    <button className="btn" 
                        disabled={this.state.selectedRow === null ? true : false} 
                        onClick={() => this.setState({alert: { show: true, 
                                                               type: "warning", 
                                                               title: 'Are you sure you want to delete this doctor?', 
                                                               text: this.state.doctor.name + ' will also be deleted from all associated insurances. Are you sure you want to continue?', 
                                                               onConfirm: this.deleteDoctor, 
                                                               confirmBtnText: 'Continue', 
                                                               showCancel: true }})}>
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

                <SortableTable rows={this.state.doctors}
                    tableName="doctorsTable"
                    headers={this.state.headers}
                    createRow={this.createDoctorRow} 
                    sortColumn={this.sortColumn}/>
                               
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

                <DoctorAddNewModal showModal={this.state.showModal}
                    facilities={this.state.facilities}
                    departments={this.state.departments}
                    close={this.close}
                    createDoctor={this.createDoctor}
                    changeHandler={this.changeHandler}/>
            </div>
        )
    }
}