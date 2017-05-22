import React from 'react';
import axios from 'axios';
import InsuranceDetails from './InsuranceDetails';
import InsuranceDoctors from './InsuranceDoctors';
import InsuranceContacts from './InsuranceContacts';
import InsuranceContactAddNewModal from './InsuranceContactAddNewModal';

export default class InsuranceDetailsContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            insurance: {
                insuranceId: 0,
                name: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null,
                fax: null,
                email: null,
                groupContractNumber: null,
                notes: null,
                necessaryDocs: null
            },
            insuranceFacilities: [],
            facilities: [],
            insuranceContacts: [],
            doctorsOnInsurance: [],
            applicationStatuses: [],
            disableFormControls: true
        }
        this.makeFormEditable = this.makeFormEditable.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.checkboxHandler = this.checkboxHandler.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.refreshInsuranceDoctors = this.refreshInsuranceDoctors.bind(this);
        this.refreshInsuranceContacts = this.refreshInsuranceContacts.bind(this);
    }
    async componentDidMount() {
        let insuranceDetails = await axios.get('/api/insurances/getinsurance?insuranceId=' + this.props.match.params.insuranceId);
        let facilities = await axios.get('/api/doctors/allfacilities');
        let applicationStatuses = await axios.get('/api/doctors/allapplicationstatuses');
        this.setState({ insurance: insuranceDetails.data.insurance, 
                        insuranceFacilities: insuranceDetails.data.insuranceFacilities,
                        facilities: facilities.data, 
                        insuranceContacts: insuranceDetails.data.contacts,
                        doctorsOnInsurance: insuranceDetails.data.doctors,
                        applicationStatuses: applicationStatuses.data });
    }

    makeFormEditable() {
        this.setState({disableFormControls: false})
    }

    async cancel() {
        event.preventDefault();
        let insuranceDetails = await axios.get('/api/insurances/getinsurance?insuranceId=' + this.props.match.params.insuranceId);
        this.setState({insurance: insuranceDetails.data.insurance, disableFormControls: true});
    }

    changeHandler(e) {
        e.preventDefault();
        let insurance = this.state.insurance;
        insurance[e.target.name] = e.target.value;
        this.setState({insurance});
    }

    checkboxHandler(e) {
        e.preventDefault();
        let facilities = this.state.insuranceFacilities;

        if(e.target.checked) {
            facilities.push(+e.target.value);
            e.target.checked = true;
        }
        else {
            let index = facilities.indexOf(+e.target.value);
            facilities.splice(index, 1);
            e.target.checked = false;
        }
        this.setState({insuranceFacilities: facilities});
    }

    async save() {
        event.preventDefault();
        await axios.post('/api/insurances/editinsurance', {insurance: this.state.insurance, insuranceFacilities: this.state.insuranceFacilities});
        this.setState({disableFormControls: true});
    }

    async refreshInsuranceDoctors() {
        let doctorsOnInsurance = await axios.get('/api/insurances/getinsurancedoctors?insuranceId=' + this.props.match.params.insuranceId);
        this.setState({doctorsOnInsurance: doctorsOnInsurance.data});
    }

    async refreshInsuranceContacts() {
        let insuranceContacts = await axios.get('/api/insurances/getinsurancecontacts?insuranceId=' + this.props.match.params.insuranceId);
        this.setState({insuranceContacts: insuranceContacts.data});
    }

    render() {
        let renderThis;
        if (this.state.insurance.insuranceId) {
            renderThis = 
                    <div>
                        <h3>{this.state.insurance.name} Info</h3>
                        <hr />
                        <InsuranceDetails insurance={this.state.insurance}
                            insuranceFacilities={this.state.insuranceFacilities}
                            facilities={this.state.facilities}
                            departments={this.state.departments} 
                            makeFormEditable={this.makeFormEditable}
                            disableFormControls={this.state.disableFormControls}
                            cancel={this.cancel}
                            handler={this.changeHandler}
                            checkboxHandler={this.checkboxHandler}
                            save={this.save}/>

                        <br />
                        <InsuranceDoctors insurances={this.state.doctorsOnInsurance}
                            applicationStatuses={this.state.applicationStatuses}
                            refresh={this.refreshInsuranceDoctors}
                            insurance={this.state.insurance.name}/>

                        <br />
                        <InsuranceContacts insuranceContacts={this.state.insuranceContacts}
                            insuranceId={this.props.match.params.insuranceId}
                            refresh={this.refreshInsuranceContacts}
                            insurance={this.state.insurance.name}/>
                    </div>
        }
        return (
            <div>
                {renderThis}
            </div>
        )
    }
}