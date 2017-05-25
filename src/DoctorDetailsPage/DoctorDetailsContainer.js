import React from 'react';
import axios from 'axios';
import DoctorDetails from './DoctorDetails';
import DoctorInsurances from './DoctorInsurances';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export default class DoctorDetailsContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            doctor: {
                doctorId: 0,
                name: "",
                credentials: "",
                status: null,
                facility: null,
                department: null,
                notes: ""
            },
            facilities: [],
            departments: [],
            doctorInsurances: [],
            applicationStatuses: [],
            disableFormControls: true,
            alert: {
                show: false,
                type: null,
                title: '',
                text: '',
                onConfirm: null,
                confirmBtnText: 'OK',
                showCancel: false,
                onCancel: this.closeAlert
            },
            showConfirmAlert: false
        }
        this.makeFormEditable = this.makeFormEditable.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.refreshDoctorInsurances = this.refreshDoctorInsurances.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    async componentDidMount() {
        let doctorDetails = await axios.get('/api/doctors/getdoctor?doctorId=' + this.props.match.params.doctorId);
        let facilities = await axios.get('/api/doctors/allfacilities');
        let departments = await axios.get('/api/doctors/alldepartments');
        let applicationStatuses = await axios.get('/api/doctors/allapplicationstatuses');
        this.setState({ doctor: doctorDetails.data.doctor, facilities: facilities.data, departments: departments.data, doctorInsurances: doctorDetails.data.insurances, applicationStatuses: applicationStatuses.data });
    }

    makeFormEditable() {
        event.preventDefault();
        this.setState({disableFormControls: false})
    }

    async cancel() {
        event.preventDefault();
        let doctorDetails = await axios.get('/api/doctors/getdoctor?doctorId=' + this.props.match.params.doctorId);
        this.setState({doctor: doctorDetails.data.doctor, disableFormControls: true, showConfirmAlert: false});
        this.closeAlert();
    }

    closeAlert() {
        this.setState({ alert: {show: false,
                                type: null,
                                title: '',
                                text: '',
                                onConfirm: null,
                                confirmBtnText: 'OK',
                                showCancel: false,
                                onCancel: this.closeAlert}});
    }

    changeHandler(e) {
        let doctor = this.state.doctor;
        if(e.target.name === "facility") {
            this.setState({showConfirmAlert: true})
        }
        doctor[e.target.name] = e.target.value;
        this.setState({doctor});
    }

    async save() {
        event.preventDefault();
        await axios.post('/api/doctors/editdoctor', this.state.doctor);
        this.setState({disableFormControls: true, showConfirmAlert: false, alert: {show: true, type: "success", title: 'Doctor Updated Successfully!', text: '', onConfirm: this.closeAlert, confirmBtnText: 'OK', showCancel: false }});
        this.refreshDoctorInsurances();
    }

    confirm() {
        event.preventDefault();
        if(this.state.showConfirmAlert === true) {

            this.setState({alert: { show: true, 
                                    type: "warning", 
                                    title: 'Are you sure?', 
                                    text: 'Changing the facility will delete all insurances not associated in the new facility selected. Are you sure you want to continue?', 
                                    onConfirm: this.save, 
                                    confirmBtnText: 'Continue', 
                                    showCancel: true,
                                    onCancel: this.cancel}})
        }
        else {
            this.save();
        }
    }

    async refreshDoctorInsurances() {
        let doctorInsurances = await axios.get('/api/doctors/getdoctorinsurances?doctorId=' + this.props.match.params.doctorId);
        this.setState({doctorInsurances: doctorInsurances.data});
    }

    render() {
        let renderThis;

        if (this.state.doctor.doctorId) {
            renderThis = 
                    <div>
                        <h3>{this.state.doctor.name} Info</h3>
                        <hr />
                        <DoctorDetails doctor={this.state.doctor}
                            facilities={this.state.facilities}
                            departments={this.state.departments} 
                            makeFormEditable={this.makeFormEditable}
                            disableFormControls={this.state.disableFormControls}
                            cancel={this.cancel}
                            handler={this.changeHandler}
                            confirm={this.confirm}/>
                
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
                            onCancel={this.state.alert.onCancel}
                        />

                        <br />
                        <DoctorInsurances insurances={this.state.doctorInsurances}
                            applicationStatuses={this.state.applicationStatuses}
                            refresh={this.refreshDoctorInsurances}
                            doctor={this.state.doctor.name}/>
                    </div>
        }
        return (
            <div>
                {renderThis}
            </div>
        )
    }
}