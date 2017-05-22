import React from 'react';
import axios from 'axios';
import DoctorDetails from './DoctorDetails';
import DoctorInsurances from './DoctorInsurances';

export default class DoctorDetailsContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            doctor: {
                doctorId: 0,
                name: null,
                credentials: null,
                ssn: null,
                status: null,
                facility: null,
                department: null,
                notes: null
            },
            facilities: [],
            departments: [],
            doctorInsurances: [],
            applicationStatuses: [],
            disableFormControls: true
        }
        this.makeFormEditable = this.makeFormEditable.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.refreshDoctorInsurances = this.refreshDoctorInsurances.bind(this);
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
        this.setState({doctor: doctorDetails.data.doctor, disableFormControls: true});
    }

    changeHandler(e) {
        let doctor = this.state.doctor;
        doctor[e.target.name] = e.target.value;
        this.setState({doctor});
    }

    async save() {
        event.preventDefault();
        await axios.post('/api/doctors/editdoctor', this.state.doctor);
        this.setState({disableFormControls: true});
        this.refreshDoctorInsurances();
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
                            save={this.save}/>

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